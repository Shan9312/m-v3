<template>
  <div>
    <!--  弹出框  start-->
    <div class="share_bg" v-show="isShare" @click="click_share"  @touchmove.prevent>
       <img class="share_person" src="../../../assets/images/activity_img/share.png"/>
    </div> 
    <!-- 确认弹出框 -->
    <div class="isSuccess_bg delete_card" v-show="delete_card_show" @touchmove.prevent>
        <div class="isSuccess">
            <p>您在本次活动已有未支付订单，快去看看吧~</p>
            <div class="input_view">
                <div @click="delete_card_show = !delete_card_show">取消</div>
                <div @click="delete_card_affirm(orderNum,userId)" class="right" :disabled="disabled">确定</div>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <!--  弹出框  end-->
    <div class="activity_div">
    <div class="img_div">
      <img src="../../../assets/images/activity_img/a_index.jpg"/>
    </div>
    <div class="activity_botton">
      <div data-baidu-stats="兜礼话费优惠活动-我要充值" @click="btn_recharge" :disabled="disabled"></div>
      <div data-baidu-stats="兜礼话费优惠活动-召换亲友" @click="btn_share" :disabled="disabled"></div>
    </div>
    </div>
    <div class="foooter_bg"></div> 
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfig,onWechatConfigNew} from '@/assets/js/wechatShare2.js';

  export default {
    name: "activity_indx",
    data() {
      return {
      isShare:false,
      delete_card_show:false,
      disabled:true,
      sourceOpenId:this.$route.query.sourceOpenId,
      orderNum:"",
      userId:"",
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#ec3837";
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
    created(){
      if(localStorage.activityfunction){
        localStorage.activityfunction= "";
        this.btn_recharge();
      }
      if(localStorage.activityisShare){
       this.isShare=true;
      }
      initTitle('兜礼话费优惠活动','');
      onWechatConfigNew('hideMenuItems');
    },
    mounted:function(){
    },
    methods: {
      btn_share(){//分享弹框
        wx.showMenuItems({
          menuList: ['menuItem:share:appMessage','menuItem:share:timeline']
        });
        this.isShare=true;
        localStorage.activityisShare=1;
        this.onload_share();
      },
      onload_share(){
        if(this.sourceOpenId!=undefined){
            http({
              method: 'get',
              url: api.getOpenid+"?sourceOpenId="+this.sourceOpenId
            }).then((res) => {
              localStorage.activityisShare="";
              if(res.data.code == '1000'){
              this.Wechatshare('huafeiRefill',res.data.channel, [res.data.openId,this.sourceOpenId]);
              var t = setTimeout(() => {
               this.isShare = false;
                clearTimeout(t);
              }, 2000);
              }
            })
          }
        },
      click_share(){//关闭分享弹框
        this.isShare=false;
      },
      getOrder(){ //下单接口
          http({
              method: 'get',
              url: api.getOrder+"?sourceOpenId="+this.sourceOpenId
            }).then((res) => {
                if(res.data.code == '1000'){
                  dooolyAPP.redirectPay(res.data.data.orderNum)
                }else{
                  this.$toast("下单失败");
                }
            })
      },
      btn_recharge(){
        localStorage.activityfunction = 1;
        this.disabled=false;
        http({
          method: 'get',
          url: api.getIsbutterfly
        }).then((res) => {
          if (res.data.code == '1000') {
          localStorage.activityfunction = "";
            if(browserName=="WeChat"){
              this.getOrder();
            }else {
              this.$toast("请在微信中打开进行下单");
            }
          }
          else if (res.data.code == '11003') { //生成了订单，但是未支付，调用取消订单接口
            localStorage.activityfunction = "";
            this.disabled=true;
            this.delete_card_show=true;
            this.orderNum=res.data.data.orderNumber;
            this.userId=res.data.data.userId;
          } else if (res.data.code == '11005') {//生成了订单，已经支付
            localStorage.activityfunction = "";
            this.$toast("您已在本次活动中成功下单，快去召唤朋友");
          }else if(res.data.code == '1003'){
            localStorage.activityfunction = "";
            this.$toast("参数错误");
          }
          else {
            this.disabled=true;
            localStorage.activityfunction= "";
          }
        });

      },
      delete_card_affirm(orderNum,userId){//确定取消之前订单
         localStorage.activityfunction = "";
         this.disabled=false;
         http({
            method: 'post',
            url: api.cancleOrder,
            data:{
              orderNum:this.orderNum,
              token:localStorage.token,
              userId:userId
            }
          }).then(
            (res) => {
            this.delete_card_show=false;
              if (res.data.code == '1000') {
               localStorage.activityfunction = "";
                if(browserName=="WeChat"){
                  this.getOrder();
                }else{
                  this.$toast("请在微信中打开进行下单");
                }
              }else if(res.data.code == '1001'){
                this.$toast("订单不能取消");
              }
              else {
                this.$toast("数据异常");
              }
            }
          );

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
              shareWithFriendsAPP(res);//40002兜里配置
            }
        });
      }

    }
  }
</script>

<style scoped>
body{background:#ec3837 !important;}
img{width:100%;pointer-events: none;}
.activity_div{background:#ec3837}
.img_div{font-size: 0; margin-bottom: 1.69rem;}
.activity_time{height: 0.48rem; background: url(../../../assets/images/activity_img/index_2.jpg) no-repeat; background-size: 100%;}
.activity_botton{height: 1.69rem; background: url(../../../assets/images/activity_img/index_4.png) no-repeat; background-size: 100%;position: fixed;bottom: 0;width: 100%;}
.activity_botton div{width:50%; float:left;display: inline-block;height: 1.2rem;}

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
    background: #ec3837;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
  .activity_botton{margin-bottom: 34px;z-index: 9999999999;}
}

</style>
