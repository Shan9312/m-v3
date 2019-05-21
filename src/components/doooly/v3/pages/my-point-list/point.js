import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import { cannelUserFlag } from 'v3/services';
export default {
  name: 'myPointList',
  data() {
    return {
      firstPointText: '可用积分',
      secondPointText: '即将可用',
      availablePoint: '',
      returnPoint: '',
      recentArrivalIntefral: '',
      isShow: true,
      isPointfrist: false,
      tabs: [
        {
          value: '收入记录',
          ifAdd: 0,
          content: '收入'
        },
        {
          value: '支出记录',
          ifAdd: 1,
          content: '支出'
        }
      ],
      browserName: browserName,
      tab: '0',
      mainPointList: true,
      noRecords: false,
      pageNumber: 1,
      pageSize: 10,
      pointType: this.$route.params.pointType,
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      loadContainerState: false,
      scrollMode: 'auto', //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      loadFinish: false,
      bottomDistanceValue: 70,
      listData: [],
      remindingText: '',
      income: 1,
      isLoading: true,
      isbig_small: true,
      defaultImg:
        'this.src="' +
        require('@/assets/images/shoppingGuide/goods.png') +
        '"'
    };
  },
  created() {
    initTitle('我的积分', '');
  },
  mounted() {
    this.vmCannelUserFlag();
    http({
      method: 'get',
      url: api.myPoint + '?token=' + localStorage.token
    }).then(res => {
      this.availablePoint = res.data.availablePoint;
      this.returnPoint = res.data.returnPoint;
      this.recentArrivalIntefral = res.data.recentArrivalIntefral;
    });
    if (this.pointType == 1) {
      //可用积分
      this.isShow = true;
      this.isbig_small = true;
      this.income = 1;
      this.remindingText = '收入记录呢';
      this.secondPointText = '最近到账';
    } else if (this.pointType == 3) {
      this.isShow = false;
      this.remindingText = '即将过期的积分哦';
      this.secondPointText = '即将过期';
    } else {
      //即将可用
      this.pointType = 2;
      this.isShow = false;
      this.isbig_small = false;
      this.income = 0;
      this.remindingText = '待返记录呢';
    }
    this.loadFirstPage();
  },
  methods: {
    vmCannelUserFlag() {
      let userFlag = '';
      userFlag = this.pointType == 1 ? '2' : '3';
      cannelUserFlag(userFlag);
    },
    pointUrl: function(token, pageNumber, pageSize, pointType, income) {
      return (
        api.myPointList +
        '?token=' +
        token +
        '&pageNumber=' +
        pageNumber +
        '&pageSize=' +
        pageSize +
        '&pointType=' +
        pointType +
        '&income=' +
        income
      );
    },
    loadFirstPage() {
      http({
        method: 'get',
        url: this.pointUrl(
          localStorage.token,
          this.pageNumber,
          this.pageSize,
          this.pointType,
          this.income
        )
      }).then(res => {
        this.listData = res.data.adAvailablePoints;
        if (this.listData != undefined) {
          this.mainPointList = true;
          this.noRecords = false;
          this.isLoading = true;
          if (this.pageNumber >= res.data.countPage) {
            this.allLoaded = true;
            this.loadContainerState = true;
            this.isLoading = false;
          }
        } else {
          this.mainPointList = false;
          this.noRecords = true;
          this.isLoading = false;
        }
      });
      this.$nextTick(function() {
        this.scrollMode = 'touch';
      });
    },
    more() {
      this.pageNumber = this.pageNumber + 1;
      http({
        method: 'get',
        url: this.pointUrl(
          localStorage.token,
          this.pageNumber,
          this.pageSize,
          this.pointType,
          this.income
        )
      }).then(res => {
        this.isLoading = true;
        if (this.pageNumber >= res.data.countPage) {
          this.allLoaded = true;
          this.loadContainerState = true;
          this.isLoading = false;
        }
        this.listData = this.listData.concat(res.data.adAvailablePoints);
      });
    },
    usable_link: function(pointType, income) {
      this.listData = [];
      this.tab = 0;
      if (pointType == 1) {
        //可用积分
        this.isShow = true;
        this.remindingText = '收入';
        this.$baiduStats('我的积分-收入记录');
      } else {
        //即将可用
        this.isShow = false;
        this.remindingText = '待返';
        this.$baiduStats('我的积分-即将可用');
      }
      this.pointType = pointType;
      this.income = income;
      this.loadFirstPage();
    },
    // 上拉加载
    loadBottom() {
      if (!this.isLoading) {
        return;
      }
      this.more(); // 上拉触发的分页查询
    },
    link: function(index, content) {
      this.listData = [];
      this.allLoaded = false;
      this.loadContainerState = false;
      this.pageNumber = 1;
      this.income = index + 1;
      this.tab = index;
      this.remindingText = content;
      this.isLoading = true;
      this.loadFirstPage();
      if (index == 0) {
        this.$baiduStats('我的积分-收入记录');
      } else {
        this.$baiduStats('我的积分-支出记录');
      }
    },
    businessDetail: function(itemId, itemPointType) {
      //关闭新手引导
      if (browserName == 'WebKit') {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('false');
      } else if (browserName == 'Chrome WebView') {
        RHNativeJS.setTopDialog(false);
        RHNativeJS.visablePtrFrame(true);
      }
      let jumpUrl = '/myPointDetail/' + itemId + '/' + itemPointType;
      dooolyAPP.gotoJumpVue.call(this, jumpUrl);
    },
    //判断是否是第一次进入
    beforeCreate() {
      document.body.style.backgroundColor = '#f5f5f5';
    },
    beforeDestroy() {
      document.body.style.backgroundColor = '';
    },
    appeal: function() {
      let jumpUrl = '/pointsService';
      dooolyAPP.gotoJumpVue.call(this, jumpUrl);
    }
  }
};
