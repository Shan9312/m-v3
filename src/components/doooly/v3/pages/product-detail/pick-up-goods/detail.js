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
  computed: {
  },
  beforeCreate() {
    document.body.style.backgroundColor = '#fff';
  },
  beforeDestroy() {
  },
  mounted() {
    window.addEventListener('scroll', this.menu);
  },
  created() {
    this.loadCardBuyDetailList();
    this.getIsReceive();
    if (browserName == 'Chrome WebView') {
      // 在安卓app中优化轮播图禁用下拉刷新
      RHNativeJS.visablePtrFrame(false);
    }
  },
  methods: {
    countdownRun(){
      clearInterval(this.countdownId);
      if (this.isStart || this.isEnd) {
        return;
      };
      this.countdownId = setInterval(() => {
        let obj = this.countdown(this.specialStartDate, this.serverDate);
        if (obj.hours <= 0 && obj.minutes <= 0 && obj.seconds <= 0) {
          window.location.reload();
          clearInterval(this.countdownId);
          this.isStart = true;
          return;
        }
        // adGroupSelfProductPrice undefined
        if (obj.hours === undefined && obj.minutes === undefined && obj.seconds === undefined) return this.countdownTim = '';
        this.countdownTim = `倒计时：${obj.hours || 0}:${obj.minutes || 0}:${obj.seconds || 0}`;
      }, 300);
    },
    countdown(dateTim, serverDate) {
      if (typeof dateTim !== 'number') return {};
      var hours = 0,
        minutes = 0,
        seconds = 0;
      seconds = (dateTim - serverDate) / 1000;
    
      hours = Math.floor(seconds / 3600);
      seconds = seconds % 3600;
      minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      seconds = Math.floor(seconds);
    
      // 添加0
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
    
      return {
        hours,
        minutes,
        seconds
      };
    },
    watchEndDate(){
      this.watchEndId = setInterval(() => {
        this.serverDate = this.serverDate + 300;
        if (this.specialEndDate <= this.serverDate) {
          this.isEnd = true;
          clearInterval(this.watchEndId);
        }
      }, 300);
    },
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
    // 获取服务器当前时间
    getServer() {
      http({
        url: api.getCurrentTime + '?token=' + localStorage.token,
        method: 'get'
      }).then(res => {
        let serverDate = 0;
        if (res.data && res.data.currentTime) {
          serverDate = res.data.currentTime;
          this.isEnd = this.specialEndDate && this.specialEndDate <= serverDate;
          this.isStart =
            this.specialStartDate && this.specialStartDate <= serverDate;
        }
        this.serverDate = serverDate;
        this.watchEndDate();
        this.countdownRun();
      });
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
    order(flag) {
      if (!this.isStart && this.activityName) {
        return;
      }
      if (this.isEnd) {
        return;
      }
      if (this.inventory == 0 || this.isReceive == 1) {
        return;
      }
      if (flag && this.isError) {
        return this.$toast(this.errMsg);
      }
      this.postData = {
        productType: this.cardBuyDetailList.productTypeList[this.proIndex].id,
        merchantProduct: [
          {
            merchantId: this.cardBuyDetailList.selfProduct.businessId,
            remarks: '',
            productSku: [
              {
                productId: this.cardBuyDetailList.selfProduct.id,
                skuId: this.cardBuyDetailList.skuList[this.skuIndex].id,
                buyNum: 1
              }
            ]
          }
        ],
        img: this.cardBuyDetailList.imagesList[0],
        name: this.cardBuyDetailList.selfProduct.name,
        specification: this.cardBuyDetailList.skuList[this.skuIndex]
          .specification,
        sellPrice: this.showSellPrice,
        giftBagId: this.giftBagId,
        orderType: this.cardBuyDetailList.selfProduct.productAttr
      };
      if (this.postData.productType == 1) {
        this.$router.push({ path: '/orderInfo_entity' });
      } else if (this.postData.productType === '11') {
        // productType: 11 机场活动实物商品
        if (this.activityName) {
          dooolyAPP.gotoJumpVue.call(
            this,
            '/confirm_order/' +
              this.activityName +
              '/' +
              this.cardBuyDetailList.selfProduct.id +
              '/' +
              this.cardBuyDetailList.skuList[this.skuIndex].id +
              '/0/' +
              this.cardBuyDetailList.productTypeList[this.proIndex].id
          );
        } else {
          dooolyAPP.gotoJumpVue.call(
            this,
            '/confirm_order/0/' +
              this.cardBuyDetailList.selfProduct.id +
              '/' +
              this.cardBuyDetailList.skuList[this.skuIndex].id +
              '/0/' +
              this.cardBuyDetailList.productTypeList[this.proIndex].id
          );
        }
      } else {
        if (this.activityName) {
          dooolyAPP.gotoJumpVue.call(
            this,
            '/cardBuyOrder/' +
              this.activityName +
              '/' +
              this.cardBuyDetailList.selfProduct.id +
              '/' +
              this.cardBuyDetailList.skuList[this.skuIndex].id +
              '/0/' +
              this.cardBuyDetailList.productTypeList[this.proIndex].id
          );
        } else {
          dooolyAPP.gotoJumpVue.call(
            this,
            '/cardBuyOrder/0/' +
              this.cardBuyDetailList.selfProduct.id +
              '/' +
              this.cardBuyDetailList.skuList[this.skuIndex].id +
              '/0/' +
              this.cardBuyDetailList.productTypeList[this.proIndex].id
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
      let params = {
        userId: localStorage.userId,
        productId: this.$route.params.productId,
        activityName: this.activityName,
        token: localStorage.token
      };
      http({
        method: 'post',
        data: params,
        url: api.detailForAjax
      }).then(res => {
        try {
          this.getServer(); // 请求服务器时间
          let data = res.data.data;
          this.cardBuyDetailList = data;
          this.handleWelsh(
            this.cardBuyDetailList && this.cardBuyDetailList.selfProduct && this.cardBuyDetailList.selfProduct.name,
            this.cardBuyDetailList && this.cardBuyDetailList.selfProduct && this.cardBuyDetailList.selfProduct.id
          );
          initTitle('商品详情');
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
    },
    getIsReceive() {
      if (this.isReceive === undefined && this.giftBagId === undefined) {
        return false;
      }
      http({
        method: 'post',
        url: api.giftBagIsReceive,
        data: {
          userId: localStorage.userId,
          giftBagId: this.giftBagId,
          productSkuIds: this.$route.params.skuId
        }
      }).then(res => {
        let data = res.data;
        if (data) {
          let code = data.code;
          if (code !== 1000) {
            this.isError = true;
            this.errMsg = data.info;
          }
        }
      });
    }
  }
};
