<template>
  <div class="card-buy-order" v-show="pageShow">
    <div class="top"></div>
    <header v-if="!userDeliveryList"  @click="link()" class="add clearfix">
      <div class="fl">
        点击添加收货地址
      </div>
      <div class="fr">
        <img src="../../../assets/images/userDelivery/right.png">
      </div>
    </header>
    <!-- 收货地址 -->
    <header v-else @click="link()" class="clearfix">
      <div class="fl clearfix">
        <span class="name">收货人：{{userDeliveryList.receiverName}}</span>
        <span class="fr tel">{{userDeliveryList.receiverTelephone}}</span>
        <br>
        <span class="address">收货地址：{{userDeliveryList.province + userDeliveryList.city + userDeliveryList.area + userDeliveryList.address}}</span>
      </div>
      <div class="fr">
        <img src="../../../assets/images/userDelivery/right.png">
      </div> 
    </header>
    <div class="line_bold"></div>

    <div class="company">
      <div class="clearfix picture_view" v-for="(item,index) in shopsList" :key="index">
        <div class="fl picture">
          <img :src="item.image">
        </div>
        <div class="fl price">
          <span class="name">{{item.skuName}}</span><br>
          <span class="type">规格：{{item.specification}}</span><span class="type">数量：{{item.num}}</span><br>
          <span><span style="font-size:0.24rem;margin: 0;padding: 0;color:#ee3f44;">￥</span><span style="display: inline;margin: 0;padding: 0;" class="sellPrice">{{item.shopCartPrice.toFixed(2)}}</span></span>
        </div>
      </div>
    </div>
    <div class="line_bold"></div>

    <div class="list">
      <span class="fl">运费</span>
      <span class="fr coupon-right">无</span>
    </div>
    <div class="line_bold"></div>

    <div class="footer_bg"></div>
    <footer :class="{refer:userDeliveryList}">
      <div class="fl">
        应付金额：<span><span style="font-size:0.24rem;margin: 0;padding: 0;">￥</span><span class="sellPrice">{{totalPrices.toFixed(2)}}</span></span>
      </div>
      <div class="fr" @click="refer()">
        确认提交
      </div>
    </footer>
  </div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import {checkMobile} from '@/assets/js/verify.js';
export default {
  name: "ford-buy-order",
  data(){
    return{
      userDeliveryList:[],
      shopsList:[],
      pageShow:false,
      totalPrices:0.00,
    }
  },
  methods: {
    getUserDelivery(){
      http({
          method: 'get',
          url: api.getUserDelivery,
      }).then((data) => {
        if(data.data.userDeliveryList){
          if(this.$cookies.get("addressDataList")){
            this.userDeliveryList = data.data.userDeliveryList[this.$cookies.get("addressDataList")];
          }else{
            this.userDeliveryList = data.data.userDeliveryList[0];
          }
        }
        this.getShoppingList();
      }).catch((data) => {
        this.getShoppingList();
      })
    },
    link() {
      dooolyAPP.gotoJumpVue(this.$router,'/userDeliveryList');
    },
    refer(){
      let merchantProduct = [];
      this.shopsList.forEach((shop,key) => {
        let data = {
          'merchantId':shop.businessId,
          'remarks':'',
          'productSku':[{
            'productId':shop.goodsId,
            'skuId':shop.sku,
            'buyNum':shop.num,
            'productType':shop.productType,
          }]
        };
        merchantProduct.push(data);
      })
      http({
        method: 'post',
        url: api.createOrder_v2_2,
        notNeedTransfer:true,
        data:{
          'userId': localStorage.userId,
          'groupId': localStorage.groupId,
          'consigneeName':this.userDeliveryList.receiverName,
          'consigneeMobile':this.userDeliveryList.receiverTelephone,
          'consigneeAddr':this.userDeliveryList.province + this.userDeliveryList.city + this.userDeliveryList.area + this.userDeliveryList.address,
          'merchantProduct':merchantProduct,
          'redirectUrl': this.$allConfig.jumpDomain.cashier + 'cardBuyPayResult/'
        }
      }).then((res) => {
        if(res.data.code == 1000){
          dooolyAPP.redirectPay(res.data.data.orderNum,'payV2',res.data.data.zeroOrderFlag);
        }else{
          this.$toast(res.data.msg);
        }
      })
    },
    //购物车list
    getShoppingList(item){
      http({
        method: 'post',
        url:api.shopList,
        data: {
          userId:localStorage.userId,
          businessId:'',
          sku:this.$route.params.skuId || '',
        },
      }).then((res) => {
        if(res.data.code == 1000){
          this.shopsList = res.data.data;
          if(!this.shopsList[0]){
            dooolyAPP.goBackPageIndex(1);
          }else{
            this.shopsList.forEach((shop,key) => {
              this.totalPrices += (shop.price * shop.num);
            })
            this.pageShow = true;
          }
        }else{
          this.$toast(res.data.msg);
        }
        this.pageShow = true;
      })
    },
  },
  beforeCreate(){
    document.body.style.backgroundColor="#f5f5f5";
  },
  beforeDestroy(){
    this.$cookies.remove("addressDataList");
  },
  destroy(){
    document.body.style.backgroundColor="";
    
  },
  created(){
    dooolyAPP.initTitle('确认订单');
    //确认收货地址
    this.getUserDelivery();
  },
}
</script>

<style scoped>

  .card-buy-order{
     background: #F5F5F5;;
  }

  @font-face {
    font-family: 'iconfont';
    src: url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot');
    src: url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.woff') format('woff'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.svg#iconfont') format('svg');
  }

  .iconfont {
    font-family:"iconfont" !important;
    font-size:0.28rem;
    color:#999;
    padding-left: 0.3rem;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  .coupon-red{
    color:#EE3F44;
  }

  .list{
    height: 0.98rem;
    background: #ffffff;
    font-size: 0.28rem;
    color: #333;
    line-height:0.98rem;
    padding:0 0.3rem;
  }


  .coupon-right{
    color: #999;
  }


  .coupon-checked{
    font-size: 0.24rem;
    color: #999999;
  }

  .money-right{
    color:#EE3F44;
    font-size: 0.32rem;
  }

  .money-right i{
    font-size: 0.24rem;
    font-style:normal;
    display: inline;
  }

  .line-separation{
    height: 1px;
    background: #ECECEC;
    margin:0 0.3rem;
    box-sizing: border-box;
  }
  .line_bold{
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
  }
  .line_minute{
    width: 100%;
    height: 1px;
    background: #ececec;
  }
  input[type='button']{
    line-height: 100%;
  }
  a{
    text-decoration: none;
    color: #333;
  }
  #distpicker1.gray,#store_name1.gray,#distpicker2.gray,#store_name2.gray{
    color:#999;
  }
  /*地址*/
  .top{
    width: 100%;
    height: 0.12rem;
    background: url(../../../assets/images/cardbuy/order_top.png) 0 0;
    background-size: 100%;
  }
  header{
    background: #fff;
    padding: 0.4rem 0.3rem 0.3rem 0.3rem;
  }
  header .fl{
    font-size: 0.28rem;
    color:#333;
    width: 6.5rem;
  }
  header.add .fl{
    line-height: 0.78rem;
  }
  header .fr{
    font-size: 0;
    padding-top: 0.26rem;
  }
  header .fr img{
    width: 0.16rem;
  }
  header .fl span{
    display: inline-block;
    line-height: 100%;
  }
  header .fl .name{
    margin-bottom: 0.15rem;
  }
  header .fl .address{
    line-height: 120%;
  }
  header .fl .tel{
    font-size: 0.28rem;
    margin: 0;
    padding: 0;
  }


  /*主体表单部分*/
  .main{
    background: #fff;
    padding:0 0.3rem;
  }
  .main .list_li{
    border-top: 1px solid #ececec;
    font-size: 0.28rem;
    color: #333;
  }
  .main .list_li:first-child{
    border: 0;
  }
  .main .list_li_minute{
    line-height: 0.97rem;
  }
  .main .option .fr{
    font-size: 0;
    line-height: 0;
    padding-top: 0.36rem;
  }
  .main .option .fr img{
    width: 0.16rem;
  }
  .main .list_li .center input{
    background: transparent;
    text-align: left;
    width: 5.44rem;
    outline: none;
    text-indent: 0.6rem;
    font-size: 0.28rem;
  }
  .main .option .center input{
    background: transparent;
    text-align: right;
    margin:0;
    margin-right: 0.3rem;
    width: 4.5rem;
  }
  .main .option .center span{
    display: inline-block;
    text-align: right;
    margin:0;
    margin-right: 0.3rem;
    width: 4.5rem;
    line-height: 120%;
    font-size: 0.28rem;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
  }
  .main .list_li_minute .fl:first-child{
    width: 1.42rem;
  }
  .main .picture{
    height: 1.6rem;
    line-height: 1.6rem;
    padding: 0.4rem 0;
  }
  .main .picture .center{
    margin-left: 0.6rem;
    width: 1.6rem;
    height: 1.6rem;
    background: #f5f5f5 url(../../../assets/images/cardbuy/picture_add.png)  no-repeat 0.6rem 0.42rem;
    background-size: 0.4rem 0.4rem;
    font-size: 0;
  }
  .main .picture .center span{
    display: inline-block;
    width: 100%;
    font-size: 0.24rem;
    color: #999;
    margin-top: 0.93rem;
    text-align: center;
    line-height: 100%;
  }
  .main .picture .center img{
    width: 100%;
    height:100%;
  }


  /*底部商品信息*/
  .company{
    background: #fff;
  }
  .company .title{
    font-size: 0.24rem;
    color: #666;
    padding: 0.16rem 0.3rem 0.24rem 0.3rem;
    line-height: 100%;
    background: #f5f5f5;
  }
  .company .title span{
    display: inline-block;
    color: #ee3f44;
  }
  .company .picture_view{
    margin: 0 0.3rem;
    padding: 0.3rem 0;

  }
  .company .picture_view .picture{
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.2rem;
  }
  .company .picture_view .picture img{
    width: 100%;
    height: 100%;
  }
  .company .price{
    font-size: 0;
  }
  .company .price span{
    display: inline-block;
    line-height: 100%;
    color: #999;
    font-size: 0.24rem;
    margin-top: 0.2rem;
    margin-right: 0.2rem;
  }
  .company .price span:first-child{
    color: #333;
    font-size: 0.28rem;
    margin-top: 0.1rem;
  }
  .company .price span:last-child{
    color: #ee3f44;
    font-size: 0.28rem;
    margin-top: 0.46rem;
  }
  .company .freight{
    border-top: 1px solid #ececec;
    margin: 0 0.3rem;
  }
  .company .freight div{
    line-height: 0.98rem;
    font-size: 0.28rem;
    color: #333;
  }

  /*底部提交按钮*/
  footer{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 1rem;
    line-height: 1rem;
    border-top: 1px solid #ececec;
    font-size: 0.3rem;
    width: 100%;
    background: #fff;
  }
  footer div{
    height: 100%;
  }
  footer .fl{
    color: #333;
    padding-left: 0.3rem;
  }
  footer .fl span{
    color: #ee3f44;
  }
  footer .fr{
    background: #ccc;
    color: #fff;
    width: 3rem;
    text-align: center;
  }
  footer.refer .fr{
    background: #ee3f44;
  }

  /*门店选择列表*/
  .store_list_bg{
    display: none;
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .store_list_bg .store_list{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 8.9rem;
    width: 100%;
    background: #fff;
    font-size: 0.28rem;
    color: #333;
  }
  .store_list_bg .store_list .close{
    position: absolute;
    right: 0.4rem;
    top: 0.3rem;
    width: 0.2rem;
    height: 0.2rem;
  }
  .store_list_bg .store_list .close img{
    width: 100%;
  }
  .store_list_bg .store_list .title{
    text-align: center;
    margin-top: 0.26rem;
    line-height: 100%;
    margin-bottom: 0.48rem;
  }
  .store_list_bg .store_list .address{
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
    font-size: 0;
  }
  .store_list_bg .store_list .address span{
    font-size: 0.28rem;
  }
  .store_list_bg .store_list .address .check{
    color: #ee3f44;
  }
  .store_list_bg .store_list .address b{
    display: inline-block;
    height: 0.2rem;
    width: 0.02rem;
    background: #ccc;
    margin: 0 0.2rem;
  }
  .store_list_bg .store_list ul{
    height: 7.33rem;
    overflow: scroll;
  }
  .store_list_bg .store_list ul li{
    height: 1rem;
    line-height: 1rem;
    padding: 0 0.2rem;
    border-bottom: 1px solid #ececec;
  }

  /*iframe弹出*/
  iframe{
    display:none;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    border: 0;
  }
  body.hidden{
    overflow: hidden;
  }

  .store2{
    display:none;
  }

  .hidden{
    overflow: hidden;
    width:100%;
    height:100%;
  }
  .input_view{
    position: relative;
  }
  .input_view .input_delete{
    position: absolute;
    right: 0;
    top: 50%;
    height: 0.32rem!important;
    width: 0.32rem!important;
    font-size: 0!important;
    margin: 0!important;
    margin-top: -0.16rem!important;
    padding: 0!important;
    line-height: 100%!important;
  }
  .input_view .input_delete.lod{
    display: block;
  }
  .input_delete img{
    height: 100%!important;
    width: 100%!important;
  }

  .data_bg{
    display: none;
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .data_bg .data{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 8.9rem;
    width: 100%;
    background: #fff;
    font-size: 0.28rem;
    color: #333;
  }
  .data_bg .data .close{
    position: absolute;
    right: 0.4rem;
    top: 0.3rem;
    width: 0.2rem;
    height: 0.2rem;
  }
  .data_bg .data .close img{
    width: 100%;
  }
  .data_bg .data .title{
    text-align: center;
    margin-top: 0.26rem;
    line-height: 100%;
    margin-bottom: 0.48rem;
  }
  .data_bg .data .address{
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
    font-size: 0;
  }
  .data_bg .data .address span{
    font-size: 0.28rem;
  }
  .data_bg .data .address .check{
    color: #ee3f44;
  }
  .data_bg .data .address b{
    display: inline-block;
    height: 0.2rem;
    width: 1px;
    background: #ccc;
    margin: 0 0.2rem;
  }
  .data_bg .data ul{
    height: 7.33rem;
    overflow: scroll;
  }
  .data_bg .data ul li{
    height: 1rem;
    line-height: 1rem;
    padding: 0 0.2rem;
    border-top: 1px solid #ececec;
  }












</style>
