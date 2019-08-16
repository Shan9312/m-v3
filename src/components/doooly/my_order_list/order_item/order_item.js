import orderDialog from '../order_dialog/dialog.vue';
import defaultImg from '@/assets/images/shoppingGuide/goods.png';
import { countRebateState } from '../model/rebate.js';

const orderItem = {
  props: {
    item: Object,
    amountListData: Array,
    hintState: String
  },
  data(){
    return {
      typeFilter: {
        '1': '已完成',
        '5': '已退货',
        '10': '待支付',
        '20': '待发货',
        '30': '已发货',
        '40': '已收货',
        '50': '确认收货',
        '99': '已取消' // 交易取消
      },
      stateFilter: {
        '0': '待支付',
        '1': '已完成',
        '2': '已取消'
      },
      defaultImg: 'this.src="' + defaultImg + '";this.onerror=null',
      detailCompanyName: '',
      detailOrderNum: '',
      orderId: '',
      type: '',
      tipsTitle: '',
      popupVisible: false
    }
  },
  components: {
    orderDialog
  },
  created(){
  },
  methods: {
    rebateReturnMsg(isUserRebate, userRebate, type) {
      let rebateState = countRebateState(isUserRebate, userRebate, type);
      let resultMsg = '';
      if (rebateState === 1) { // 已完成-已返利
        resultMsg = '返' + userRebate.toFixed(2) + '积分';
      } else if (rebateState === 2) { // 已完成-预返利
        resultMsg = '返' + userRebate.toFixed(2) + '积分';
      } else if (rebateState === 3) { // 待支付-预返积分
        resultMsg = '预计返' + userRebate.toFixed(2) + '积分';
      } else if (rebateState === 4) { // 待支付-无返积分
        resultMsg = '无返积分';
      } else if (rebateState === 5) { // 已完成-无返积分
        resultMsg = '无返积分';
      } else if (rebateState === 6) { // 已取消-无返积分
        resultMsg = '无返积分';
      } else {
        resultMsg = '无返积分';
      }
      return resultMsg
    },
    rebateReturnTime(isUserRebate, userRebate, type, integrateReturnDate) {
      let rebateState = countRebateState(isUserRebate, userRebate, type);
      let resultMsg = '';
      if (rebateState === 1) { // 已完成-已返利
        resultMsg = integrateReturnDate + '积分到账';
      } else if (rebateState === 2) { // 已完成-预返利
        resultMsg = '预计' + integrateReturnDate + '发放积分';
      } else if (rebateState === 3) { // 待支付-预返积分
        resultMsg = '支付完成后计算积分到账时间';
      } else if (rebateState === 4) { // 待支付-无返积分
        resultMsg = '根据商家规则，无返利';
      } else if (rebateState === 5) { // 已完成-无返积分
        resultMsg = '根据商家规则，无返利';
      } else if (rebateState === 6) { // 已取消-无返积分
        resultMsg = '未完成交易订单无返利';
      } else {
        resultMsg = '根据商家规则，无返利';
      }
      return resultMsg
    },
    order_Detail: function (id) {
      this.$baiduStats('订单列表-查看订单详情');
      dooolyAPP.gotoJumpVue(this.$router, '/myOrderDetail/' + id);
    },
    orderDelete(companyName, orderId){
      this.$baiduStats('订单列表-删除订单');
      this.type = 'orderDelete';
      this.tipsTitle = "确认删除该订单？";
      this.detailCompanyName = companyName;
      this.orderId = orderId;
      this.popupVisible = true;
    },
    order_cancel: function (companyName, orderNumber) {
      this.$baiduStats('订单列表-取消订单');
      this.type = 'orderCancel';
      this.tipsTitle = '确认取消该订单？';
      this.detailCompanyName = companyName;
      this.detailOrderNum = orderNumber;
      this.popupVisible = true;
    },
    order_payment: function (orderNumber) {
      this.$baiduStats('订单列表-继续支付');
      this.detailOrderNum = orderNumber;
      this.popupVisible = false;
      dooolyAPP.redirectPay(orderNumber) 
    },
    changePopupVisible(boolean){
      this.popupVisible = boolean;
    },
    pageReload(data){
      this.$emit('pageReload', data);
    }
  }
};
export default orderItem;