<template>
  <div>
    <!-- 确认弹出框 -->
    <div class="isSuccess_bg approve" v-show="nonentityVisible1" @touchmove.prevent>
        <div class="isSuccess">
            <div class="title">提示</div>
            <p class="min">领取成功</p>
            <div class="input_view">
                <div @click="confirmBtn">取消</div>
                <div @click="confirmRechargeBtn" class="right">查看福利</div>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <!--  弹出框  end-->
    <div class="activity_div">
      <div class="img_div">
        <div class="btn_div1" data-baidu-stats="活动-兜礼-票牛福利大FUN送-免费领取" @click="btn_recharge"></div>
        <img src="../../../assets/images/active/piaoniu.jpg"/>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import bus from '@/components/common/bus';
  import {shareWithFriendsWX,shareWithFriendsAPP,getAddress} from '@/assets/js/wechatShare2.js';
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';

  export default {
    name: "world_cup",
    data() {
      return {
      isShare:false,
      nonentityVisible1:false,
      activity_id:this.$route.params.activityid,
      coupon_id:this.$route.params.couponid,
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#9a0000";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    beforeRouteEnter(to, from, next) {
      if (!from.name) {
        localStorage.activityfunction= "";
        localStorage.activityisShare= "";
      };
      next();
    },
    mounted(){
    },
    created(){
      if(!localStorage.token){
        var a = window.location.href;
        var b = a.indexOf("#");
        var url = a.substring(0,b+2);
        window.location.href= url;
      }
      if(localStorage.activityfunction){
        localStorage.activityfunction= "";
      }
      initTitle('兜礼&票牛福利大FUN送','');
    },
    methods: {
      confirmBtn(){//取消弹框
       this.nonentityVisible1=false;
      },
      confirmRechargeBtn(){
        this.$router.push({
          path: '/coupon/' + 0
        });
      },         
      btn_recharge(){
        localStorage.activityfunction = 1;
        http({
          method: 'POST',
          url: api.receiveCoupon,
          data:{
            adId:localStorage.userId,
            couponId:this.coupon_id,
            activityId:this.activity_id
          }
        }).then((res) => {
          if (res.data.code == '1000') {
          localStorage.activityfunction = "";
          this.nonentityVisible1=true;
          }else if(res.data.code == '1001'){
           this.$toast("券已领完");
          }else if (res.data.code == '1002') {
           this.$toast("一个用户只可领取一次");
          }else if(res.data.msg){
            this.$toast(res.data.msg);
          }else{
            this.$toast("您的网络不稳定，请重试");
          }
        });
      },
      Wechatshare(prefix,channel,params){
        var client = 'doooly';
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          client = 'wechat';//是微信
        } else {
          client = 'doooly';//不是微信
        }
        var requestUrl = api.commonShareJSONPConfig+"?client="+client+"&prefix="+prefix+"&params="+params[0]+"&params="+params[1]+"&url="+encodeURIComponent(window.location.href)+"&channel="+channel;
        this.$jsonp(requestUrl,
          {
            callbackName: 'jsonpCallback',
          }).then((res) => {
            if(res.code == 4001){
              shareWithFriendsWX(res.data);//40001微信配置
            }else if(res.code == 4002){
              //shareWithFriendsAPP(res);//40002兜里配置
            }
        });
      }

    }
  }
</script>

<style scoped>
body{background:#ec3837 !important;}
img{width:100%;pointer-events: none;}
.activity_div{background: url(../../../assets/images/World_Cup/World_Cup.png) #9a0000 no-repeat;}
.img_div{font-size: 0;position: relative;}

.btn_div1{
  position: absolute;
  width: 4.2rem;
  height: 1.2rem;
  left: 50%;
  top: 10.2rem;
  margin-left: -2.1rem;
}
.btn_div2{position: absolute;width: 4.3rem;height: 100%;left: 50%;margin-left: -2.2rem;}

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
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #9a0000;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
}

</style>
