<template>
  <div>
    <div class="mainContent">
    <header>此验证码供当面身份验证时使用</header>
    <section>
        <div class="vip"><img src="../../../assets/images/lighten_business/doooly_vip.png" alt="" /></div>
        <article class="top">
          <div class="yzm">
            <p>{{dimensionCode}}</p>
            <img :src="barURL" />
          </div>
        </article>
        <article class="bot">
          <div class="yzm">
            <img id="dCode" :src="dimensionURL" />
          </div>
        </article>
    </section>
  </div>
    <div class="foooter_bg"></div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfigNew} from '@/assets/js/wechatShare2.js';

  export default {
    name: "activity_ground",
    data() {
      return {
      barURL:"",
      dimensionURL:"",
      dimensionCode:"",
      counter:60,
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#ec3837";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      dooolyAPP.initTitle('付款码','');
      onWechatConfigNew('hideMenuItems');
      this.postScan_discount_default();
      setInterval(() => {this.active()}, 1000);
    },
    methods: {
      postScan_discount_default(){
        http({
              method: 'post',
              url: api.scan_discount_default,
              data:{
              userId:localStorage.userId
              },
              notNeedTransfer:true
          }).then((data) => {
            if (data.data.code == '1000') {
              this.dimensionCode=data.data.data.dimensionCode;
              this.dimensionURL=data.data.data.dimensionURL;
              this.barURL=data.data.data.barURL;
            } else {
              this.$toast(data.data.msg);
            }  

          });   
      },
      active(){
        this.counter -= 1;
        if(this.counter < 1) {
          this.refresh();
        }
      }, 
      refresh() {
        this.refreshDimensionCode(this.dimensionCode,this.dimensionURL,this.barURL);
        this.counter = 60;
      },
      refreshDimensionCode(barImage,dimImage,obj) {
        http({
            method: 'get',
            url: api.freshDimensionUrl,
            notNeedTransfer:true
        }).then((data) => {
          if (data.data.code == '1000') {
            this.dimensionCode=data.data.dimensionCode;
            this.dimensionURL=data.data.dimensionURL;
            this.barURL=data.data.barURL;
          } else {
            this.$toast(data.data.msg);
          }  

        }); 

      },
    },
  }
</script>

<style scoped>
/*main开始*/
.mainContent{width:100%; min-height:10.88rem; margin-bottom: 0.5rem; }
header{font-size: 0.28rem;color: #fff;text-align: center;margin-top: 0.4rem;}
section{width: 7rem; margin: 0 auto;background: #fff;border-radius: 0.1rem;margin-top: 0.88rem;position: relative;}
section article{position: relative;}
section .vip{position:absolute;left: 50%;top:0;margin-left: -0.65rem;margin-top: -0.65rem;}
section .vip img{width: 1.36rem;}
section .top{padding-bottom: 0.6rem;margin:0 auto;padding-top: 1.2rem;}
section .bot{text-align: center;padding-bottom: 0.6rem;}
section .top div{width: 77%;margin: 0 auto;background: #fff;}
section .top div p{font-size: 0.36rem;color: #000;text-align: center;white-space: nowrap; margin-bottom: 0.12rem;}
section .top img{width: 100%;}
section .bot div{width: 4rem;margin: 0 auto;background: #fff;}
section .bot div img{width:100%;}
.refresh_div{text-align: center;margin-top: 0.44rem; margin-bottom: 0.3rem;width: 100%; -webkit-tap-highlight-color:rgba(0,0,0,0);}
.refresh_div img{width: 3.4rem; cursor: pointer;}
section .top .yzm_big{position: fixed;left: 0;top: 0;width: auto;height: 7.5rem; z-index: 99999;transform:rotate(90deg);text-align: center;}
section .top .yzm_big p{font-size: 0.7rem;}
section .top .yzm_big img{height: 3.2rem;width: auto;margin-top: 2rem;}
section .bot .yzm_big{position: fixed;left:0;top:0;width: 100%; height: 100%;z-index: 99999;margin: 0;}
section .bot .yzm_big img{margin-top: 2.5rem;width: 6rem;}
.footer{position: fixed;left: 0;bottom: 0; background-color:#f16569; font-size: 0.34rem;color: #fff;margin: 0 auto;width: 7.5rem;height: 1.2rem; margin-top: 0.3rem;}
.footer2{background:rgba(255,255,255,0.15); font-size: 0.34rem;color: #fff;margin: 0 auto;width: 7.5rem;height: 1.3rem; text-align: center; padding-top: 0.4rem;font-weight: bold;margin-top: 0.3rem;}
.footer2 a{display: inline-block;text-align: center;color: #fff; -webkit-tap-highlight-color:rgba(0,0,0,0);}
.footer .points{float:left;width:50%; padding:0.46rem 0;text-align: center;-webkit-tap-highlight-color:rgba(0,0,0,0);}
.footer .points p{height:0.4rem; line-height:0.4rem}
.footer .points p span{margin-left:0.08rem;height:0.4rem; line-height:0.4rem;}
.footer .points p img{width: 0.4rem;}
.footer .points p .viewoff{vertical-align: middle;}
.footer p .view{display:none}
.footer .checkMap{float:right;border-left:solid 1px #f59496; width:49%;padding:0.46rem 0;text-align: center;-webkit-tap-highlight-color:rgba(0,0,0,0);}
.footer .checkMap a{width:100%; text-align: center;color: #fff; -webkit-tap-highlight-color:rgba(0,0,0,0);}

/* 扫码优惠 */
.comingSoon_div{text-align: center;margin-top:40%;}
.comingSoon_div img{width:2.7rem;height:2.16rem;}
.comingSoon_p{color:#666;font-size:0.3rem;text-align: center;margin-top:0.2rem;}
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
