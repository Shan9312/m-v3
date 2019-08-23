import { Loadmore } from 'mint-ui';
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import orderItem from './order_item/order_item.vue';

const myOrderList = {
  name: "myOrderList",
  data() {
    return {
      hintState: '',
      userFlag: '',
      typeFilter: {
        '1': '已完成',
        '5': '已退货',
        '10': '待付款',
        '20': '待发货',
        '30': '已发货',
        '40': '已收货',
        '50': '确认收货',
        '99': '交易取消'
      },
      stateFilter: {
        '0': '待支付',
        '1': '已完成',
        '2': '已取消'
      },
      hintStateFilter: {
        '1': '0,1,2',
        '2': '0,2',
        '3': '1',
        '4': '2'
      },
      userFlagFilter: {
        '1': '0,1',
        '2': '0',
        '5': '1',
      },
      tabs: [
        {
          value: "全部",
          ifAdd: 0
        },
        {
          value: "最近下单", // 待付款
          ifAdd: 1
        },
        {
          value: "待支付", // 已完成
          ifAdd: 4
        },
        {
          value: "已完成", // 已取消
          ifAdd: 5
        }
      ],
      tab: "",
      type: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPage: "",
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      moreLoading: false,
      moreLoading2: true,
      firstLoading: true,
      bottomDistanceValue: 200,
      listData: [],
      amountListData: [],
      emptyList: false,
      new_total_year: "",
      new_total_month: "",
      detailCompanyName: "",
      detailOrderNum: "",
      popupVisible: false,
      businessId: this.$route.params.businessId,
      browserName: this.$browserName,
    }
  },
  components: {
    'v-loadmore': Loadmore,
    orderItem
  },
  beforeDestroy() {
    document.body.style.backgroundColor = "";
  },
  destroy() {
    document.body.style.backgroundColor = "";
  },
  created() {
    document.body.style.backgroundColor = "#f5f5f5";
    dooolyAPP.initTitle('我的订单', '')
  },
  mounted() {
    this.tab = this.$route.params.tab;
    this.type = parseInt(this.tab) + 1;
    this.hintState = this.hintStateFilter[this.type];
    this.userFlag = this.userFlagFilter[this.type];
    this.loadFirstPage();
  },
  computed: {
  },
  methods: {
    pageReload(data){
      if (data && (data.type === 'delete' || data.type === 'cancle')) {
        this.pageNumber = 1;
      }
      this.listData = [];
      this.amountListData = [];
      this.loadFirstPage(true);
    },
    loadFirstPage(isReload) {
      let params = {
        type: this.type,
        token: localStorage.token,
        userId: localStorage.userId,
        currentPage: this.pageNumber,
        pageSize: this.pageSize,
        timestamp: Date.now()
      };
      if (!isReload) {
        params.hintState = this.hintState;
        params.userFlag = this.userFlag;
      }
      if (this.businessId !== "all") {
        params.businessId = this.businessId;
      }
      this.queryOrderList(params, data => {
        let pageList = data.page || [];
        let orderDataList = data.orderDataList || [];
        this.moreLoading2 = false;
        this.totalPage = data.totalPage;
        if (!pageList || !pageList.length) {
          this.emptyList = true;
          this.listData = [];
          this.amountListData = [];
          this.allLoaded = false;
        } else {
          this.emptyList = false;
          this.listData = this.getNewlist(pageList);
          this.amountListData = orderDataList;
          if (this.pageNumber >= this.totalPage) {
            this.allLoaded = true;
          }
        }
      })
    },
    //组成新数组
    getNewlist: function (data) {
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        let curr_year = d.orderDate.substring(0, 4);//当前年份
        let curr_month = d.orderDate.substring(5, 7);//当前月份
        if (this.new_total_year + "-" + this.new_total_month != curr_year + "-" + curr_month) {
          d.showTitleHtml = true;
          this.new_total_year = curr_year;
          this.new_total_month = curr_month;
        } else {
          d.showTitleHtml = false;
        }
      }
      return data;
    },
    loadMore() {
      let noData = (!this.listData || !this.listData.length);
      if (noData) return;
      if (this.pageNumber < this.totalPage) {
        this.more();
        this.moreLoading = false;
      } else {
        this.allLoaded = !noData;
        this.emptyList = noData;
      }
    },
    queryOrderList(params, next){
      if (!params) return next({});
      http({
        method: 'post',
        url: api.getOrderList,
        data: params
      }).then((res) => {
        let dataObj = res.data.data || {};
        next(dataObj);
      }).catch(err => {
        next({});
      });
    },
    // 加载更多
    more() {
      this.pageNumber = this.pageNumber + 1;
      this.moreLoading2 = true;
      let params = {
        type: this.type,
        token: localStorage.token,
        userId: localStorage.userId,
        currentPage: this.pageNumber,
        pageSize: this.pageSize,
        timestamp: Date.now(),
        hintState: this.hintState,
        userFlag: this.userFlag
      };
      if (this.businessId !== "all") {
        params.businessId = this.businessId;
      }
      this.queryOrderList(params, data => {
        let pageList = data.page || [];
        if (!pageList || !pageList.length) {
          this.allLoaded = true;
        }
        let tempListData = [];
        tempListData = this.getNewlist(pageList);
        this.listData = this.listData.concat(tempListData);
      })
    },
    link: function (index) {
      let tableName = 'err table';
      if (index === 0) {
        tableName = '全部';
      } else if (index === 1) {
        tableName = '最近下单';
      } else if (index === 2) {
        tableName = '最近到账';
      } else if (index === 3) {
        tableName = '无返利';
      }
      this.$baiduStats('订单列表-' + tableName);
      this.tab = index;
      if (this.businessId == "all") {
        localStorage.selectedTab = index;
      } else {
        localStorage.selectedTab2 = index;
      }
      this.type = parseInt(index) + 1;
      this.hintState = this.hintStateFilter[this.type];
      this.userFlag = this.userFlagFilter[this.type];
      this.pageNumber = 1;
      this.listData = [];
      this.amountListData = [];
      this.new_total_year = "";
      this.new_total_month = "";
      this.emptyList = false;
      this.allLoaded = false;
      this.moreLoading = false;
      this.moreLoading2 = true;
      this.loadFirstPage();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "newHome" || to.name === "personalCenter") {
      localStorage.removeItem('selectedTab');
      localStorage.removeItem('selectedTab2');
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "newHome" || from.name == "personalCenter" || !from.name) {
      localStorage.removeItem('selectedTab');
      localStorage.removeItem('selectedTab2');
    }
    next();
  },
};

export default myOrderList;