<template>
  <div id="BCM" class="body_view">
    <div class="banner_view">
      <img src="../../../assets/images/activity_BCM/banner1.jpg">
    </div>
    <ul>
      <li :class="{'check':checkMunber == 0 && new_gift_list[0].couponRemindQuantity > 0,'over':new_gift_list[0].couponRemindQuantity <= 0}" @click="check(0,new_gift_list[0].couponRemindQuantity,new_gift_list[0].couponId,new_gift_list[0].coupon.productName)">
        <img :src=new_gift_list[0].src>
        <span class="overImg"><img src="../../../assets/images/activity_BCM/over.png"></span>
        <span class="checkImg"><img src="../../../assets/images/activity_BCM/check.png"></span>
      </li>
      <li :class="{'check':checkMunber == 1 && new_gift_list[1].couponRemindQuantity > 0,'over':new_gift_list[1].couponRemindQuantity <= 0}" @click="check(1,new_gift_list[1].couponRemindQuantity,new_gift_list[1].couponId,new_gift_list[1].coupon.productName)">
        <img :src=new_gift_list[1].src>
        <span class="overImg"><img src="../../../assets/images/activity_BCM/over.png"></span>
        <span class="checkImg"><img src="../../../assets/images/activity_BCM/check.png"></span>
      </li><br>
      <li :class="{'check':checkMunber == 2 && new_gift_list[2].couponRemindQuantity > 0,'over':new_gift_list[2].couponRemindQuantity <= 0}" @click="check(2,new_gift_list[2].couponRemindQuantity,new_gift_list[2].couponId,new_gift_list[2].coupon.productName)">
        <img :src=new_gift_list[2].src>
        <span class="overImg"><img src="../../../assets/images/activity_BCM/over.png"></span>
        <span class="checkImg"><img src="../../../assets/images/activity_BCM/check.png"></span>
      </li>
      <li :class="{'check':checkMunber == 3 && new_gift_list[3].couponRemindQuantity > 0,'over':new_gift_list[3].couponRemindQuantity <= 0}" @click="check(3,new_gift_list[3].couponRemindQuantity,new_gift_list[3].couponId,new_gift_list[3].coupon.productName)">
        <img :src=new_gift_list[3].src>
        <span class="overImg"><img src="../../../assets/images/activity_BCM/over.png"></span>
        <span class="checkImg"><img src="../../../assets/images/activity_BCM/check.png"></span>
      </li>
      <li :class="{'check':checkMunber == 4 && new_gift_list[4].couponRemindQuantity > 0,'over':new_gift_list[4].couponRemindQuantity <= 0}" @click="check(4,new_gift_list[4].couponRemindQuantity,new_gift_list[4].couponId,new_gift_list[4].coupon.productName)">
        <img :src=new_gift_list[4].src>
        <span class="overImg"><img src="../../../assets/images/activity_BCM/over.png"></span>
        <span class="checkImg"><img src="../../../assets/images/activity_BCM/check.png"></span>
      </li>
    </ul>
    <div class="input_view">
      <input class="tel" type="tel" placeholder="请输入您的手机号" maxlength="11" v-model="mobileNum">
    </div>
    <div class="input_view clearfix">
      <div class="fl">
        <input class="code" type="tel" placeholder="请输入验证码" maxlength="6" v-model="codeNum">
      </div>
      <div class="center"></div>
      <div class="fr">
        <input v-if="againTime>0&&againTime<60" class="getCode" type="button" :value="againTime+'s'">
        <input v-else class="getCode" type="button" @click="getValidCode" value="获取验证码">
      </div>
    </div>
    <div class="input_view submit" data-baidu-stats="活动-幸福交行-活动页-点击领取" :class="{'gray':!isCheck}" @click="submit">立即领取</div>
    <div class="input_view explain">
      <img class="check_img" :src="acceptImg" @click="check_img" alt="">
        <label :class="{'accept':!isCheck}" >我已阅读并接受</label>
        <a data-baidu-stats="幸福交行-活动页-点击勾选协议" @click="user_agreement">《<label class="protocol">用户协议</label>》</a>和
        《<label @click="ruleShow = true" class="protocol">领取说明</label>》</div>
    <div class="commercial">
      <img src="../../../assets/images/activity_BCM/commercial.png">
      <div class="title">交行专享</div>
      <div class="text1">199兜礼会员权益详解</div>
      <div class="text2">(部分品牌展示)</div>
      <div class="text3">网上购物，门店买单，使用兜礼平台，可获得更多优惠</div>
    </div>
    <footer>
      Copyright@reach-life 2018 all right reserved
    </footer>
    <!-- 弹框 -->
    <div class="rule_bg" v-show="ruleShow" @touchmove.prevent>
      <div class="rule">
        <div class="title">
          领取说明
        </div>
        <div class="content">
          1、活动期间每人仅可领取1次<br>
          2、库存有限，领完为止<br>
          3、交行积分由交行工会统一发放<br>
          4、客服电话：4001582212<br>
          5、<span>凡于活动期间内参与此次“交行幸福测评礼品领取活动”的员工，自动成为“兜礼”VIP会员，享受“兜礼”平台相关商户权益。本次活动的最终解释权归“兜礼”平台所有。</span>
        </div>
        <div class="close" @click="ruleShow = false">
          我知道了
        </div>
      </div>
    </div>

    <div class="rule_bg" v-show="alrShow" @touchmove.prevent>
      <div class="rule BCM_alr">
        <div class="title">
          温馨提示
        </div>
        <div class="content">
          {{alr_content}}
        </div>
        <div class="close" @click="alrShow = false">
          我知道了
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {checkMobile} from '@/assets/js/verify.js';
  // 
  export default {
    name: "activity_BCM_index",
    data() {
      return {
        gift_list:[
        ],
        new_gift_list:[//固定排序的新list
          {
            couponRemindQuantity:''
          },
          {
            couponRemindQuantity:''
          },
          {
            couponRemindQuantity:''
          },
          {
            couponRemindQuantity:''
          },
          {
            couponRemindQuantity:''
          }
        ],
        checkMunber:-1,
        ruleShow:false,
        alrShow:false,
        againTime:60,
        mobileNum:'',
        codeNum:'',
        couponId:'',
        activityId:'',
        alr_content:'',
        acceptImg: require("../../../assets/images/activity_BCM/no_check.png"),
        isCheck: false
      }
    },
    created(){
      document.title = '幸福交行';
      this.$messageBox.alert('', {
        title: '免责声明',
        message: '本次活动由兜礼提供。相关服务和责任由兜礼承担。如有问题请咨询兜礼客服热线：400-158-2212',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '我知道了',
      });
      this.getGiftList();
    },
    mounted(){
      document.body.setAttribute('id', 'toast_wrap');
    },
    destroyed(){
      document.body.setAttribute('id', '');
    },
    methods: {
      submit(){
        if(this.checkMunber < 0){
          this.$toast("请选择礼品");
          return;
        };
        if(!this.mobileNum){
            this.$toast('请输入手机号码');
            return;
        }
        if(!this.codeNum){
            this.$toast('请输入验证码');
            return;
        }
        if(checkMobile(this.mobileNum)){
            this.$toast('请输入正确手机号码');
            return;
        }
        if(!this.$data.isCheck){
            this.$toast('请先勾选"我已阅读并接受《用户协议》和《领取说明》"');
            return;
        }
        if(!this.couponId){
          this.couponId = this.gift_list[this.checkMunber].couponId;
        }
        http({
          method: 'post',
          url: api.jiaohang,
          data: {
            activityId: this.activityId,
            phone: this.mobileNum,
            verificationCode: this.codeNum,
            couponId: this.couponId,
            outAPP:true,
          }
        }).then((res) => {
          if(res.data.code == "1000"){
            this.$toast("领取成功");
            this.$router.push({path:"/activity_BCM_success"});
          }else if(res.data.code == "2015" || res.data.code == "1002"){
            this.$toast("每位员工限领一份");
          }else{
            this.$toast(res.data.msg);
          }
        })
      },
      // 60s倒计时
      timingCode() {
        if(this.againTime != 60){
          return;
        }else{
          this.againTime--;
        }
        clearInterval(interval);
        var interval = setInterval(() => {
          if (this.againTime > 0 && this.againTime < 61) {
            this.againTime--;
          }else{
            clearInterval(interval);
            this.againTime = 60;
          }
        }, 1000)
      },
      getValidCode() {
        if(checkMobile(this.mobileNum)){
            this.$toast('请输入正确手机号码');
            return;
        }
        if(!this.$data.isCheck){
            this.$toast('请先勾选"我已阅读并接受《用户协议》和《领取说明》"');
            return;
        }
        http({
          method: 'post',
          url: api.getLoginVCode,
          data: {
            mobile: this.mobileNum,
            outAPP:true,
          }
        }).then((res) => {
          if (res.data.code == 1000) {
            this.timingCode();
            this.$toast("发送成功");
          }else {
            this.$toast("发送失败");
          }
        })
      },
      check(index,munber,couponId,productName){
        if(this.checkMunber == index || munber <= 0 ){
          return;
        }
        if(productName == "35元网易严选陶瓷花瓶" || productName == "49元网易严选收纳盒"){
          this.alr_content = '限网易严选新用户领取哦';
          this.alrShow = true;
        }else if(productName == "20元来伊份无门槛券"){
          this.alr_content = '限上海地区来伊份门店使用';
          this.alrShow = true;
        }
        this.checkMunber = index;
        this.couponId = couponId;
      },
      getGiftList(){
        http({
          method: 'post',
          url: api.getActivityCoupon,
          data:{
            "idFlag":"JHLQ",
            outAPP:true,
          }
        }).then((res) =>{
          if(res.data.code == 1000){
            this.gift_list = res.data.data.adCouponActivityConnList;
            this.activityId = res.data.data.adCouponActivityConnList[0].activityId;
            for(let i =0;i<this.gift_list.length;i++){
              if(this.gift_list[i].coupon.productName == "免费洗车券"){
                this.gift_list[i].src = require("../../../assets/images/activity_BCM/gift1.png");
                this.new_gift_list[0] = this.gift_list[i];
              }else if(this.gift_list[i].coupon.productName == "话费充值满30减5"){
                this.gift_list[i].src = require("../../../assets/images/activity_BCM/gift2.png");
                this.new_gift_list[1] = this.gift_list[i];
              }else if(this.gift_list[i].coupon.productName == "49元网易严选收纳盒"){
                this.gift_list[i].src = require("../../../assets/images/activity_BCM/gift3.png");
                this.new_gift_list[2] = this.gift_list[i];
              }else if(this.gift_list[i].coupon.productName == "20元来伊份无门槛券"){
                this.gift_list[i].src = require("../../../assets/images/activity_BCM/gift4.png");
                this.new_gift_list[3] = this.gift_list[i];
              }else if(this.gift_list[i].coupon.productName == "35元网易严选陶瓷花瓶"){
                this.gift_list[i].src = require("../../../assets/images/activity_BCM/gift5.png");
                this.new_gift_list[4] = this.gift_list[i];
              }
            }
            this.new_gift_list.push();
            if(this.new_gift_list[1].couponRemindQuantity > 0){
              this.checkMunber = 1;
              this.couponId = this.new_gift_list[1].couponId;
            }
          }
        })
      },
      user_agreement() {
        this.$router.push('/userProtocol');
      },
      check_img() {
        this.$data.isCheck = !this.$data.isCheck
        this.$data.acceptImg = this.$data.isCheck ? require("../../../assets/images/activity_BCM/checked.png") : require("../../../assets/images/activity_BCM/no_check.png")
      }
    }
  }
</script>

<style scoped>

  .body_view{
    background:#dd3b15;
  }
  .banner_view{
    font-size: 0;
  }
  ul{
    background:#dd3b15 url(../../../assets/images/activity_BCM/banner2.jpg) no-repeat 0 0;
    background-size: 100%;
    text-align: center;
    font-size: 0;
    padding: 8% 10% 6% 10%;
    white-space: nowrap;
  }
  li{
    display: inline-block;
    overflow: hidden;
    margin-bottom: 11%;
    position: relative;
  }
  li:nth-of-type(1),li:nth-of-type(2){
    width: 40%;
    margin: 0 2.5%;
    margin-bottom: 11%;
  }
  li:nth-of-type(3),li:nth-of-type(4),li:nth-of-type(5){
    width: 32.8%;
  }
  li:nth-of-type(3) img,li:nth-of-type(4) img,li:nth-of-type(5) img{
    width: 111%;
  }
  li .checkImg{
    width: 17%;
    position: absolute;
    left: 3%;
    top: 3%;
    overflow: hidden;
  }
  li .checkImg img{
    width: 200%;
  }
  li.check .checkImg img{
    margin-left: -100%;
  }
  li.over{
    filter: gray;
    filter: grayscale(100%);
  }
  li.over .overImg{
    width: 73%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-62%,-60%);
  }
  .input_view{
    width: 80%;
    line-height:300%;
    margin: 0 auto;
    margin-bottom: 0.1rem;
    background: #fff6ce;
    border-radius: 0.1rem;
    font-size: 15px;
    text-align: center;
    color: #dd3b15;
  }
  .tel{
    width: 90%;
    height: 100%;
    background: #fff6ce;
    border-radius: 0.1rem;
  }
  .clearfix{
    position: relative;
  }
  .fl{
    margin-left: 5%;
    height: 100%;
    width: 58%;
  }
  .code{
    width: 100%;
    height: 100%;
    background: #fff6ce;
  }
  .center{
    position: absolute;
    top: 35%;
    right: 34.5%;
    width: 0.02rem;
    height: 33%;
    background: #dd3b15;
  }
  .fr{
    height: 100%;
    width: 35%;
  }
  .getCode{
    height: 100%;
    background: #fff6ce;
    width: 100%;
  }
  .submit{
    background: #ffcf43;
    font-size: 18px;
    text-align: center;
    margin-top: 0.2rem;
    margin-bottom: 0;
  }
  .submit.gray {
    background-color: #c1c1c1;
    color: #d7d7d7;
  }
  .explain{
    width: 85%;
    background: transparent;
    text-align: center;
    line-height: 0.9rem;
    font-size: 14px;
    color: #ffb59e;
    margin-bottom: 0.2rem;
  }
  .explain .check_img {
    margin-right: 0.06rem;
    margin-top: -0.05rem;
    width: 0.26rem;
    height: 0.26rem;
    vertical-align: middle;
  }
  .check_img .accept {
    opacity: 0.7;
  }
  .explain .protocol {
    text-decoration: underline;
  }
  .explain .accept {
    opacity: 0.7;
  }
  .commercial{
    background: #a90b0a;
    width: 96%;
    margin: 0 auto;
    border-radius: 0.1rem;
    text-align: center;
    position: relative;
    font-size: 0;
  }
  .commercial .title{
    position: absolute;
    left: 50%;
    top: 4%;
    transform: translate(-50%,0%);
    line-height: 0.48rem;
    font-size: 14px;
    color: #c42f14;
  }
  .commercial .text1{
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translate(-50%,0%);
    font-size: 13px;
    color: #fff3bf;
    line-height: 100%;
  }
  .commercial .text2{
    position: absolute;
    left: 50%;
    top: 16%;
    transform: translate(-50%,0%);
    font-size: 10px;
    color: #ff805f;
    line-height: 100%;
  }
  .commercial .text3{
    position: absolute;
    left: 50%;
    bottom: 3%;
    transform: translate(-50%,0%);
    font-size: 12px;
    color: #fff3bf;
    line-height: 100%;
    white-space: nowrap;
  }
  footer{
    font-size: 12px;
    color: #a90b0a;
    text-align: center;
    line-height: 0.72rem;
  }
  .rule_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 9;
  }
  .rule{
    position: fixed;
    width: 68%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #c40a09 url(../../../assets/images/activity_BCM/yun.png) no-repeat 50% 3%;
    background-size: 75%;
    text-align: center;
    border-radius: 0.1rem;
    overflow: hidden;
    font-size: 0;
  }
  .rule .title{
    font-size: 14px;
    color: #c42f14;
    line-height: 100%;
    padding-top: 10%;
  }
  .rule .content{
    font-size: 13px;
    color: #fff3bf;
    line-height: 200%;
    padding:0 10%;
    text-align: left;
    margin: 10% 0;
  }
  .rule .content span{
    display: inline-block;
    width: 72%;
    vertical-align: top;
    line-height: 150%;
  }
  .rule .close{
    width: 100%;
    line-height: 250%;
    font-size: 16px;
    color: #c40a09;
    background: #ffd744;
  }
  .BCM_alr{
    margin-top: -0.72rem;
  }
  .BCM_alr .title{
    padding-top: 7%;
  }
  .BCM_alr .content{
    text-align: center;
    font-size: 14px;
  }
</style>
