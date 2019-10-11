import adBanner from '@/components/common/adBanner';
import http from '@/http/http.js';
import api from '@/assets/js/api.js';

export default {
  name: 'seckill-goods-detail',
  components: {
    adBanner
  }, 
  data() {
    return {
      // sourceType: this.$route.params.sourceType,
      specialStartDate: 0,
      specialEndDate: 0,
      isStart: false,
      isEnd: false,
      activityName: this.$route.params.activityName,
      cardBuyDetailList: {
        availablePoint: '',
        code: '',
        groupShortName: '',
        imagesList: [],
        productTypeList: [{
          id: '',
          name: ''
        }],
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
      // isReceive: this.$route.params.isReceive,
      giftBagId: this.$route.params.giftBagId,
      giftType: this.$route.query.giftType || '', // 礼包页面跳转至此
      ccbType: this.$route.query.ccbType || '', // 建设银行一元购活动跳转至此
      recyclingType: this.$route.query.recyclingType || '', // 回收活动跳转至此
      isError: false,
      errMsg: '',
      serverDate: 0,
      countdownTim: '',
      countdownId: null,
      watchEndId: null
    };
  },
  computed: {},
  beforeCreate() {
    document.body.style.backgroundColor = '#fff';
  },
  beforeDestroy() {},
  mounted() {
    window.addEventListener('scroll', this.menu);
  },
  created() {
    // 禁止通过分享链接进入
    if (history.length <= 1 && (this.activityName === 'jianhangTicket' || this.activityName === 'jianhangTicketOther')) return dooolyAPP.redirectActivity('jianhangGiftEntry');
    this.loadCardBuyDetailList();
    if (this.$browserName == 'Chrome WebView') {
      // 在安卓app中优化轮播图禁用下拉刷新
      RHNativeJS.visablePtrFrame(false);
    }
  },
  methods: {
    menu() {
      this.scroll = document.documentElement.scrollTop;
      if (
        typeof document.getElementsByClassName('commodity_details')[0] ===
        'object'
      ) {
        this.offsetTop = document.getElementsByClassName(
          'commodity_details'
        )[0].offsetTop;
      } else {
        this.offsetTop = 0;
      }
      if (this.scroll > this.offsetTop) {
        this.goTop = 1;
      } else if (this.goTop == 1) {
        this.goTop = 2;
      }
    },
    goTopfunction() {
      clearInterval(this.timeOut);
      this.animation();
    },
    animation() {
      this.timeOut = setTimeout(() => {
        if (this.scroll > 0) {
          this.scroll -= this.scroll / 8;
          scrollTo(0, this.scroll);
          this.animation();
        }
      }, 1);
    },

    // 选择商品规格
    skuClick(index) {
      localStorage.setItem("skuIdIndex", index);
      if (this.cardBuyDetailList.skuList[index].specification.indexOf('平季') > -1) {
        localStorage.setItem("skuListCardId", 1217);
      } else if (this.cardBuyDetailList.skuList[index].specification.indexOf('旺季') > -1) {
        localStorage.setItem("skuListCardId", 1218);
      } else {
        localStorage.setItem("skuListCardId", 0);
      }
      this.checkSkuClass = index;
      this.skuIndex = index;
      this.showSellPrice = this.cardBuyDetailList.skuList[index].sellPrice;
      this.showMarketPrice = this.cardBuyDetailList.skuList[index].marketPrice;
      let inventory = this.cardBuyDetailList.skuList[index].inventory;
      this.handleInventory(inventory);
    },
    proTypeClick(index) {
      this.checkProTypeClass = index;
      this.proIndex = index;
    },
    order() {
      if (this.inventory == 0) {
        return;
      }
      this.postData = {
        productType: this.cardBuyDetailList.productTypeList[this.proIndex].id,
        merchantProduct: [{
          merchantId: this.cardBuyDetailList.selfProduct.businessId,
          remarks: '',
          productSku: [{
            productId: this.cardBuyDetailList.selfProduct.id,
            skuId: this.cardBuyDetailList.skuList[this.skuIndex].id,
            buyNum: 1
          }]
        }],
        img: this.cardBuyDetailList.imagesList[0],
        name: this.cardBuyDetailList.selfProduct.name,
        specification: this.cardBuyDetailList.skuList[this.skuIndex]
          .specification,
        sellPrice: this.showSellPrice,
        giftBagId: this.giftBagId,
        orderType: this.cardBuyDetailList.selfProduct.productAttr
      };
      if (this.activityName === 'jianhangTicketOther') return this.$router.push({
        path: `/v3/constructOrderDetail/${this.$route.params.productId}/${this.activityName}?ccbType=${this.ccbType}`
      });
      if (this.postData.productType == 1) {
        this.$router.push({
          path: '/orderInfo_entity'
        });
      } else if (this.postData.productType === '11') {
        // productType: 11 机场活动实物商品
        if (this.activityName) {
          dooolyAPP.gotoJumpVue(
            this.$router,
            '/confirm_order/' +
            this.activityName +
            '/' +
            this.cardBuyDetailList.selfProduct.id +
            '/' +
            this.cardBuyDetailList.skuList[this.skuIndex].id +
            '/0/' +
            this.cardBuyDetailList.productTypeList[this.proIndex].id + 
            "?ccbType=" + this.ccbType
          );
        } else {
          dooolyAPP.gotoJumpVue(
            this.$router,
            '/confirm_order/0/' +
            this.cardBuyDetailList.selfProduct.id +
            '/' +
            this.cardBuyDetailList.skuList[this.skuIndex].id +
            '/0/' +
            this.cardBuyDetailList.productTypeList[this.proIndex].id + 
            "?ccbType=" + this.ccbType
          );
        }
      } else {
        if (this.activityName) {
          dooolyAPP.gotoJumpVue(
            this.$router,
            '/cardBuyOrder/' +
            this.activityName +
            '/' +
            this.cardBuyDetailList.selfProduct.id +
            '/' +
            this.cardBuyDetailList.skuList[this.skuIndex].id +
            '/0/' +
            this.cardBuyDetailList.productTypeList[this.proIndex].id + 
            "?ccbType=" + this.ccbType
          );
        } else {
          dooolyAPP.gotoJumpVue(
            this.$router,
            '/cardBuyOrder/0/' +
            this.cardBuyDetailList.selfProduct.id +
            '/' +
            this.cardBuyDetailList.skuList[this.skuIndex].id +
            '/0/' +
            this.cardBuyDetailList.productTypeList[this.proIndex].id + 
            "?ccbType=" + this.ccbType
          );
        }
      }
    },

    // 带库存量的商品处理方法
    handleInventory(inventory) {
      this.inventory = inventory;

      if (inventory === 0) {
        this.inventoryText = '库存0件';
      } else if (inventory == '' || inventory == undefined) {
        this.inventoryText = '';
      } else if (inventory > 0 && inventory < 10) {
        this.inventoryText = '库存紧张';
      } else if (inventory >= 10) {
        this.inventoryText = '库存' + inventory + '件';
      }
    },

    // 加载商品详情信息
    loadCardBuyDetailList() {
      let activityName = this.activityName;
      if (activityName === 'pickUpGoods' || activityName === 'jianhangTicket' || activityName === 'jianhangTicketOther') activityName = ''; // TODO 如果是东航提货券活动，不需要传activityName，这里的activityName只是用于在收银台判断跳哪个支付结果页
      let params = {
        userId: localStorage.userId,
        productId: this.$route.params.productId,
        activityName,
        token: localStorage.token
      };
      http({
        method: 'post',
        data: params,
        url: api.detailForAjax
      }).then(res => {
        try {
          // this.getServer(); // 请求服务器时间
          let data = res.data.data;
          this.cardBuyDetailList = data;
          if (data.skuList && data.skuList.length > 0) {
            localStorage.setItem("skuIdIndex", 0);
            if (data.skuList[0].specification.indexOf('平季') > -1) {
              localStorage.setItem("skuListCardId", 1217);
            } else if (data.skuList[0].specification.indexOf('旺季') > -1) {
              localStorage.setItem("skuListCardId", 1218);
            }
          }
          // this.handleWelsh(
          //   this.cardBuyDetailList && this.cardBuyDetailList.selfProduct && this.cardBuyDetailList.selfProduct.name,
          //   this.cardBuyDetailList && this.cardBuyDetailList.selfProduct && this.cardBuyDetailList.selfProduct.id
          // );
          dooolyAPP.initTitle('商品详情');
          for (let [index, elem] of data.imagesList.entries()) {
            this.imagesList.push({
              imagePath: elem
            });
          }
          this.showSellPrice = this.cardBuyDetailList.skuList[0].sellPrice;
          this.showMarketPrice = this.cardBuyDetailList.skuList[0].marketPrice;
          let inventory = this.cardBuyDetailList.skuList[0].inventory;
          this.specialStartDate =
            data.adGroupSelfProductPrice &&
            data.adGroupSelfProductPrice.specialStartDate;
          this.specialEndDate = data.adGroupSelfProductPrice && data.adGroupSelfProductPrice.specialEndDate;
          this.handleInventory(inventory);
          for (let [index, elem] of data.skuList.entries()) {
            if (elem.inventory > 0) {
              this.skuClick(index);
              break;
            }
          }
        } catch (error) {}
      });
    }
  }
};