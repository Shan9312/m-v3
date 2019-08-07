<template>
  <div>
    <div class="activity_div">
      <div class="img_div">
        <img src="../../../assets/images/shoujia/img1.png"/>
      </div>
      <div class="img_div">
        <div class="firstCommodity" @click="onlink(1)"></div>
        <img src="../../../assets/images/shoujia/img2.png"/>
      </div>
      <div class="img_div">
        <img src="../../../assets/images/shoujia/img3.png"/>
      </div>
      <div class="img_div">
        <div class="lastCommodity" @click="onlink(2)"></div>
        <img src="../../../assets/images/shoujia/img4.png"/>
      </div>
      <div class="img_div footer_div" @click="onlink(3)" v-if="footer_show == 1">
        <img src="../../../assets/images/shoujia/img5.png"/>
      </div>
      <div class="img_div footer_div" @click="limitedAuthority()" v-if="footer_show == 2" >
        <img src="../../../assets/images/shoujia/img5.png"/>
      </div>
      <div class="footer_div_bg" v-if="footer_show != 3"></div>
    </div>
    <div class="foooter_bg"></div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfigNew} from '@/assets/js/wechatShare2.js';

  export default {
    name: "shoujia_index",
    data() {
      return {
      isShare:false,
      delete_card_show:false,
      disabled:true,
      footer_show:3,
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#56beb7";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      this.footer_show = 3;
      dooolyAPP.initTitle('夏日送清凉','');
      onWechatConfigNew('hideMenuItems');
    },
    mounted(){

    },
    methods: {
      onlink(type){
        if(type == 1){
          dooolyAPP.gotoJumpVue(this.$router,'/cardBuyDetail/87');
        }else if(type == 2){
          dooolyAPP.gotoJumpVue(this.$router,'/cardBuyDetail/88');
        }else{
          dooolyAPP.gotoJumpVue(this.$router,'/shoujia_invite');
        }
      },
      limitedAuthority(){
        this.$toast("购买后才能发起分享");
      }
    }
  }
</script>

<style scoped>
body{background:#5dc2be !important;}
img{width:100%;pointer-events: none;}
.activity_div{background:#56beb7; padding-bottom: 0.3rem;}
.img_div{font-size: 0;position: relative;}
.firstCommodity{
  position: absolute;
  width: 1.6rem;
  height: 100%;
  left: 3.6rem;
}
.lastCommodity{
  position: absolute;
  width: 4.1rem;
  height: 60%;
  left: 1.7rem;
}
.footer_div{position: fixed;bottom: 0;}
.footer_div_bg{
  height: 1.1rem;
  width: 100%;
}
.share_bg{position:fixed;left:0;top:0;width:100%;height:100%;z-index: 120;background: rgba(0,0,0,0.7); }
.share_person{width: 3.25rem;position: absolute;z-index: 40;right:0;top: 0.2rem;}
.share_finger{width: 0.6rem;position: absolute;z-index: 30;right: 0.3rem;top: 0.6rem;}
.share_finger {
   animation: myfirst 0.2s infinite;
}
@keyframes myfirst {
   0% {
       transform: translate(0px, 0px);
   }
   50% {
       transform: translate(0px, -16px);
   }
   100% {
       transform: translate(0px, 0px);
   }
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
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #56beb7;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
  .activity_botton{margin-bottom: 34px;z-index: 9999999999;}
}

</style>
