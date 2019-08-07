<template v-cloak>
  <article class="g-doc" v-cloak>
    <section class="m-verification">
      <div class="m-step"> 
        <div class="m-step-1">
          <div class="item f-pr" :class="{ 'step-cur-0': step > 0 , 'step-cur': step === 0}">
            <div class="step-txt">
              <b>1</b><span>身份验证</span>
            </div>
          </div>
          <div class="item f-pr" :class="{ 'step-cur-0': step > 1 , 'step-cur': step === 1}">
            <div class="step-txt">
              <b>2</b><span>设置密码</span>
            </div>
          </div>
          <div class="item f-pr" :class="{'step-cur-0': step === 2}">
            <div class="step-txt">
              <b>3</b><span>确认密码</span>
            </div>
          </div>
        </div>
        <div class="m-mm_box">
          <p class="f-tac f-fs2 tit">{{tits[type][step]}}</p>
          <div class="mm_box">
            <div class="item" v-for="i in 6">{{numbers[i-1]}}</div>
            <input v-model="numbers" maxlength="6" type="tel" name="code">
          </div>
          <p class="f-tac f-fs2 tit2" v-show="timeNum < 60 && step == 0 && type == '0'">验证码已发送至{{mobileNum.substring(0,3)}}****{{mobileNum.substring(7)}}，<span>{{timeNum}}</span>s后重新获取</p>
          <p v-show="timeNum >= 60 && step == 0 && type == '0'" class="f-tac f-fs2 tit2">未收到验证码?请<span @click="getLoginVCode">重新获取</span></p>
        </div>
      </div>
    </section>
    <aside class="m-tips footer">
      <h3>温馨提示</h3>
      <div class="">
        <p>1、为保障您的帐号安全变更重要信息需要身份验证。</p>
        <p>2、有疑问请拨打<a href="#" @click="dial_phone('4001582212')">400-158-2212</a>（9:00-18:00）联系客服。</p>
      </div>
    </aside>
  </article>
</template>
<script>
import http from '@/http/http.js'
import api from '@/assets/js/api.js';
import utils from '@/assets/js/utils.js';
export default {
  name: "verification",
  data(){
    return{
      numbers: '',
      type :this.$route.params.type,
      way :this.$route.params.way,
      step: 0,
      tits: [['请输入验证码，完成身份验证','设置6位支付密码', '再次输入6位支付密码确认'],
            ['请输入原支付密码，完成身份验证', '设置6位支付密码','再次输入6位支付密码确认']],
      mobileNum: localStorage.mobile,
      timeNum: 60,
      validCodeNum:'', // 验证码
      secondStepNum: '', // 第二步
      thirdStepNum: '', // 第三步
      oldPassword: '', // 输入旧支付密码
      option: localStorage.isPayPassword,
      interval:'',
    }
  },
  directives: {
  },
  mounted(){
    if(this.type==0){
       this.getLoginVCode(); // 调用获取验证码接口
    }else{
 
    }
  },
  methods: {
    // 获取验证码
    getLoginVCode() {
      http({
        method: 'post',
        url: api.getLoginVCode,
        data: { mobile: this.mobileNum },
      }).then((res)=> {
        if(res.data.code == 1000){
          this.timingCode();
          this.$toast("发送成功");
        }else {
          this.$toast(res.data.msg);
        }
      })
    },
    dial_phone(tel){
      dooolyAPP.callPhone(tel);
    },
    // 校验原密码
    getValoldPassword(){
      http({
        method: 'post',
        url: api.validPayPassword,
        data: { 
          userId: localStorage.userId,
          payPassword: utils.encrypt(this.oldPassword)
        },
      }).then((res)=> {
        if(res.data.code == 1000){
          this.step = 1;
          this.numbers = '';
        }else if(res.data.code == 1001) {
          document.activeElement.blur();
          this.$messageBox({
            title:'原支付密码错误',
            message: '',
            confirmButtonText: '再试一次',
            cancelButtonText: '忘记密码',
            showCancelButton: true
          }).then(action => {
            if(action == "cancel"){ // 忘记密码跳转至验证码验证身份页面
              this.type =0;
              this.getLoginVCode();
              this.numbers = '';
            }
          })
        }
      })
    },
    // 60s倒计时
    timingCode() {
      if (this.timeNum > 1 && this.timeNum < 61) {
        this.codeState = false;
        this.timeNum--;
        this.interval = setTimeout(() => this.timingCode(), 1000);
      }else if (this.timeNum <= 1) {
        this.codeState = true;
        clearInterval(this.interval);
        this.timeNum = 60;
      }
    },
    resets(){//重置状态
      dooolyAPP.initTitle('身份验证');
      this.step = 0;
      this.numbers = '';
    },
  },
  watch:{
    numbers(val){
      if(this.step === 0){
        dooolyAPP.initTitle('身份验证');
      }else if(this.step ===1){
        dooolyAPP.initTitle('设置密码');
      }else{
        dooolyAPP.initTitle('确认密码');
      }
      this.numbers=this.numbers.replace(/[^\d]/g,'');
      if(val.length === 6 && this.step === 0){ // 第一步
        if(this.type == 1){ // 修改支付密码校验原本支付密码
          this.oldPassword = this.numbers;
          this.getValoldPassword(); // 校验原密码
        }else if(this.type == 0){ // 校验验证码
          http({
            method: 'post',
            url: api.checkValidCode,
            data: {
              mobile: this.mobileNum,
              code: this.numbers,
            }
          }).then((res) => {
            if(res.data.code == "1000"){
              dooolyAPP.initTitle('设置密码');
              this.step = 1;
              this.numbers = '';
            }else if(res.data.code == "1002") {
              this.$toast("验证码错误");
              this.numbers = '';
            }
          }) 
        }    
      }else if(val.length === 6 && this.step === 1){ //第二步
        this.step = 2;
        this.secondStepNum = this.numbers;
        this.numbers = '';
      }else if(val.length === 6 && this.step === 2){ //第三步
        this.thirdStepNum = this.numbers;
        if(this.secondStepNum == this.thirdStepNum){
          http({
            method: 'post',
            url: api.setPayPassword,
            data: {
              userId: localStorage.userId,
              payPassword: utils.encrypt(this.thirdStepNum),
              isPayPassword:(this.way == 1? 2 : '')
            }
          }).then((res) => {
            if(res.data.code == 1000){
              this.$toast("设置成功")
              if(!localStorage.isPayPassword){
                localStorage.isPayPassword = 1;
              }
              if(this.way==0 || this.way==1){
                if(this.way==1){
                  localStorage.isPayPassword = 2;
                }
                if(browserName == "WebKit"){ // ios
                  window.webkit.messageHandlers.popToRoot.postMessage(JSON.stringify({isPayPassword:localStorage.isPayPassword}));
                }else if(browserName == "Chrome WebView"){
                  RHNativeJS.successPay(localStorage.isPayPassword);
                  RHNativeJS.jumpSysSetting();
                }else{
                  window.history.go(-2);
                }
              }else if(this.way==2){
                dooolyAPP.goBackPageIndex(1);
              }else{
                if(browserName == "WebKit"){ // ios
                  window.webkit.messageHandlers.popToRoot.postMessage(JSON.stringify({isPayPassword:this.option}));
                }else if(browserName == "Chrome WebView"){
                  RHNativeJS.successPay(this.option);
                  RHNativeJS.jumpSysSetting();
                }else{
                  window.history.go(-2);
                }
              }
            }
          })
        }else{
          this.$toast("密码设置不一致");
        }
      }
    },
  },
  created(){
    dooolyAPP.initTitle('身份验证');
  },
}
</script>
 
<style lang="scss" scoped>
  [v-cloak] {
    display: none;
  }
  html,body,.g-doc,#app{
    height: 100%;
  }
  .m-step-1{
      display:flex;
      &:after{
        content: " ";
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        height: 0.24rem;
        width: 100%;
        background: #ececec;
      }
      .item{
        padding-top: 0.5rem;
        width: 33.3%;
        &:after{
          content: " ";
          position: absolute;
          top: 0;
          display: inline-block;
          height: 0.24rem;
          width: 100%;
        }
        b{
          position: absolute;
          top: 0;
          z-index: 1;
          left: 50%;
          margin-left: -0.2rem;
          display: block;
          width: 0.4rem;
          height: 0.4rem;
          text-align: center;
          line-height: 0.4rem;
          font-size: 0.28rem;
          border-radius: 50%;
          background: #ececec;
          color: #ccc;
        }
        .step-txt{
        text-align: center;
        font-size: 0.24rem;
        color: #999;
        }
      }
      .step-cur{
        @at-root .step-cur-0:after, &:after{
          background: #ee3f44;
        }
 
        &:after{
          border-radius:0 0.24rem 0.24rem 0
        }
        @at-root .m-step .step-cur-0 b, & b{
          background: #ee3f44;
          color: #fff;
        }
        @at-root .m-step .step-cur-0 .step-txt{
          color: #ee3f44;
        }
        .step-txt{
          color: #ee3f44;
        }
      }
      
  }
 
 
  .m-mm_box{
    margin-top: 1.28rem;
    .tit{
      margin-bottom: 0.34rem;
    }
    .tit2{
      margin-top: 0.24rem;
      color: #999;
    }
    .tit2 span{
      color:#ee3f44;
    }
    @at-root .mm_box{
      position: relative;
      width: 6.1rem;
      height: 1rem;
      margin:  0 auto;
      border: 1px solid #bebebe;
      overflow: hidden;
      display: flex;
      .item{
        height: 1rem;
        width: 16.8%;
        line-height: 1rem;
        text-align: center;
        font-size: 0.4rem;
        color: #333;
        &:not(:last-of-type) {
          border-right: 1px solid #ddd;
        }
      }
      input{
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 100%;
        opacity: 0;
        font-size: 0.24rem; // fix bug input不触发 -- zhaoyang 1224
        color: transparent;
        text-shadow: 0 0 0 #fff;
        text-indent: -999em;  // 文本向左缩进
        margin-left: -50%;
      }
      input::-webkit-input-placeholder{
        color: #cccccc;
        -webkit-text-fill-color: #ccc;
        opacity: 1;
        -webkit-opacity:1;
        margin-top: 0.2rem;
      }
      input:disabled{
        background: none;
        color: #333;
        -webkit-text-fill-color: #333;
        opacity: 1;
        -webkit-opacity:1;
      }
      input:disabled::-webkit-input-placeholder{
        color: #cccccc;
        -webkit-text-fill-color: #ccc;
        opacity: 1;
        -webkit-opacity:1;
      }
    }
  }
  .m-tips{
    position: absolute;
    bottom: 0.5rem;
    left: 0.3rem;
    font-size: 0.24rem;
    h3{
      padding-bottom: 0.12rem;
      color: #666;
    }
    p{
      color: #999;
    }
    a{
      color: #999;
    }
  }
</style>