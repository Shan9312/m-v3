<template>
  <div class="recharge_activity">
    <div class="activity_header">
      <p>{{ phoneNumber }}</p>
      <!-- <br/> -->
      <p class="highlight">{{ operator }}</p>
    </div>
    <!-- 卡片 -->
    <div class="activity_card">
      <div class="card">
        <img src="../../../assets/images/recharge/fri_card.png" alt />
        <div class="price_wrap">
          <p>
            <b>{{activityData.sellPrice || 0}}</b>元
            <br />
            <span>
              售价
              <b>{{activityData.specialPrice || 0}}</b>元
            </span>
          </p>
          <i></i>
        </div>
      </div>
      <div
        class="card_btn activity_start"
        @click="rechargeRefer()"
        v-if="activityStatus === '2' && activityData.inventory > 0"
      >立即充值</div>
      <div class="card_btn" v-else>
        <!-- {{ activityStatus === '2' ? '本轮已抢完' : '每周五14:00准时开抢' }} -->
        {{ errMsg }}
      </div>
    </div>
    <!-- 充值说明 -->
    <div class="activity_explain">
      <p class="explain_title">充值使用说明</p>
      <ul>
        <li>1、每个号码每周仅可充值一次。</li>
        <li>2、活动时间每周五14:00-17:00。</li>
        <li>3、该活动限充值档次使用。</li>
        <li>4、充值仅限本机号码使用。</li>
        <li>5、非活动期间页面不可充值。</li>
        <li>6、活动当天限量100名，加赠或减免的金额当天到账。</li>
        <li>7、仅限移动、联通、电信号码参与，互联网账号、异网账号不能参与活动。</li>
        <li>8、本活动不可与其他优惠叠加享受，活动期间有可能更新充值档次，以实际展示为准。</li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "@/assets/js/api.js";
import http from "@/http/http.js";
import { checkOperator } from "@/assets/js/verify.js";
export default {
  name: "rechargeRule",
  data() {
    return {
      activityName: this.$route.params.type || "",
      phoneNumber: "",
      operator: "",
      toRecharge: {},
      errMsg: "每周五14:00准时开抢",
      activityStatus: 1,
      activityData: {} // 活动数据
    };
  },
  created() {
    initTitle("话费充值", "");
    this.initData();
    this.queryToRecharge();
    this.queryActivityInfo();
  },
  methods: {
    initData() {},
    queryActivityInfo(next) {
      let params = {
        activityName: this.activityName,
        userId: localStorage.userId,
        groupId: localStorage.groupId
      };
      http({
        method: "post",
        url: api.getRechargeActivity,
        data: params
      }).then(res => {
        let data = res.data || {};
        this.activityData = data.data.adGroupSelfProductPrice || {};
        this.activityStatus = this.activityData.isStart;
        if (this.activityStatus === "2" && this.activityData.inventory <= 0) {
          this.errMsg = "本轮已抢完";
        } else if (this.activityStatus === "4") {
          this.errMsg = "每个用户每周仅可充值一次";
        } else {
          this.errMsg = "每周五14:00准时开抢";
        }
        if (next) {
          next();
        }
      });
    },
    rechargeRefer() {
      this.$baiduStats("活动-话费充值页-周五充值活动-立即充值");
      this.queryActivityInfo(() => {
        if (this.activityStatus === "2" && this.activityData.inventory > 0) {
          this.createOrder();
        } else {
          this.$toast(this.errMsg);
        }
      });
    },
    createOrder() {
      let params = {
        groupId: localStorage.groupId,
        userId: localStorage.userId,
        couponId: null,
        consigneeName: this.phoneNumber,
        consigneeMobile: this.phoneNumber,
        productType: 10,
        merchantProduct: [
          {
            merchantId: this.activityData.businessId,
            remarks: "",
            productSku: [
              {
                productType: 10,
                productId: this.activityData.produceId,
                skuId: this.activityData.skuId,
                buyNum: 1
              }
            ]
          }
        ],
        redirectUrl: dooolyAPP.redirectPayResult()
      };
      http({
        method: "post",
        url: api.createOrder_v2_2,
        notNeedTransfer: true,
        data: params
      }).then(data => {
        if (data.data.code === "1000") {
          if (res.data.data.zeroOrderFlag) {
            // 若返回的zeroOrderFlag 为true，则表示 0元支付，直接跳转支付结果页
            dooolyAPP.redirectPay(res.data.data.orderNum, "", "1");
          } else {
            dooolyAPP.redirectPay(data.data.data.orderNum);
          }
        } else if (data.data.msg) {
          this.$toast(data.data.msg);
        } else {
          this.$toast("小兜兜现在正忙，请稍候重试");
        }
      });
    },
    queryToRecharge() {
      http({
        method: "get",
        url: api.toRecharge,
        notNeedTransfer: true
      }).then(data => {
        this.toRecharge = data.data || {};
        this.phoneNumber = this.toRecharge.mobile;
        this.filterOperator(checkOperator(this.phoneNumber));
      });
    },
    filterOperator(item) {
      if (item == "cmcc") {
        this.operator = "中国移动";
      } else if (item == "cucc") {
        this.operator = "中国联通";
      } else if (item == "ctcc") {
        this.operator = "中国电信";
      } else {
        this.operator = "";
      }
    }
  }
};
</script>

<style scoped>
.activity_header {
  padding: 0.4rem 0.3rem 0.24rem 0.3rem;
  border-bottom: 1px solid #ececec;
}
.activity_header p {
  font-size: 0.4rem;
  color: #333;
}
.activity_header .highlight {
  font-size: 0.24rem;
  color: #c24c5a;
}
/* activity_card */
.activity_card {
  margin: 0 0.3rem;
  padding: 0.48rem 0 0.35rem;
  border-bottom: 1px solid #ececec;
}
.activity_card .card {
  position: relative;
  margin-bottom: 0.2rem;
  border-radius: 10px;
}
.activity_card .card img {
  vertical-align: middle;
}
.activity_card .card p {
  text-align: center;
  font-size: 0.6rem;
  color: #f54100;
}
.activity_card .card p span {
  font-size: 0.45rem;
  font-weight: normal;
}
.price_wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
}
/* card 多行文字垂直居中对齐  兼容 */
.card {
  font-size: 0;
}
.card p,
.card i {
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  *display: inline;
  *zoom: 1;
}
.card i {
  height: 100%;
  width: 0;
}
.card p {
  width: 100%;
}
/* card 多行文字垂直居中对齐  兼容 */
.activity_card .card_btn {
  height: 0.94rem;
  font-size: 0.32rem;
  text-align: center;
  line-height: 0.94rem;
  color: #fff;
  background-color: #a0a0a0;
  border-radius: 5px;
}
.activity_card .card_btn.activity_start {
  background-color: #f54100;
}
/* 充值说明 */
.activity_explain {
  margin: 0 0.3rem;
  padding-top: 0.35rem;
}
.activity_explain .explain_title {
  margin-bottom: 0.16rem;
  font-size: 0.32rem;
  color: #616161;
}
.activity_explain ul li {
  line-height: 0.45rem;
  font-size: 0.24rem;
  color: #a5a5a5;
}
</style>
