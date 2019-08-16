import Clipboard from 'clipboard';
import http from '@/http/http';
import api from '@/assets/js/api.js';
import detailHeader from './detail_header/detail_header.vue';
import detailContent from './detail_content/detail_content.vue';

const myOrderDetail = {
  name: "myOrderDetail",
  data() {
    return {
      userId: localStorage.userId,
      id: this.$route.params.Id,
      showDetail: false,
      supplierOrder: {},
      isShowDetailHeader: false,
      timerId: null,
      minutes: 0,
      seconds: 0,
      productTypeFilter: {
        3: '/recharge/0/0',
        4: '/recharge/1/0',
        5: '/recharge/2/0',
        8: '/mobikeRecharge/',
        9: '/familyRecharge/',
        10: '/recharge/0/0'
      },
      countDownEnd: false,
      serviceTime: dooolyConfig.serviceTime,
    }
  },
  components: {
    detailHeader,
    detailContent
  },
  beforeCreate() {
    document.body.style.backgroundColor = "#f5f5f5";
  },
  beforeDestroy() {
  },
  created() {
    dooolyAPP.initTitle('我的订单-订单详情', '')
  },
  mounted() {
    this.queryOrderDetail();
  },
  methods: {
    queryOrderDetail(){
      let params = {
        userId: this.userId,
        orderId: this.id,
        token: localStorage.token,
      }
      http({
        method: 'post',
        url: api.getOrderDetail,
        data: params
      }).then((res) => {
        let dataObj = res.data.data;
        this.supplierOrder = dataObj;
        this.countDown(dataObj.orderDate, dataObj.systemDate);
        this.isShowDetailHeader = true;
        this.showDetail = true;
      });
    },
    countDown(orderDate, systemDate){
      if (!orderDate || !systemDate) return;
      this.minutes = 0;
      this.seconds = 0;
      orderDate = orderDate.replace(/\./g, '/');
      systemDate = systemDate.replace(/\./g, '/');
      let orderDateTim = Date.parse(orderDate);
      let systemDateTim = Date.parse(systemDate);
      let downDate = (orderDateTim - systemDateTim) + 900000;
      if (900000 <= downDate || downDate <= 0) {
        this.countDownEnd = true;
        return;
      };
      this.timerId = setInterval(() => {
        systemDateTim = systemDateTim + 300;
        downDate = (orderDateTim - systemDateTim) + 900000;
        if (900000 <= downDate || downDate <= 0) {
          this.minutes = 0;
          this.seconds = 0;
          clearInterval(this.timerId);
          this.countDownEnd = true;
          this.queryOrderDetail();
          return;
        }
        let dateObj = new Date(downDate);
        this.minutes = dateObj.getMinutes();
        this.seconds = dateObj.getSeconds();
      }, 300);
    },
    buyAgain(id, isSource, productId) { // 再次购买
      // 酷屏商品
      if (id && isSource !== 3) return this.jumpExternalLink(id);
      // 跳转到自营商品
      let productType = this.supplierOrder.productType;
      let jumpUrl = this.productTypeFilter[productType];
      if (!jumpUrl && productId) {
        let arr = productId.split('-');
        let proId = arr[0];
        if (proId) jumpUrl = '/cardBuyDetail/' + proId;
      }
      if (!jumpUrl) return this.$toast("找不到该商品");
      dooolyAPP.gotoJumpVue(this.$router, jumpUrl);
    },
    jumpExternalLink(id){
      http({
        method: 'get',
        url: api.getTargetUrl+"?businessId="+id+"&targetUrl="+"",
      }).then((result) => {
          if(result.data.code == 1000){
              dooolyAPP.gotoJumpJq(this.$router,result.data.resultUrl);
          }
          if(result.data.code == 1001){
            this.$toast("获取1号通跳转链接出错,请稍候重试!");
          }
        })
    },
    order_details(bid) {
      localStorage.selectedTab2 = 0;
      let url = "/myOrderList/0/" + bid;
      dooolyAPP.gotoJumpVue(this.$router, url);
    },
    keepBuying(orderNumber) {
      dooolyAPP.redirectPay(orderNumber)      
    },
    onlineService() {
      this.$toast('功能开发中');
    },
    callService() {
      this.$messageBox({
        title: '电话客服',
        message: '您可以拨打客服电话“400-158-2212”客服能更好的帮助你。('+dooolyConfig.serviceTime+')',
        confirmButtonText: '立即拨打',
        cancelButtonText: '取消',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          this.mobileCall();
        }
      });
    },
    mobileCall() {
      window.location.href = 'tel://400-158-2212';
    },
    copyBtn() {
      if (this.supplierOrder.cardPass) {
        let clipboard = new Clipboard('.copy_btn');
        clipboard.on('success', e => {
          this.$toast("卡密复制成功");
          let t = setTimeout(() => {
            this.clickDiv();
            clearTimeout(t);
          }, 1000);
          // 释放内存
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          let r = confirm("是否已经手动复制完成？")
          if (r) {
            this.clickDiv();
          }
          clipboard.destroy()
        });
      }
      else {
        this.clickDiv();
      }
    },
    clickDiv() {
      let newUrl = this.supplierOrder.duihuanUrl;
      let index = newUrl.indexOf('openOneNnumber');
      if (index > 0) {
        let id = newUrl.substring(index + 15, index + 17);
        let url = newUrl.substring(index + 18);
        dooolyAPP.gotoJumpVue(this.$router,'/openOneNnumber/'+id+'/'+encodeURIComponent(url));
      } else {
        window.location.href = newUrl;
      }
    }
  }
};

export default myOrderDetail;
