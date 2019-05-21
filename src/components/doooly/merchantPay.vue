<template>
  <div v-show="IndicatorState">
    <ul class="content">
      <li>
        <span class="tag">商户名称</span><span class="detail">{{pageList.company}}</span>
      </li>
      <li>
        <span class="tag">商品名称</span><span class="detail">{{pageList.orderDesc}}</span>
      </li> 
      <li>
        <span class="tag">订单编号</span><span class="detail">{{pageList.orderNum}}</span>
      </li>
      <li>
        <span class="tag">付款金额</span>
        <span class="detail">
          {{payMode1 ? convertToNumber(pageList.totalFree,pageList.serviceCharge):pageList.totalFree}}
          <span v-if="pageList.serviceCharge!= 0 && payMode1" class="serviceCharge">
            (手续费：<span class="red">{{pageList.serviceCharge.toFixed(2)}}</span>)
          </span>
        </span>
      </li>
    </ul>
    <div class="payTitle">
      支付方式<span>（使用‘兜礼积分’方式，商户将不向个人开具发票）</span>
    </div>
    <!-- 支付类型 -->
    <div class="pay_type">
      <div>
        <span class="pic">
            <img src="../../assets/images/logo.png">
        </span>
        <span class="center">
            兜礼积分<span>可用余额：<span class="red">{{pageList.userIntegral.toFixed(2)}}</span></span>
        </span>
        <span @click="changeCheck(0)" class="fr" data-id="doooly" :class="{check: payMode1}">
          <img v-if="payMode1" src="../../assets/images/cardbuy/pay/pay_check.png">
          <img v-else-if="pageList.company == '兜礼' && wechatPirce > 0" src="../../assets/images/cardbuy/pay/pay_checkR.png">
        </span>
      </div>
 
      <div class="wechat" v-if="payType != 1">
        <span class="pic">
          <img src="../../assets/images/cardbuy/pay/pay_wechat.png">
        </span>
        <span class="center">
            微信支付<span v-show="payMode2 && payMode == 2">还需支付：<span class="red">{{wechatPirce.toFixed(2)}}</span></span>
        </span>
        <span @click="changeCheck(1)" class="fr" data-id="weixin" :class="{check: payMode2}">
          <img v-if="payMode2" src="../../assets/images/cardbuy/pay/pay_check.png">
        </span>
      </div>
      <div v-if="payType != 1">
        <span class="pic">
          <img src="../../assets/images/cardbuy/pay/pay_wechat.png">
        </span>
        <span class="center">
            支付宝<span v-show="payMode2 && payMode == 2">还需支付：<span class="red">{{wechatPirce.toFixed(2)}}</span></span>
        </span>
        <span @click="changeCheck(2)" class="fr" data-id="weixin" :class="{check: payMode == '3'}">
          <img v-if="payMode2" src="../../assets/images/cardbuy/pay/pay_check.png">
        </span>
      </div>
    </div>
    <!-- 确认支付 -->
    <!-- <div class="footer_toast">订单保留15分钟，请尽快支付</div> -->
    <div class="footer_bg"></div>
    <footer>
      <!-- <div class="fl" @click="isConfirm_show = true">
        取消支付
      </div> -->
      <div class="fr" @click="again()">
        确认支付
      </div>
    </footer>
    <!-- 确认弹出框 -->
    <div class="isSuccess_bg" v-show="isConfirm_show" @touchmove.prevent>
      <div class="isSuccess">
        <p>确定要离开收银台？</p>
        <div class="input_view">
          <div @click="cancel_orderNun()" class="left">确认离开</div>
          <div @click="isConfirm_show = false" class="right">继续支付</div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <!-- 确认弹出框 -->
    <!-- 支付键盘 -->
    <div class="payKey_bg" @touchmove.prevent v-show="payKey">
      <div class="payKey">
        <div class="payKey_title">
          <img @click="payKey = false" src="../../assets/images/cardbuy/pay/close.png">{{isPayPassword == 2 ? "请输入兜礼支付密码" : "请输入短信验证码"}}
        </div>
        <ul class="payKey_text">
          <li v-for="(item,index) in mm_list" :key="index" :class="{mm:index< mm.length}">{{item}}</li>
        </ul>
        <div :class='{check:mm.length >= 6}' class="payKey_button" @click="note_check">
          确认支付
        </div>
        <div class="payKey_toast" @click="password" v-if="isPayPassword == 2">
          忘记密码？
        </div>
        <div v-else-if="againTime>0&&againTime<60" class="again">验证码已发送至您的手机,<span>{{againTime}}s</span>后请重新获取</div>
        <div v-else class="again">未收到验证码，请<span @click="again()">重新获取</span></div>
        <!-- <div class="payKey_toast" @click="password" v-else>
          未收到验证码，请<span @click="again()">重新获取</span>
        </div> -->
        <ul class="key">
          <li v-for="(item,index) in li_list" :key="index" @click="keyDown(item)">{{item}}</li>
          <li @click="keyDown('-1')"><img class="payKey_delete" src="../../assets/images/cardbuy/pay/Delete.png"></li>
        </ul>
      </div>
    </div>
    <!-- 支付键盘 -->
    <!-- 错误弹出框 -->
    <div class="istoast_bg" v-show="alr_show">
      <div class="istoast">
        <p>温馨提示</p>
        <div><span>{{to_hint}}</span></div>
        <div class="input" @click="alr_show = false;payKey=true;mm='' ">确定</div>
      </div>
    </div>
  </div>
</template>
 
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX} from '@/assets/js/wechatShare2.js';
  
  import utils from '@/assets/js/utils.js';
  export default {
    name: "merchant-pay",
    data(){
      return{
        activityName: this.$route.params.activityName || '',
        payType:(browserName == "otherAPP" ? "1" : this.$route.query.payType),//1只支持微信支付
        payMode1:true,
        payMode2:false,
        payMode:0,//0积分支付1微信2混合3支付宝
        pageList:{
          userIntegral:0,
          serviceCharge:0,
        },
        payKey:false,
        wechatPirce:0,
        IndicatorState:false,
        isConfirm_show:false,
        li_list:[1,2,3,4,5,6,7,8,9,"",0],
        mm_list:['','','','','',''],
        mm:'',
        isPayPassword: (localStorage.isPayPassword ? localStorage.isPayPassword:1),
        payFlowId:'',
        alr_show: false,
        to_hint:'',
        againTime:60,
        tradeType:'',
      }
    },
    watch:{
      pageList:function(val,old){
        this.wechatPirce = Number(this.pageList.totalFree)+Number(this.pageList.serviceCharge)-Number(this.pageList.userIntegral);
        if(this.pageList.userIntegral <= 0){
          changeCheck(1);
        }
      },
      wechatPirce:function(val,old){
        if(val <= 0 ){
          this.wechatPirce = 0;
          this.changeCheck(0);
        }else{
          this.changeCheck(1);
        }
      },
      mm:function(val,old){
        if(val.length > old.length){
          this.mm_list[val.length-1] = val.substr(val.length-1,1);
        }else if(val == ""){
          this.mm_list = ['','','','','',''];
        }else{
          this.mm_list[val.length] = "";
        };
        if(val.length == 6){
        };
      },
      payKey(){
        if(!this.payKey){
          this.mm_list = ['','','','','',''];
          this.mm = '';
        }
      },
    },
    methods:{
      convertToNumber(num1,num2){
        let n=Number(num2);
        return isNaN(n)?num1:(num1*1 + num2*1).toFixed(2);
      },
      //输入事件监听
      keyDown(item){
        if(item == '-1'){
          this.mm = this.mm.substr(0,this.mm.length-1);
        }else{
          if(this.mm.length >= 6){
            return;
          }else{
            this.mm += item;
          }
        }
      },
      //获取支付方式
      loadPass(){
        http({
          method: 'post',
          url: api.gerneralInfo,
          data: {
            userId: localStorage.userId
          }
        }).then((res) => {
          this.IndicatorState=true;
          if (res.data.data.isPayPassword) {
            localStorage.isPayPassword = res.data.data.isPayPassword;
            this.isPayPassword = res.data.data.isPayPassword;
          }
        })
      },
      //加载订单信息
      loadPageData(){
        http({
          method: 'post',
          url: api.unifiedorder,
          data:{
            orderNum:this.$route.params.orderNum,
            userId:localStorage.userId
          }
        }).then((res)=>{
          this.IndicatorState = true;
          if(!res.data.data.serviceCharge){
            res.data.data.serviceCharge = 0;
          }
          this.pageList=res.data.data;
        }).catch(err => {
          this.IndicatorState=true;
        })
 
      },
      //支付方式切换
      changeCheck(type){
        if(Number(this.pageList.userIntegral) <= 0){
          this.payMode1 = false;
          this.payMode2 = true;
          this.payMode = 1;
          return;
        }
        if(this.payType == 1 || this.payMode == type){
          return;
        }
        if(Number(this.wechatPirce) <= 0){
          if(type == 0){
            this.payMode1 = true;
            this.payMode2 = false;
          }else if(type == 1){
            this.payMode1 = false;
            this.payMode2 = true;
          };
        }else if(this.pageList.company == "兜礼"){
          this.payMode1 = false;
          this.payMode2 = true;
        }else{
          if(type == 0){
            this.payMode1 = !this.payMode1;
          }else if(type == 1){
            this.payMode1 = true;
            this.payMode2 = true;
          }
        }
        //支付方式0.积分支付1.微信支付2.混合支付
        if(this.payMode1 == true && this.payMode1 != this.payMode2){
          this.payMode = 0;
        }else if(this.payMode2 == true && this.payMode1 != this.payMode2){
          this.payMode = 1;
        }else if(this.payMode1 == this.payMode2){
          this.payMode = 2;
        }
      },
      //忘记密码
      password(){
        if(browserName == "WebKit" || browserName == "otherAPPIos" || browserName == "Chrome WebView" || browserName == "otherAPPAndroid"){
          if(window.location.href.indexOf("/dist/") > -1){
            this.payKey = false;
            this.$messageBox({
              title: '请更新版本',
              message: '该版本不支持该功能，请更新版本或者在微信公众号进行尝试'
            })
          }else{
            dooolyAPP.gotoJumpVue.call(this,'/verification/0/2');
          }
        }else{
          dooolyAPP.gotoJumpVue.call(this,'/verification/0/2');
        }
      },
      //通过订单号获取微信支付参数/短信验证码接口
      WeChatPay(){
        if(browserName == "WeChat"){
          if( window.location.href.indexOf('wiscowechat') > 0){
            this.tradeType = 'WISCO_JS';
          }else{
            this.tradeType = 'DOOOLY_JS';
          }
        }else if(browserName == "WebKit"||browserName == "Chrome WebView"){
          this.tradeType = 'DOOOLY_APP';
        }else if(browserName == "otherAPPAndroid"||browserName == "otherAPPIos"){
          this.tradeType = 'WISCO_APP';
        }else if(this.payMode != 0){
          this.tradeType = 'DOOOLY_H5';
        }else{
          this.tradeType = 'DOOOLY_JS';
        }
        if(this.pageList.supportPayType == 0){//0元订单
          this.tradeType = 'doooly_zero';
        }
        if(this.payMode == 0 || this.payMode == 2){//如果在60秒时间内弹出输入框，否则充值倒计时
          if (this.againTime > 0 && this.againTime < 60) {
            this.payKey=true;
            return;
          }else{
            this.againTime = 60;
          }
        };
        http({
          method: 'post',
          url: api.getPayForm,
          data:{
            orderNum:this.$route.params.orderNum,
            userId:localStorage.userId,
            payId:this.pageList.payId,
            tradeType: this.tradeType,
            payType: 6,
          }
        }).then((res) => {
            if( this.pageList.supportPayType == 0 ){
              this.note_check();
            }else{
              if (browserName == "WebKit"  || browserName == "otherAPPIos") {  //判断iPhone|iPad|iPod|iOS
                res.data.data.func = "pay_callBack";
                window.webkit.messageHandlers.aliPayment.postMessage(JSON.stringify(res.data.data));
              } else if (browserName == "Chrome WebView"  || browserName == "otherAPPAndroid") {   //判断Android
                RHNativeJS.aliPayment(JSON.stringify(res.data.data), 'pay_callBack');
              }
            }
        })
      },
      //短信验证接口
      note_check(code){
        if(this.mm.length < 6 && this.pageList.supportPayType != 0){
          return;
        };
        this.payKey=false;
        var newpassword = this.mm||'111111';
        if(this.isPayPassword == 2){
          newpassword = utils.encrypt(this.mm);
        }
        http({
          method: 'post',
          url: api.integralPay,
          data:{
            payId:this.pageList.payId,
            payPassword:newpassword,
            orderNum:this.$route.params.orderNum,
          }
        }).then((res) => {
          if(res.data.code == 1000){
            if(this.payMode==2){
              this.appPay(res.data.data);
            }else{
              this.pay_callBack();
            }
          }else if(res.data.code==1016){// 验证码验证失败
            this.alr_show=true;
            this.to_hint="您输入的短信验证码有误，请重新输入（5分钟内有效）！";
          }else if(res.data.code==1017){// 验证码已过期，请重新获取
            this.alr_show=true;
            this.to_hint="您输入的短信验证码超时，请重新获取！";
          }else if(res.data.code==1007){
            this.$toast('支付密码错误，请重新输入');
          }else{
            this.$toast(res.data.msg);
          }
        })
      },
      //验证支付结果接口
      pay_callBack(){
        http({
          method: 'post',
          url: api.getPayResult,
          data:{
            orderNum:this.$route.params.orderNum
          }
        }).then((res) => {
          if(res.data.code==1000 || res.data.code==1001){
            if(this.pageList.productType == 7){
              dooolyAPP.gotoJumpVue.call(this,'/activity_cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+res.data.data.activityParam+'/'+res.data.data.openId);
            }else{
              let pathStr = '/cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+this.pageList.productType
              if (this.activityName){
                pathStr += '/' + this.activityName;
              }
              dooolyAPP.gotoJumpVue.call(this, pathStr);
            }
          }else{
            this.$toast(res.data.msg);
          }
        })
      },
      again(){
        //只支持微信支付
        if(this.payType == 1 && parseFloat(this.pageList.userIntegral) < parseFloat(this.convertToNumber(this.pageList.totalFree,this.pageList.serviceCharge))){
          this.$messageBox.confirm('', {
            title: '您的积分余额不足',
            message: '',
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: '关闭',
          }).then(action => {
            if(action == 'confirm'){
              dooolyAPP.goBackPageIndex(1);
            }
          });
          return;
        }
        //限额
        if(this.payMode!=1 && this.pageList.monthLimit && this.pageList.monthLimit != 0){
          if(parseFloat(this.pageList.monthLimit) < parseFloat(this.pageList.consumptionAmount)+parseFloat(this.pageList.totalFree)-parseFloat(this.wechatPirce)){
            this.$toast('您已超出限额');
            return;
          };
        }
        this.mm_list=['','','','','',''];
        this.WeChatPay();
      },
      // 60s倒计时
      timingCode() {
        if(this.againTime != 60){
          this.payKey=true;
          return;
        }else{
          this.againTime--;
        }
        clearInterval(interval);
        var interval = setInterval(() => {
          if (this.againTime > 0 && this.againTime < 61) {
            this.againTime--;
          }else{
            clearInterval(interval);
            this.againTime = 60;
          }
        }, 1000)
      },
      //微信支付接口
      appPay(data) {
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
          }else if(this.tradeType == 'DOOOLY_H5'){
            window.location.href = data.mwebUrl +'&redirect_url='+encodeURIComponent(window.location.href.substring(0,window.location.href.indexOf('#')+2))+'cardBuyPayResultH5%2f'+this.pageList.orderNum+'%2f'+this.pageList.productType;
          }
        }
      },
      cancel_orderNun(){
        if(this.pageList.isSource == 3){
           http({
              method: 'post',
              url: api.cancleOrder,
              data:{
                orderNum:this.$route.params.orderNum
              }
            }).then((res) => { 
              dooolyAPP.goBackPageIndex("1");
            })
        }else{
          dooolyAPP.goBackPageIndex("1");
        }
      },
    },
    beforeCreate(){
      var payCall=this;
      window.pay_callBack=function(){
        // 跳转支付结果页面;
        http({
          method: 'post',
          url: api.getPayResult,
          data:{
            orderNum:payCall.$route.params.orderNum
          }
        }).then((res) => {
          if(res.data.code==1000 || res.data.code==1001){
            let pathStr = '/cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+payCall.pageList.productType;
            if (payCall.activityName){
              pathStr += '/' + payCall.activityName;
            }
            dooolyAPP.gotoJumpVue.call(payCall, pathStr);
          }
        })
      };
      window.altNoticeAndriod=function(){
        payCall.alr_show=0;
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
        payCall.alr_show=0;
      };
      window.isConfirmShow=function() {//确认离开弹框
        payCall.isConfirm_show = true;
        payCall.payKey = false;
      };
      if (!sessionStorage.cardBuyPay && browserName == "WeChat") {
        sessionStorage.cardBuyPay=1;
        let url = window.location.href;
        let index =url.indexOf('?');
        let index2 =url.indexOf('#');
        let base;
        let base2;
        if(index > 0 && index < index2){
          base = url.substring(0,index);
          base2 = url.substring(index2);
          window.location.href= base + base2;
        }else{
          location.reload();
        }
      }
    },
    destroyed(){
      sessionStorage.removeItem('cardBuyPay');
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      document.body.style.backgroundColor="#f5f5f5";
      initTitle('兜礼收银台','2','isConfirmShow()');
      this.loadPageData();
      this.loadPass();
    },
    beforeRouteLeave(to, from, next) {
      if(to.name != "verification" && to.name != "cardBuyPayResult" && !this.isConfirm_show && browserName == "WeChat"){
        this.payKey = false;
        this.isConfirm_show = true;
        window.history.go(1);
        return;
      }
      next();
    },
  }
</script>
 
<style scoped>
  .content{
    padding: 0.1rem 0.3rem 0.44rem 0.3rem;
    background: #fff url(../../assets/images/cardbuy/pay/title_bg.png) repeat-x 0 bottom;
    background-size: auto 0.3rem;
  }
  .content li{
    display: flex;
    justify-content:space-between;
    padding: 0.1rem 0;
    white-space: nowrap;
  }
  .content li span{
    font-size: 0.28rem;
  }
  .content li .tag{
    color: #999;
  }
  .content li .detail{
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
  }
  .payTitle{
    padding: 0 0.3rem;
    font-size: 0.28rem;
    color: #333;
    line-height: 0.56rem;
  }
  .payTitle span{
    font-size: 0.24rem;
    color: #999;
  }
  /*支付类型*/
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
    margin-top: 0.26rem;
    width: 0.44rem;
    height: 0.44rem;
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
    width: 5.35rem;
  }
  .pay_type .center span{
    font-size: 0.24rem;
    color: #999;
    float: right;
  }
  .pay_type .center span .red{
    color: #ee3f44;
  }
  .pay_type .fr{
    margin-top: 0.24rem;
    width: 0.44rem;
    height: 0.44rem;
    border-radius: 100%;
    border:1px solid #ddd;
  }
  .pay_type .check{
    border-color: transparent;
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
    width: 100%;
    text-align: center;
  }
  footer .fl{
    border-top:1px solid #ececec;
  }
  footer .fr{
    background: #ee3f44;
    color: #fff;
  }
  /*支付键盘*/
  .payKey_bg{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.50);
  }
  .payKey{
    position: absolute;
    left: 0;
    bottom: 0;
    max-height: 8.3rem;
    width: 100%;
    font-size: 0;
    text-align: center;
    background: #fff;
  }
  .payKey_title{
    height: 0.88rem;
    line-height: 0.88rem;
    position: relative;
    text-align: center;
    font-size: 0.32rem;
    color: #333;
    border-bottom: 1px solid #ececec;
  }
  .payKey_title img{
    width: 0.28rem;
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
  }
  .payKey_text{
    display: inline-flex;
    border:1px solid #9f9f9f;
    margin: 0.4rem auto 0.3rem auto;
  }
  .payKey_text li{
    width: 1.1rem;
    height: 0.84rem;
    line-height: 0.84rem;
    font-size: 0.36rem;
    color: #333;
    border-right: 1px solid #ddd;
  }
  .payKey_text li:last-child{
    border:0;
  }
  .payKey_delete{
    width: 0.48rem;
  }
  .payKey_button{
    display: inline-flex;
    width: 6.9rem;
    height: 0.82rem;
    line-height: 0.82rem;
    font-size: 0.32rem;
    color: #fff;
    background: #ee3f44;
    justify-content: center;
    opacity: 0.5;
  }
  .payKey_button.check{
    opacity: 1;
  }
  .payKey_toast{
    height: 0.34rem;
    margin: 0.14rem 0.34rem 0.22rem 0.34rem;
    font-size: 0.24rem;
    color: #EE3F44;
    text-align: right;
  }
  .key{
    display: inline-flex;
    flex-wrap: wrap;
    background: rgba(210,213,219,0.90);
    height: 4.34rem;
    justify-content: center;
    align-content: center;
  }
  .key li{
    width: 2.32rem;
    margin: 0.06rem 0.08rem;
    height: 0.94rem;
    line-height: 0.94rem;
    background: #FFFFFF;
    box-shadow: 0 1px 0 0 #848688;
    border-radius: 0.1rem;
    font-size: 0.42rem;
    text-align: center;
  }
  .key li:nth-child(10){
    opacity: 0;
  }
  .key li:nth-child(12){
    background: rgba(0,0,0,0);
    box-shadow:0 0 0 0;
  }
  /*确认弹出框*/
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
  .again{
    font-size: 0.24rem;
    margin: 0.1rem auto;
    width: 89%;
    text-align: center;
    color:#999;
  }
  .again span{
    color: #ee3f44;
  }
</style>