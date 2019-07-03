<template>
<div class="app_bg">
  <div v-if="msg == undefined || msg == ''">
    <div v-if="showType=='order'">
      <section class="clearfix">
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img :src="logo" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>{{company}}</span><span v-if="storeName!=undefined">-{{storeName}}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con clearfix">
          <div class="fl">付款金额</div>
          <div class="fr" v-if="String(totalAmount).indexOf('.')>0">￥{{totalAmount.toFixed(2)}}</div>
          <div class="fr" v-else>￥{{totalAmount}}.00</div>
        </div>
        <div class="details_con">
          <div class="fl">订单状态</div>
          <div class="fr" v-if="state==1">已完成</div>
          <div class="fr" v-else-if="state==2">已取消</div>
          <div class="fr" v-else-if="state==0">未完成</div>
        </div>
        <div class="details_con">
          <div class="fl">订单编号</div>
          <div class="fr">{{orderNumber}}</div>
        </div>
        <div class="details_con">
          <div class="fl">订单时间</div>
          <div class="fr">{{orderDateStr}}</div>
        </div>
        <div v-if="userRebate!=0">
          <div class="details_con">
            <div class="fl">预计返利</div>
            <div class="fr" v-if="String(userRebate).indexOf('.')>0">{{userRebate.toFixed(2)}}积分</div>
            <div class="fr" v-else>{{userRebate}}.00积分</div>
          </div>
          <div class="details_con">
            <div class="fl">返利状态</div>
            <div class="fr" v-if="isRebate==0 || isRebate==1">返利中</div>
            <div class="fr" v-if="isRebate==2">已到账</div>
          </div>
        </div>
        <div v-if="productType!=undefined">
          <div v-if="productType==2 || productType==3 || productType==4 || productType==5">
            <div class="details_con">
              <div class="fl">商品名称</div>
              <div class="fr">{{productName}}</div>
            </div>
          </div>
        </div>
        <div v-if="type == 8 || type == 13">
          <div class="details_con">
            <div class="fl">退积分</div>
            <div class="fr" v-if="String(businessRebateAmount).indexOf('.')>0">{{businessRebateAmount.toFixed(2)}}积分</div>
            <div class="fr" v-else>{{businessRebateAmount}}.00积分</div>
            <!-- zhaoyang 11-25 修改字段 -->
            <!-- <div class="fr" v-if="String(amount).indexOf('.')>0">{{amount.toFixed(2)}}积分</div>
            <div class="fr" v-else>{{amount}}.00积分</div> -->
          </div>
          <div class="details_con">
            <div class="fl">积分类型</div>
            <div class="fr">退款</div>
          </div>
        </div>
        <div v-else-if="type != 8">
          <div v-if="userRebate!=0">
            <div class="details_con">
              <div class="fl">积分类型</div>
              <div class="fr">返积分</div>
            </div>
          </div>
          <div v-else>
            <div class="details_con">
              <div class="fl">积分类型</div>
              <div class="fr">消费</div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-if="showType=='didi'">
      <section class="clearfix">
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img :src="logo" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>{{company}}</span><span v-if="storeName!=undefined">-{{storeName}}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con clearfix">
          <div class="fl">付款金额</div>
          <div class="fr" v-if="String(businessRebateAmount).indexOf('.')>0">{{businessRebateAmount.toFixed(2)}}积分</div>
          <div class="fr" v-else>{{businessRebateAmount}}.00积分</div>
        </div>
        <div class="details_con">
          <div class="fl">消费时间</div>
          <div class="fr">{{createDateStr}}</div>
        </div>
        <div>
          <div class="details_con">
            <div class="fl">备注</div>
            <div class="fr">滴滴打车兑换</div>
          </div>
        </div>
      </section>
    </div>
    <div v-else-if="showType == 'recharge' && pointType == '1' && businessRebateAmount>=0">
      <section>
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img :src="groupLogo" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>{{groupName}}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con">
          <div class="fl">充值金额</div>
          <div class="fr" v-if="String(amount).indexOf('.')>0">{{amount.toFixed(2)}}积分</div>
          <div class="fr" v-else>{{amount}}.00积分</div>
        </div>
        <div class="details_con">
          <div class="fl">充值时间</div>
          <div class="fr">{{rechargeDate}}</div>
        </div>
        <div class="details_con">
          <div class="fl">积分类型</div>
          <div class="fr">福利</div>
        </div>
      </section>
    </div>
    <div v-else-if="showType == 'recharge' && pointType == '1' && businessRebateAmount<0">
      <section>
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img :src="groupLogo" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>{{groupName}}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con">
          <div class="fl">消费金额</div>
          <div class="fr" v-if="String(amount).indexOf('.')>0">{{amount.toFixed(2)}}积分</div>
          <div class="fr" v-else>{{amount}}.00积分</div>
        </div>
        <div class="details_con">
          <div class="fl">消费时间</div>
          <div class="fr">{{rechargeDate}}</div>
        </div>
        <div class="details_con">
          <div class="fl">积分类型</div>
          <div class="fr">福利</div>
        </div>
      </section>
    </div>
    <div v-else-if="showType == 'activity'">
      <section>
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img src="../../assets/images/personalCenter/myPoint/activity.png" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>{{integralName}}</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con">
          <div class="fl">活动金额</div>
          <div class="fr" v-if="String(integral).indexOf('.')>0">{{integral.toFixed(2)}}积分</div>
          <div class="fr" v-else>{{integral}}.00积分</div>
        </div>
        <div class="details_con">
          <div class="fl">活动时间</div>
          <div class="fr">{{dateTime}}</div>
        </div>
        <div class="details_con">
          <div class="fl">积分类型</div>
          <div class="fr">活动</div>
        </div>
      </section>
    </div>
    <div v-else-if="showType == 'integralRecharge'">
      <section>
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img src="../../assets/images/logo.png" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>兜礼积分绑定</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="details_con">
          <div class="fl">绑定金额</div>
          <div class="fr" v-if="String(integral).indexOf('.')>0">{{integral.toFixed(2)}}积分</div>
          <div class="fr" v-else>{{integral}}.00积分</div>
        </div>
        <div class="details_con">
          <div class="fl">绑定时间</div>
          <div class="fr">{{dateTime}}</div>
        </div>
        <div class="details_con">
          <div class="fl">积分类型</div>
          <div class="fr">福利</div>
        </div>
      </section>
    </div>
    <div v-if="showType == 'attend'">
      <section>
        <div class="order_details_topbg"></div>
        <div class="logo_bg">
          <div class="header_logo">
            <img src="../../assets/images/personalCenter/myPoint/sign_icon.png" />
          </div>
        </div>
        <div class="detail_all_div">
          <div class="detail_div">
            <div class="detail_Name">
              <span>兜礼签到积分</span>
            </div>
          </div>
        </div>
      </section>
      <section class="signIntegral">
        <p class="sign_amount" v-if="String(sign.signAmount).indexOf('.')>0">{{sign.signAmount.toFixed(2)}}</p>
        <p class="sign_amount" v-else>{{sign.signAmount}}</p>
        <p class="sign_name">签到积分</p>
      </section>
      <section>
        <div class="details_con">
          <span class="sign_mark">签到时间</span>
          <span class="sign_date">{{this.formatStrDate(sign.signDate,true)}}</span>
        </div>
      </section>
    </div>
  </div>
  <div v-else>
    <section>
      <p class="message">{{msg}}</p>
    </section>
  </div>
  <div>
    <img src="" />
  </div>
</div>
</template>

<script>
import http from '@/http/http.js'
import api from '@/assets/js/api.js';
export default {
  name: "myPointDetail",
  data() {
    return {
      msg: "",
      showType: "",
      logo: "",
      company: "",
      storeName: "",
      totalAmount: "",
      state: "",
      orderNumber: "",
      orderDateStr: "",
      userRebate: "",
      isRebate: "",
      pointType: "",
      businessRebateAmount: "",
      groupLogo: "",
      groupShortName: "",
      groupName: "", //全称
      amount: "",
      rechargeDate: "",
      integral: "",
      dateTime: "",
      userRebate: "",
      integralName: "",
      createDateStr: "",
      productType: "",
      productName: "",
      sign: {
        signDate: '',
        signAmount: ''
      }
    }
  },
  created() {
    initTitle('积分详情', '')
    this.getDetail()
  },
  methods: {
    getDetail() {
      let itemPonintType = this.$route.params.itemPointType;
      let id = this.$route.params.itemId;
      http({
        method: 'get',
        url: api.myPointDetail + "?id=" + id + "&pointType=" + itemPonintType + "&token=" + localStorage.token,
      }).then((res) => {
        this.showType = res.data.showType;
        this.pointType = res.data.pointType;
        this.msg = res.data.msg;
        this.integral = res.data.integral;
        this.dateTime = res.data.date;
        this.integralName = res.data.integralName;
        this.productType = res.data.productType;
        this.productName = res.data.productName;
        let adAvailablePoint = res.data.adAvailablePoint;
        if (adAvailablePoint != undefined) {
          this.logo = adAvailablePoint.logo;
          this.company = adAvailablePoint.company;
          this.storeName = adAvailablePoint.storeName;
          this.businessRebateAmount = adAvailablePoint.businessRebateAmount;
          this.groupLogo = adAvailablePoint.groupLogo;
          this.groupShortName = adAvailablePoint.groupShortName;
          this.groupName = adAvailablePoint.groupName;
          this.type = res.data.adAvailablePoint.type;
          this.createDateStr = adAvailablePoint.createDateStr;
        }

        let order = res.data.order;
        if (order != undefined) {
          this.totalAmount = order.totalAmount;
          this.amount = order.amount;
          this.state = order.state;
          this.orderNumber = order.orderNumber;
          this.orderDateStr = order.orderDateStr;
          this.userRebate = order.userRebate;
          this.isRebate = order.isRebate;
        }

        let recharge = res.data.recharge;
        if (recharge != undefined) {
          this.amount = recharge.amount;
          this.rechargeDate = recharge.rechargeDate;
        }
        if (adAvailablePoint) {
          this.$data.sign.signDate = adAvailablePoint.createDate
          this.$data.sign.signAmount = adAvailablePoint.businessRebateAmount
        }
      });
    },
    formatStrDate(str, isPoint) {
      let date = new Date(str)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let array = [m, d, hour, minute]
      array.forEach((item, index, arr) => {
        if (item < 10) {
          arr[index] = '0' + item
        }
      })
      if (isPoint) return y + '.' + m + '.' + d + ' ' + hour + ':' + minute
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<style scoped>
.message {
  font-size: 0.3rem;
  text-align: center;
}

.details_title {
  background: #84898f;
  color: #fff;
  font-size: 0;
  height: 1rem;
}

.details_title .title_img_div {
  width: 15%;
  float: left;
  display: inline-block;
  text-align: center;
}

.details_title img {
  width: 0.6rem;
  height: 0.6rem;
  margin-top: 0.2rem;
  line-height: 1rem;
  vertical-align: middle
}

.details_title .title_txt {
  font-size: 0.3rem;
  margin-top: 0.3rem;
  color: #fff;
  float: left;
  display: inline-block;
}

.money_div {
  text-align: center;
  background: #fff;
}

.money_div .money_title {
  color: #333;
  font-size: 0.3rem;
  padding: 0.32rem 0 0.28rem 0;
  border-bottom: 1px solid #ececec;
}

.money_div .money {
  color: #333;
  font-size: 0.7rem;
  margin-top: 0.56rem;
  text-align: right;
}

.signIntegral {
  padding: 0 0.3rem;
}

.signIntegral p {
  text-align: center;
  color: #333;
}

.signIntegral .sign_amount {
  height: 1.4rem;
  font-size: 1rem;
}

.signIntegral .sign_name {
  font-size: 0.28rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #ececec;
}

.details_con {
  height: 0.4rem;
  font-size: 0.28rem;
  line-height: 0.4rem;
  margin-top: 0.2rem;
  margin: 0.2rem 0.3rem;

}

.details_con .sign_mark {
  padding-right: 0.4rem;
  display: inline-block;
  color: #999;
}

.details_con .sign_date {
  display: inline-block;
  color: #333;
}

.details_con .fl {
  float: left;
  display: inline-block;
  width: 30%;
  color: #999;
  text-align: left;
}

.details_con .fr {
  float: left;
  display: inline-block;
  width: 70%;
  color: #333;
  text-align: right;
}

.details_record {
  font-size: 0.3rem;
  background: #fff;
  margin-top: 0.2rem;
  height: 1rem;
  line-height: 1rem;
}

.details_record a .fl {
  color: #000;
  margin-left: 0.3rem;
}

.details_record a .fr {
  color: #a0a0a0;
  margin-right: 0.4rem;
}

.order_details_div {
  width: 100%;
  height: auto;
}

.order_details_topbg {
  overflow: hidden;
  position: relative;
  top: 0;
  background: #f5f5f5;
  height: 1rem;
}

.logo_bg {
  height: 0.6rem;
  position: relative;
  width: 100%;
  background: #fff;
}

.header_logo {
  text-align: center;
  position: absolute;
  top: 0.4rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-top: -1.1rem
}

.header_logo img {
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 50%;
  border: 0.07rem solid #fff;
}

.detail_all_div {
  background: #fff;
  padding: 0.3rem;
}

.detail_div {
  text-align: center;
  background: #fff;
}

.detail_div .detail_Name {
  font-size: 0.3rem;
  color: #333;
  border-bottom: 1px solid #ececec;
  padding: 0 0 0.4rem 0;
}

.detail_div .detail_money {
  color: #333;
  font-size: 0.7rem;
  margin-top: 0.56rem;
}

.detail_div .detail_money_txt {
  color: #333;
  font-size: 0.3rem;
  padding: 0.32rem 0 0.28rem 0;
  border-bottom: 1px solid #ececec;
}
</style>
