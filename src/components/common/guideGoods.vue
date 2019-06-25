<template>
  <div>
    <div class="goods-wrapper" v-for="(item,index) of pageList" :key="index"
      @click="buyToast(item.id,item.businessLogo,item.discount,item.maxUserRebate,item.dealType,item.linkUrlWechat,item.businessId)">
      <div class="list-left fl">
        <img :src="item.imageWechat" :onerror="defaultImg">
      </div>
      <div class="list-right fr">
        <div class="list-content-top">
          <p class="goods-name">
            <span><i></i><i></i><i></i><i></i>{{item.businessName}}</span>{{item.name}}
          </p>
        </div>
        <div class="list-content-middle">
          <span
            :class="{'list-content-middle-color':item.discount}">&yen;{{!item.discount?item.marketPrice.toFixed(2):item.price.toFixed(2)}}</span>
          <span class="doooly-label" v-if="item.discount">兜礼价</span>
        </div>
        <div class="list-content-buttom">
          <div class="buttom-left">
            <i></i><i></i><i></i><i></i>
            <span class="plan">预计返</span>
            <span class="point">{{item.rebate}}积分</span>
          </div>
          <span class="sales-right">已售{{item.sellCount}}件</span>
        </div>
      </div>
    </div>
    <toast v-if="toastState == 1" :toastData="toastData" :firstShow="1"></toast>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import toast from '@/components/common/toast';
  export default {
    props: ['pageList', 'orderType'],
    data() {
      return {
        toastState: 0,
        toastData: {},
        defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"'
      }
    },
    components: {
      toast
    },
    conputed: {

    },
    methods: {
      orderTypeCh() {
        if (this.orderType == 1) {
          return '最新'
        } else if (this.orderType == 2) {
          return '价格低到高'
        } else if (this.orderType == 3) {
          return '销量'
        } else if (this.orderType == 4) {
          return '价格高到低'
        }
      },
      buyToast(productId, logo, discount, maxUserRebate, dealType, url, id) {

        this.$baiduStats('兜礼导购-' + this.orderTypeCh() + '商品' + productId);
        this.plusSales(productId);
        this.toastState = 1;
        this.timeOut = setTimeout(() => {
          this.toastState = 0;
        }, 950);
        this.toastData.miniLogo = logo;
        if (discount == '' || discount == '0') {
          this.toastData.discount = '';
        } else {
          this.toastData.discount = '购物享' + discount + '折';
        }
        if (maxUserRebate == '' || maxUserRebate == '0') {
          this.toastData.maxUserRebate = '';
        } else {
          this.toastData.maxUserRebate = '最高返' + maxUserRebate + '%';
        }
        this.toastData.dealType = dealType;
        this.toastData.url = url;
        this.toastData.id = id;
      },
      plusSales(productId) {

        http({
          method: 'post',
          url: api.addSellCount,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            "productId": productId,
          }
        })
      },

    }

  }
</script>
<style scoped>
  .top {
    height: 0.78rem;
    background: #F7F7F7;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 0.32rem;
    color: #999999;
    align-items: center;
  }
  .top-checked{
    color: #FD5739;
  }
  .down-sort-price {
    border-bottom: 4px solid #FD5739 !important;
  }
  .up-sort-price {
    border-top: 4px solid #FD5739 !important;
  }
  .triangle-up {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    margin: -10px 0 0 0;
    border-bottom: 4px solid #A2A2A2;
    border-top: 0 none;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    color: #FF3FFF;
    filter: chroma(color=#FF3FFF);
  }
  .triangle-down {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    line-height: 0;
    font-size: 0;
    vertical-align: middle;
    margin: 3px 0 0 -13px;
    border-top: 4px solid #A2A2A2;
    border-bottom: 0 none;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    color: #FF3FFF;
    filter: chroma(color=#FF3FFF);
  }
  .goods-wrapper {
    height: 2.4rem;
    padding: 0.4rem 0.3rem 0 0.3rem;
    background: #fff;
    box-sizing: border-box;
  }
  .goods-wrapper:last-child{
    margin-bottom: 0.4rem;
  }
  .list-left {
    height: 2rem;
    width: 2rem;
    background: url(../../assets/images/shoppingGuide/goods.png) no-repeat 0 0;
    background-size:100% 100%;

  }

  .list-left img {
    width: 100%;
    height: 100%;
  }

  .list-right {
    padding-left: 0.1rem;
    height: 2rem;
    width: 4.48rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

  }

  .list-content-top {
    height: 0.8rem;
    width: 4.48rem;
  }

  .goods-name {
    height: 0.8rem;
    font-size: 0.32rem;
    color: #333333;
    line-height: 0.4rem;
    overflow: hidden; 
    text-overflow: ellipsis; 
    display: -webkit-box; 
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical; 
  }

  .goods-name span {
    font-size: 0.24rem;
    color: #CFA864;
    border-radius: 1px;
    margin-right: 0.02rem;
    display: inline-block;
    padding: 0 0.05rem;
    text-align: center;
    vertical-align: top;
    position: relative;
    margin-right: 0.1rem;
    overflow: hidden;
  }
  .goods-name span i:nth-child(1),.buttom-left i:nth-child(1){
    content: '';
    position: absolute;
    width: 200%;
    height: 1px;
    top: 0;
    left:0;
    border-bottom: 1px solid #CFA864;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box
  }
  .goods-name span i:nth-child(2),.buttom-left i:nth-child(2){
    content: '';
    position: absolute;
    width: 1px;
    height: 200%;
    top: 0;
    right:0;
    border-right: 1px solid #CFA864;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box
  }
  .goods-name span i:nth-child(3),.buttom-left i:nth-child(3){
    content: '';
    position: absolute;
    width: 200%;
    height: 1px;
    bottom: 0;
    left:0;
    border-bottom: 1px solid #CFA864;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box
  }
  .goods-name span i:nth-child(4),.buttom-left i:nth-child(4){
    content: '';
    position: absolute;
    width: 1px;
    height: 200%;
    top: 0;
    left:0;
    border-left: 1px solid #CFA864;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scale(.5,.5);
    transform: scale(.5,.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box
  }

  .list-content-middle {
    height: 0.4rem;
    font-size: 0.32rem;
    color: #CFA864;
  }

  .list-content-middle-color{
    color:#FD5739;
    display: inline-block;
    line-height: 0.4rem;
  }
  .list-content-middle .fl{max-width: 1.9rem;overflow: hidden;text-overflow: ellipsis;}

  .middle-right {font-size: 0;max-width:2.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}

  .doooly-label {
    background: #FD5739;
    border-radius: 1px;
    font-size: 0.24rem;
    color: #FFFFFF;
    line-height: 0.4rem;
    display: inline-block;
    text-align: center;
    vertical-align: top;
    padding: 0 0.1rem;
  }

  .doooly-price {
    font-size: 0.32rem;
    color: #FD5739;
    display: inline-block;
    text-align: center;
    letter-spacing: 0;
    padding-left: 0.1rem;
  }

  .list-content-middle i {
    font-style: normal;
    margin-right: -3px;
  }

  .list-content-buttom {
    font-size: 0.24rem;
  }

  .buttom-left {
    float: left;
    font-size: 0;
    white-space: nowrap;
    position: relative;
    padding: 1px;
  }
  .plan {
    color: #FFFFFF;
    background: #CFA864;
    border-radius: 1px 0 0 1px;
    font-size: 0.24rem;
    display: inline-block;
    height: 0.34rem;
    line-height: 0.34rem;
    padding:0 0.05rem;
    text-align: center;
    box-sizing: border-box;
  }

  .point {
    background: #FFFFFF;
    border-radius: 0 1px 1px 0;
    line-height: 0.34rem;
    font-size: 0.24rem;
    display: inline-block;
    text-align: center;
    box-sizing: border-box;
    padding:0 0.05rem;
    color: #CFA864;
    position: relative;
  }
  .sales-right {
    height: 0.34rem;
    color: #999999;
    font-size: 0.24rem;
    float: right;
  }
  .loadContainer {
    width: 100%;
    font-size: 0.24rem;
    text-align: center;
    padding: 0.5rem 0;
    background: #f5f5f5;
    color: #999;
    position: relative;

  }

  .loadText {
    width: 2.1rem;
    height: 1px;
    background: #ececec;
    position: absolute;
    left: 0.3rem;
    top: 50%;
  }

  .loadLine {
    width: 2.1rem;
    height: 1px;
    background: #ececec;
    position: absolute;
    right: 0.3rem;
    top: 50%;
  }

  .mint-loadmore-bottom {
    width: 100%;
    font-size: 0.26rem;
    text-align: center;
    padding: 0.1rem 0;
  }

  .mint-loadmore-bottom-img {
    width: 1rem;
  }
</style>
