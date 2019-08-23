<template>
  <div class="card-buy-order">
    <div v-if="loadingState" @touchmove.prevent class="alr_loading">
      <span class="loading_gif"></span>
    </div>
    <div class="line_bold"></div>
    <div class="main">
      <!-- 姓名 -->
      <div class="list_li list_li_minute clearfix">
        <div class="fl">姓名</div>
        <div class="center fl" :class="{input_view:deletePngState1||inputLength1}">
          <div
            v-if="deletePngState1||inputLength1"
            @click="deleteInputValue1()"
            class="input_delete"
          >
            <img src="../../assets/images/cardbuy/input_delete.png" />
          </div>
          <input
            id="name"
            type="text"
            maxlength="10"
            placeholder="请输入姓名"
            v-model="defaultDelivery.receiverName"
          />
        </div>
      </div>

      <!-- 手机号 -->
      <div class="list_li list_li_minute clearfix">
        <div class="fl">手机号码</div>
        <div class="center fl" :class="{input_view:deletePngState2||inputLength2}">
          <div
            v-if="deletePngState2||inputLength2"
            @click="deleteInputValue2()"
            class="input_delete"
          >
            <img src="../../assets/images/cardbuy/input_delete.png" />
          </div>
          <input
            id="tel"
            type="text"
            maxlength="11"
            placeholder="请输入手机号码"
            v-model="defaultDelivery.receiverTelephone"
            onkeyup="this.value=this.value.replace(/\D/g,'')"
            onafterpaste="this.value=this.value.replace(/\D/g,'')"
          />
        </div>
      </div>
    </div>

    <div class="line_bold"></div>
    <div class="company">
      <div class="clearfix picture_view">
        <div class="fl picture">
          <img :src="receiveData.img" />
        </div>
        <div class="fl price">
          <span class="name">{{receiveData.name}}</span>
          <br />
          <span class="type">规格：{{receiveData.specification}}</span>
          <br />
          <span>
            <span style="font-size:0.24rem;margin: 0;padding: 0;color:#ee3f44;">￥</span>
            <span
              style="display: inline;margin: 0;padding: 0;"
              class="sellPrice"
            >{{receiveData.sellPrice}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="line_bold"></div>

    <div class="list">
      <span class="fl">抵扣券</span>
      <span v-if="checkedCount>0" class="coupon-checked">{{"(已选"+checkedCount+"张)"}}</span>
      <span v-if="checkedCount<=0&&couponNum<=0" class="fr coupon-right">
        暂无可用
        <i class="icon iconfont">&#xe804;</i>
      </span>
      <span v-if="checkedCount>0" class="fr coupon-red">{{"-￥"+parseFloat(saveMoney).toFixed(2)}}</span>
      <span v-if="couponNum>0&&checkedCount<=0" @click="checkCoupon" class="fr coupon-red">
        {{couponNum+"张可用"}}
        <i class="icon iconfont">&#xe804;</i>
      </span>
    </div>

    <div class="line_bold"></div>

    <div v-if="saveMoney>0">
      <div class="list">
        <span class="fl">商品合计</span>
        <span class="fr money-right">
          <span>￥</span>
          {{parseFloat(receiveData.sellPrice).toFixed(2)}}
        </span>
      </div>
      <div class="line-separation"></div>
      <div class="list">
        <span class="fl">抵扣券</span>
        <span class="fr coupon-red">{{"-￥"+parseFloat(saveMoney).toFixed(2)}}</span>
      </div>
      <div class="line_bold"></div>
    </div>

    <div class="footer_bg"></div>
    <footer
      :class="{refer:defaultDelivery.receiverName!=''&&defaultDelivery.receiverTelephone!=''}"
    >
      <div class="fl">
        应付金额：
        <span>
          <span style="font-size:0.24rem;margin: 0;padding: 0;">￥</span>
          <span
            class="sellPrice"
          >{{saveMoney?parseFloat(receiveData.sellPrice-parseFloat(saveMoney)).toFixed(2):parseFloat(receiveData.sellPrice).toFixed(2)}}</span>
        </span>
      </div>
      <div class="fr" @click="refer()">确认提交</div>
    </footer>
  </div>
</template>

<script>
import bus from "@/components/common/bus";
import http from "@/http/http.js";
import api from "@/assets/js/api.js";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { checkMobile } from "@/assets/js/verify.js";
export default {
  name: "card-buy-order",
  data() {
    return {
      activityName:
        !this.$route.params.activityName || this.$route.params.activityName == 0
          ? ""
          : this.$route.params.activityName,
      defaultDelivery: {
        receiverName: localStorage.userName,
        receiverTelephone: localStorage.mobile
      },
      receiveData: "",
      deletePngState1: true,
      deletePngState2: true,
      loadingState: false,
      couponNum: 0, //可选抵扣券的数量
      saveMoney: localStorage.saveMoney,
      cardbuy2: "",
      checkindex: 0
    };
  },
  computed: {
    checkedCount() {
      if (this.saveMoney > 0) {
        return 1;
      } else {
        return 0;
      }
    },
    ...mapState(["cardbuy"]),
    inputLength1() {
      if (this.defaultDelivery.receiverName.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    inputLength2() {
      if (this.defaultDelivery.receiverTelephone.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== "coupon") {
      localStorage.removeItem("couponId");
      localStorage.removeItem("saveMoney");
    }
    next();
  },
  methods: {
    deleteInputValue1() {
      this.defaultDelivery.receiverName = "";
      this.deletePngState1 = false;
    },
    deleteInputValue2() {
      this.defaultDelivery.receiverTelephone = "";
      this.deletePngState2 = false;
    },
    refer() {
      if (!this.defaultDelivery.receiverName) {
        this.$toast("姓名不能为空");
        return;
      } else if (!this.defaultDelivery.receiverTelephone) {
        this.$toast("手机号不能为空");
        return;
      }
      var reg = /^[0-9a-zA-Z\u4e00-\u9fa5\s]{1,20}$/;
      if (!reg.test(this.defaultDelivery.receiverName)) {
        this.$toast("姓名只能输入中文,英文或数字");
        return;
      }
      if (checkMobile(this.defaultDelivery.receiverTelephone)) {
        this.$toast("手机号格式错误");
        return;
      }
      this.loadingState = true;
      let data = {
        userId: localStorage.userId,
        groupId: localStorage.groupId,
        consigneeName: this.defaultDelivery.receiverName,
        consigneeMobile: this.defaultDelivery.receiverTelephone,
        productType: this.receiveData.productType,
        // giftBagId: this.receiveData.giftBagId,
        orderType: this.receiveData.orderType,
        merchantProduct: [
          {
            couponId: localStorage.couponId,
            merchantId: this.receiveData.merchantProduct[0].merchantId,
            giftBagId: this.receiveData.giftBagId,
            remarks: "",
            productSku: [
              {
                productId: this.receiveData.merchantProduct[0].productSku[0]
                  .productId,
                skuId: this.receiveData.merchantProduct[0].productSku[0].skuId,
                productType: this.receiveData.productType,
                buyNum: 1
              }
            ]
          }
        ],
        redirectUrl: this.$allConfig.jumpDomain.cashier + "cardBuyPayResult/"
      };
      http({
        method: "post",
        url: api.createOrder_v2_2,
        notNeedTransfer: true,
        data: data
      })
        .then(res => {
          this.loadingState = false;
          if (res.data.code == 1000) {
            let orderNum = res.data.data.orderNum;
            if (
              this.activityName &&
              this.activityName !== "0" &&
              this.activityName !== "false"
            ) {
              let activityObj = {};
              activityObj[orderNum] = this.activityName;
              localStorage.activity = JSON.stringify(activityObj);
            }
            dooolyAPP.redirectPay(
              res.data.data.orderNum,
              "",
              res.data.data.zeroOrderFlag
            );
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(error => {
          this.loadingState = false;
        });
    },
    loadCoupon() {
      http({
        method: "get",
        url: api.getVoucherCouponNum + "?amount=" + this.receiveData.sellPrice
      }).then(res => {
        this.couponNum = res.data.couponNum;
      });
    },
    checkCoupon() {
      let url = "/coupon/" + 15;
      dooolyAPP.gotoJumpVue(this.$router, url);
    },
    loadCardBuyDetailList() {
      http({
        method: "post",
        url: api.detailForAjax,
        data: {
          userId: localStorage.userId,
          productId: this.$route.params.productId,
          activityName: this.$route.params.activityName,
          token: localStorage.token
        }
      }).then(res => {
        if (res.data.code == 1000) {
          res.data.data.skuList.forEach((item, index) => {
            if (item.id == this.$route.params.skuId) {
              this.checkindex = index;
            }
          });
          this.receiveData = {
            productType: this.$route.params.productTypeId,
            merchantProduct: [
              {
                merchantId: res.data.data.selfProduct.businessId,
                remarks: "",
                productSku: [
                  {
                    productId: res.data.data.selfProduct.id,
                    skuId: this.$route.params.skuId,
                    buyNum: 1
                  }
                ]
              }
            ],
            img: res.data.data.imagesList[0],
            name: res.data.data.selfProduct.name,
            specification: res.data.data.skuList[this.checkindex].specification,
            sellPrice: res.data.data.skuList[this.checkindex].sellPrice,
            giftBagId:
              !this.$route.params.giftBagId || this.$route.params.giftBagId == 0
                ? ""
                : this.$route.params.giftBagId,
            orderType: res.data.data.selfProduct.productAttr
          };
          if (!localStorage.saveMoney) {
            this.loadCoupon();
          }
        }
      });
    }
  },
  created() {
    // 禁止通过分享链接进入
    if (
      history.length <= 1 &&
      (this.activityName === "jianhangTicket" ||
        this.activityName === "jianhangTicketOther")
    )
      return dooolyAPP.redirectActivity("jianhangGiftEntry");
  },
  beforeDestroy() {
    localStorage.removeItem("couponId");
    localStorage.removeItem("saveMoney");
    localStorage.cardBuyOrdersellPrice = this.receiveData.sellPrice;
  },
  mounted() {
    dooolyAPP.initTitle("确认订单");
    if (this.$route.params.productId) {
      this.loadCardBuyDetailList();
    } else {
      this.receiveData = this.cardbuy;
    }
  }
};
</script>

<style scoped>
.card-buy-order {
  background: #f5f5f5;
}

@font-face {
  font-family: "iconfont";
  src: url("//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot");
  src: url("//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.woff") format("woff"),
    url("//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.svg#iconfont")
      format("svg");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 0.28rem;
  color: #999;
  padding-left: 0.3rem;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.coupon-red {
  color: #ee3f44;
}

.list {
  height: 0.98rem;
  background: #ffffff;
  font-size: 0.28rem;
  color: #333;
  line-height: 0.98rem;
  padding: 0 0.3rem;
}

.coupon-right {
  color: #999;
}

.coupon-checked {
  font-size: 0.24rem;
  color: #999999;
}

.money-right {
  color: #ee3f44;
  font-size: 0.32rem;
}

.money-right i {
  font-size: 0.24rem;
  font-style: normal;
  display: inline;
}

.line-separation {
  height: 1px;
  background: #ececec;
  margin: 0 0.3rem;
  box-sizing: border-box;
}
.line_bold {
  width: 100%;
  height: 0.2rem;
  background: #f5f5f5;
}
.line_minute {
  width: 100%;
  height: 1px;
  background: #ececec;
}
input[type="button"] {
  line-height: 100%;
}
a {
  text-decoration: none;
  color: #333;
}
#distpicker1.gray,
#store_name1.gray,
#distpicker2.gray,
#store_name2.gray {
  color: #999;
}
/*地址*/
.top {
  width: 100%;
  height: 0.12rem;
  background: url(../../assets/images/cardbuy/order_top.png) 0 0;
  background-size: 100%;
}
header {
  background: #fff;
  padding: 0.4rem 0.3rem 0.3rem 0.3rem;
}
header .fl {
  font-size: 0.28rem;
  color: #333;
  width: 6.5rem;
}
header.add .fl {
  line-height: 0.78rem;
}
header .fr {
  font-size: 0;
  padding-top: 0.26rem;
}
header .fr img {
  width: 0.16rem;
}
header .fl span {
  display: inline-block;
  line-height: 100%;
}
header .fl .name {
  margin-bottom: 0.15rem;
}
header .fl .address {
  line-height: 120%;
}
header .fl .tel {
  font-size: 0.28rem;
  margin: 0;
  padding: 0;
}

/*主体表单部分*/
.main {
  background: #fff;
  padding: 0 0.3rem;
}
.main .list_li {
  border-top: 1px solid #ececec;
  font-size: 0.28rem;
  color: #333;
}
.main .list_li:first-child {
  border: 0;
}
.main .list_li_minute {
  line-height: 0.97rem;
}
.main .option .fr {
  font-size: 0;
  line-height: 0;
  padding-top: 0.36rem;
}
.main .option .fr img {
  width: 0.16rem;
}
.main .list_li .center input {
  background: transparent;
  text-align: left;
  width: 5.44rem;
  outline: none;
  text-indent: 0.6rem;
  font-size: 0.28rem;
}
.main .option .center input {
  background: transparent;
  text-align: right;
  margin: 0;
  margin-right: 0.3rem;
  width: 4.5rem;
}
.main .option .center span {
  display: inline-block;
  text-align: right;
  margin: 0;
  margin-right: 0.3rem;
  width: 4.5rem;
  line-height: 120%;
  font-size: 0.28rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.main .list_li_minute .fl:first-child {
  width: 1.42rem;
}
.main .picture {
  height: 1.6rem;
  line-height: 1.6rem;
  padding: 0.4rem 0;
}
.main .picture .center {
  margin-left: 0.6rem;
  width: 1.6rem;
  height: 1.6rem;
  background: #f5f5f5 url(../../assets/images/cardbuy/picture_add.png) no-repeat
    0.6rem 0.42rem;
  background-size: 0.4rem 0.4rem;
  font-size: 0;
}
.main .picture .center span {
  display: inline-block;
  width: 100%;
  font-size: 0.24rem;
  color: #999;
  margin-top: 0.93rem;
  text-align: center;
  line-height: 100%;
}
.main .picture .center img {
  width: 100%;
  height: 100%;
}

/*底部商品信息*/
.company {
  background: #fff;
}
.company .title {
  font-size: 0.24rem;
  color: #666;
  padding: 0.16rem 0.3rem 0.24rem 0.3rem;
  line-height: 100%;
  background: #f5f5f5;
}
.company .title span {
  display: inline-block;
  color: #ee3f44;
}
.company .picture_view {
  margin: 0 0.3rem;
  padding: 0.3rem 0;
}
.company .picture_view .picture {
  width: 1.6rem;
  height: 1.6rem;
  margin-right: 0.2rem;
}
.company .picture_view .picture img {
  width: 100%;
  height: 100%;
}
.company .price {
  font-size: 0;
}
.company .price span {
  display: inline-block;
  line-height: 100%;
  color: #999;
  font-size: 0.24rem;
  margin-top: 0.2rem;
}
.company .price span:first-child {
  color: #333;
  font-size: 0.28rem;
  margin-top: 0.1rem;
}
.company .price span:last-child {
  color: #ee3f44;
  font-size: 0.28rem;
  margin-top: 0.46rem;
}
.company .freight {
  border-top: 1px solid #ececec;
  margin: 0 0.3rem;
}
.company .freight div {
  line-height: 0.98rem;
  font-size: 0.28rem;
  color: #333;
}

/*底部提交按钮*/
footer {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 1rem;
  line-height: 1rem;
  border-top: 1px solid #ececec;
  font-size: 0.3rem;
  width: 100%;
  background: #fff;
}
footer div {
  height: 100%;
}
footer .fl {
  color: #333;
  padding-left: 0.3rem;
}
footer .fl span {
  color: #ee3f44;
}
footer .fr {
  background: #ccc;
  color: #fff;
  width: 3rem;
  text-align: center;
}
footer.refer .fr {
  background: #ee3f44;
}

/*门店选择列表*/
.store_list_bg {
  display: none;
  z-index: 9999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.store_list_bg .store_list {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8.9rem;
  width: 100%;
  background: #fff;
  font-size: 0.28rem;
  color: #333;
}
.store_list_bg .store_list .close {
  position: absolute;
  right: 0.4rem;
  top: 0.3rem;
  width: 0.2rem;
  height: 0.2rem;
}
.store_list_bg .store_list .close img {
  width: 100%;
}
.store_list_bg .store_list .title {
  text-align: center;
  margin-top: 0.26rem;
  line-height: 100%;
  margin-bottom: 0.48rem;
}
.store_list_bg .store_list .address {
  margin-bottom: 0.3rem;
  padding: 0 0.2rem;
  font-size: 0;
}
.store_list_bg .store_list .address span {
  font-size: 0.28rem;
}
.store_list_bg .store_list .address .check {
  color: #ee3f44;
}
.store_list_bg .store_list .address b {
  display: inline-block;
  height: 0.2rem;
  width: 0.02rem;
  background: #ccc;
  margin: 0 0.2rem;
}
.store_list_bg .store_list ul {
  height: 7.33rem;
  overflow: scroll;
}
.store_list_bg .store_list ul li {
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.2rem;
  border-bottom: 1px solid #ececec;
}

/*iframe弹出*/
iframe {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  border: 0;
}
body.hidden {
  overflow: hidden;
}

.store2 {
  display: none;
}

.alr_loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: none;
}
.alr_loading img {
  width: 1rem;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -0.5rem;
  margin-left: -0.5rem;
}

.hidden {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.input_view {
  position: relative;
}
.input_view .input_delete {
  position: absolute;
  right: 0;
  top: 50%;
  height: 0.32rem !important;
  width: 0.32rem !important;
  font-size: 0 !important;
  margin: 0 !important;
  margin-top: -0.16rem !important;
  padding: 0 !important;
  line-height: 100% !important;
}
.input_view .input_delete.lod {
  display: block;
}
.input_delete img {
  height: 100% !important;
  width: 100% !important;
}

.data_bg {
  display: none;
  z-index: 9999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.data_bg .data {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 8.9rem;
  width: 100%;
  background: #fff;
  font-size: 0.28rem;
  color: #333;
}
.data_bg .data .close {
  position: absolute;
  right: 0.4rem;
  top: 0.3rem;
  width: 0.2rem;
  height: 0.2rem;
}
.data_bg .data .close img {
  width: 100%;
}
.data_bg .data .title {
  text-align: center;
  margin-top: 0.26rem;
  line-height: 100%;
  margin-bottom: 0.48rem;
}
.data_bg .data .address {
  margin-bottom: 0.3rem;
  padding: 0 0.2rem;
  font-size: 0;
}
.data_bg .data .address span {
  font-size: 0.28rem;
}
.data_bg .data .address .check {
  color: #ee3f44;
}
.data_bg .data .address b {
  display: inline-block;
  height: 0.2rem;
  width: 1px;
  background: #ccc;
  margin: 0 0.2rem;
}
.data_bg .data ul {
  height: 7.33rem;
  overflow: scroll;
}
.data_bg .data ul li {
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.2rem;
  border-top: 1px solid #ececec;
}
</style>
