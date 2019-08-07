<template>
  <div>
    <div class="activity_div">
    <div class="img_div">
      <img class="herder_img_bg" src="../../../assets/images/activity_img/re_img1.jpg"/>
      <div class="herder_div">
        <img class=""  :src="headUrl"/>
        <div>{{user_name}}</div>
      </div>
      <div>
         <img class="img_bg" src="../../../assets/images/activity_img/re_img2.jpg"/>
         <img class="img_a"  :src="url_img"/>
      </div>
    </div>
     
    </div>
    <div class="foooter_bg"></div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP} from '@/assets/js/wechatShare2.js';

  export default {
    name: "activity_ground",
    data() {
      return {
      openId:this.$route.query.openId,
      sourceOpenId:this.$route.query.sourceOpenId,
      url_img:"",
      headUrl:"",
      user_name:"",
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#ec3837";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      dooolyAPP.initTitle('兜礼话费优惠活动','');
      http({
          method: 'get',
          url: api.getQRCode+"?openId="+this.openId+"&sourceOpenId="+this.sourceOpenId
        }).then((res) => {
          if(res.data.code == '1000'){
           this.user_name=res.data.name;
           this.headUrl=res.data.headUrl;
           this.url_img=res.data.url;
          }else{
            this.$toast("接收失败");
          }
          
        })
    },
    methods: {

    },
  }
</script>

<style scoped>
img{width:100%;}
.activity_div{background:#ec3837;}
.img_div{font-size: 0;}
.img_bg{position: absolute;z-index: 10;}
.img_a{position: absolute;width: 2.2rem;z-index: 100;left: 13%;}
.herder_div{position: absolute;z-index: 100;top:0}
.herder_div img{display: inline-block;float: left;width: 0.7rem;height: 0.7rem;border-radius: 50%;margin-top: 0.14rem;margin-left: 0.14rem;}  
.herder_div div{font-size: 0.3rem;display: inline-block;float: left;color: #fff;height: 1rem;line-height: 1rem;margin-left: 0.2rem;}
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #ec3837;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
}
</style>
