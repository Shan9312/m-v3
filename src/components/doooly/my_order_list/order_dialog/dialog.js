import api from '@/assets/js/api.js';
import http from '@/http/http.js';

const orderDialog = {
  props: {
    popupVisible: Boolean,
    type: String, // 必需
    tipsTitle: String, // 必需
    detailCompanyName: null, // 必需
    detailOrderNum: null,
    detailOrderId: null,
    hintState: String
  },
  data(){
    return {
      userId: localStorage.userId,
    }
  },
  created(){
  },
  methods: {
    close_btn: function () {
      this.$emit('changePopupVisible', false);
    },
    affirm_btn: function () {
      this.$emit('changePopupVisible', false);
      if (this.type === 'orderCancel') {
        this.cancleOrder();
      } else if(this.type === 'orderDelete'){
        this.deleteOrder();
      }
    },
    cancleOrder(){
      let url = api.cancleOrder_v2;
      http({
        method: 'post',
        url: url,
        data: {
          userId: this.userId,
          orderNum: this.detailOrderNum,
          token: localStorage.token
        }
      }).then((res) => {
        if (res.data.code == '1000') {
          this.$emit('pageReload', {type: 'cancle'});
        } else {
          this.$toast("您当前这笔记录不能取消");
        }
      }
      );
    },
    deleteOrder(){
      let url = api.orderDelete;
      http({
        method: 'post',
        url: url,
        data: {
          userId: this.userId,
          orderId: this.detailOrderId,
          hintState: this.hintState
        }
      }).then((res) => {
        if (res.data.code == '1000') {
          this.$emit('pageReload', {type: 'delete'});
        } else {
          this.$toast("您当前这笔记录不能删除");
        }
      });
    },
  }
};
export default orderDialog;