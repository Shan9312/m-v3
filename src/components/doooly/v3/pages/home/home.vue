<template>
  <div class="home-page" v-if="users">
    <div class="header">
      <div class="lv" data-route-name="home" data-baidu-stats="会员权益等级" @click="goJumpPage(2)">
        <img :src="lvList[0]">
      </div>
      <div class="user">
        <div class="view">
          <div class="name">
            {{users.memberName || (localStorageObj.mobile.substring(0,3) + '****' + localStorageObj.mobile.substring(7,11))}}
          </div>
          <div class="piont">
            <span>{{users.availablePoints ? users.availablePoints.toFixed(2) : '0.00'}}</span> 积分
          </div>
        </div>
        <div class="view">
          <div class="equity">
            <img data-route-name="home" data-baidu-stats="会员权益等级" @click="goJumpPage(2)" v-for="(item,index) in users.groupEquitys" :key="index" :src="item.equityLogo" v-show="index < 3">
            <span class="icon" v-if="users.hasMoreEquity"></span>
            <div data-route-name="home" :data-baidu-stats="'您有' + users.giftBagCount + '个礼包待领取'" @click="goJumpPage(1)" class="gift" v-if="users.giftBagCount">
              {{users.giftBagCount}}个礼包待领取
            </div>
          </div>
          <div data-route-name="home" data-baidu-stats="花积分" class="takepiont" @click="goJumpPage(3)">
            花积分<span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="home-banner">
      <mt-swipe :auto="4000" :showIndicators="adList.length > 1" v-if="adList.length > 0">
        <mt-swipe-item data-route-name="home" :data-baidu-stats="'轮播图-' + item.title" v-for="(item,index) in adList" :key="index" ><img @click="goJumpPage(4,item.imageLinkUrl,index+1);" :src="item.imagePath" :onerror="defaultImg"></mt-swipe-item>
      </mt-swipe>
      <mt-swipe :auto="4000" :showIndicators="false" v-else>
        <mt-swipe-item><img src="" :onerror="defaultImg"></mt-swipe-item>
      </mt-swipe>
    </div>
    <newHmoeModules v-for="(item,index) in typeList" :origin="'首页'" :key="index" :newListV3="item"></newHmoeModules>
    <!-- 下午茶弹出框 -->
    <coupon-toast :conponShow="conponShow" :isGift="newGift.isShow" v-show="couponisShow"></coupon-toast>
    <!--  弹出框 新手礼 start-->
    <div class="new-gift-bg" v-show="newGift.isShow" @touchmove.prevent>
      <div class="new-gift">
        <div>
          <div>
            <img :src="newGift.img" style="width:86%;"/>
            <p class="show-integral">{{newGift.integral}}</p>
            <p class="get-integral">{{newGift.integral}}</p>
          </div>
          <div class="button" data-route-name="home" data-baidu-stats="领取积分" @click="getPiont();">
          </div>
        </div>
      </div>
    </div>
    <!-- 大华闪屏欢迎页 -->
    <div class="dh-guide" v-show="dhData.show" @touchmove.prevent>
      <img :src="dhData.img">
    </div>
    <!-- 大华生日礼 -->
    <!-- <div class="gift-logo" @click="giftData.giftShow = true" v-show="!giftData.giftShow && giftData.giftLogoShow">
      <img :src="giftData.giftLogo">
    </div> -->

    <div class="gift-pop" v-show="giftData.giftShow" @touchmove.prevent>
      <div class="close" @click="giftData.giftShow = false"></div>
      <img :src="giftData.giftBanner">
      <div class="submit" @click="goJumpPage(5);">点击领取</div>
    </div>

    <!-- giftData.giftShow && dhData.show && newGift.isShow && couponisShow -->
    <custom-popup v-if="showCustom" />
    
    <footer></footer>
  </div>
</template>

<script>
  import {
    getAdList,
    addUserAction,
    getTemplateByType,
    getNewGift,
    sendIntegralActivity,
    giftBagList,
    thirdLogin,
    getProfileV3
  } from 'v3/services';
  import MobileDetect from 'mobile-detect';
  import {getAddress} from '@/assets/js/wechatShare2.js';
  import NewHmoeModules from '@/components/common/newHmoeModules';
  import CouponToast from '@/components/common/couponToast';
  import CustomPopup from './popup';
  export default {
    name: 'home',
    props: {

    },
    data() {
      return {
        adList: [],
        typeList: [],
        lvList:[
          require('@/assets/images/home/home_v3_lv_0.png'),
          require('@/assets/images/home/home_v3_lv_1.png'),
          require('@/assets/images/home/home_v3_lv_2.png'),
          require('@/assets/images/home/home_v3_lv_3.png'),
          require('@/assets/images/home/home_v3_lv_4.png'),
          require('@/assets/images/home/home_v3_lv_5.png'),
          require('@/assets/images/home/home_v3_lv_6.png'),
        ],
        users:'',
        defaultImg: 'this.src="' + require('@/assets/images/shoppingGuide/goods.png') + '"',
        newGift:{
          img:require('@/assets/images/red_packet.png'),
          isShow:false,
          integral:'***',
          loaded: false
        },
        conponShow:false,
        couponisShow:false,
        giftData:{
          giftLogoShow:false,
          giftShow:false,
          gifts:{},
          giftLogo:require('@/assets/images/home/gift_logo.png'),
          giftBanner:require('@/assets/images/home/gift.png'),
          loaded: false
        },
        dhData:{
          img:'',
          show:false,
        },
        localStorageObj:localStorage,
        // popStatus: false, // 自定义弹窗状态
        // isInitData: false
      };
    },
    computed: {
      showCustom(){
        alert(this.giftData.loaded + '---' + this.newGift.loaded);
        // alert(this.giftData.giftShow + '---' + this.dhData.show + '---' + this.newGift.isShow + '---' + this.conponShow);
        return (this.giftData.loaded && this.newGift.loaded) && !(this.giftData.giftShow || this.dhData.show || this.newGift.isShow || this.conponShow);
      }
    },
    created() {
      this.firstLoding();
      this.getPoints();
      this.getAdList();
      this.getTemplateByType();
    },
    mounted() {
      this.addUserAction();
    },
    methods: {
      // changePopStatus(status){
      //   this.popStatus = status;
      // },
      async goJumpPage(type,url,index) {
        if(type == 1){
          //  this.$baiduStats('首页-头部-待领取礼包');
           dooolyAPP.redirectActivity('giftList?type=0');
        }else if(type == 2){
          if(this.users.groupLevel == 0){
            return;
          }
          // this.$baiduStats('首页-头部-权益icon');
          dooolyAPP.gotoJumpVue.call(this,'/v3/memberEquity');
        }else if(type == 3){
          // this.$baiduStats('首页-头部-花积分');
          dooolyAPP.gotoJumpVue.call(this,'/takeIntegral');
        }else if(type == 4){
          // this.$baiduStats('首页-banner-'+index);
          dooolyAPP.gotoJumpJq.call(this,url);
        }else if(type == 5){
          // this.$baiduStats('首页-大华活动-领取礼包-点击领取');
          if(this.giftData.gifts.length < 2){
            dooolyAPP.redirectActivity('giftActivity/'+this.giftData.gifts[0].id);
          }else{
            dooolyAPP.redirectActivity('giftList');
          }
        }
      },
      async getPoints() {
        const {
          data
        } = await getProfileV3();
        if(data.code == 1000 && data.data){
          this.users = data.data;
          this.localStorageObj.setItem('groupId',data.data.adGroup.id);
          this.localStorageObj.setItem('blocId',data.data.adGroup.blocId);
          this.localStorageObj.setItem('groupShortName',data.data.adGroup.groupShortName);
        }
      },
      async getAdList() {
        const {
          data
        } = await getAdList();
        if (data.code === '1000' && data.data) {
          this.adList = data.data.ads;
        }
      },
      async getTemplateByType() {
        const {
          data
        } = await getTemplateByType({
          address: this.localStorageObj.address,
          tempType: 1
        });
        if (data.code === '1000' && data.data) {
          this.typeList = data.data.floors;
        }
      },
      async addUserAction() {
        let md = new MobileDetect(window.navigator.userAgent);
        const {
          data
        } = await addUserAction(
          md.versionStr('Build'),
          md.phone(),
          md.phone(),
          md.phone(),
          '',
          md.os(),
          md.userAgent(),
          this.localStorageObj.blocId,
          '', {
            appSource: 'H5',
            deviceId: getDeviceId() == 'undefined' ? this.localStorageObj.userId : getDeviceId(),
            userId: this.localStorageObj.userId,
          }
        );
      },
      //是否领取过新手礼积分
      async isNewGift() {
        const {
          data
        } = await getNewGift();
        this.newGift.loaded = true;
        if (data.code === '1000' && data.data) {
          this.newGift.isShow = true;
          this.newGift.integral = data.data.integral;
          this.getGiftBagList(data.code);
        }else{
          this.getGiftBagList();
        }
      },
      async getGiftBagList(type){
        const {
          data
        } = await giftBagList();
        this.giftData.loaded = true;
        if (data.code == 1000 && data.data) {
          if(this.$cookies.get("first_giftShow") != "3" && data.data.gifts && data.data.iconShow == 1){
            this.giftData.giftShow = true;
            this.$cookies.set("first_giftShow","3",24 - new Date().getHours() + "h");
            // this.$baiduStats('首页-大华活动-领取礼包-自动弹出');
          };
          if(data.data.iconShow == 1){
            this.giftData.giftLogoShow = true;
            this.giftData.gifts = data.data.gifts;
          }
        }else{
          this.couponisShow = true;
        }
      },
      async thirdLogin(){
        const {
          data
        } = await thirdLogin();
        if (data.code == "1001"){
          dooolyAPP.logOut();
        } else {
          if(data.data){
            const obj = JSON.parse(data.data.userInfo);
          }
          if (obj.token != this.localStorageObj.token) {
            dooolyAPP.logOut();
          }
        }
      },
      //点击领取积分
      async getPiont() {
        const {
          data
        } = await sendIntegralActivity();
        this.newGift.isShow = false;
      },
      async firstLoding(){
        document.body.style.backgroundColor="#fff";
        initTitle(this.localStorageObj.groupShortName ? this.localStorageObj.groupShortName + '专享':'兜礼');
        //获取地址
        getAddress.call(this);
        //大华首次登录闪屏
        if(this.localStorageObj.appStartUpUrl && this.localStorageObj.appStartUpUrl != 'undefined'){
          this.dhData.img = this.localStorageObj.appStartUpUrl;
          this.dhData.show = true;
          setTimeout(() => {this.dhData.show = false;this.isNewGift();}, 3000);
          this.localStorageObj.removeItem('appStartUpUrl');
        }else{
          this.isNewGift();
        }
        //大华免登录
        if(this.localStorageObj.thirdUserToken && browserName != 'WeChat'){
          this.thirdLogin();
        }
      },
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    watch: {
  
    },
    components: {
      NewHmoeModules,
      CouponToast,
      CustomPopup
    },
  };
</script>

<style scoped lang="scss">
footer{
  height: 1rem;
}
.header{
  background: url('~@/assets/images/home/home_v3_header.png') no-repeat left bottom;
  background-size: 100%;
  height: 3.3rem;
  padding: 0.1rem 0.2rem 0 0.2rem;
  display: flex;
  .lv{
    img{
      width: 0.86rem;
    }
  }
  .user{
    font-size: 0.24rem;
    color: #fff;
    padding-top: 0.05rem;
    .view{
      width: 6.1rem;
      padding-left: 0.14rem;
      display: flex;
      justify-content: space-between;
      .name{
        font-size: 0.34rem;
        font-weight: bold;
      }
      .piont{
        span{
          font-size: 0.46rem;
          font-weight: bold;
        }
      }
      .equity{
        font-size: 0;
        display: flex;
        img{
          width: 0.42rem;
          margin-right: 0.1rem;
          height: 0.62rem;
        }
        .gift{
          height: 0.42rem;
          line-height: 0.44rem;
          padding: 0 0.12rem;
          border-radius: 0.5rem;
          box-shadow: 0px 5px 12px 0px rgba(0, 0, 0, 0.2);
          background-image: linear-gradient( 90deg, #fe9e00, #fe9700);
          font-size: 0.24rem;
        }
        .icon{
          width: 0;
          height: 0;
          margin: 0.12rem 0.2rem 0 0;
          border-width: 0.08rem 0 0.08rem 0.1rem;
          border-style: solid;
          border-color: transparent transparent transparent #dcca8a;
        }
      }
      .takepiont{
        line-height: 0.42rem;
        color: #dcca8a;
        display: flex;
        span{
          width:0;
          height:0;
          margin: 0.12rem 0 0 0.1rem;
          border-width:0.08rem 0 0.08rem 0.1rem;
          border-style:solid;
          border-color:transparent transparent transparent #dcca8a;
        }
      }
    }
  }
}


/* 弹出框新手礼 */
.new-gift-bg{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  .new-gift{
    position: fixed;
    width: 80%;
    left: 50%;
    top: 50%;
    margin-left: -45%;
    margin-top: -45%; 
    background-size: 100%;
    z-index: 100000;
    text-align: center;
    overflow: hidden;
    .show-integral{
      position: absolute;
      width: 70%;
      margin-left: 20%;
      top: 20%;
      color: #d8c37f;
      font-size: 1.4rem;
      font-weight: bold;
    }
    .get-integral{
      position: absolute;
      width: 70%;
      margin-left: 20%;
      color: #f0d8b4;
      font-size: 0.7rem;
      font-weight: bold;
      bottom: 26%;
    }
    .button{
      position: absolute;
      bottom: 10%;
      width: 70%;
      height: 0.9rem;
      margin-left: 20%;
    }
  }
}
// 大华闪屏欢迎页
.dh-guide{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
  img{
    width: 4.6rem;
    height: 3.6rem;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -2.3rem;
    margin-top: -1.8rem;
  }
}
/* 生日礼 */
.gift-pop{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  img{
    width: 5.9rem;
    height: 8.81rem;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -2.95rem;
    margin-top: -5rem;
  }
  .submit{
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
    background-image: linear-gradient( 180deg, rgb(239,103,96) 0%, rgb(242,123,116) 100%);
  }
  .close{
    width: 0.46rem;
    height: 0.46rem;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: 1.95rem;
    margin-top: -5rem;
    z-index: 1;
  }
}
.gift-logo{
  position: fixed;
  bottom: 15%;
  right: 2%;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255,255,255,0.6);
  border-radius: 100%;
  z-index: 999;
  img{
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
}

</style>
<style>
  .home-banner{
    position: relative;
    height: 2.84rem;
    margin: -1.85rem 0.2rem 0.5rem 0.2rem;
    background: url(~@/assets/images/home/home_v3_banner_shadow.png) no-repeat 0 0;
    background-size: 99% 100%;
    padding-bottom: 0.25rem;
    border-radius: 0.08rem;
  }
  .home-banner .mint-swipe {
    height: 100%;
    overflow: initial;
    border-radius: 0.08rem;
  }
  .home-banner .mint-swipe-items-wrap{
    border-radius: 0.08rem;
  }
  .home-banner img {
    width: 100%;
    height: 100%;
  }
  .home-banner .mint-swipe-indicators {
    bottom: -0.35rem;
    font-size: 0;
  }
  .home-banner .mint-swipe-indicator{
    background: #d7d7d7;
    opacity: 1;
  }
  .home-banner .is-active{
    background: #ee3f44 !important;
  }
</style>
