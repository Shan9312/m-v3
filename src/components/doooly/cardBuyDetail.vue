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
        <span class="red">￥</span><span id="sellPrice_view">{{showSellPrice}}</span><span v-show="cardBuyDetailList.selfProduct.productAttr != '1'">市场价￥<span
        id="marketPrice_view">{{showMarketPrice}}</span></span>
        <div class="fr" :class="{red:inventory<10}" v-show="cardBuyDetailList.selfProduct.productAttr != '1'">{{inventoryText}}</div>
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
        <!--<#list skuList as skuList>-->
        <!--<li <#if skuList_index == 0>class="check"</#if> data-id="${skuList.id}" data-buyNumberLimit="${skuList.buyNumberLimit}" data-overBuyLimit="${skuList.overBuyLimit?string ("true","false")}" data-inventory="${skuList.inventory}" data-sellPrice="${skuList.sellPrice}" data-marketPrice="${skuList.marketPrice}">${skuList.specification}</li>-->
        <!--</#list>-->
        <li :class="{check:checkSkuClass==index}" v-for="(item,index) in cardBuyDetailList.skuList" :key="index"
            @click="skuClick(index)">{{item.specification}}
        </li>
      </ul>
    </div>
    <!-- 类型 -->
    <div class="type padding_frm">
      <div class="title">卡券类型</div>
      <ul class="label">
        <!--<#list productTypeList as productTypeList>-->
        <!--<li <#if productTypeList_index == 0>class="check"</#if> data-id="${productTypeList.id}">${productTypeList.name}</li>-->
        <!--</#list>-->
        <li :class="{check:checkProTypeClass==index}" v-for="(item,index) in cardBuyDetailList.productTypeList"
            :key="index" @click="proTypeClick(index)">{{item.name}}
        </li>
        {{cardBuyDetailList.productTypeList}}
      </ul>
    </div>
    <div class="line_bold"></div>
    <!-- 详情 -->
    <div class="commodity_details" v-html="cardBuyDetailList.selfProduct.detail">
    </div>
    <!-- 返回顶部 -->
    <div class="go_top" :class="{'hide':goTop == 2,'show':goTop == 1}" @click="goTopfunction">
      <img src="../../assets/images/cardbuy/go_top.png">
    </div>
    <!-- 底部悬浮 -->
    <div class="footer_bg"></div>
    <footer class="box_item" v-if="!giftBagId">
      <div class="item fl-1">
        可用积分：<span>{{cardBuyDetailList.availablePoint}}</span>
      </div>
      <div class="item fr-2" :class="{gary: (inventory === 0 || (!isStart && activityName))}" @click="order()">
        <span v-if="!activityName">{{inventory===0?'补货中':'立即订购'}}</span>
        <span v-else-if="isStart && activityName">{{inventory===0?'已售罄':'立即抢购'}}</span>
        <span v-else>即将开抢</span>
        <!--{{inventory!=0?'立即订购':'已售罄'}}-->
      </div>
    </footer>
    <footer class="box_item" v-else>
      <div class="item fr-2" v-if="!giftType" :class="{gary: (inventory == 0 || isReceive == 1)}" @click="order('38')">
        <span v-if="isReceive == 1">已领取</span>
        <span v-else-if="inventory ==0">已领完</span>
        <span v-else>{{giftType ? "立即兑换" : '立即领取'}}</span>
        <!--{{inventory!=0?'立即订购':'已售罄'}}-->
      </div>
      <div class="item fr-2" v-else  :class="{gary: (inventory == 0 || isReceive == 1)}" @click="order()">
        <span>立即兑换</span>
      </div>
    </footer>
  </div>
</template>

<script>

import adBanner from '@/components/common/adBanner'
import http from '@/http/http.js'
import api from '@/assets/js/api.js'
import bus from '@/components/common/bus'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import {shareWithFriendsWX, shareWithFriendsAPP} from '@/assets/js/wechatShare2.js'
export default {
  name: 'card-buy-detail',
  components: {
    adBanner
  },
  data () {
    return {
      specialStartDate: 0,
      isStart: false,
      activityName: (this.$route.params.activityName && this.$route.params.activityName != 'false' ? this.$route.params.activityName : ''),
      umengNameObj: {
        'AirportActivity': '机场活动',
        'airportactivity': '机场活动',
        'ChristmasActivity': '圣诞平安夜',
        'christmasactivity': '圣诞平安夜'
      },
      cardBuyDetailList: {
        availablePoint: '',
        code: '',
        groupShortName: '',
        imagesList: [],
        productTypeList: [
          {
            id: '',
            name: ''
          }
        ],
        selfProduct: '',
        skuList: ''
      },
      groupShortName: localStorage.groupShortName,
      checkSkuClass: 0,
      checkProTypeClass: 0,
      showSellPrice: '',
      showMarketPrice: '',
      inventory: '',
      inventoryText: '',
      skuIndex: 0,
      proIndex: 0,
      postData: {},
      imagesList: [],
      scroll: '',
      offsetTop: '',
      goTop: 0,
      isReceive: this.$route.params.isReceive,
      giftBagId: this.$route.params.giftBagId,
      giftType: this.$route.query.giftType || '',
      isError: false,
      errMsg: ''
    }
  },
  computed: {
    ...mapState(['deliveryAddress'])
  },
  methods: {
    ...mapActions(['addAction', 'deleteAction', 'deleteAddressAction']),

    menu () {
      this.scroll = document.documentElement.scrollTop
      if (typeof (document.getElementsByClassName('commodity_details')[0]) === 'object') {
        this.offsetTop = document.getElementsByClassName('commodity_details')[0].offsetTop
      } else {
        this.offsetTop = 0
      }
      if (this.scroll > this.offsetTop) {
        this.goTop = 1
      } else if (this.goTop == 1) {
        this.goTop = 2
      }
    },
    goTopfunction () {
      clearInterval(this.timeOut)
      this.animation()
    },
    getUserInfo () {
      http({
        method: 'get',
        url: api.personalCenter + '?userId=' + localStorage.userId
      }).then((res) => {
        if (res.data.adUserConn != undefined) {
          let adUserConn = res.data.adUserConn
          if (adUserConn.groupId) {
            localStorage.groupId = adUserConn.groupId
          }
        }
      })
    },
    // 获取服务器当前时间
    getServer () {
      http({
        url: api.getCurrentTime + '?token=' + localStorage.token,
        method: 'get'
      }).then((res) => {
        if (res.data && res.data.currentTime) {
          let serverDate = res.data.currentTime
          this.isStart = (this.specialStartDate && this.specialStartDate <= serverDate)
        }
      })
    },
    animation () {
      this.timeOut = setTimeout(() => {
        if (this.scroll > 0) {
          this.scroll -= (this.scroll / 8)
          scrollTo(0, this.scroll)
          this.animation()
        }
      }, 1)
    },
    Wechatshare (prefix, params) {
      var client = 'doooly'
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        client = 'wechat'// 是微信
      } else {
        client = 'doooly'// 不是微信
      }
      this.$jsonp(api.commonShareJSONPConfig + '?client=' + client + '&prefix=' + prefix + '&params=' + params + '&url=' + encodeURIComponent(window.location.href),
        {
          callbackName: 'jsonpCallback'
        }).then((res) => {
        if (res.code == 4001) {
          // 40001微信配置
          shareWithFriendsWX(res.data)
        } else if (res.code == 4002) {
          // 40002兜里配置
          shareWithFriendsAPP(res)
        } else {
          // 获取配置错误10001
        }
      })
    },

    // 威尔士的特殊处理
    handleWelsh (name, id) {
      if (name == '威尔士健身卡') {
        if (browserName == 'WeChat') {
          this.Wechatshare('selfproduct', [id])
        }
      }
    },

    // 选择商品规格
    skuClick (index) {
      this.checkSkuClass = index
      this.skuIndex = index
      this.showSellPrice = this.cardBuyDetailList.skuList[index].sellPrice
      this.showMarketPrice = this.cardBuyDetailList.skuList[index].marketPrice
      let inventory = this.cardBuyDetailList.skuList[index].inventory
      this.handleInventory(inventory)
    },
    proTypeClick (index) {
      this.checkProTypeClass = index
      this.proIndex = index
    },
    order (flag) {
      this.$baiduStats('商品详情-' + (this.umengNameObj[this.activityName] || '商品') + '-立即抢购')
      if (!this.isStart && this.activityName) {
        return
      }
      if (this.inventory == 0 || this.isReceive == 1) {
        return
      }
      if (flag && this.isError) {
        return this.$toast(this.errMsg)
      }
      this.postData =	{
        productType: this.cardBuyDetailList.productTypeList[this.proIndex].id,
        merchantProduct: [{
          merchantId: this.cardBuyDetailList.selfProduct.businessId,
          remarks: '',
          productSku: [{
            'productId': this.cardBuyDetailList.selfProduct.id,
            'skuId': this.cardBuyDetailList.skuList[this.skuIndex].id,
            'buyNum': 1
          }]
        }],
        img: this.cardBuyDetailList.imagesList[0],
        name: this.cardBuyDetailList.selfProduct.name,
        specification: this.cardBuyDetailList.skuList[this.skuIndex].specification,
        sellPrice: this.showSellPrice,
        giftBagId: this.giftBagId,
        orderType: this.cardBuyDetailList.selfProduct.productAttr
      }
      if (this.postData.productType == 1) {
        this.$router.push({path: '/orderInfo_entity'})
      } else if (this.postData.productType === '11') { // productType: 11 机场活动实物商品
        if (this.activityName) {
          this.$router.push({
            path: '/confirm_order/' + this.activityName + '/' + this.cardBuyDetailList.selfProduct.id + '/' + this.cardBuyDetailList.skuList[this.skuIndex].id + '/0/' + this.cardBuyDetailList.productTypeList[this.proIndex].id
          })
        } else {
          this.$router.push({
            path: '/confirm_order/0/' + this.cardBuyDetailList.selfProduct.id + '/' + this.cardBuyDetailList.skuList[this.skuIndex].id + '/0/' + this.cardBuyDetailList.productTypeList[this.proIndex].id
          })
        }
      } else {
        if (this.activityName) {
          this.$router.push({
            path: '/cardBuyOrder/' + this.activityName + '/' + this.cardBuyDetailList.selfProduct.id + '/' + this.cardBuyDetailList.skuList[this.skuIndex].id + '/0/' + this.cardBuyDetailList.productTypeList[this.proIndex].id
          })
        } else {
          this.$router.push({
            path: '/cardBuyOrder/0/' + this.cardBuyDetailList.selfProduct.id + '/' + this.cardBuyDetailList.skuList[this.skuIndex].id + '/0/' + this.cardBuyDetailList.productTypeList[this.proIndex].id
          })
        }
      }
    },

    // 带库存量的商品处理方法
    handleInventory (inventory) {
      this.inventory = inventory

      if (inventory === 0) {
        this.inventoryText = '库存0件'
      } else if (inventory == '' || inventory == undefined) {
        this.inventoryText = ''
      } else if (inventory > 0 && inventory < 10) {
        this.inventoryText = '库存紧张'
      } else if (inventory >= 10) {
        this.inventoryText = '库存' + inventory + '件'
      }
    },

    // 加载商品详情信息
    loadCardBuyDetailList () {
      let params = {
        userId: localStorage.userId,
        productId: this.$route.params.productId,
        activityName: this.activityName,
        token: localStorage.token
      }
      http({
        method: 'post',
        data: params,
        url: api.detailForAjax
      }).then((res) => {
        this.getServer() // 请求服务器时间
        let data = res.data.data
        this.cardBuyDetailList = data
        this.handleWelsh(this.cardBuyDetailList.selfProduct.name, this.cardBuyDetailList.selfProduct.id)
        initTitle('商品详情')
        for (let [index, elem] of data.imagesList.entries()) {
          this.imagesList.push({
            imagePath: elem
          })
        }
        this.showSellPrice = this.cardBuyDetailList.skuList[0].sellPrice
        this.showMarketPrice = this.cardBuyDetailList.skuList[0].marketPrice
        let inventory = this.cardBuyDetailList.skuList[0].inventory
        this.specialStartDate = data.adGroupSelfProductPrice && data.adGroupSelfProductPrice.specialStartDate
        this.handleInventory(inventory)
        for (let [index, elem] of data.skuList.entries()) {
          if (elem.inventory > 0) {
            this.skuClick(index)
            break
          }
        }
      })
    },
    getIsReceive () {
      if (this.isReceive === undefined && this.giftBagId === undefined) return false
      http({
        method: 'post',
        url: api.giftBagIsReceive,
        data: {
          userId: localStorage.userId,
          giftBagId: this.giftBagId,
          productSkuIds: this.$route.params.skuId
        }
      }).then(res => {
        let data = res.data
        if (data) {
          let code = data.code
          if (code !== 1000) {
            this.isError = true
            this.errMsg = data.info
          }
        }
      })
    }
  },
  beforeCreate () {
    document.body.style.backgroundColor = '#fff'
  },
  beforeDestroy () {
    this.addAction(this.postData)
  },
  mounted () {
    this.deleteAddressAction(this.deliveryAddress)
    window.addEventListener('scroll', this.menu)
  },
  created () {
    this.getUserInfo()
    // }
    this.loadCardBuyDetailList()
    this.getIsReceive()
    if(browserName == "Chrome WebView"){//在安卓app中优化轮播图禁用下拉刷新
      RHNativeJS.visablePtrFrame(false);
    }
  }
}
</script>
<style scoped>
/*----------layout等分模型----------*/
.box_item {
    display: -webkit-box;
    display: -moz-box;
    display: box;
    -webkit-box-orient: horizontal;
    -moz-box-orient:horizontal;
    box-orient:horizontal;
}
.box_item .item {
    -webkit-box-flex: 1.0;
    -moz-box-flex: 1.0;
    box-flex: 1.0;
}
.box_item .item2 {
    -webkit-box-flex: 2.0;
    -moz-box-flex: 2.0;
    box-flex: 2.0;
}
.box_item .item3 {
    -webkit-box-flex: 3.0;
    -moz-box-flex: 3.0;
    box-flex: 3.0;
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
