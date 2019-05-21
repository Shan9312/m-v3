<template>
  <div v-if="resultShow">
    <div v-if="payCodestate=='1000'">
      <div class="title">
        <span>支付成功</span>
      </div>
      <div class="price">
        <span>￥</span>{{totalAmount}}
      </div>
      <ul class="label">
        <li @click="link()">查看详情</li>
        <li @click="gobankIndex" v-if="productType != 6 || activityName">返回首页</li>
      </ul>
    </div>
    <div v-if="payCodestate=='1001'">
      <div class="title error">
      <span>支付失败</span>
      </div>
      <div class="price">
      <span>￥</span>{{totalAmount}}
      </div>
      <ul class="label">
      <li class="error" @click="link('/reachtest/doooly/member/order/toConfirmPayment.jhtml?orderNum='+orderNum)">重新支付</li>
      </ul>
    </div>
    <!-- pop -->
    <div class="pop-wrap" :class="{'fix-iphonex-bottom': isIphoneX}" v-if="activityName">
      <div class="pop-content">
        <h2 class="title-bold">关注兜礼公众号</h2>
        <h2 class="title-bold-red">代金券、全年员工折扣价马上拥有</h2>
        <p class="img-wrap">
          <img v-if="activityName === 'AirportActivity' || activityName === 'airportactivity'" class="qrcode" src="../../assets/images/pay_result/qrcode.png" alt="">
          <img v-else class="qrcode" src="../../assets/images/pay_result/qrcode_christmas.png" alt="">
          <!-- <img class="fr" src="@/assets/images/airport/fingerprint.png" alt=""> -->
        </p>
        <p class="qrcode-word">长按保存图片，在微信识别</p>
        <p class="qrcode-word">或微信搜索关注公众号“兜礼”</p>
        <!-- <p>关注兜礼公众号</p> -->
        <p class="tip-grey">注：已关注兜礼的用户，请扫描二维码获得礼品</p>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
  name: "cardbuy-pay-result",
  data(){
      return{
        umengNameObj: {
          'AirportActivity': '机场活动',
          'airportactivity': '机场活动',
          'ChristmasActivity': '圣诞平安夜',
          'christmasactivity': '圣诞平安夜',
        },
        isIphoneX: false,
        activityName: '',
        payCodestate:this.$route.params.code,
        orderId:this.$route.params.orderId,
        orderNum:this.$route.params.orderNum,
        productType:this.$route.params.productType,
        resultShow:false,
        totalAmount:this.$route.params.totalAmount,
      }
  },
  methods:{
    gobankIndex(){
      dooolyAPP.jumpIndexPage.call(this);
    },
    link(){
      dooolyAPP.gotoJumpVue.call(this,'/myOrderDetail/'+this.orderId);
    },
    judgeIsIphoneX(){
      var isIphoneX = window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone');
      this.isIphoneX = isIphoneX;
      function testUA (str) { 
        return navigator.userAgent.indexOf(str) > -1 
      }
    },
  },
  mounted(){
    this.judgeIsIphoneX();
    let localStorageStr = localStorage.activity || '{}';
    let activityObj = JSON.parse(localStorageStr);
    this.activityName = activityObj[this.orderNum];
    if(this.activityName) {
      this.$baiduStats('支付结果页-' + this.umengNameObj[this.activityName] + '-支付成功');
    }
    http({
      method: 'post',
      url: api.getOrderReportIdByOrderNum,
      data:{
        orderNum:this.orderNum
      }
    }).then((res) => {
      if(res.data.code == 1000){
        this.orderId=res.data.data.orderReportId;
      }
      this.resultShow=true;
    });
    window.isConfirmShow=function() {//确认离开弹框
      dooolyAPP.goBackPageIndex("2");
    };
    document.title="支付结果";
    initTitle('支付结果','2','isConfirmShow()');
  },
  beforeRouteLeave(to, from, next) {
    if(browserName != "WebKit" && browserName != "Chrome WebView"){
      if(to.name == "cardBuyPay"){
        window.history.go(-1);
        return;
      }
    }
    next();
  },
}
</script>

<style lang="scss" scoped>
  .title{
    margin-top: 1.6rem;
    margin-bottom: 0.6rem;
    font-size: 0;
    color: #333;
    text-align: center;
    background: url(../../assets/images/cardbuy/pay/pay_succeed.png) no-repeat 2.68rem center;
    background-size: auto 100%;
    height: 0.48rem;
    line-height: 0.48rem;
    text-indent: 0.68rem;
  }
  .title.error{
    background: url(../../assets/images/cardbuy/pay/pay_error.png) no-repeat 2.68rem center;
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
  .label li:only-child{
    margin-right: 0;
  }
  .label li:last-child{
    margin-right: 0;
  }
  .label li.error{
    border-color: #ee3f44;
    color: #ee3f44;
  }
  /* pop */
  .pop-wrap{
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: -1;
    &.fix-iphonex-bottom {
      bottom: 34px;
    }
    .pop-content{
      padding: 0.6rem 0.68rem 0.27rem;
      text-align: center;
      font-size: 0.28rem;
      color: #333;
      h2{
        font-size: 0.28rem;
      }
    }
    .title-bold{
      color: #333;
      font-weight: bold;
    }
    .title-bold-red{
      color: #EE3F44;
      font-weight: bold;
    }
    .img-wrap{
      overflow: hidden;
      img{
        width: 2.88rem;
      }
      .qrcode{
        padding-top: 0.12rem;
      }
    }
    .tip-grey{
      font-size: 0.24rem;
      padding-top: 0.15rem;
      color: #999999;
    }
  }
</style>
