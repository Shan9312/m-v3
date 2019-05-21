<template>
  <div class="home">
    <!--  弹出框 新手礼 start-->
    <div v-show="isShow">
      <div class="model_bg"></div>
      <div class="new_model">
        <div class="border_bg">
          <div class="phone_img">
            <img id="new_pic" src="../../assets/images/red_packet.png" style="width:86%;"/>
            <p class="model_money1">{{integral}}</p>
            <p class="model_money2">{{integral}}</p>
          </div>
          <div class="model_btn_div" @click="click_send();">
          </div>
        </div>
      </div>
    </div>
    <!--  弹出框 新手礼 end-->

    <adBanner :items="adList">

    </adBanner>
    <div class="point">
      <div class="title">会员特权已为您返利：<span>{{myPoints.isReturnPoints}}</span> 积分</div> 
      <div>可抵扣人民币<span> {{myPoints.isReturnPoints}} </span>元</div> 
    </div>
    <newHmoeModules v-for="(item,index) in list" :origin="'首页'" :key="index" :type="item.type" :list="item.list" :name="item.mainTitle" :index="item.listindex" :online="item.isOnline" :subTitle="item.subTitle"></newHmoeModules>
    <coupon-toast :conponShow="conponShow" :isGift="isShow" v-show="couponisShow"></coupon-toast>
    <div class="dh" v-show="dfShow" @touchmove.prevent>
      <img :src="dahuaimg">
    </div>
    <!-- 大华生日礼 -->
    <div class="giftLogo" @click="giftShow = true" v-show="!giftShow && giftLogoShow">
      <img src="../../assets/images/home/gift_logo.png">
    </div>
    <div class="giftPop" v-show="giftShow" @touchmove.prevent>
      <div class="close" @click="giftShow = false"></div>
      <img src="../../assets/images/home/gift.png">
      <div class="submit" @click="getGift">点击领取</div>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import adBanner from '@/components/common/adBannerNew';
  import newHmoeModules from '@/components/common/newHmoeModules';
  import couponToast from '@/components/common/couponToast';
  import bus from '@/components/common/bus';
  import {getAddress} from '@/assets/js/wechatShare2.js';
  import MobileDetect from 'mobile-detect';
  export default {
    name: "new-home",
    data(){
      return{
        integral:"",
        isShow:false,
        couponisShow:false,
        adList:[],
        list:[],
        myPoints:{
          doingReturnPoints: "*******",
          isReturnPoints: "*****",
          notReturnPoints: "*****",
        },
        myPointsGet:false,
        conponShow:false,
        dfShow:false,
        dahuaimg:'',
        giftShow:false,
        giftLogoShow:false,
        gifts:[],
      }
    },
    components: {
      adBanner,
      newHmoeModules,
      couponToast,
    },
    methods: {
      loadAdList() {
        http({
          method: 'get',
          url: api.indexForAjax + '?address=' + localStorage.address,
        }).then((res) => {
          let adList = [];
          if(res.data.data.ads){
            for (let [index, elem] of res.data.data.ads.entries()) {
              adList.push({
                imageLinkUrl: elem.imageLinkUrl,
                linkType: elem.linkType,
                imagePath: elem.imagePath
              });
            }
          }
          this.adList = adList;
        })
        let md = new MobileDetect(window.navigator.userAgent);
        //用户行为分析统计
        http({
          method: 'post',
          url: api.actionVisit,
          data:{
            model:md.versionStr('Build'),//设备型号
            product: md.phone(),//产品型号
            brand: md.phone(),//产品品牌	
            manufacturer: md.phone(),//产品制造商
            systemVersion: '',//系统版本型号
            os:md.os(),//操作系统
            browser: md.userAgent(),//浏览器
            blocId: localStorage.blocId,//集团
            appVersion:'',//应用版本
          },
          headers: {
            appSource: 'H5',//渠道
            deviceId: getDeviceId() == 'undefined' ? getDeviceId() : localStorage.userId,//设备id
            userId:localStorage.userId,
          }
        })
      },
      //点击领取积分
      click_send() {
        this.isShow = false;
        this.$baiduStats('首页-领取积分');
        let myDate = new Date();
        let myTime = new Date().getTime();//获取当前时间
        let getClientChannel = "";
        if (browserName == "WeChat") {
          getClientChannel = 'wechat';
        }else if (browserName == "WebKit" || browserName == "Chrome WebView") {
          getClientChannel = 'app';
        }else if(browserName == "otherAPPAndroid"){
          getClientChannel = 'wiscoapp';
        }else if(browserName == "otherAPPIos"){
          getClientChannel = 'app';
        }else {
          getClientChannel = 'brower';
        }
        http({
          method: 'post',
          url: api.getSendIntegralActivity,
          data: {
            clientChannel: getClientChannel,
            params: {userId: localStorage.userId},
            timestamp: myTime
          }
        }).then((res) => {
          if (res.data.code == 1000) {  //成功返回数据
            this.isShow = false;
          }
        })
      },
      // 领取生日礼
      getGift(){
        this.$baiduStats('首页-大华活动-领取礼包-点击领取');
        if(this.gifts.length <2){
          dooolyAPP.redirectActivity('giftActivity/'+this.gifts[0].id);
        }else{
          dooolyAPP.redirectActivity('giftList');
        }
      },
      //是否领取过新手礼积分
      isNewGift() {
        let myDate = new Date();
        let mytime = new Date().getTime(); //获取当前时间
        let getClientChannel = "";
        if (browserName == "WeChat") {
          getClientChannel = 'wechat';
        }
        else if (browserName == "WebKit" || browserName == "Chrome WebView") {
            getClientChannel = 'app';
        }
        else if(browserName == "otherAPPAndroid"){
          getClientChannel = 'wiscoapp';
        }
        else if(browserName == "otherAPPIos"){
          getClientChannel = 'app';
        }
        else {
          getClientChannel = 'brower';
        }
        http({
          method: 'post',
          url: api.getIntegralActivity,
          data: {
            clientChannel: getClientChannel,
            params: {userId: localStorage.userId},
            timestamp: mytime
          }
        }).then((res) => {
          if (res.data.code == 1000) {  //成功返回数据
            this.isShow = true;
            this.integral = res.data.data.integral;
            this.getGiftBagList(res.data.code);
          }else{
            this.getGiftBagList();
          }
        })
      },
      getGiftBagList(type){
        http({
          method: 'post',
          url: api.giftBagList,
          data: {
            userId: localStorage.userId,
          }
        }).then((res) => {
          if (res.data.code == 1000) {  //成功返回数据
            if(this.$cookies.get("first_giftShow") != "3" && res.data.data.gifts && res.data.data.iconShow == 1){
                this.giftShow = true;
                this.$cookies.set("first_giftShow","3",24 - new Date().getHours() + "h");
                this.$baiduStats('首页-大华活动-领取礼包-自动弹出');
            };
            if(res.data.data.iconShow == 1){
                this.giftLogoShow = true;
                this.gifts = res.data.data.gifts;
            }
          }else{
            this.couponisShow = true;
          }
        })
      },
      getList(){
        if(!localStorage.address){
          localStorage.address = "全国";
        }
        http({
          method: 'post',
          url: api.indexV3_3,
          data: {
            address: localStorage.address,
          }
        }).then((res) => {
          if(res.data.code == 1000){
            let _list = res.data.data.floors;
            if(_list.length){
              this.list = [];
              setTimeout(()=>{ //数组视图不更新BUG
                if(_list.length){
                  this.list = _list;
                  var a = 1;
                  for(var i=0;i<_list.length;i++){
                    if(this.list[i].type == 2){
                      this.list[i].listindex = a-1;
                      a++;
                    }else{
                      this.list[i].listindex = 0;
                    }
                  }
                }
              },10)
            }else {
              this.list = [];
            }
          }
        });
        http({
          method: 'post',
          url: api.userReturnPoints,
          data:{"userId":localStorage.userId}
        }).then((res) => {
          if(res.data.code == 1000){
            localStorage.groupId = res.data.data.adGroup.id;
            localStorage.blocId = res.data.data.adGroup.blocId;
            this.groupShortName = res.data.data.adGroup.groupShortName;
            localStorage.groupShortName = res.data.data.adGroup.groupShortName;
            if(document.title == "兜礼"){
              initTitle(localStorage.groupShortName + '专享', 1);
            }
            this.myPoints = res.data.data;
          }
        });
      },
      getPoints(){
        http({
          method: 'post',
          url: api.receiveUserReturnPoints,
          data: {
            userId: localStorage.userId,
          }
        }).then((res) => {
          if(res.data.code == 1000){
            this.myPointsGet = true;
            this.myPoints = res.data.data;
            this.$toast("您的积分45天内到账");
          }else{
          }
        });
        this.$baiduStats('首页-积分返利按钮-点击领取');
      }
    },
    mounted(){
      getAddress.call(this);
      this.getList();//获取商户列表数据
      this.loadAdList();
      bus.$on('mapStore',(function(data){}).bind(this));
      if(localStorage.groupShortName){
        initTitle(localStorage.groupShortName + '专享', 1);
      }else{
        initTitle('兜礼', 1);
      }
      if(localStorage.appStartUpUrl && localStorage.appStartUpUrl != 'undefined'){
        this.dahuaimg = localStorage.appStartUpUrl;
        localStorage.removeItem('appStartUpUrl');
        this.dfShow = true;
        setTimeout(() => {this.dfShow = false;}, 3000);
      }
      if(localStorage.thirdUserToken && browserName != 'WeChat'){
        http({
          method: 'post',
          url: api.thirdLogin,
          data:{
            thirdUserToken:localStorage.thirdUserToken,
          },
        }).then((res) => {
          if (res.data.code == "1001"){
            dooolyAPP.logOut.call(this);
          } else { // fix ### 01-26
            let str = res.data.data.userInfo;
            let obj = JSON.parse(str);
            if (obj.token !== localStorage.token) {
              dooolyAPP.logOut.call(this);
            }
          }
        })
      }
    },
    activated(){
      this.loadAdList();
      this.getList();
      if(localStorage.groupShortName){
        initTitle(localStorage.groupShortName + '专享', 1);
      }else{
        initTitle('兜礼', 1);
      }
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      this.isNewGift();//是否领取过新手礼积分
    },
    beforeCreate(){
      if(browserName=="WebKit" || browserName=="Chrome WebView"){
        dooolyAPP.forceLoginOut();
      }
      document.body.style.backgroundColor="#fff";
      if ( window.__wxjs_is_wkwebview === true && !localStorloadPrivilegeDataage.latitude) {
        if(!localStorage.reload){
          localStorage.reload=1;
          location.reload();
        }
      }
    },
    destroyed(){
      localStorage.removeItem('reload');
    },
  }
</script>

<style scoped>
.adBannerSwipe{
  width: 100%;
  height: 3rem;
}



/* 弹出框新手礼 */
.model_bg{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: block;
}
.new_model{
  position: fixed;
  width: 80%;
  left: 50%;
  top: 50%;
  margin-left: -45%;
  margin-top: -45%;
  background-size: 100%;
  display: block;
  z-index: 100000;
  text-align: center;
  overflow: hidden;
}
.model_btn_div{
  position: absolute;
  bottom: 10%;
  width: 70%;
  height: 0.9rem;
  margin-left: 20%;
}
.model_money1{
  position: absolute;
  width: 70%;
  margin-left: 20%;
  top: 20%;
  color: #d8c37f;
  font-size: 1.4rem;
  font-weight: bold;
}
.model_money2{
  position: absolute;
  width: 70%;
  margin-left: 20%;
  color: #f0d8b4;
  font-size: 0.7rem;
  font-weight: bold;
  bottom: 26%;
}
/* 新增积分模块 */
.point{
  margin: 0 auto;
  width: 6.7rem;
  height: 0.9rem;
  background: url(../../assets/images/home/pointBg.png) no-repeat 0 0;
  background-size: 100%;
  text-indent: 0.6rem;
  font-size: 0.22rem;
  color: #a0a0a0;
  margin-bottom: 0.36rem;
}
.title{
  font-size: 0.28rem;
  line-height: 100%;
  padding: 0.16rem 0 0.04rem 0;
}
.title span{
  font-size: 0.3rem;
  color: #ee3f44;
}
.dh{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
}
.dh img{
  width: 4.6rem;
  height: 3.6rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -2.3rem;
  margin-top: -1.8rem;
}
/* 生日礼 */
.giftPop{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
}
.giftPop img{
  width: 5.9rem;
  height: 8.81rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -2.95rem;
  margin-top: -5rem;
}
.giftPop .submit{
  width: 4.2rem;
  line-height: 0.9rem;
  border-radius: 1rem;
  font-size: 0.32rem;
  color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -2.1rem;
  margin-top: 4.1rem;
  background-image: -moz-linear-gradient( 180deg, rgb(239,103,96) 0%, rgb(242,123,116) 100%);
  background-image: -webkit-linear-gradient( 180deg, rgb(239,103,96) 0%, rgb(242,123,116) 100%);
  background-image: -ms-linear-gradient( 180deg, rgb(239,103,96) 0%, rgb(242,123,116) 100%);
}
.giftPop .close{
  width: 0.46rem;
  height: 0.46rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: 1.95rem;
  margin-top: -5rem;
  z-index: 1;
}
.giftLogo{
  position: fixed;
  bottom: 15%;
  right: 2%;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255,255,255,0.6);
  border-radius: 100%;
  z-index: 999;
}
.giftLogo img{
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
