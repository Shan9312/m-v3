<template>
  <div class="order-detail-wrraper">
    <!-- 商品信息 -->
    <section>
      <div class="order-msg msg-box">
        <h2 class="title">{{productName}}</h2>
        <p class="order-date">游玩日期</p>
        <div class="order-date-box">
          <p
            class="order-date-item"
            v-for="(item,index) in dayList"
            :key="index"
            :class="{selected:selectedDay === item.nowDay}"
            @click="handleChoose(item)"
          >{{item.nowDay}}</p>
          <p class="order-date-item more-date" @click="handleSelectDate('1')" v-if="isShowMore">
            更多日期
            <img src="@/assets/images/rg-row.png" class="icon" alt />
          </p>
          <p
            class="order-date-item"
            @click="handleSelectDate('1')"
            :class="{selected:selectedDay === formObj.selectDate}"
            v-else
          >{{formObj.selectDate }}</p>
        </div>
        <div class="order-num">
          <p class="order-num-lf">购买数量</p>
          <p class="order-num-rg">
            <span class="lf-btn" @click="handleChangeNum(buyNum,1)">-</span>
            <input v-model="buyNum" type="number" class="input-num" :disabled="true" />
            <span class="rg-btn" @click="handleChangeNum(buyNum,2)">+</span>
          </p>
        </div>
      </div>
    </section>
    <!-- 用户信息 -->
    <section>
      <div class="user-msg msg-box">
        <h2 class="title">取票人信息</h2>
        <ul class="user-msg-box">
          <li>
            <label for="name">
              姓名
              <input
                class="name_input"
                id="name"
                type="text"
                maxlength="10"
                v-model="formObj.orderExt.deliveryName"
              />
            </label>
          </li>
          <li>
            <label for="phone">
              手机号
              <input
                id="phone"
                type="tel"
                maxlength="11"
                v-model="formObj.orderExt.deliveryTelephone"
              />
            </label>
          </li>
          <li>
            <label for="identityCard">
              身份证
              <input
                id="identityCard"
                type="text"
                maxlength="18"
                v-model="formObj.orderExt.identityCard"
                onkeyup="value=value.replace(/[\W]/g,'')"
                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"
              />
            </label>
          </li>
        </ul>
      </div>
    </section>
    <!-- 抵扣券 -->
    <section>
      <div class="msg-box deduction">
        <span>抵扣券</span>
        <p>
          <span class="rg-text">暂无可用</span>
          <img src="@/assets/images/rg-row.png" class="icon" alt />
        </p>
      </div>
    </section>
    <!-- 底部金额 -->
    <footer>
      <div class="footer">
        <div class="footer-box">
          <p class="lf-title">
            应付金额:
            <span>¥{{ amount | fixedNum }}</span>
          </p>
          <p class="rg-btn" @click="handleSubmit">确认提交</p>
        </div>
      </div>
    </footer>
    <!-- 日期插件 -->
    <div v-if="isShowDate">
      <div class="dialog-box"></div>
      <div class="date-box">
        <p>
          选择游玩日期
          <img
            src="@/assets/images/close-icon.png"
            class="icon-img2"
            @click="handleSelectDate('2')"
            alt
          />
        </p>
        <div class="calender">
          <Calendar
            :monthRange="mounthArr"
            :begin="beginDate"
            :disabled="disabledArr"
            rangeMonthFormat="yyyy年MM月"
            :tileContent="tileContent"
            @select="select"
            ref="calendar"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/http/http.js";
import api from "@/assets/js/api.js";
import Calendar from "./src/mpvue-calendar";
import { checkMobile, isCardNo } from "@/assets/js/verify.js";
import "./src/style.css";
import "./style.scss";
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const day = new Date().getDate();

export default {
  name: "constructOrderDetail",
  components: { Calendar },
  data() {
    return {
      mounthArr: [`${year}-${month}`, `${year}-${month + 1}`],
      disabledArr: [],
      dayList: [],
      tileContent: [
        { date: `${year}-${month}-${day + 3}`, className: "holiday " }
      ],
      productName: "",
      beginDate: [year, month, day + 3],
      buyNum: 1, // 购买数量
      amount: "0",
      selectDate: "", // 临时选中的日期
      userObj: {
        token: localStorage.token,
        userId: localStorage.userId,
        groupId: localStorage.groupId,
        productId: this.$route.params.productId,
        activityName: this.$route.params.activityName
      },
      formObj: {
        consigneeName: "",
        consigneeMobile: "",
        orderType: 5, // 5代表改商品有邀请券,礼包订单默认传1，
        productType: 0,
        redirectUrl: this.$allConfig.jumpDomain.cashier + "cardBuyPayResult/",
        specialType: this.$route.query.ccbType ? "ccbVolunteer" : "",
        orderExt: {
          deliveryName: "", // 用户姓名
          deliveryTelephone: "", // 用户手机号
          identityCard: "", // 身份证
          selectDateStart: "" // 选中的日期
        },
        merchantProduct: [
          {
            merchantId: "",
            remarks: "",
            productSku: [
              {
                productId: this.$route.params.productId,
                skuId: "",
                productType: 0,
                buyNum: 1
              }
            ]
          }
        ]
      },
      isShowDate: false, // 是否显示选中的日期
      selectedDay: "", // 判断是否当天选中的状态
      isShowMore: true, // 显示更多按钮
      yearDate: "", // 选中某一时的 日期
      isLowSea: localStorage.getItem("skuListCardId"), // id ：1217 淡季；id:1218:旺季
      skuIdIndex: localStorage.getItem("skuIdIndex"), // 获取sku的index
      ccbType: this.$route.query.ccbType || "" // 建设银行一元购活动跳转至此
    };
  },
  filters: {
    fixedNum(num) {
      if (!num) return 0;
      return Number(num).toFixed(2);
    }
  },
  created() {
    // 禁止通过分享链接进入
    let activityName = this.$route.params.activityName;
    if (
      history.length <= 1 &&
      (activityName === "jianhangTicket" ||
        activityName === "jianhangTicketOther")
    )
      return dooolyAPP.redirectActivity("jianhangGiftEntry");
    // 获取当前3天日期
    this.getDayList();
    dooolyAPP.initTitle("确认订单");
    this.getDecSevenDay(); // 10月国庆不需要加进去
  },
  mounted() {
    this.getOrderDetail();
    this.randerLowSea();
  },
  methods: {
    /**
     * 判断当前活动是否 淡 旺季
     * 旺季： 每个月的周六和周日的日期 都可选
     * 平季： 每个月的周一和周五的日期 都可选 排除 9月13号
     * */
    randerLowSea() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let obj1 = this.getWeekDay(y, m);
      let obj2 = this.getWeekDay(y, m + 1);
      let busySeasonArr = obj1.weekDay.concat(obj2.weekDay);
      let lowSeasonArr = obj1.workDay.concat(obj2.workDay);
      // 如果19年 淡季中含有 9-13号，则删除加到是旺季数组中;
      let str = "2019-9-13";
      if (lowSeasonArr.indexOf(str) > 0) {
        lowSeasonArr.splice(lowSeasonArr.indexOf(str), 1);
        busySeasonArr.splice(3, 0, str);
      }
      // 判断当前活动是淡季/旺季 ; // id ：1217 平季；id:1218:旺季
      if (this.isLowSea == 1218) {
        this.handleDayArr(busySeasonArr);
        lowSeasonArr.forEach(item => {
          this.disabledArr.push(item);
        });
      } else if (this.isLowSea == 1217) {
        this.handleDayArr(lowSeasonArr);
        busySeasonArr.forEach(item => {
          this.disabledArr.push(item);
        });
      }
    },
    // 判断当前是特殊季节
    handleDayArr(arr) {
      let dayArr = [];
      let dateArr = [];
      let Index = 0;
      this.dayList.forEach(child => {
        if (arr.indexOf(child.date) > 0) {
          Index = arr.indexOf(child.date) + 1;
          dayArr.push(child);
        }
      });
      if (dayArr && dayArr.length < 3) {
        dateArr = arr.slice(Index, Index + 3 - dayArr.length);
      }
      // 处理格式
      if (dateArr && dateArr.length > 0) {
        dateArr.forEach(item => {
          let str = item.split("-");
          let date = `${str[1]}月${str[2]}日`;
          let obj = {
            date: item,
            nowDay: date
          };
          dayArr.push(obj);
        });
      }
      this.dayList = dayArr;
      this.selectedDay = this.dayList[0].nowDay;
    },
    // 获取每个月的 淡季/旺季的周几天
    getWeekDay(y, m) {
      let tempTime = new Date(y, m, 0);
      let time = new Date();
      let weekDay = new Array();
      let workDay = new Array();
      let t = m == 10 ? 8 : 1;
      for (var i = t; i <= tempTime.getDate(); i++) {
        time.setFullYear(y, m - 1, i);
        var day = time.getDay();
        if (day == 6 || day == 0) {
          weekDay.push(`${y}-${m}-${i}`);
        } else {
          workDay.push(`${y}-${m}-${i}`);
        }
      }
      let obj = {
        weekDay: weekDay,
        workDay: workDay
      };
      return obj;
    },
    // 获取10月份的1-7号
    getDecSevenDay() {
      let mounth = 10;
      let year = new Date().getFullYear();
      for (let i = 1; i < 8; i++) {
        let date = `${year}-${mounth}-${i}`;
        this.disabledArr.push(date);
      }
    },
    // 获取订单信息
    getOrderDetail() {
      http({
        method: "post",
        url: api.detailForAjax,
        data: this.userObj
      }).then(res => {
        if (res.data.code == "1000") {
          let { data } = res.data;
          this.productName = data.selfProduct.name;
          this.amount = data.skuList[this.skuIdIndex].sellPrice;
          this.formObj.merchantProduct[0].merchantId =
            data.selfProduct.businessId;
          this.formObj.merchantProduct[0].productSku[0].skuId =
            data.skuList[this.skuIdIndex].id;
          this.formObj.productType = data.productTypeList[0].id;
          this.formObj.merchantProduct[0].productSku[0].productType =
            data.productTypeList[0].id;
        } else {
          if (res.data.msg) {
            this.$toast(res.data.msg);
          } else {
            this.$toast("数据获取失败");
          }
        }
      });
    },
    // 处理日期方法
    getDay(day) {
      let tyear = new Date().getFullYear();
      let today = new Date();
      let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      let tMonth = today.getMonth();
      let tDate = today.getDate();
      tMonth = tMonth + 1;
      tDate = tDate;
      return {
        nowDay: `${tMonth}月${tDate}日`,
        date: `${tyear}-${tMonth}-${tDate}`
      };
    },
    // 获取3天内的日期
    getDayList() {
      for (let i = 3; i < 6; i++) {
        this.dayList.push(this.getDay(i));
      }
      this.selectedDay = this.dayList[0].nowDay;
      this.yearDate = this.dayList[0].date;
    },
    // 当前选中的日期
    handleChoose(val) {
      this.selectedDay = val.nowDay;
      this.yearDate = val.date;
      this.isShowMore = true;
    },
    // 展示日期插件
    handleSelectDate(type) {
      type === "1" ? (this.isShowDate = true) : (this.isShowDate = false);
    },
    // 点击购买数量提升
    handleChangeNum(val, type) {
      if (type === 1) {
        if (val <= 1) return;
        this.num--;
      } else {
        this.$toast("限购1个");
        return;
      }
    },
    // 日期插件选当前点击的日期
    select(val1, val2) {
      if (val1.length) {
        this.formObj.selectDate = `${val1[val1.length - 2]}月${
          val1[val1.length - 1]
        }日`;
        this.yearDate = val2.date;
        this.handleIsInDayList(this.formObj.selectDate);
        setTimeout(() => {
          this.handleSelectDate("2");
        }, 100);
      }
    },
    /**
     * 若当前日期存在dayList中，则改日期框选中&更多按钮显示
     *  否则 更多按钮消失，显示的日期在最后一个 &选中框
     * */
    handleIsInDayList(val) {
      if (val) {
        let arr = this.dayList.map(item => item.nowDay == val);
        if (arr.includes(true)) {
          this.isShowMore = true;
          this.selectedDay = val;
          this.yearDate = this.dayList.filter(
            child => child.nowDay == val
          )[0].date;
        } else {
          this.isShowMore = false;
          this.selectedDay = this.formObj.selectDate;
        }
      } else {
        this.isShowMore = true;
      }
    },
    // 校验表单
    formdatVaild() {
      if (this.formObj.orderExt.deliveryName == "") {
        this.$toast("请输入姓名");
        return false;
      }
      if (this.formObj.orderExt.deliveryTelephone == "") {
        this.$toast("请输入手机号");
        return false;
      }
      if (checkMobile(this.formObj.orderExt.deliveryTelephone)) {
        this.$toast("手机号有误");
        return false;
      }
      if (this.formObj.orderExt.identityCard == "") {
        this.$toast("请输入身份证");
        return false;
      }
      if (!isCardNo(this.formObj.orderExt.identityCard)) {
        this.$toast("身份证号有误");
        return false;
      }
      return true;
    },
    // 确认提交信息
    handleSubmit() {
      if (this.formdatVaild()) {
        this.formObj.consigneeName = this.formObj.orderExt.deliveryName;
        this.formObj.consigneeMobile = this.formObj.orderExt.deliveryTelephone;
        this.formObj.orderExt.selectDateStart = this.yearDate;
        let obj = {};
        Object.assign(obj, this.formObj, this.userObj);
        http({
          method: "post",
          url: api.createOrder_v2_2,
          notNeedTransfer: true,
          data: obj
        }).then(res => {
          if (res.data.code == "1000") {
            let { data } = res.data;
            // 存储活动名
            if (this.userObj.activityName) {
              let activityObj = {};
              activityObj[data.orderNum] = this.userObj.activityName;
              localStorage.activity = JSON.stringify(activityObj);
            }
            // 若返回的zeroOrderFlag 为true，则表示 0元支付，直接跳转支付结果页
            dooolyAPP.redirectPay(data.orderNum, "", data.zeroOrderFlag);
          } else {
            if (res.data.msg) {
              this.$toast(res.data.msg);
            } else {
              this.$toast("数据获取失败");
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.order-detail-wrraper {
  height: 100%;
  width: 100%;
  padding: 0.2rem;
  font-size: 0.28rem;
  position: relative;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  background-color: #f9f9f9;
  .msg-box {
    width: 100%;
    border-radius: 0.08rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    margin-bottom: 0.2rem;
  }
  .title {
    font-size: 0.32rem;
    margin: 0.3rem 0 0.38rem 0.2rem;
  }
  .icon-img2 {
    position: absolute;
    width: 0.33rem;
    height: 0.33rem;
    right: 0.45rem;
  }
  .icon {
    width: 0.13rem;
    height: 0.22rem;
  }
  .order-msg {
    .order-date {
      margin-left: 0.2rem;
      margin-bottom: 0.16rem;
    }
    .order-date-box {
      height: 0.9rem;
      margin: 0 0.2rem;
      display: flex;
      justify-content: space-between;
      .order-date-item {
        height: 0.85rem;
        width: 1.5rem;
        border: 1px solid #999;
        text-align: center;
        line-height: 0.85rem;
        color: #333;
        box-sizing: border-box;
      }
      .selected {
        background: url("../../assets/images/common/select-box.png") no-repeat
          center center;
        background-size: auto 100%;
        border: none;
      }
      .more-date {
        position: relative;
      }
    }
    .order-num {
      display: flex;
      justify-content: space-between;
      margin: 0.2rem;
      height: 0.68rem;
      line-height: 0.68rem;
      .order-num-rg {
        width: 2.5rem;
        border: 1px solid rgba(225, 225, 225, 1);
        border-radius: 33px 34px 34px 34px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        text-align: center;
        .input-num {
          width: 0.9rem;
          text-align: center;
          background: #fff;
        }
        .lf-btn {
          width: 0.8rem;
          color: #b5b5b5;
          font-size: 20px;
          border-right: 1px solid #e1e1e1;
        }
        .rg-btn {
          width: 0.8rem;
          color: #ff1023;
          font-size: 20px;
          border-left: 1px solid #e1e1e1;
        }
      }
    }
  }
  .user-msg {
    .user-msg-box {
      margin: 0 0.2rem 0.2rem 0.2rem;
      li {
        height: 0.4rem;
        line-height: 0.4rem;
        border-bottom: 1px solid #f9f9f9;
        padding: 0.2rem 0;
      }
      li > label {
        color: #999;
      }
      input {
        margin-left: 0.3rem;
        padding: 0 0.35rem;
        width: 4rem;
        color: #333;
      }
      .name_input {
        margin-left: 0.58rem !important;
      }
    }
  }
  .deduction {
    height: 0.88rem;
    line-height: 0.88rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 0 0.2rem;
    box-sizing: border-box;
    .rg-text {
      color: #999;
      padding-right: 0.3rem;
    }
  }
}
.dialog-box {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 1);
  opacity: 0.7;
  z-index: 100;
}
.date-box {
  position: fixed;
  top: 2.5rem;
  bottom: 0;
  left: 0;
  opacity: 1;
  z-index: 999;
  width: 100%;
  background: #fff;
  text-align: center;
  overflow-y: scroll;
  p {
    padding: 0.2rem 0;
    height: 0.4rem;
    position: sticky;
    width: 100%;
    z-index: 9999;
    top: 0;
    background: #fff;
  }
  .calender {
    height: 60%;
  }
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 1rem;
  line-height: 1rem;
  border-top: 1px solid #ececec;
  font-size: 0.3rem;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  .footer-box {
    .lf-title {
      float: left;
      margin-left: 0.3rem;
      span {
        padding-left: 0.2rem;
      }
    }
    .rg-btn {
      float: right;
      width: 2.5rem;
      background-color: #ff1023;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
