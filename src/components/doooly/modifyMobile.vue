<template>
  <div class="bg">
    <header><img src="../../../src/assets/images/personalCenter/accountSecurity/tel.png" /></header>
    <section class="section_form">
      <article class="clearfix tel">
        <div class="index_div">
          <input type="tel" v-model="mobileNum" readonly="readonly" class="form-control" maxlength="11"
                 name="loginMobile" placeholder="请输入手机号码">
        </div>
      </article>
      <article class="clearfix">
        <div class="index_div">
          <input type="tel" v-model="validCodeNum" placeholder="请输入验证码" class="form-control" maxlength="6" id="code"
                 name="code">
          <div class="code_btn_txt" id="hq" @click="getValidCode" v-if="codeState">获取验证码</div>
          <div class="code_btn_d" v-if="!codeState">{{timeNum}}s后重新获取</div>
        </div>
      </article>
      <div class="btn_div_d">
        <button :disabled="nextStep" @click="okBtn()" :class="classObject">下一步</button>
      </div>
    </section>
    <footer class="footer_fixed">
      <div style="line-height:0.4rem;">
        <div class="btn_block" @click="nonValidPhone()">手机无法验证？</div>
      </div>
    </footer>
    <!-- 手机验证 start -->
    <div v-if="altNonentity" class="coverBg">
      <div class="alt_div alt_nonentity">
        <div class="alt_title">手机无法验证？</div>
        <div class="model_con">联系客服</div>
        <div class="model_title">400-158-2212</div>
        <div class="model_btn_div">
          <button type="button" class="btn_float cancel" @click="cancelBtn()">关闭</button>
          <button type="button" class="btn_float active" @click="mobileCall()">呼叫</button>
          <!--<a href="tel:400-158-2212" class="btn_float active">呼叫</a>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/assets/js/api.js';
  import http from '@/http/http'
    export default {
      name: "modifyMobile",
      data(){
          return{
            mobileNum:"",
            validCodeNum:"",
            codeState: true,
            timeNum:60,
            altNonentity:false,
            codeclick:false,
          }
      },
      created(){
        dooolyAPP.initTitle('修改手机号','')
      },
      mounted(){
        let mobile=localStorage.mobile;
        this.mobileNum=mobile.substr(0,3)+"****"+mobile.substr(7);
        this.$baiduStats('兜礼-我的-个人信息-修改手机号');
      },
      computed:{
        nextStep:function () {
          if(this.mobileNum =="" || this.validCodeNum == ""){
            return true
          }
          else {
            return false
          }
        },
        classObject: function () {
          if ((this.mobileNum != "" && this.validCodeNum != "")) {
            return {
              dis_btn: false,
              click_btn: true
            }
          }
          else {
            return {
              dis_btn: true,
              click_btn: false
            }
          }
        },
      },
      methods:{
        checkMobile() {
          if (this.mobileNum == "") {
            this.$toast("手机号不能为空");
            return false;
          }
          else if (this.mobileNum.length != 11) {
            this.$toast("手机号格式错误！");
            return false;
          }
          else {
            return true;
          }
        },
        getValidCode:function () {
          if (this.checkMobile() == false) {
            return;
          }
          if (this.codeclick) {
            return;
          }
          this.codeclick = true;
          http({
            method: 'post',
            url: api.modifyMobileGetCode+"?mobile="+localStorage.mobile,
          }).then((res) => {
            if (res.data.code == "1001") {
              this.timingCode();
            }
            else {
              this.$toast(res.data.msg.content);
            }
            this.codeclick = false;
          });
        },
        timingCode(){
          if (this.timeNum > 0 && this.timeNum < 61) {
            this.codeState = false;
            this.timeNum--;
          }else if (this.timeNum == 0) {
            this.codeState = true;
            clearInterval(interval);
            this.timeNum = 60;
          }
          let interval = setInterval(() => {
            if (this.timeNum > 0 && this.timeNum < 61) {
              this.codeState = false;
              this.timeNum--;
            }else if (this.timeNum == 0) {
              this.codeState = true;
              clearInterval(interval);
              this.timeNum = 60;
            }
          }, 1000);
        },
        okBtn:function () {
          if (this.checkMobile() == false) {
            return false;
          }
          if (isNaN(this.validCodeNum) || this.validCodeNum.length != 6) {
            this.$toast("请输入正确的验证码");
            return false;
          }
          http({
            method: 'post',
            url: api.modifyMobileStepOne+"?mobile="+localStorage.mobile+"&code="+this.validCodeNum,
          }).then((res) => {
            if (res.data.code == '1001') {
              this.$router.push({path:"/modifyMobileTwo"});
            } else {
              this.$toast(res.data.msg);
            }
          }
          ); 
        },
        //账号不存在
        nonValidPhone() {
          if(this.$browserName == "otherAPPAndroid"){
            dooolyAPP.callPhone('4001582212');
          }else{
            this.altNonentity=true;
          }
        },
        //拨打电话
        mobileCall() {
          dooolyAPP.callPhone('4001582212');
        },
        cancelBtn(){
          this.altNonentity=false;
        }
      },
      beforeCreate(){
        document.body.style.backgroundColor="#fff";
      },
      beforeDestroy(){
        document.body.style.backgroundColor="";
      },
    }
</script>

<style scoped>
  header{
    width: 100%;
    text-align: center;
    font-size: 0.3rem;
    font-weight: bold;
  }
  header img{
    width: 1.16rem;
    padding-top: 0.75rem;
    padding-bottom: 0.85rem;
  }
  .section_form{
    padding: 0 0.6rem;
    padding-bottom: 2.5rem;
    background: #fff;
    position: relative;
    z-index: 1;
  }
  .clearfix {
    zoom: 1;
  }
  .index_div {
    border: 0;
    border-bottom: 1px solid #ECECEC;
    margin-top: 0.4rem;
    float: left;
    height: 0.77rem;
    width: 100%;
  }

  .index_div .form-control {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 0.32rem;
    display: block;
    text-indent: 0.1rem;
    outline: none;
    border: 0;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .code_btn_txt {
    float: right;
    display: inline-block;
    margin: 0 !important;
    font-size: 0.28rem !important;
    color: #ee3f44 !important;
    background: #fff !important;
    margin-top: 0.2rem !important;
    width: 2rem !important;
    text-align: right;
    line-height: 0.3rem;
    height: 0.4rem !important;
    margin-right: 0.1rem !important;
    cursor: pointer;
  }
  #code {
    width: 3.6rem;
    float: left;
    display: inline-block;
  }
  .index_div .form-control::-webkit-input-placeholder { /* WebKit browsers */font-size:0.32rem;color:#ccc;border: 0;}
  .index_div .form-control:-moz-placeholder { /* Mozilla Firefox 4 to 18 */font-size:0.32rem;color:#ccc;border: 0;}
  .index_div .form-control::-moz-placeholder { /* Mozilla Firefox 19+ */font-size:0.32rem;color:#ccc;border: 0;}
  .index_div .form-control:-ms-input-placeholder { /* Internet Explorer 10+ */font-size:0.32rem;color:#ccc;border: 0;}
  .btn_div_d{
    margin-top: 0.4rem;
    background: #fff;
    color: #ee3f44;
    border: none;
    width:100%;
    line-height:0.82rem;
    font-size: 0.36rem;
    border-radius: 0 0 5px 5px;
  }
  .btn_div_d .dis_btn{
    text-align: center;
    line-height:0.82rem;
    width:100%;
    height: 0.82rem;
    margin: 0 auto;
    border: 0;
    background: #f58c8f;
    display: block;
    font-size: 0.32rem;
    color: #f9c5c6;
  }
  .btn_div_d .click_btn{
    text-align: center;
    line-height:0.82rem;
    width:100%;
    height: 0.82rem;
    margin: 0 auto;
    border: 0;
    background: #ee3f44;
    display: block;
    font-size: 0.32rem;
    color: #fff;
  }
  .code_btn_txt{
    float: right;
    display: inline-block;
    margin: 0 !important;
    font-size: 0.28rem !important;
    color: #ee3f44 !important;
    background: #fff !important;
    margin-top: 0.2rem !important;
    width: 2rem !important;
    text-align: right;
    line-height: 0.3rem;
    height: 0.4rem !important;
    margin-right: 0.1rem !important;
    cursor: pointer;
    padding: 0 !important;
  }
  .code_btn_d{
    float: right;
    display: inline-block;
    margin: 0;
    font-size:0.28rem;
    color:#999;
    background: #fff;
    margin-top: 0.2rem;
    width:2rem;
    text-align: right;
    padding: 0 !important;
  }
  .footer_fixed{
    margin: 0;
    position: fixed;
    background: #fff;
    width: 100%;
    bottom: 0.6rem;
    text-align: center;
  }
  .footer_fixed .btn_block{
    font-size: 0.28rem;
    background: #fff;
    color: #ee3f44;
    cursor: pointer;
    z-index: -1;
  }

  /* 弹出框 */
  .coverBg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 9999;
  }
  .alt_div{
    position: absolute;
    width: 70%;
    min-height: 3rem;
    left: 15%;
    top: 30%;
    background: #fff;
    border-radius: 0.2rem;
    z-index: 100000;
  }
  .alt_title{
    font-size: 0.36rem;
    padding-bottom: 0.2rem;
    width: 100%;
    text-align: center;
    background: #fff!important;
    margin-top: 0.6rem;
    font-weight: bold;
  }
  .model_con{
    line-height: 0.42rem;
    font-size: 0.3rem;
    color: #999;
    text-align: center;
    padding: 0 0.26rem;
  }
  .model_btn_div{
    width: 100%;
    text-align: center;
    display: block;
    border-top: 1px solid #ececec;
    height: 1rem;
    line-height: 1rem;
    margin-top: 0.3rem;
    border-radius: 0 0 0.2rem 0.2rem;
  }
  .model_btn_div .btn_float{
    float: left;
    display: inline-block;
    border: none;
    width: 49.9%;
    background: #fff;
    line-height: 1rem;
    font-size: 0.32rem;
    text-align: center;
  }
  .model_btn_div .cancel{
    color: #333;
    border-right: 1px solid #ececec;
    border-radius: 0 0 0 0.2rem;
  }
  .model_btn_div .active{
    color: #f05358;
    border-radius: 0 0 0.2rem 0;
  }
  .model_title{
    color: #f05358;
    text-align: center;
    font-size: 0.3rem;
    margin-top: 0.1rem;
  }
  .qut_active{text-align: center;color: #ee3f44;border-radius: 0 0 0.2rem 0;font-size: 0.32rem;}
</style>
