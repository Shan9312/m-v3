<template>
  <div>
    <!-- 查看弹出框 -->
    <div class="isSuccess_bg" v-show="isShare" @click="click_share"  @touchmove.prevent>
        <div class="isSuccess">
            <p>恭喜您已成功领取百丽集团兑换码！</p>
            <div class="input_view" @click="url_link()"><div>立即查看</div></div>
        </div>
    </div>
    <!--  弹出框  end-->
    <div class="app_div one_bg">
     <div class="diandian_div"><img src="../../../assets/images/baiLi2/baili-1.jpg" /></div>
     <div class="diandian_div click_one_bg" ><div class="onclik_div"  @click="my_welfare()"></div></div>
     <div class="diandian_div"><img src="../../../assets/images/baiLi2/baili-3.jpg" /></div>
    </div>
   <!-- <div class="foooter_bg"></div> -->
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP} from '@/assets/js/wechatShare2.js';

  export default {
    name: "baili2_index",
    data() {
      return {
      isShare:false,
      disabled:true,
      
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#97ddb9";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    beforeRouteEnter(to, from, next) {
      if (!from.name) {
        localStorage.activityfunction= "";
      };
      next();
    },
    created(){
      if(localStorage.activityfunction){
        localStorage.activityfunction= "";
        this.my_welfare();
      }
      initTitle('百丽踏青季-兜礼会员三大福利','');
      if(isWeiXin()){
        this.Wechatshare('baili2');  
      } 
    },
    methods: {
      my_welfare(){
      localStorage.activityfunction = 1;
      this.disabled=false;
      this.$baiduStats('活动-百丽踏青季&兜礼会员三大福利-立即领取');
       http({
          method: 'post',
          url: api.receiveBelleCoupon,
          data:{
            token:localStorage.token,
            "idFlag":"baili2"
          },
        }).then((res) => {
            if(res.data.code == '1000') {
                localStorage.activityfunction = "";
                this.isShare=true;
                this.actConnId=res.data.data.actConnId;
            }else if(res.data.code=='1001'){
              this.$toast("活动已结束");
            }else if(res.data.code=='1002'){
              this.$toast("已领过该券");
            }else if(res.data.code=='1003'){
              this.$toast("该券已领完");
            }
          }
        )
      },
      click_share(){
       this.isShare=false;
      },
      url_link(){
        this.$router.push({
          path: '/coupon/' + 0
        });
      },
      Wechatshare(prefix){
        var client = 'doooly';
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          client = 'wechat';//是微信
        } else {
          client = 'doooly';//不是微信
        }
        var requestUrl = api.commonShareJSONPConfig+"?client="+client+"&prefix="+prefix+"&url="+encodeURIComponent(window.location.href);
        this.$jsonp(requestUrl,
          {
            callbackName: 'jsonpCallback',
          }).then((res) => {
            if(res.code == 4001){
              shareWithFriendsWX(res.data);//40001微信配置
            }else if(res.code == 4002){
              shareWithFriendsAPP(res);//40002兜里配置
            }else{
            }

        });
      }
    },
  
    }
</script>

<style scoped>
img{display:block;width:100%;pointer-events: none;}
/* 唯品会领取优惠券 */
.usage_mode li{font-weight: bold;color:#2c2c2c;font-family: sans-serif;}
.usage_mode li:first-child{font-size: 0.18rem;margin-bottom: 0.1rem;}
.usage_mode li span{color:#ff5e32;}
.matters{margin-top:0.2rem;}
.matters li{color:#fff;font-family: sans-serif;}
.matters li:first-child{margin-bottom: 0.1rem;}

.click_one_bg{background: url(../../../assets/images/baiLi2/baili-2.jpg) no-repeat; background-size: 100%;height:0.83rem;}
.onclik_div{width:60%; height: 0.83rem;cursor: pointer;padding: 0 20%;-webkit-tap-highlight-color:rgba(0,0,0,0);}

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
    width:100%;
    color:#ee3f44;
}
/* 温馨提示 end */
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {

  .inponex_background_bg{display: none;}
  .inponex_background{display: none;}
}

</style>
