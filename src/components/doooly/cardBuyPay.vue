<template>
<div v-if="IndicatorState">

  <div  @touchmove.prevent class="alr_loading"><span class="loading_gif"></span></div>
  <div class="title clearfix">
    <div class="fl pic">

      <img v-if="pageList.productType==3||pageList.productType==4" src="../../assets/images/cardbuy/pay/pay_tel.png">


      <img v-else :src="pageList.productImg">

    </div>
    <div class="fl describe">
      <div class="price">
        应付金额：<span class="red"><span class="min">￥</span>
      <span class="totalFree">{{payMode==1?convertToNumber(pageList.totalFree,serviceChargeNew):pageList.totalFree}}</span>
    </span><span v-if="serviceChargeNew!=0&&payMode==1" class="serviceCharge">(手续费：<span class="red">{{serviceChargeNew}}</span>)</span>
      </div>
      <div class="order">
        {{pageList.orderDesc}}
      </div>
    </div>
  </div>

  <div class="pay_type">
    <div class="integral" v-show="pageList.supportPayType == 'all' ||pageList.supportPayType == 1"><!--deficiency-->
      <span class="pic">
              <img src="../../assets/images/logo.png">
          </span>
      <span class="center">
              积分兑换<span>(可用余额：<span class="red">{{Number(pageList.userIntegral)}}</span>)</span>
          </span>

      <span @click="changeCheck(1)" class="fr" data-id="doooly" :class="{check:payMode==1}"></span>
    </div>


    <div class="wechat" v-if="pageList.supportPayType == 'all' ||pageList.supportPayType == 2">
          <span class="pic">
              <img src="../../assets/images/cardbuy/pay/pay_wechat.png">
          </span>
      <span class="center">
              微信支付
          </span>
      <span @click="changeCheck(2)" class="fr" data-id="weixin" :class="{check:payMode==2}">

          </span>
    </div>
  </div>
  <div class="footer_toast">订单保留15分钟，请尽快支付</div>
  <div class="footer_bg"></div>
  <footer class="clearfix">
    <div class="fl" @click="cancelPay()">
      取消支付
    </div>
    <div class="fr" @click="again()">
      确认支付
    </div>
  </footer>

  <!--浮动层-->
  <div v-if="dooolyPayState" class="ftc_wzsf">
    <div class="srzfmm_box">
      <div class="qsrzfmm_bt clear_wl"> <span class="fl">请输入短信验证码</span> </div>
      <div class="zfmmxx_shop">
        <div class="wxzf_price totalFree">
          {{convertToNumber(pageList.totalFree,serviceChargeNew)}}
        </div>
      </div>
      <a href="javascript:void(0);" class="blank_yh"> <img src="../../assets/images/cardbuy/pay/pay_integral.png" class="fl"  ><span class="fl ml5">积分兑换</span></a>
      <ul  @click="changexiaq_tbState2" class="mm_box">
        <li><span>{{mm_boxNum[0]}}</span></li>
        <li><span>{{mm_boxNum[1]}}</span></li>
        <li><span>{{mm_boxNum[2]}}</span></li>
        <li><span>{{mm_boxNum[3]}}</span></li>
        <li><span>{{mm_boxNum[4]}}</span></li>
        <li><span>{{mm_boxNum[5]}}</span></li>
      </ul>

      <div v-if="againTime>0&&againTime<60" class="again">验证码已发送至您的手机,<span>{{againTime}}s</span>后请重新获取</div>
      <div v-else class="again">未收到验证码，请<span @click="again()">重新获取</span></div>
      <input type="hidden" ref="again_time" v-model="againTime">
    </div>
    <div v-if="xiaq_tbState" class="numb_box">
      <div  @click="changexiaq_tbState" class="xiaq_tb"> <img src="../../assets/images/cardbuy/pay/jftc_14.jpg" height="10"> </div>
      <ul class="nub_ggg">
        <li v-for="(item,index) in nub_gggNum" :key="index" @click="getNum(item)" :class="{zj_x:item==2||item==5||item==8||item===0}">{{item}}<span v-if="item==''"></span></li>
        <li @click="deleteNum"><span  class="del" > <img src="../../assets/images/cardbuy/pay/jftc_18.jpg"   ></span></li>
      </ul>
    </div>
    <div class="hbbj"></div>
  </div>

  <!-- 错误弹出框 -->
  <div class="istoast_bg" v-show="alr_show">
    <div class="istoast">
      <p>温馨提示</p>
      <div><span>{{to_hint}}</span></div>
      <div class="input" @click="alr_show = false;dooolyPayState=true;mm_boxNum=[]">确定</div>
    </div>
  </div>

  <!-- 确认弹出框 -->
  <div class="isSuccess_bg" v-show="isConfirm_show" @touchmove.prevent>
  <div class="isSuccess">
   <p>确认取消支付？</p>
  <div class="input_view">
  <div @click="close_isSuccess()" class="left">取消</div>
  <div @click="cancel_orderNun()" class="right">确定</div>
  <div class="line"></div>
  </div>
  </div>
  </div>
</div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import {shareWithFriendsWX} from '@/assets/js/wechatShare2.js';
export default {
  name: "cardbuy-pay",
  data(){
    return{
      pageList:{
      },
      payMode:1,
      dooolyPayState:false,
      againTime:60,
      xiaq_tbState:true,
      nub_gggNum:[1,2,3,4,5,6,7,8,9,'',0],
      mm_boxNum:[],
      payFlowId:'',
      to_hint:"",
      alr_show:false,
      IndicatorState:false,
      isConfirm_show:false,
      groupShortName:localStorage.groupShortName
    }
  },
  computed:{
    serviceChargeNew(){
      if(this.pageList.serviceCharge){
        return this.pageList.serviceCharge
      }else{
        return 0
      }
    }
  },
  watch:{
    mm_boxNum(curVal,oldVal){
      if(curVal.length==6){
        this.note_check(this.mm_boxNum.join(""));
      }
    },
  },
  methods:{
    //获取键盘输入值
    getNum(num){
      if(num===0){
        this.mm_boxNum.push(num);
      }else if(num==''){
        return
      }else if(num!=''){
        if(this.mm_boxNum.length<6){
          this.mm_boxNum.push(num);
        }
      }
    },
    deleteNum(){
      this.mm_boxNum.pop();
    },
    changexiaq_tbState(){
      this.xiaq_tbState=false;
    },
    changexiaq_tbState2(){
      this.xiaq_tbState=true;
    },
    convertToNumber(num1,num2){
      let n=Number(num2);
      return isNaN(n)?num1:(num1*1 + num2*1).toFixed(2);
    },
    changeCheck(data){
      if(data == 1){
        this.payMode=1;
      }else if(data == 2){
        this.payMode=2;
      }
    },
    loadPageData(){
      http({
        method: 'get',
        url: api.toConfirmPaymentForAjax+'?token='+localStorage.token+'&orderNum='+this.$route.params.orderNum
      }).then((res)=>{
        this.pageList=res.data;
        this.IndicatorState=true;
        this.checkSumPoint();
      }).catch(err => {
        this.IndicatorState=true;
      })

    },

    call_off(orderNum){
      http({
        method: 'post',
        url: api.cancleOrder+'?token='+localStorage.token+'&orderNum='+this.$route.params.orderNum
      }).then((res)=>{
        if(data.code == 1000){
          dooolyAPP.gotoJumpJq.call(this,'/doooly/member/supplier_order/list.jhtml');
        }else{
          this.$toast(data.msg);
        }
      })
    },
    // 60s倒计时
    timingCode() {
      let interval = setInterval(() => {
        if (this.againTime > 0 && this.againTime < 61) {

          if(this.againTime==60)
          {
            let orderNum = this.$route.params.orderNum;
            this.WeChatPay(orderNum);
          }
          this.againTime--;
        }
        else if (this.againTime == 0) {
          clearInterval(interval);
          this.againTime = 60;
        }
      }, 1000)
    },
    again(){
      if( this.payMode==1 && Number(this.pageList.userIntegral) < Number(this.pageList.totalFree) + Number(this.serviceChargeNew) ){
        this.$toast('积分可用余额不足');
        return;
      };
      //限额
      if(this.payMode==1 && this.pageList.monthLimit && this.pageList.monthLimit != 0){
        if(parseFloat(this.pageList.monthLimit) < parseFloat(this.pageList.consumptionAmount)+parseFloat(this.pageList.totalFree)){
          this.$toast('您已超出限额');
          return;
        };
      }
      this.mm_boxNum=[];
      this.xiaq_tbState=true;
      this.timingCode();
    },
//通过订单号获取微信支付参数/短信验证码接口
    WeChatPay(orderNum){
      
      var payType;
      if(this.payMode==1){
        payType = 'doooly';
      }
      //2017-10-17 16:29:42 WANG  选择微信支付并且使用微信浏览器,使用微信公众号支付
      if( this.payMode == 2 ){
        if(browserName == "WeChat") {
          payType = 'weixin_jsapi';
        }
        else {
          payType = 'weixin';
        }
      }
      if( this.pageList.supportPayType == 0 ){
        payType = 'doooly_zero';
      }
      http({
        method: 'post',
        url: api.getPayForm,
        data:{
          orderNum:this.$route.params.orderNum,
          payType:payType,
          token:localStorage.token
        }
      }).then((res) => {
          if( this.pageList.supportPayType == 0 ){
            this.payFlowId=res.data.data.payFlowId;
            this.note_check();
          }else{
            if(this.payMode==1){
              this.dooolyPayState=true;
            }
            if(res.data.code == 1000){
              this.payFlowId=res.data.data.payFlowId;
              if(this.payMode==2){
                this.appPay(res.data.data,orderNum,payType);
              }
            }else{
              this.$toast(res.data.msg);
            }
          }
      })
    },
    appPay: function (data, orderNum, payType) {
      var that=this;
      if (browserName == "WeChat") {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": data.appId,
          "timeStamp": data.timeStamp,
          "nonceStr": data.nonceStr,
          "package": data.package,
          "signType": data.signType,
          "paySign": data.paySign
        }, function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            that.$toast("支付成功");
            that.pay_callBack();
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            that.$toast("用户取消支付!");
          } else {
            that.$toast("支付失败!");
            that.pay_callBack();
          }
        });
      } else {
        if (browserName == "WebKit"  || browserName == "otherAPPIos") {  //判断iPhone|iPad|iPod|iOS
          data.func = "pay_callBack";
          window.webkit.messageHandlers.wechatPay.postMessage(JSON.stringify(data));
        } else if (browserName == "Chrome WebView"  || browserName == "otherAPPAndroid") {   //判断Android
          RHNativeJS.wechatPay(JSON.stringify(data), 'pay_callBack');
        }
      }
    },

    //短信验证接口
    note_check(code){
      if(this.pageList.supportPayType == 0){
        var payType = 'doooly_zero';
      }else{
        var payType = 'doooly';
      }
      http({
        method: 'post',
        url: api.integralPayment,
        data:{
          orderNum:this.$route.params.orderNum,
          payType:payType,
          token:localStorage.token,
          msgCode:code,
          payFlowId:this.payFlowId
        }
      }).then(
        (res) => {
          if(res.data.code == 1000){
            this.pay_callBack();
          }
          else if(res.data.data.errCode==1016){// 验证码验证失败
            this.dooolyPayState=false;
            this.alr_show=true;
            this.to_hint="您输入的短信验证码有误，请重新输入（5分钟内有效）！";
          }
          else if(res.data.data.errCode==1017){// 验证码已过期，请重新获取
            this.dooolyPayState=false;
            this.alr_show=true;
            this.to_hint="您输入的短信验证码超时，请重新获取！";
          }else{
            this.$toast(res.data.data.errMess);
          }
        }).catch((error)=>{
        this.loadingState=false;
      })
    },
    //app支付回调函数(跳转支付结果页面)
    pay_callBack(){
      var payType;
      if( this.payMode == 2 ){

        if(browserName == "WeChat"){
          payType = 'weixin_jsapi';
        }
        else {
          payType = 'weixin';
        }
      }
      else {
        payType = 'doooly';
      }
      http({
        method: 'get',
        url: api.toPayResultForAjax+'?orderNum='+this.$route.params.orderNum+'&payType='+payType+'&token='+localStorage.token
      }).then((res) => {
        if(res.data.code==1000 || res.data.code==1001){
          if(this.pageList.productType == 7){
            dooolyAPP.gotoJumpVue.call(payCall,'/activity_cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+res.data.data.activityParam+'/'+res.data.data.openId);
          }else{
            dooolyAPP.gotoJumpVue.call(payCall,'/cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+this.pageList.productType);
          }
        }
      })
    },




    checkSumPoint(){
      if(Number(this.pageList.userIntegral)>=Number(this.pageList.totalFree)+Number(this.serviceChargeNew)){
        this.payMode=1;
      }
      else
      {
        this.payMode=2;
      }
      if(this.pageList.supportPayType == 1){
        this.payMode=1;
      }else if(this.pageList.supportPayType == 2){
        this.payMode=2;
      }
    },
    cancelPay(){
    this.isConfirm_show=true;
    },
    cancel_orderNun(){
       http({
          method: 'post',
          url: api.cancleOrder,
          data:{
            orderNum:this.$route.params.orderNum
          }
        }).then((res) => {
          if(res.data.code=1000){
            if(this.pageList.productType == 7){
              this.$router.push({path: '/activity_index?openId=ohQx6wD-XsNsnsu7xCHf6toYQ5u8&sourceOpenId=doooly~recharge_activity~'});
            }else{
              this.$router.push({path: '/myOrderList/0/all'});
            }

         }
        })
    },
    close_isSuccess(){
      this.isConfirm_show=false;
    },
    Wechatshare(prefix,params){
      //调用微信接口获取用户数据
      this.$jsonp(api.commonShareJSONPConfig+"?client=wechat",
        {//请求参数
          callbackName: 'jsonpCallback',
        }).then((res) => {
        if (res.code == 1000) {
          shareWithFriendsWX(res);
        }
      });
    }
  },

  mounted(){
    initTitle('支付订单');
  },


  beforeCreate(){
    window.payCall=this;
    window.pay_callBack=function(){
      var payType;
      if( payCall.payMode == 2 ){

        if(browserName == "WeChat"){
          payType = 'weixin_jsapi';
        }
        else {
          payType = 'weixin';
        }
      }
      else {
        payType = 'doooly';
      }
      // 跳转支付结果页面;
      http({
        method: 'get',
        url: api.toPayResultForAjax+'?orderNum='+payCall.$route.params.orderNum+'&payType='+payType
      }).then((res) => {
        if(res.data.code==1000 || res.data.code==1001){
          dooolyAPP.gotoJumpVue.call(payCall,'/cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+payCall.pageList.productType);
        }
      })
    },
    window.artile=this;
    window.altNoticeAndriod=function(){
      artile.alr_show=0;
      if(browserName == "Chrome WebView"  || browserName == "otherAPPAndroid"){
        RHNativeJS.visablePtrFrame("false");
        HNativeJS.setTopDialog("true");
      }
    };
    window.altNotice=function() {
      //ios打开title遮罩
      if (browserName == "WebKit"  || browserName == "otherAPPIos") {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('1');
      }
      artile.alr_show=0;
    }
    if (!sessionStorage.cardBuyPay) {
      sessionStorage.cardBuyPay=1;
      let url = window.location.href;
      let index =url.indexOf('?');
      let index2 =url.indexOf('#');
      let base;
      let base2;
      if(index > 0){
        base = url.substring(0,index);
        base2 = url.substring(index2);
        window.location.href= base + base2;
      }else{
        location.reload();
      }
    }
  },
  created(){
    this.loadPageData();
    this.checkSumPoint();
  },
  destroyed(){
    sessionStorage.removeItem('cardBuyPay');
  },

}
</script>

<style scoped>
  .title{
    height: 2rem;
    padding: 0 0.3rem;
    padding-bottom: 0.3rem;
    background: #fff url(../../assets/images/cardbuy/pay/title_bg.png) repeat-x 0 bottom;
    background-size: auto 0.3rem;
  }
  .title .pic{
    margin: 0.4rem 0;
    height: 1.2rem;
    width: 1.2rem;
    font-size: 0;
    margin-right: 0.4rem;
    border-radius: 100%;
  }
  .title .pic img{
    height: 100%;
    width: 100%;
    border-radius: 100%;
  }
  .title .describe{
    margin: 0.4rem 0;
    height: 1.2rem;
    padding-top: 0.24rem;
    max-width:5rem;
  }
  .title .describe .price{
    font-size: 0.32rem;
    color: #333;
    line-height: 100%;
  }
  .title .describe .red{
    font-size: 0.36rem;
    color: #ee3f44;
  }
  .title .describe .price .serviceCharge{
    font-size: 0.24rem;
    color: #666;
  }
  .title .describe .price .serviceCharge .red{
    font-size: 0.24rem;
    color: #ee3f44;
  }
  .title .describe .red .min{
    font-size: 0.24rem;
  }
  .title .describe .order{
    margin-top: 0.2rem;
    font-size: 0.24rem;
    color: #999;
    line-height: 120%;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 5rem;
    white-space:nowrap;
  }

  /*支付类型*/
  .pay_type{
    background: #fff
  }
  .pay_type div{
    font-size: 0;
    margin: 0 0.3rem;
  }
  .pay_type div span{
    display: inline-block;
    vertical-align: top;
  }
  .pay_type .pic{
    margin-top: 0.3rem;
    width: 0.4rem;
    height: 0.4rem;
  }
  .pay_type .pic img{
    height: 100%;
    width: 100%;
  }
  .pay_type .center{
    margin-left: 0.3rem;
    font-size: 0.28rem;
    color: #333;
    line-height: 0.98rem;
  }
  .pay_type .center span{
    font-size: 0.24rem;
    color: #999;
  }
  .pay_type .center span .red{
    color: #ee3f44;
  }
  .pay_type .fr{
    margin-top: 0.28rem;
    width: 0.44rem;
    height: 0.44rem;
    border-radius: 100%;
    border:1px solid #ddd;
  }
  .pay_type .check{
    border-color: transparent;
    background: url(../../assets/images/cardbuy/pay/pay_check.png) no-repeat 0 0;
    background-size: 100%;
  }
  .pay_type div{
    border-bottom: 1px solid #ececec;
  }
  .pay_type div:last-child{
    border:0;
  }
  .deficiency{
    opacity: 0.7;
  }
  .deficiency .center{
    color: #999;
  }

  /*底部悬浮*/
  .footer_bg{
    height: 1.6rem;
    width: 100%;
  }
  .footer_toast{
    width: 100%;
    background: #fcf6d4;
    color:#ef843a;
    position: fixed;
    left: 0;
    bottom: 0;
    margin-bottom: 1rem;
    font-size: 0.28rem;
    height: 0.6rem;
    line-height: 0.6rem;
    z-index: 9;
    text-align: center;
  }
  footer{
    width: 100%;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    z-index: 9;
  }
  footer div{
    width: 50%;
    text-align: center;
  }
  footer .fl{
    border-top:1px solid #ececec;
  }
  footer .fr{
    background: #ee3f44;
    color: #fff;
  }

  /*浮动层*/
  .ftc_wzsf { width: 100%; height: 100%; position: fixed; z-index: 999; top: 0; left: 0; }
  .ftc_wzsf .hbbj { width: 100%; height: 100%; position: absolute; z-index: 8; background: #000; opacity: 0.4; top: 0; left: 0; }
  .ftc_wzsf .srzfmm_box { position: absolute; z-index: 10; background: #fff; width: 88%; left: 50%; margin-left: -44%; top: 0.5rem;border-radius: 0.2rem;padding: 0.2rem 0;}
  .qsrzfmm_bt { font-size: 0.32rem; border-bottom: 1px solid #ececec; overflow: hidden; }
  .qsrzfmm_bt a { display: block; width: 10%; padding: 10px 0; text-align: center; }
  .qsrzfmm_bt img.tx { width: 10%; padding: 0.2rem 0; }
  .qsrzfmm_bt span { padding: 0.3rem 0;width: 100%;text-align: center; }
  .zfmmxx_shop { text-align: center; font-size: 0.24rem; padding: 0.2rem 0; overflow: hidden; }
  .zfmmxx_shop .mz { font-size: 0.28rem; float: left; width: 100%; }
  .zfmmxx_shop .wxzf_price { font-size: 0.8rem; float: left; width: 100%; }
  .blank_yh { width: 89%; margin: 0 auto; line-height: 0.8rem; display: block; color: #636363; font-size: 0.32rem; padding: 0.1rem 0; overflow: hidden; border-bottom: 1px solid #e6e6e6; border-top: 1px solid #e6e6e6; }
  .blank_yh img {height: 0.4rem;margin-top: 0.2rem;margin-right: 0.3rem;width:auto;}
  .ml5 { margin-left: 0.1rem; }
  .mm_box { width: 89%; margin: 0.2rem auto; height: 0.8rem; overflow: hidden; border: 1px solid #bebebe; }
  .mm_box li {
    border-right: 1px solid #efefef;
    height: 0.8rem;
    float: left;
    width: 16.3%;
    background: #FFF;
    font-size: 0.4rem;
    display: flex;
    justify-content: center;
    align-items:center;
  }
  .mm_box li.mmdd{ background:#FFF url(../../assets/images/cardbuy/pay/paydd_03.jpg) center no-repeat ; background-size:25%;}
  .mm_box li span {font-weight: bold;color:#333;}
  .mm_box li:last-child { border-right: none; }
  .xiaq_tb { padding: 0.1rem 0; text-align: center; border-top: 1px solid #dadada; font-size: 0;}
  .numb_box { position: absolute; z-index: 10; background: #f5f5f5; width: 100%; bottom: 0px; }
  .nub_ggg { border: 1px solid #dadada; overflow: hidden; border-bottom: none; }


  .nub_ggg li { width: 33.1%;border-bottom: 1px solid #dadada; float: left; text-align: center; font-size: 0.44rem;display: block; color: #000; height: 1rem; line-height: 1rem; overflow: hidden;  }
  .nub_ggg li:active  { background: #79D1FF;}
  .zj_x { border-left: 1px solid #dadada; border-right: 1px solid #dadada; }
  .nub_ggg li span { display: block; color: #e0e0e0; background: #e0e0e0; height: 1rem; line-height: 1rem; overflow: hidden; }
  .nub_ggg li span.del img { width: 30%; }

  .fh_but{ position:absolute; right:0px; top:0.24rem; font-size:0.28rem; color:#20d81f;}
  .zfcg_box{ background:#f2f2f2;  height: 1.12rem; line-height:1.12rem;   font-size:0.4rem; color:#1ea300; }
  .zfcg_box img{ width:10%;}
  .ftc_wzsf .again{
    font-size: 0.24rem;
    margin: 0.1rem auto;
    width: 89%;
    text-align: center;
    color:#999;
  }
  .ftc_wzsf .again span{
    color: #ee3f44;
  }

  .cgzf_info{ background:#FFF; border-top:1px solid #dfdfdd; }

  .spxx_shop{ background:#FFF; margin-left:4.35%; border-top:1px solid #dfdfdd; padding:0.2rem 0; }
  .spxx_shop td{ color:#7b7b7b; font-size:0.28rem; padding:0.2rem 0;}

  .wzxfcgde_tb{ position:fixed; width:100%; z-index:999; bottom:0.4rem; text-align:center;}
  .wzxfcgde_tb img{ width:20.6%;}
  .mlr_pm{margin-right:4.35%;}


  /*弹出框*/
  .share_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    display:none;
    z-index: 9999;
  }
  .share_bg img{
    width: 6.07rem;
  }
  .isSuccess_bg,.apply_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
  }
  .isSuccess,.apply{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    height: 3.2rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
  }
  .isSuccess p,.apply p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    color:#333;
  }
  .isSuccess p span,.apply p span{
    font-size: 0.26rem;
    margin-top: 0.1rem;
    color:#9c9c9c;
  }
  .isSuccess .input_view{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1rem;
    width: 100%;
    font-size: 0;
    border-top:1px solid #ececec;
  }
  .isSuccess .input_view div{
    font-size: 0.36rem;
    text-align: center;
    display: inline-block;
    line-height: 1rem;
    width:50%;
  }
  .isSuccess .input_view .line{
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background: #ececec;
  }
  .isSuccess .input_view .right{
    color:#ee3f44;
  }
  /* 温馨提示 start */
  .istoast_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
  }
  .istoast{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    height: 3.56rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
    font-size: 0;
    text-align: center;
  }
  .istoast p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.72rem;
    padding: 0 0.2rem;
    color:#333;
    font-weight: bold;
  }
  .istoast span{
    font-size: 0.28rem;
    display: inline-block;
    margin-top: 0.1rem;
    color: #999;
    padding: 0.2rem 0.4rem;
  }
  .istoast span b{
    font-weight: normal;
    color: #ee3f44;
  }
  .istoast .input{
    position: absolute;
    left: 0;
    bottom: 0;
    line-height: 1rem;
    width: 100%;
    border-top: 1px solid #ececec;
    font-size: 0.36rem;
    color: #ee3f44;
    text-align: center;
  }
  /* 温馨提示 end */







  .alr_loading{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.4);
    z-index: 9999;
    display: none;
  }
  .alr_loading img{
    width:1rem;
    position: absolute;
    left:50%;
    top:50%;
    margin-top:-0.5rem;
    margin-left:-0.5rem;
  }
</style>
