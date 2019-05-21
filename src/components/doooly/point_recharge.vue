<template>
  <div class="container">
    <section class="topSection">
      <div class="div_header clearfix">
        <div class="fl left">
          <div class="usable_point">
            <span>积分余额</span>
            <p class="big_p">{{integral && integral.toFixed(2)}}</p>
          </div>
        </div>
        <div class="fr right"><span>1积分可抵1元</span></div>
      </div>
    </section>
    <section class="p_b3">
      <p class="font_p">请刮开礼券，输入16位绑定码，不区分大小写</p>
 
      <div class="input_div">
          <span><i></i><i></i><i></i><i></i><input type="text" v-model="card1" v-focus="focusStatus == 1" @focus="inputFocus" @keydown="inputKeyDown"></span>
          <img src="../../assets/images/point_recharge/line.png" />
          <span><i></i><i></i><i></i><i></i><input type="text" v-model="card2" v-focus="focusStatus == 2" @focus="inputFocus" @keydown="inputKeyDown"></span>
          <img src="../../assets/images/point_recharge/line.png" />
          <span><i></i><i></i><i></i><i></i><input type="text" v-model="card3" v-focus="focusStatus == 3" @focus="inputFocus" @keydown="inputKeyDown"></span>
          <img src="../../assets/images/point_recharge/line.png" />
          <span><i></i><i></i><i></i><i></i><input type="text" maxlength="4" v-model="card4" v-focus="focusStatus == 4" @focus="inputFocus" @keydown="inputKeyDown"></span>
      </div>
      <div :class="classObj" @click="rechargeBtn" :disabled="activeDisable">绑定</div>
    </section>
    <section>
      <div class="recharge_record">绑定记录</div>
      <div v-if="mainPointList" class="main-body" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                    :bottomDistance="bottomDistanceValue" bottomDropText="" bottomPullText="">
          <ul class="tabs1_usableUl">
            <li class='clearfix div_con' v-for="(item,index) in listData" :key="index">
              <div class='fl icon_div'>
                 <img src='../../assets/images/p_r_icon.png'/>
              </div>
              <div class='fl con'>
                <p class="shop_name">{{item.cardNo}}</p>
                <p class='con_date'>{{item.cardUseDate}}</p>
              </div>
              <div class='fr con_money'>
                +{{item.cardMoney.toFixed(2)}}
              </div>
            </li>
            <div class="loadContainer" v-if="loadContainerState">
              <div class="loadText">
                 <span class="loadLine"></span><span>已经全部加载完毕</span><span class="loadLine"></span>
              </div>
            </div>
          </ul>
          <div class="mint-loadmore-bottom" v-if="isLoading">
           <!-- <img class="mint-loadmore-bottom-img" src="../../../src/assets/images/loading.gif"> -->
            <span class="loading_gif"></span>
          </div>
        </mt-loadmore>
      </div>
      <div v-if="noRecords" class="noRecord" style='text-align: center;font-size: 0;'>
        <img style='width: 2.4rem;margin-top:1rem;' src='../../../src/assets/images/personalCenter/myPoint/no_point.png'/>
        <p style='color:#666;font-size:0.28rem;'>您还没有绑定记录呢</p>
      </div>
    </section>
    <div class="isSuccess_bg approve" v-show="nonentityVisible1">
        <div class="isSuccess">
            <div class="title">提示</div>
            <p class="min">绑定成功！</p>
            <div class="input_view">
                <div @click="confirmActivateBtn()">立即使用</div>
                <div @click="confirmRechargeBtn()" class="right">继续绑定</div>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <div class="isSuccess_bg approve" v-show="nonentityVisible2">
        <div class="isSuccess">
            <div class="title">提示</div>
            <p class="min">请联系<span class="span_red">400-158-2212</span></p>
            <div class="input_view">
                <div @click="mobileCall()" class="right">联系客服</div>
            </div>
        </div>
    </div>
    <div class="isSuccess_bg approve" v-if="popupVisible3">
        <div class="isSuccess">
            <!-- <div class="title">您已连续输错{{failCount}}次卡密</div> -->
            <div class="title">绑定失败多次</div>
            <p class="min">请联系<span class="span_red" @click="mobileCall()">400-158-2212</span></p>
            <div class="input_view">
                <div class="right r_m width_btn" @click="cancelActivateBtnData()">确定</div>
            </div>
        </div>
    </div>
    <div class="isSuccess_bg approve" v-if="popupVisible4">
        <div class="isSuccess">
            <div class="title">礼券已超使用期限</div>
            <p class="min">请联系<span class="span_red" @click="mobileCall()">400-158-2212</span></p>
            <div class="input_view">
                <div class="right r_m width_btn" @click="cancelActivateBtn()">确定</div>
            </div>
        </div>
    </div>
  </div>
</template>
 
<script>
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  window["APP_card_question"] = function() {
    if(browserName == "WeChat"){
      window.location.href = '#/card_question';
    }else{
      dooolyAPP.gotoJumpVue('/card_question');
    }
  };
    export default {
      name: "point_recharge",
      data(){
          return{
            availablePoint:"",
            returnPoint:"",
            isShow:true,
            isPointfrist:false,
            mainPointList:true,
            noRecords:false,
            pageNumber:1,
            pageSize:10,
            allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
            loadContainerState: false,
            scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
            loadFinish: false,
            bottomDistanceValue: 70,
            listData:[],
            remindingText:"",
            income:1,
            isLoading:true,
            cardPassword:"",
            integral:"",
            card1:"",
            card2:"",
            card3:"",
            card4:"",
            nonentityVisible1:false,
            nonentityVisible2:false,
            article_code:false,
            popupVisible3:false,
            popupVisible4:false,
            failCount:0,
            validCodeNum: "",//验证码
            codeState: true,
            focusStatus:0,
          }
      },
      directives: {
        focus: {
          update: function (el, {value}) {
            if (value) {
              el.focus()
            }
          }
        }
      },
      created(){
        if(this.$cookies.get("card1")){
          this.card1 = this.$cookies.get("card1");
        }
        if(this.$cookies.get("card2")){
          this.card2 = this.$cookies.get("card2");
        }
        if(this.$cookies.get("card3")){
          this.card3 = this.$cookies.get("card3");
        }
        if(this.$cookies.get("card4")){
          this.card4 = this.$cookies.get("card4");
        }
        if(/dist2.2.1/.test(window.location.href)){
          initTitle('礼券绑定','8',"isreturn()");
        }else{
          initTitle('礼券绑定','8');
        }
        window.isreturn = function(){
          dooolyAPP.jumpAPPHOME(3);
        };
      },
      computed:{
        activeDisable() {
            return this.card1 + this.card2 + this.card3 + this.card4;
        },
        //样式控制
        classObj: function () {
          if (this.card1.length ==  4 && this.card2.length ==  4 && this.card3.length ==  4 && this.card4.length ==  4 ) {
            return {
              btn_disabled: false,
              recharge_button: true
            }
          }
          else {
            return {
              btn_disabled: true,
              recharge_button: false
            }
          }
        },
        serviceChargeNew(){
          if(this.pageList.serviceCharge){
            return this.pageList.serviceCharge
          }else
          {
            return 0
          }
 
        },
        activated(){
          if(/dist2.2.1/.test(window.location.href)){
            initTitle('礼券绑定','8',"isreturn()");
          }else{
            initTitle('礼券绑定','8');
          }
          this.loadFirstPage();
        },
      },
      watch:{
        card1:function (val,old){
          this.card1=this.card1.replace(/[\W]/g,'');
          if(val.length > 4){
            this.card2 = this.card1.substring(4);
            this.card1 = this.card1.substring(0,4);
            this.focusStatus = 2;
          }else if(val.length == 4){
            this.focusStatus = 2;
          }else if(val.length == 0){
            this.focusStatus = 0;
          }
        },
        card2:function (val,old){
          this.card2=this.card2.replace(/[\W]/g,'');
          if(val.length > 4){
            this.card3 = this.card2.substring(4);
            this.card2 = this.card2.substring(0,4);
            this.focusStatus = 3;
          }else if(val.length == 4){
            this.focusStatus = 3;
          }else if(val.length == 0){
            this.focusStatus = 1;
          }
        },
        card3:function (val,old){
          this.card3=this.card3.replace(/[\W]/g,'');
          if(val.length > 4){
            this.card4 = this.card3.substring(4);
            this.card3 = this.card3.substring(0,4);
            this.focusStatus = 4;
          }else if(val.length == 4){
            this.focusStatus = 4;
          }else if(val.length == 0){
            this.focusStatus = 2;
          }
        },
        card4:function (val,old){
          this.card4=this.card4.replace(/[\W]/g,'');
          if(val.length > 4){
            this.card4 = this.card4.substring(0,4);
            this.focusStatus = 4;
          }else if(val.length == 4){
            this.focusStatus = 4;
          }else if(val.length == 0){
            this.focusStatus = 3;
          }
        },
      },
      mounted(){
        this.loadFirstPage();
      },
      methods:{
        inputKeyDown(event){
          if(event.keyCode == 8){
            if(this.activeDisable.length == 12){
              this.card3 = this.card3.substring(0,3);
              this.focusStatus = 3;
            }else if(this.activeDisable.length == 8){
              this.card2 = this.card2.substring(0,3);
              this.focusStatus = 2;
            }else if(this.activeDisable.length == 4){
              this.card1 = this.card1.substring(0,3);
              this.focusStatus = 1;
            }else{
              this.focusStatus = 0;
            }
          }
        },
        //按钮焦点设置
        inputFocus(){
          this.focusStatus = 0;
          if(this.activeDisable.length >= 12){
            this.focusStatus = 4;
          }else if(this.activeDisable.length >= 8){
            this.focusStatus = 3;
          }else if(this.activeDisable.length >= 4){
            this.focusStatus = 2;
          }else{
            this.focusStatus = 1;
          }
        },
        //拨打电话
        mobileCall() {
         dooolyAPP.callPhone('4001582212');
        },
        cancelActivateBtn(){//取消弹框
          this.nonentityVisible1=false;
          this.nonentityVisible2=false;
          this.popupVisible4=false;
        },
        cancelActivateBtnData(){
          this.popupVisible3=false;
          this.getDatafailCount();
        },
        confirmActivateBtn(){//跳转个人中心
          this.nonentityVisible1=false;
          dooolyAPP.gotoJumpVue.call(this,'/pointsService');
        },
        confirmRechargeBtn(){//
          this.nonentityVisible1=false;
          window.location.reload();
        },
        loadFirstPage(){
          http({
            method: 'post',
            url: api.integralRechargeList,
            data: {
              userId: localStorage.userId,
              currentPage: this.pageNumber,
              pageSize: this.pageSize,
            }
          }).then((res) => {
            this.integral=res.data.data.integral;
            this.failCount=res.data.data.failCount;
            if(res.data.code == "1000"){
              this.listData=res.data.data.records;
             if(this.listData!= undefined){
                  this.mainPointList=true;
                  this.noRecords=false;
                  this.isLoading=true;
 
                  if (this.pageNumber >= res.data.data.countPage) {
                    this.allLoaded = true;
                    this.loadContainerState = true;
                    this.isLoading=false;
                  }
              }else{
                this.mainPointList=false;
                this.noRecords=true;
                this.isLoading=false;
              }
            }else if(res.data.code == "2000"){
                this.mainPointList=false;
                this.noRecords=true;
                this.isLoading=false;
            }else if(res.data.code == "1001"){
                this.$toast('系统错误');
            }else{
                this.$toast('小兜兜正忙,请稍候重试!');
            }
          });
          this.$nextTick(function () {
            this.scrollMode = "touch";
          });
        },
        rechargeBtn(){//充值
          this.focusStatus = 0;
          if(this.activeDisable.length < 16){
            this.$toast('请输入16位开礼券密码');
            return;
          }
          if(this.card1 == "" || this.card1.length !=  4){
            this.$toast('请输入开礼券密码');
            return;
          }
          if(this.card2 == "" || this.card2.length !=  4){
            this.$toast('请输入开礼券密码');
            return;
          }
          if(this.card3 == "" || this.card3.length !=  4){
            this.$toast('请输入开礼券密码');
            return;
          }
          if(this.card4 == "" || this.card4.length !=  4){
            this.$toast('请输入开礼券密码');
            return;
          }
          this.cardPassword=this.card1+this.card2+this.card3+this.card4;
          if(this.failCount==5 || this.failCount==10 || this.failCount==15){
           this.popupVisible3=true;
           return;
          }
          if(this.failCount>=20){
           this.$toast('当日密码输错次数已超限，请次日再试');
           return;
          }
          this.getDatafailCount();
        },
        getDatafailCount(){
          this.$baiduStats('礼券绑定-绑定');
          if(this.cardPassword){
           http({
            method: 'post',
            url: api.integralRechargeDo,
            data:{
              userId:localStorage.userId,
              cardPassword:this.cardPassword
            }
          }).then((res) => {
            this.failCount=res.data.data.failCount;
            if (res.data.code == "1000") {
              this.nonentityVisible1=true;
              document.getElementsByClassName('j-success')[0].style.display = 'block';
              this.$cookies.remove("card1");
              this.$cookies.remove("card2");
              this.$cookies.remove("card3");
              this.$cookies.remove("card4");
            }else if(res.data.code == "11003"){
              this.nonentityVisible2=true;
            }else if(res.data.code == "13003"){
              this.$toast('充值人与激活人不符');
            }else if(res.data.code == "13002"){
              this.$toast('绑定失败！请核对绑定码是否正确');
            }else if(res.data.code == "30000"){
              this.$toast('系统异常');
            }else if(res.data.code == "13004"){
              this.$toast('绑定失败！绑定码未激活');
            }else if(res.data.code == "13005"){
              this.$toast('绑定失败！绑定码已被使用');
            }else if(res.data.code == "13006"){
              this.$toast('超过最大失败次数');
            }else if(res.data.code == "13007"){
              this.$toast('礼券未激活');
            }else if(res.data.code == "13008"){
              //this.$toast('未在使用期限内');
              this.popupVisible4=true;
            }else if(res.data.code == "13009"){
              this.$toast('礼券已冻结');
            }else if(res.data.code == "1102"){
              this.$toast('验证失败');
            }else if(res.data.code == "1002"){
              this.$toast('验证码不存在');
            }
            else{
              this.$toast(res.data.msg);
            }
 
          });
        }else{
          this.$toast('请输入开礼券密码');
        }
      },
        more(){
          this.pageNumber = this.pageNumber + 1;
          http({
            method: 'post',
            url: api.integralRechargeList,
            data: {
              userId: localStorage.userId,
              currentPage: this.pageNumber,
              pageSize: this.pageSize,
            }
          }).then((res) => {
            this.isLoading=true;
            if (this.pageNumber >= res.data.data.countPage) {
              this.allLoaded = true;
              this.loadContainerState = true;
              this.isLoading=false;
            }
            this.listData = this.listData.concat(res.data.data.records);
          });
        },
        // 上拉加载
        loadBottom() {
          this.more();// 上拉触发的分页查询
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        beforeCreate(){
          document.body.style.backgroundColor="#fff";
          window.artile=this;
        },
        beforeDestroy(){
          document.body.style.backgroundColor="";
        },
      }
    }
</script>
 
<style scoped>
section{background: #fff;}
.p_b3{padding-bottom: 0.3rem;}
.input_div{background: #fff;padding: 0.3rem 0.2rem;font-size: 0;text-align: center;}
.input_div span{
  display: inline-block;
  width: 20%;
  position: relative;
}
.input_div span i:nth-child(1){
  content: '';
  position: absolute;
  width: 200%;
  height: 1px;
  top: 0;
  left:0;
  border-bottom: 1px solid #9f9f9f;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(.5,.5);
  transform: scale(.5,.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.input_div span i:nth-child(2){
  content: '';
  position: absolute;
  width: 1px;
  height: 200%;
  top: 0;
  right:0;
  border-right: 1px solid #9f9f9f;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(.5,.5);
  transform: scale(.5,.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}
.input_div span i:nth-child(3){
  content: '';
  position: absolute;
  width: 200%;
  height: 1px;
  bottom: 0;
  left:0;
  border-bottom: 1px solid #9f9f9f;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(.5,.5);
  transform: scale(.5,.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}
.input_div span i:nth-child(4){
  content: '';
  position: absolute;
  width: 1px;
  height: 200%;
  top: 0;
  left:0;
  border-left: 1px solid #9f9f9f;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(.5,.5);
  transform: scale(.5,.5);
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}
.input_div input{width:100%; height: 0.9rem;font-size: 0.3rem;color: #333;text-align: center;display: inline-block;outline-color: invert ;outline-style: none ;  outline-width: 0px ;  text-shadow: none ;  -webkit-appearance: none ;  -webkit-user-select: text ;  outline-color: transparent ;  box-shadow: none;  }
.input_div img{width: 2%;display: inline-block;padding: 0 0.1rem;}
.input_div span{color: #ccc;}
.recharge_button{
    text-align: center;
    width: 6.9rem;
    background: #ee3f44;
    color: #fff;
    line-height: 1rem;
    font-size: 0.3rem;
    margin: auto;
}
.recharge_record{
    background: #f5f5f5;
    color: #333;
    line-height: 1rem;
    font-size: 0.34rem;
    padding-left: 0.3rem;
    font-weight: bold;}
.font_p{font-size: 0.3rem;background: #fff;color: #999;padding-left: 0.3rem;padding-top: 0.3rem;}
 
 
  .topSection{background-color: #fff;padding-top: 0.2rem;}
  .div_header{background: #fff;
    width: 6.9rem;
    margin: auto;
    background:url(../../assets/images/point_recharge/point_recharge_bg.png) no-repeat;
    background-size: 100% 100%;
  }
  .div_header .left{margin: 0.54rem 0 0.36rem 0.36rem;width: 60%;overflow: hidden;text-overflow: ellipsis;}
  .usable_point{font-size: 0}
  .div_header .left span{font-size: 0.24rem; color: #f9cdc6;line-height: 0.6rem;}
  .big_p{font-size: 0.56rem; color: #fff;font-weight: bold;width: 100%; overflow: hidden;text-overflow: ellipsis;}
  .to_point{font-size: 0; margin-top: 0.6rem}
  .small_p{font-size: 0.28rem; color: #fff;font-weight: bold;}
  .div_header .right{
    padding: 0 0.2rem;
    height: 0.4rem;
    margin: 0.48rem 0.4rem 0 0;
    background-color:rgba(255,255,255,0.2);
    border-radius: 0.5rem;
    text-align: center;
    font-size: 0;
  }
 
  .div_header .right span{line-height:0.4rem; vertical-align:middle;font-size: 0.24rem;color: #fff;}
  .usable_ul{font-size: 0;border-bottom: 1px solid #ececec;margin-bottom: 0.2rem;}
  .usable_ul li{display: inline-block;line-height: 0.98rem;font-size: 0.28rem;width: 49.8%;text-align: center;}
  .usable_ul li.l1{color: #ee3f43;}
  .usable_ul li.l1 .div_bot{color: #ee3f43;text-decoration: none;border-bottom: 2px solid #ee3f44;
  display: inline-block;height: 0.95rem;}
  .div_con{background: #fff; margin: 0 0.3rem;border-bottom:1px solid #ececec;height: 1.5rem; clear: both;}
  .div_con a{height: 1.5rem;display: block;}
  .div_con .icon_div{height: 1.1rem;font-size: 0;margin-right: 0.3rem;}
  .div_con .icon_div img{width:0.9rem; height:0.9rem;display: inline-block;margin-top:0.25rem;border-radius:50%;}
  .div_con .icon_div i{font-size: 0.6rem;color: #a0a0a0;padding: 0.2rem 0.2rem 0.2rem 0;}
  .div_con .con{width:40%;}
  .div_con .con .shop_name{color: #333;font-size: 0.28rem;margin-top: 0.32rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  .div_con .con .con_date{color: #999;font-size: 0.24rem;margin-top: 0.16rem;}
  .div_con .con_money{line-height: 1rem;color: #333;font-size: 0.36rem;}
  /* footer */
  footer{position: fixed;left: 0;bottom: 0;width: 100%;z-index: 1010;background: #fdfdfd; }
  /* btn */
  .btn{height:1rem;line-height:1rem;padding: 0;font-size:0.32rem;color: #fff;}
  .btn-primary {border: none;background-color: #ee3f44;}
  .btn-block {display: block;width: 100%;}
 
.main-body {
  padding-top: 0.3rem;
  }
 
  .loadContainer {
    width: 100%;
    font-size: 0.24rem;
    text-align: center;
    padding: 0.3rem 0 1.5rem 0;
    background: #fff;
    color: #999;
  }
 
  .loadText {
    height: 0.5rem;
    line-height: 0.5rem;
  }
  .loadText span{
    margin: 0 0.2rem;
    vertical-align: middle;
  }
 
  .loadLine {
    display: inline-block;
    width: 2.1rem;
    height: 1px;
    background: #ececec;
    vertical-align: middle;
  }
 
  .mint-loadmore-bottom {
    width: 100%;
    font-size: 0.26rem;
    text-align: center;
    padding: 0.1rem 0 1rem 0;
  }
 
  .mint-loadmore-bottom-img {
    width: 1rem;
  }
 
 
/*确认弹出框*/
.isSuccess_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
}
.isSuccess{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    min-height: 3.2rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
}
.isSuccess .title{
    padding-top: 0.3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
}
.isSuccess p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    color:#333;
}
.isSuccess p.min{
    margin-top: 0;
    font-size: 0.28rem;
    padding: 0 0.5rem;
    color: #999;
}
.isSuccess p span{
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
    text-align: center;
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
.novice{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:101;
}
.novice img{
    width: 100%;
    height: 100%;
}
 
.btn_disabled{color: #f9c5c6;background: #f58c8f;text-align: center;width: 6.9rem;line-height: 1rem;font-size: 0.3rem;margin: auto;}
.r_m{margin: 0 !important;}
.span_red{color: #ee3f44 !important;padding: 0 0.2rem;font-size: 0.32rem !important;font-weight: bold;}
</style>
