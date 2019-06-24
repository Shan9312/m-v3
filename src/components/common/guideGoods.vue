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