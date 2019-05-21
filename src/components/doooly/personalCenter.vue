<template>
  <div class="personalCenter">
    <div v-if="showData">
      <div class="home-top">
        <img class="banner_bg" src="../../../src/assets/images/personalCenter/personalCenter_bg.png">
        <div class="personInfoTop" @click='JumpPersonalInfo()'>
          <div class="imgview">
            <img  :src="profile.memberHeadImgUrl">
          </div>
          <div class="personDetailInfo">
            {{profile.memberName}}
          </div>
          <div class="companyName">
            {{profile.memberCompanyName}}
          </div>
        </div>
        <div class="piont_view">
          <div @click="jumpMyPoints(1)">
            可用积分<br>
            <span>{{Number(profile.availablePoints).toFixed(2)}}</span>
          </div>
          <div @click="jumpMyPoints(0)">
            即将可用<br>
            <span>{{Number(adUserConn.returnIntegral).toFixed(2)}}</span>
          </div>
        </div>
        <div class="piont_back">
          兜礼已为你节省：<span>{{Number(profile.thriftAmount).toFixed(2)}}</span>元
        </div>
      </div>

      <section>
        <ul class="my_center_list marginTop">
          <li  @click='skip(3,"/myOrderList/0/","/myOrderList/0/")' class="margin">
            <!-- <img class="leftImg" src="../../../src/assets/images/personalCenter/myOrder.png"> -->
            <span class="leftSpan leftSpan1">我的订单</span>
            <div class="fr right">
              <span>全部订单</span>
              <img src="../../../src/assets/images/personalCenter/rightArrow.png">
            </div>
          </li>
          <li class="orderTab">
            <div @click='skip(4,"/myOrderList/1/","/myOrderList/1/")' class="tabs">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/order2.png"/>
                <img v-if="newOrderFlag" class="redDot" src="../../../src/assets/images/personalCenter/red_dot.png"/>
              </div>
              <span>最近下单</span>
            </div>
            <div @click='skip(5,"/myOrderList/2/","/myOrderList/2/")' class="tabs">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/successOrder2.png"/>
                <img v-if="newFinishFlag" class="redDot" src="../../../src/assets/images/personalCenter/red_dot.png"/>
              </div>
              <span>最近到帐</span>
            </div>
            <div @click='skip(6,"/myOrderList/3/","/myOrderList/3/")' class="tabs">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/cancelOrder2.png"/>
                <img v-if="newCancelFlag" class="redDot" src="../../../src/assets/images/personalCenter/red_dot.png"/>
              </div>
              <span>无返利</span>
            </div>
          </li>
        </ul>
        <ul class="my_center_list marginTop">
          <li class="orderTab">
            <div @click='jumpMyCoupon()' class="tabs">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/gift.png"/>
              </div>
              <span>我的福利</span>
            </div>
            <div @click='skip(11, "/point_recharge","/point_recharge")' class="tabs">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/integral2.png"/>
              </div>
              <span>礼券绑定</span>
            </div>
            <div @click='skip(12, "/familyInvite","/familyInvite")' class="tabs" v-if="browserName != 'otherAPP' ">
              <div class="tabImg">
                <img src="../../../src/assets/images/personalCenter/family2.png"/>
              </div>
              <span>邀请亲友</span>
            </div>
          </li>
        </ul>
        <ul class="my_center_list marginTop">
          <li @click='skip(7, "CustomerService","appeal")' v-if="this.adUserConn.groupName != '中福匯'">
            <!-- <img class="leftImg2" src="../../../src/assets/images/personalCenter/customerService.png"> -->
            <span class="leftSpan leftSpan2">意见反馈</span>
            <div class="fr right"><img src="../../../src/assets/images/personalCenter/rightArrow.png"></div>
          </li>
          <li @click='skip(8,"/complaint/","/complaint/")' v-if="this.adUserConn.groupName != '中福匯'">
            <!-- <img class="leftImg" src="../../../src/assets/images/personalCenter/appeal.png"> -->
            <span class="leftSpan leftSpan1">我的申诉</span>
            <div class="fr right"><img src="../../../src/assets/images/personalCenter/rightArrow.png"></div>
          </li>
          <li @click='skip(9,"/helpCenter/","/helpCenter/")' v-if="this.adUserConn.groupName != '中福匯'">
            <!-- <img class="leftImg" src="../../../src/assets/images/personalCenter/helpCenter.png"> -->
            <span class="leftSpan leftSpan1">帮助中心</span>
            <div class="fr right"><img src="../../../src/assets/images/personalCenter/rightArrow.png"></div>
          </li>
          <li  @click='skip(11,"/setting","/setting")'>
            <!-- <img class="leftImg2" src="../../../src/assets/images/personalCenter/set.png"> -->
            <span class="leftSpan leftSpan2">系统设置</span>
            <div class="fr right"><img src="../../../src/assets/images/personalCenter/rightArrow.png"></div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>


<script>
  import http from '@/http/http'
  import api from '@/assets/js/api.js';
  export default {
    name: "personalCenter",
    data(){
      return{
        showData:true,
        browserType:"",
        type:"doooly",
        userType:"",
        adUserConn:{},
        profile:{},
        newCancelFlag: false,
        newFinishFlag: false,
        newOrderFlag: false,
        browserName:browserName,
      }
    },
    activated(){
      initTitle('我的',6);
      this.getUserInfo();
    },
    beforeCreate(){
      document.body.style.backgroundColor="#fff";
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      initTitle('我的',6);
    },
    mounted(){
      this.getUserInfo();
      this.loadPersonGeneralInfo();
    },
    methods:{
      //个人信息概要
      loadPersonGeneralInfo() {
        http({
          method: 'post',
          url: api.profilev2_2,
          data: {
            userId: localStorage.userId
          }
        }).then((res) => {
          let code = res.data.code;
          this.IndicatorState=true;
          if (code == 1000) {
            this.profile = res.data.data;
            this.newCancelFlag = this.profile.newCancelFlag || false;
            this.newFinishFlag = this.profile.newFinishFlag || false;
            this.newOrderFlag = this.profile.newOrderFlag || false;
            if(res.data.data.isPayPassword){
              localStorage.isPayPassword = res.data.data.isPayPassword;
              localStorage.isSetPayPassword = res.data.data.isSetPayPassword;
            }
          }
        }).catch(err => {
          this.IndicatorState=true;
        })
      },
      JumpPersonalInfo() {
        let jsonObj = {
          "jumpType": "Native",
          "jumpUrl": "AccountSecurity"
        };
        if (this.browserName == "WebKit") {
          window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
        }else if (this.browserName == "Chrome WebView") {
          RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
        }else {
          this.$router.push({
            name: "accountSecurity",
            params: {userid: localStorage.userId}
          });
        }
      },
      jumpMyOrder() {
        this.$baiduStats('我的-会员卡-购物节省');
        let businessId = "all";
        this.$router.push({path: "/myOrderList/2/" + businessId});
      },
      jumpMyCoupon() {
        this.$baiduStats('我的-会员卡-已领福利');
        
        this.$router.push({path: '/coupon/' + 0});
      },
      jumpMyPoints(type,event) {
        this.$baiduStats('我的-会员卡-可用积分');
        if(type == 0){
          this.$router.push({path: "/myPointList/0/"});
        }else if(type == 1){
          this.$router.push({path: "/myPointList/1/"});
        }else if(type == 2){
          event.cancelBubble = true;
          this.$router.push({path: "/pointsService"});
        }
      },
      getUserInfo(){
        http({
          method: 'get',
          url: api.personalCenter+"?userId="+localStorage.userId
        }).then((res) => {
          this.showData=true;
          if(res.data.adUserConn != undefined){
            this.adUserConn = res.data.adUserConn;
            localStorage.groupId=res.data.adUserConn.groupId;
            localStorage.blocId=res.data.adUserConn.blocId;
            localStorage.groupShortName = res.data.adUserConn.groupShortName;
            localStorage.setItem('mobile', res.data.adUserConn.telephone);
          }
        });
      },
      getMyOrderHint(){
        // 弃用
        let params = {
          userId: localStorage.userId
        };
        http({
          method: 'post',
          url: api.getOrderHint,
          data: params
        }).then((res) => {
          let data = res.data.data || {};
          this.newCancelFlag = data.newCancelFlag || false;
          this.newFinishFlag = data.newFinishFlag || false;
          this.newOrderFlag = data.newOrderFlag || false;
        });
      },
      skip(direct,appURL, wechatURL) {
        if(direct=="1" || direct=="7"){
          if(direct=="1"){
            this.$baiduStats('我的-头像');
          }else if(direct=="7"){
            this.$baiduStats('我的-联系客服');
          }
          let jsonObj={
            "jumpType":"Native",
            "jumpUrl":appURL
          };
          if (browserName  == "WebKit") {
            window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
          }else if(browserName  == "Chrome WebView"){
            RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
          }else {
            if(direct=="1"){
              this.$router.push({name: wechatURL, params: {userid: localStorage.userId}});
            }else {
              this.$router.push({name: wechatURL,params: {dataType:6}});
            }
          }
        }else if(direct=="3" || direct=="4"|| direct=="5"|| direct=="6"){
          if(direct=="3"){
            this.$baiduStats('我的-全部订单');
          }
          else if(direct=="4"){
            this.newOrderFlag=false;
            this.$baiduStats('我的-最近下单');
          }
          else if(direct=="5"){
            this.newFinishFlag=false;
            this.$baiduStats('我的-最近到帐');
          }
          else if(direct=="6"){
            this.newCancelFlag=false;
            this.$baiduStats('我的-无返利');
          }
          let businessId="all";
          let url="";
          if(browserName  == "WebKit" || browserName  == "Chrome WebView"){
            url=appURL+businessId;
          }
          else{
            url=wechatURL+businessId;
          }
          dooolyAPP.gotoJumpVue.call(this,url);
        }else{
          if(direct=="2"){
            this.$baiduStats('我的-当前可用积分');
          }
          else if(direct=="11"){
            this.$baiduStats('我的-即将到账积分');
          }
          else if(direct=="8"){
            localStorage.complaintTab=0;
            this.$baiduStats('我的-我的申诉');
          }
          else if(direct=="9"){
            this.$baiduStats('我的-帮助中心');
          }
          else if(direct=="10"){
            this.$baiduStats('我的-关于兜礼');
          }else if(direct=="11"){
            this.$baiduStats('我的-积分充值');
          }else if(direct=="12"){
            this.$baiduStats('我的-邀请亲友');
          }
          else if(direct=="13"){
            this.$baiduStats('我的-系统设置');
          }
          let url="";
          if(browserName  == "WebKit" || browserName  == "Chrome WebView"){
            url=appURL
          }else{
            url=wechatURL
          }
          dooolyAPP.gotoJumpVue.call(this,url);
        }
      }
    }
  }
</script>

<style scoped>
  .personalCenter{
    padding-bottom:0.2rem;
    width: 100%;
    height: 100%;
    font-family: "Segoe UI","Lucida Grande",Helvetica,Arial,"Microsoft YaHei",FreeSans,Arimo,"Droid Sans","wenquanyi micro hei","Hiragino Sans GB","Hiragino Sans GB W3",FontAwesome,sans-serif;
    font-weight: 400;
    line-height: 1.6;
    color: #333;
    font-size: 1.6rem;
  }

  /* 个人中心列表 */
  .my_center_list{
    background-color: #f8f8f8;
    text-align: left;
    overflow: hidden;
    width: 6.9rem;
    margin: auto;
    border-radius: 5px;
  }
  .marginTop{
    margin-top:0.2rem
  }
  .my_center_list li{
    list-style:none;
    height: 0.98rem;
    line-height: 0.98rem;
    padding:0 0.35rem;
    color: #333;
    border-bottom:1px solid #ececec;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    font-size: 0;
    overflow: hidden;
    vertical-align: middle;
  }
  .my_center_list .margin{
    padding: 0;
    margin: 0 0.35rem;
  }
  .my_center_list li:last-child{border-bottom: none;}
  .my_center_list li .leftSpan{color: #333;font-size:0.28rem;line-height: 0.98rem;vertical-align: middle}
  .my_center_list li .leftImg{width: 0.48rem;vertical-align: middle}
  .my_center_list li .leftImg2{width: 0.48rem;vertical-align: middle}
  .my_center_list li .fr{float:right; font-size: 0; vertical-align: middle}
  .my_center_list li .right{text-align:right; height:0.98rem;vertical-align: middle}
  .my_center_list li .right span{font-size: 0.28rem; color: #999; margin-right: 0.2rem;line-height: 0.98rem;vertical-align: middle}
  .my_center_list li .right img{width: 0.16rem; height: 0.28rem;vertical-align: middle}
  .my_center_list .orderTab{
    height: 1.5rem;
    overflow: hidden;
    text-align: center;
    border:none;
  }
  .my_center_list .orderTab .tabs{float: left; width: 33%; text-align: center; margin-top: 0.3rem; line-height: normal;}
  .my_center_list .orderTab .tabs span{font-size: 0.24rem; color: #666;margin-top: 0.2rem; display: inline-block;}
  .my_center_list .orderTab .tabs .tabImg{width: 0.56rem;height: 0.41rem;margin: auto; position: relative;text-align: left}
  .my_center_list .orderTab .tabs .tabImg img{width: 100%;}
  .my_center_list .orderTab .tabs .tabImg .redDot{position: absolute;width: 0.16rem;right: -0.05rem;top: -0.05rem;}

  .home-top{
    height: 4rem;
    width: 100%;
    background: url(../../assets/images/personalCenter/head_bg2.png) center center no-repeat;
    background-size:6.7rem;
    margin: 0.2rem 0;
    position: relative;
  }
  .home-top .banner_bg{
    position: absolute;
    left: 50%;
    top: 55%;
    width: 100%;
    z-index: -1;
    transform: translate(-50%,-50%);
  }
  .personInfoTop{
    font-size: 0;
    text-align: center;
  }
  .personInfoTop .imgview{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    padding: 0.17rem 0.25rem;
    margin: 0.13rem 0 0.03rem 0;
    background: url(../../assets/images/personalCenter/head_photo_bg.png) 0 0.1rem no-repeat;
    background-size: 1.5rem 1.35rem;
  }
  .personInfoTop .imgview img{
    border-radius: 100%;
    width: 100%;
    height: 100%;
  }
  .personDetailInfo{
    font-size: 0.3rem;
    color: #fff;
    line-height: 100%;
  }
  .companyName{
    font-size: 0.24rem;
    color: #fff;
    opacity: 0.5;
    margin-top: 0.1rem;
    line-height: 100%;
  }
  .piont_view{
    width: 6.7rem;
    display: flex;
    margin: 0 auto;
    margin-top: 0.45rem;
  }
  .piont_view div{
    width: 50%;
    font-size: 0.24rem;
    color: #d9b15a;
    text-align: center;
    line-height: 0.3rem;
  }
  .piont_view div span{
    font-size: 0.3rem;
  }
  .piont_view div:last-child{
    color: #a0a0a0;
  }
  .piont_back{
    font-size: 0.24rem;
    color: #a0a0a0;
    text-align: center;
    margin-top: 0.28rem;
  }
  .piont_back span{
    color: #d9b15a;
  }
  .top-down-wrapper{
    font-size: 0;
  }
  .down-content{
    display: inline-block;
    width: 33.3%;
    text-align: center;
    overflow: hidden;
    font-size: 0;
    line-height: 0.34rem;
    font-size: 0;
  }
  .down-content span{
    display: inline-block;
    margin-top: 0.04rem;
  }
  .down-content .down-title{
    font-size: 0.28rem;
    color: rgba(255,255,255,0.60);
    letter-spacing: -0.34px;
  }
  .down-content .down-number{
    font-size: 0.36rem;
    color: #DBBB84;
  }
  .down-content .down-sales{
    font-size: 0.2rem;
    color: rgba(255,255,255,0.50);
  }
  .down-content .down-button{
    margin-top: 0.12rem;
    width: 1.36rem;
    line-height: 0.48rem;
    font-size: 0.24rem;
    color: #DBBB84;
    border: 1px solid #DBBB84;
    border-radius: 100px;
  }
</style>
