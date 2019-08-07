<template>
  <div>
    <div v-if="payCodestate=='1000'">
      <div class="title">
        <span>支付成功</span>
      </div>
      <div class="price">
        <span>￥</span>{{this.$route.params.totalAmount}}
      </div>
      <ul class="label">
        <li @click="link(orderId)">查看详情</li>
        <!-- <li @click="gobankIndex">返回首页</li> -->
      </ul>
    </div>
    <div v-if="payCodestate=='1001'">
      <div class="title error">
        <span>支付失败</span> 
      </div>
      <div class="price">
        <span>￥</span>{{this.$route.params.totalAmount}}
      </div>
      <ul class="label">
        <li class="error" @click="link('/reachtest/doooly/member/order/toConfirmPayment.jhtml?orderNum='+orderNum)">重新支付</li>
      </ul>
    </div>
    <div class="share">
      <div class="title"><span>赶紧邀请你的好友参与吧</span></div>
      <div class="contont" @click="shareBgState = true">
        <div>
          <img src="../../../assets/images/activity/wechat.png"><br>
          微信好友
        </div>
        <div>
          <img src="../../../assets/images/activity/wechatfr.png"><br>
          朋友圈
        </div>
      </div>
    </div>
    <div v-show="shareBgState" @click="shareBgState = false" class="share_bg">
      <img src="../../../assets/images/familyinvite/share.png">
    </div>
  </div>
</template>

<script>

  import {shareWithFriendsWX,shareWithFriendsAPP,Wechatshare} from '@/assets/js/wechatShare2.js';
  import api from '@/assets/js/api.js';

    export default {
        name: "activity_cardBuyPayResult",
      data(){
          return{
            payCodestate:this.$route.params.code,
            orderId:this.$route.params.orderId,
            orderNum:this.$route.params.orderNum,
            shareBgState: false
          }
      },
      methods:{
        gobankIndex(){
          dooolyAPP.jumpIndexPage();
        },
        link(orderId){
          dooolyAPP.gotoJumpVue(this.$router,'/myOrderDetail/'+orderId);
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
              }else{
                //获取配置错误10001
              }

          });
        }
      },
      mounted(){
          dooolyAPP.initTitle('支付结果');
          this.Wechatshare('huafeiRefill',"doooly", [this.$route.params.openId,this.$route.params.activityParam]);
      }
    }
</script>

<style scoped>
  .title{
    margin-top: 1.6rem;
    margin-bottom: 0.6rem;
    font-size: 0;
    color: #333;
    text-align: center;
    background: url(../../../assets/images/cardbuy/pay/pay_succeed.png) no-repeat 2.68rem center;
    background-size: auto 100%;
    height: 0.48rem;
    line-height: 0.48rem;
    text-indent: 0.68rem;
  }
  .title.error{
    background: url(../../../assets/images/cardbuy/pay/pay_error.png) no-repeat 2.68rem center;
    background-size: auto 100%;
  }
  .title img{
    width: 0.48rem;
    margin-right: 0.2rem;
    vertical-align: top;
  }
  .title span{
    font-size: 0.36rem;
  }
  /*价格*/
  .price{
    text-align: center;
    font-size: 0.8rem;
    color: #333;
    line-height: 100%;
  }
  .price span{
    font-size: 0.6rem;
  }
  /*点击按钮*/
  .label{
    margin-top: 1.2rem;
    font-size: 0;
    text-align: center;
  }
  .label li{
    display: inline-block;
    line-height: 0.72rem;
    width: 2.4rem;
    font-size: 0.28rem;
    color: #333;
    border-radius: 0.1rem;
    border: 1px solid #ddd;
    margin-right: 0.4rem;
  }
  .label li:last-child{
    margin-right: 0;
  }
  .label li.error{
    border-color: #ee3f44;
    color: #ee3f44;
  }
  .share{
    margin-top: 2.8rem;
  }
  .share .title{
    width: 3.7rem;
    text-align: center;
    margin: 0 auto;
    position: relative;
    height: auto;
    line-height: auto;
    text-indent: 0;
    height: 0.28rem;
  }
  .share .title span{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    vertical-align: middle;
    line-height: 100%;
    background: #fff;
    z-index: 1;
    font-size: 0.28rem;
  }
  .share .title:after{
    content:'';
    position: absolute;
    left: 0;
    top: 50%;
    width: 5.9rem;
    margin-left: -1.2rem;
    height: 1px;
    background: #ececec;
    z-index: 0;
  }
  .share .contont{
    display: flex;
    justify-content: center;
    margin-top: 0.9rem;
  }
  .share .contont div{
    font-size: 0.28rem;
    text-align: center;
  }
  .share .contont div:first-child{
    margin-right: 1.8rem;
  }
  .share .contont img{
    height: 0.6rem;
    margin-bottom: 0.2rem;
    width:auto;
  }
  .share_bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
    text-align: right;
    z-index: 99;
  }

  .share_bg img {
    width: 6.07rem;
    margin-right: 0.5rem;
  }
</style>
