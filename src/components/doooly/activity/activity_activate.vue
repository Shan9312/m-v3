<template>
  <div class="body_view">
    <div class="banner_view">
      <img src="../../../assets/images/activity/activate.jpg">
    </div>
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
        <input v-else class="getCode" type="button" @click="getValidCode" value="发送验证码">
      </div>
    </div>
    <div class="input_view">
      <input class="tel" type="tel" placeholder="请输入邀请码" v-model="code" :disabled="code">
    </div>
    <div class="input_view submit" data-baidu-stats="活动-激活活动-点击激活" @click="submit">立即领取</div>

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
  
  export default {
    name: "activity_BCM_index",
    data() {
      return {
        ruleShow:false,
        alrShow:false,
        againTime:60,
        mobileNum:'',
        codeNum:'',
        alr_content:'',
        code:this.$route.query.code,
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#1e0e19";
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      initTitle('兜礼权益限时领');
    },
    mounted(){
    },
    methods: {
      submit(){
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
        if(!this.code){
          this.$toast('请输入邀请码');
          return;
        }
        http({
          method: 'post',
          url: api.checkValidCode,
          data: {
            mobile: this.mobileNum,
            code: this.codeNum,
          }
        }).then((res) => {
          if (res.data.code == '1000') {
            http({
              method: 'post',
              url: api.verifyCodeToActive,
              data: {
                code: this.code,
                mobile: this.mobileNum,
              }
            }).then((res) => {
              if (res.data.code == "1000") {
                localStorage.activateMobile = this.mobileNum;
                if(this.code.length == 12){
                  dooolyAPP.logIn.call(this,res.data.data,'/point_recharge');
                }else if(this.code.length == 8){
                  this.$router.push('/activity_activate2/'+this.code);
                }else{
                  this.$router.push('/vip_activate2/'+this.code);
                };
              }else if(res.data.code == "1004"){
                this.$toast("激活码已使用");
              }else if(res.data.code == "1003"){
                this.$toast("激活码不存在");
              }else if(res.data.code == "1006"){
                this.$toast("专属码对应用户已激活");
              }else if(res.data.code == "1007"){
                this.$toast("请输入正确的工号");
              }else if(res.data.code == "1008"){
                this.$toast("用户信息不存在");
              }else if(res.data.code == "1005"){
                this.$toast("专属码状态有误");
              }else if(res.data.code == "1001"){
                this.$toast("系统错误");
              }else if(res.data.code == "1002"){
                this.$toast("激活码不存在");
              }else if(res.data.code == "11003"){
                this.$toast("重复请求");
              }else if(res.data.code == "13003"){
                this.$toast("充值人与激活人不符");
              }else if(res.data.code == "30000"){
                this.$toast("系统异常");
              }else if(res.data.code == "13004"){
                this.$toast("卡密未激活");
              }else if(res.data.code == "13007"){
                this.$toast("激活码未激活");
              }else if(res.data.code == "13008"){
                this.$toast("未在使用期限内");
              }else if(res.data.code == "13009"){
                this.$toast("激活码已冻结");
              }else{
                this.$toast("请输入正确的激活码");
              }
            });
          } else {
            this.$toast(res.data.msg);
          }
        }); 
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
    }
  }
</script>

<style scoped>
  .body_view{
    background:#1e0e19;
  }
  .banner_view{
    font-size: 0;
    margin-bottom: 0.4rem;
  }
  .input_view{
    width: 80%;
    line-height:300%;
    margin: 0 auto;
    margin-bottom: 0.3rem;
    background: #fff;
    border-radius: 0.1rem;
    font-size: 0.3rem;
    text-align: center;
  }
  .tel{
    width: 90%;
    height: 100%;
    background: #fff;
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
    background: #fff;
  }
  .center{
    position: absolute;
    top: 35%;
    right: 34.5%;
    width: 0.02rem;
    height: 33%;
    background: #ccc;
  }
  .fr{
    height: 100%;
    width: 35%;
  }
  .getCode{
    height: 100%;
    background: #fff;
    width: 100%;
    color: #f54100;
  }
  .submit{
    background: #f54100;
    color: #fff;
    font-size: 18px;
    text-align: center;
    margin-top: 0.7rem;
    margin-bottom: 0;
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
