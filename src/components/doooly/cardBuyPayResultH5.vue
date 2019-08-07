<template>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
  name: "cardBuyPayResultH5",
  data(){
      return{
        orderNum:this.$route.params.orderNum,
        productType:this.$route.params.productType,
        conut:0,
      }
  },
  methods:{
    getPayResult(){
      this.conut = this.conut +1;
      if(this.conut > 5){
        this.affirmReturn();
        return;
      }
      http({
        method: 'post',
        url: api.getPayResult,
        data:{
          orderNum:this.orderNum
        }
      }).then((res) => {
        if(res.data.code==1000 || res.data.code==1001){
          if(this.productType == 7){
            dooolyAPP.gotoJumpVue(this.$router,'/activity_cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+res.data.data.activityParam+'/'+res.data.data.openId);
          }else{
            let pathStr = '/cardBuyPayResult/'+res.data.data.code+'/'+res.data.data.totalAmount+'/'+res.data.data.orderId+'/'+res.data.data.orderNum+'/'+this.productType
            if (this.activityName){
              pathStr += '/' + this.activityName;
            }
            dooolyAPP.gotoJumpVue(this.$router, pathStr);
          }
        }else if(res.data.code==1002){
          let timeOut = setTimeout(() => {this.getPayResult();}, 500);
        }else{
          this.$toast(res.data.msg);
          dooolyAPP.gotoJumpVue(this.$router, '/nav/newHome');
        }
      });
    },
    gobank(){
      let browserName = getBrowser();
      if(browserName == "WebKit"){
        window.history.go(-2);
      }else{
        window.history.go(-3);
      }
    },
    affirm(){
      this.$messageBox({
        title: '支付提醒',
        message: '付款后请根据您的情况点击下面按钮',
        confirmButtonText: '我已完成付款',
        cancelButtonText: '重新支付',
        showCancelButton: true
      }).then(action => {
        if(action == 'confirm'){
          this.getPayResult();
        }else{
          this.gobank();
        }
      });
    },
    affirmReturn(){
      this.$messageBox({
        title: '支付提醒',
        message: '未查询到您的支付结果',
        confirmButtonText: '重新支付',
      }).then(action => {
          this.gobank();
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    if(!from.name){
      next(vm=>{ 
        vm.affirm();
      });
    }else{
      vm.gobank();
      next();
    }
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
