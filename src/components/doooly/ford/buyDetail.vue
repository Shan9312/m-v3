<template>
  <div>
    <!--轮播图-->
    <adBanner :items="imagesList"></adBanner>
    <!--{{imagesList}}-->
    <!-- 标题 -->
    <div class="explain padding_frm">
      <div class="title">
        {{cardBuyDetailList.selfProduct.name}}
      </div>

      <div class="details" v-if="cardBuyDetailList.selfProduct.brandDescription">
        {{activityName ? cardBuyDetailList.selfProduct.introduction : cardBuyDetailList.selfProduct.brandDescription}}
      </div>

      <div class="price">
        <span class="red">￥</span><span id="sellPrice_view">{{showSellPrice}}</span><span>市场价￥<span
        id="marketPrice_view">{{showMarketPrice}}</span></span>
        <div class="fr" :class="{red:inventory<10}">{{inventoryText}}</div>
      </div>
      <ul class="label">
        <li>{{groupShortName}}专享</li>
      </ul>
    </div>
    <div class="line_bold"></div>
    <!-- 商品规格 -->
    <div class="specification padding_frm">
      <div class="title">规格</div>
      <ul class="label">
        <li :class="{check:checkSkuClass==index}" v-for="(item,index) in cardBuyDetailList.skuList" :key="index"
            @click="skuClick(index)">{{item.specification}}
        </li>
      </ul>
    </div>
    <!-- 类型 -->
    <div class="specification type padding_frm">
      <div class="title">卡券类型</div>
      <ul class="label">
        <li :class="{check:checkProTypeClass==index}" v-for="(item,index) in cardBuyDetailList.productTypeList"
            :key="index" @click="proTypeClick(index)">{{item.name}}
        </li>
      </ul>
    </div>
    <!-- 类型 -->
    <div class="type padding_frm">
      <div class="title">数量</div>
      <ul class="label">
        <li class="button_count">
          <div @click="shoppingDelte()"><img src="../../../assets/images/subtract.png"></div>
          <div class="count">{{count}}</div>
          <div @click="shoppingAdd()"><img src="../../../assets/images/append.png"></div>
        </li>
      </ul>
    </div>
    <div class="line_bold"></div>
    <!-- 详情 -->
    <div class="commodity_details" v-html="cardBuyDetailList.selfProduct.detail">
    </div>
    <!-- 返回顶部 -->
    <div class="go_top" :class="{'hide':goTop == 2,'show':goTop == 1}" @click="goTopfunction">
      <img src="../../../assets/images/cardbuy/go_top.png">
    </div>
    <!-- 底部悬浮 -->
    <div class="footer_bg"></div>
    <footer class="box_item">
      <div class="item fl-1">
        可用积分：<span>{{cardBuyDetailList.availablePoint}}</span>
      </div>
      <div class="item fr-2" :class="{gary: inventory === 0 || count <= 0}" @click="order()">
        <span v-if="!activityName">{{inventory===0?'补货中':'立即订购'}}</span>
        <span v-else>即将开抢</span>
      </div>
    </footer>
  </div>
</template>

<script>
import adBanner from '@/components/common/adBanner';
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import bus from '@/components/common/bus';
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';
import {shareWithFriendsWX,shareWithFriendsAPP} from '@/assets/js/wechatShare2.js';
export default {
  name: "card-buy-detail",
  components: {
    adBanner,
  },
  data() {
    return {
      activityName: this.$route.params.activityName || '',
      umengNameObj: {
        'AirportActivity': '机场活动',
        'airportactivity': '机场活动',
        'ChristmasActivity': '圣诞平安夜',
        'christmasactivity': '圣诞平安夜',
      },
      cardBuyDetailList:{
        availablePoint:'',
        code:'',
        groupShortName:'',
        imagesList:[],
        productTypeList:[
          {
            id:'',
            name:''
          }
        ],
        selfProduct:'',
        skuList:''
      },
      groupShortName:localStorage.groupShortName,
      checkSkuClass: 0,
      checkProTypeClass: 0,
      showSellPrice:'',
      showMarketPrice:'',
      inventory:'',
      inventoryText:'',
      skuIndex:0,
      proIndex:0,
      postData:{},
      imagesList:[],
      scroll: '',
      offsetTop:'',
      goTop:0,
      shopsList:[],
      count:0,
    }
  },
  computed:{
    ...mapState(["deliveryAddress"]),
  },
  methods: {
    ...mapActions(['addAction','deleteAction','deleteAddressAction']),
    //购物车list
    getShoppingList(item){
      http({
        method: 'post',
        url:api.shopList,
        data: {
          userId:localStorage.userId,
          businessId:'',
          sku:'',
        },
      }).then((res) => {
        this.shopsList = res.data.data;
        this.shopNum();
      })
    },
    //购物车添加商品
    shoppingAdd(){
      let item = this.cardBuyDetailList.skuList[this.skuIndex];
      http({
        method: 'post',
        url: api.shopHandle,
        data: {
          sku:item.id,
          businessId:this.cardBuyDetailList.selfProduct.businessId,
          num:this.count+1,
          price:item.sellPrice,
          specification:item.specification,
          userId:localStorage.userId,
          name:this.cardBuyDetailList.selfProduct.name,
          businessName:this.cardBuyDetailList.selfProduct.company,
          image:this.cardBuyDetailList.imagesList[0],
          goodsId:this.cardBuyDetailList.selfProduct.id,
          productType:this.cardBuyDetailList.productTypeList[this.proIndex].id,
        },
      }).then((res) => {
        if(res.data.code = 1000){
          this.count++;
        }
      })
    },
    //购物车删除商品
    shoppingDelte(){
      if(this.count == 0){
        return;
      }
      let item = this.cardBuyDetailList.skuList[this.skuIndex];
      http({
        method: 'post',
        url: api.shopHandle,
        data: {
          sku:item.id,
          businessId:this.cardBuyDetailList.selfProduct.businessId,
          num:this.count-1,
          price:item.sellPrice,
          specification:item.specification,
          userId:localStorage.userId,
          name:this.cardBuyDetailList.selfProduct.name,
          businessName:this.cardBuyDetailList.selfProduct.company,
          image:this.cardBuyDetailList.imagesList[0],
          goodsId:this.cardBuyDetailList.selfProduct.id,
          productType:this.cardBuyDetailList.productTypeList[this.proIndex].id,
        },
      }).then((res) => {
        if(res.data.code = 1000){
          this.count--;
        }
      })
    },
    //加载购物车数量
    shopNum(item){
      this.cardBuyDetailList.skuList.forEach((card,index) => {//同步购物车与商品列表数量计算总价格
        card.count = 0;
        this.shopsList.forEach((shop,key) => {
          if(card.id == shop.sku){
            card.count = shop.num;
          }
        })
        if(this.$route.params.skuId == card.id){
          this.skuClick(index);
        }
      })
      
    },
    menu() {
      this.scroll = document.documentElement.scrollTop;
      if(typeof(document.getElementsByClassName("commodity_details")[0]) == "object"){
          this.offsetTop = document.getElementsByClassName("commodity_details")[0].offsetTop;
      }else{
        this.offsetTop = 0;
      }
      if(this.scroll > this.offsetTop){
        this.goTop = 1;
      }else if(this.goTop == 1){
        this.goTop = 2;
      }
    },
    goTopfunction(){
      clearInterval(this.timeOut);
      this.animation();
    },
    animation(){
      this.timeOut = setTimeout(() => {
        if(this.scroll > 0){
          this.scroll-=(this.scroll/8);
          scrollTo(0,this.scroll);
          this.animation();
        }
      }, 1);
    },
    Wechatshare(prefix,params){
      var client = 'doooly';
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        client = 'wechat';//是微信
      } else {
        client = 'doooly';//不是微信
      }
      this.$jsonp(api.commonShareJSONPConfig+"?client="+client+"&prefix="+prefix+"&params="+params+"&url="+encodeURIComponent(window.location.href),
        {
          callbackName: 'jsonpCallback',
        }).then((res) => {
        if(res.code == 4001){
          //40001微信配置
          shareWithFriendsWX(res.data);
        }else if(res.code == 4002){
          //40002兜里配置
          shareWithFriendsAPP(res);
        }else{
          //获取配置错误10001
        }
      });
    },
    //选择商品规格
    skuClick(index) {
      this.checkSkuClass = index;
      this.skuIndex = index;
      this.showSellPrice=this.cardBuyDetailList.skuList[index].sellPrice;
      this.showMarketPrice=this.cardBuyDetailList.skuList[index].marketPrice;
      this.count = this.cardBuyDetailList.skuList[index].count;
      this.handleInventory(index);
    },
    proTypeClick(index) {
      this.checkProTypeClass = index;
      this.proIndex=index;
    },
    order() {
      this.$baiduStats(this.umengNameObj[this.activityName]+'-商品详情-立即抢购');
      if(this.inventory == 0 || this.count <= 0){
        return;
      }
      this.$router.push({path:'/fordBuyOrder/'+this.cardBuyDetailList.skuList[this.skuIndex].id});
    },
    //带库存量的商品处理方法
    handleInventory(index){
      this.inventory=this.cardBuyDetailList.skuList[index].inventory;
      if(this.inventory===0){
        this.inventoryText="库存0件";
      }else if(this.inventory==''|| this.inventory == undefined){
        this.inventoryText='';
      }else if(this.inventory>0&&this.inventory<10){
        this.inventoryText="库存紧张";
      }else if(this.inventory>=10){
        this.inventoryText="库存"+this.inventory+"件";
      }
    },
    //加载商品详情信息
    loadCardBuyDetailList(){
      http({
        method: 'post',
        url: api.detailForAjax,
        data: {
          userId: localStorage.userId,
          productId: this.$route.params.id,
          activityName: this.activityName,
          token: localStorage.token
        },
      }).then((res) => {
        this.cardBuyDetailList = res.data.data;
        this.shopNum();
        if(this.cardBuyDetailList.selfProduct.name == '威尔士健身卡'){
          if(this.$browserName == "WeChat" ){
            this.Wechatshare('selfproduct',[this.cardBuyDetailList.selfProduct.id]);
          }
        }
        if(this.cardBuyDetailList.imagesList){
          this.cardBuyDetailList.imagesList.forEach((shop,key) => {
            this.imagesList.push({
              imagePath:shop
            });
          })
        }
      })
    },
  },
  beforeCreate(){
    document.body.style.backgroundColor="#fff";
  },
  beforeDestroy(){
    this.addAction(this.postData);
  },
  mounted(){
    this.deleteAddressAction(this.deliveryAddress);
    window.addEventListener('scroll', this.menu);
  },
  created(){
    dooolyAPP.initTitle('商品详情');
    this.loadCardBuyDetailList();
    this.getShoppingList();
  }
}
</script>
<style scoped>
/*----------layout等分模型----------*/
.box_item {
    display: flex;
    justify-content: space-between;
}
  .fl-1{
    min-width: 66%;
  }
  .fr-2{
    min-width: 33%;
    width: 100%;
  }
  .adBannerSwipe{
    height: 7.5rem;
  }
  .padding_frm{
    margin: 0 0.3rem;
  }
  .line_bold{
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
  }
  /*标题部分*/
  .explain {
    margin-top: 0.4rem;
  }

  .explain .title {
    margin-bottom: 0.2rem;
    color: #333;
    font-size: 0.36rem;
    line-height: 100%;
  }

  .explain .details {
    font-size: 0.24rem;
    color: #999;
    line-height: 0.32rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .explain .price {
    margin-top: 0.4rem;
    font-size: 0.4rem;
    color: #ee3f44;
    line-height: 100%;
  }

  .explain .price span {
    display: inline-block;
    margin-left: 0.12rem;
    font-size: 0.24rem;
    color: #999;
  }

  .explain .price span.red {
    margin: 0;
    color: #ee3f44;
    font-size: 0.28rem;
    text-decoration: none;
  }

  .explain .fr {
    font-size: 0.24rem;
    color: #999;
    line-height: 0.5rem;
  }

  .explain .fr.red {
    color: #ee3f44;
  }

  .explain .label {
    font-size: 0;
    margin-top: 0.16rem;
    margin-bottom: 0.3rem;
  }

  .explain .label li {
    display: inline-block;
    padding: 0 0.1rem;
    line-height: 0.4rem;
    background: #fff;
    color: #ee3f44;
    font-size: 0.24rem;
    border: 1px solid #ee3f44;
    text-align: center;
    border-radius: 0.1rem;
  }

  #sellPrice_view {
    display: inline;
    margin: 0;
    font-size: 0.4rem;
    color: #ee3f44;
  }

  #marketPrice_view {
    display: inline;
    margin: 0;
  }

  /*规格*/
  .specification {
    padding-top: 0.4rem;
    padding-bottom: 0;
    border-bottom: 1px solid #f5f5f5;
  }

  /*类型*/
  .type {
    padding-top: 0.3rem;
    padding-bottom: 0.1rem;
  }

  .specification .title, .type .title {
    margin-bottom: 0.18rem;
    line-height: 100%;
    font-size: 0.28rem;
    color: #333;
  }

  .specification .label, .type .label {
    font-size: 0;
  }

  .specification .label li, .type .label li {
    display: inline-block;
    line-height: 0.64rem;
    padding: 0 0.2rem;
    font-size: 0.24rem;
    color: #333;
    background: #f5f5f5;
    border-radius: 0.1rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
  }

  .specification .label li.check, .type .label li.check {
    background: #ee3f44;
    color: #fff;
  }
  /* 数量 */
  .padding_frm .label li.button_count {
    position: relative;
    right: 0;
    top: 0;
    width: 2.2rem;
    padding: 0;
    display: flex;
    justify-content: space-between;
    border-radius: 0;
    background: #fff
  }
  .padding_frm .label li.button_count div{
    position: relative;
    width: 0.68rem;
    height: 0.6rem;
    background: #f5f5f5;
    margin-right: 1px;
  }
  .padding_frm .label li.button_count .count{
    width: 0.8rem;
    line-height: 0.6rem;
    font-size: 0.32rem;
    color: #333;
    text-align: center;
  }
  .padding_frm .label li.button_count div:last-child{
    margin-right: 0;
  }
  .padding_frm .label li.button_count div img{
    width: 0.24rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }

  /*商品详情*/
  .commodity_details {
    font-size: 0;
  }

  .commodity_details img {
    width: 100%;
  }

  /*返回顶部*/
  .go_top {
    position: fixed;
    right: 0.3rem;
    bottom: 1.3rem;
    width: 0.82rem;
    height: 0.82rem;
    border-radius: 100%;
    border: 1px solid #ccc;
    opacity: 0;
    font-size: 0;
    background: #fff;
  }
  .hide{
    opacity: 0;
    animation:hide 0.6s linear ;
  }
  .show{
    opacity: 0.7;
    animation:show 0.6s linear;
  }
  @keyframes hide{
      0%   {opacity: 0.7;}
      100% {opacity: 0;}
  }
  @keyframes show{
      0%   {opacity: 0;}
      100% {opacity: 0.7;}
  }

  .go_top img {
    width: 100%;
    height: 100%;
  }

  /*底部悬浮*/
  .footer_bg {
    height: 1rem;
    width: 100%;
  }

  footer {
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    width: 100%;
    z-index: 9;
  }

  footer .fl-1 {
    text-align: left;
    text-indent: 0.3rem;
    border-top: 1px solid #ececec;
  }

  footer .fl-1 span {
    font-size: 0.36rem;
    color: #ee3f44;
  }

  footer .fr-2 {
    background: #ee3f44;
    color: #fff;
    text-align: center;
  }

  footer .fr-2.gary {
    background: #ccc;
  }

  form {
    display: none;
  }
</style>
