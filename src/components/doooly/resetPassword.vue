<template>
  <div class="view">
    <!-- <div>测试</div> -->
    <div class="header_top"></div>
    <header v-if="typeAPP">
      <img :class="{'min_logo':min_logo}" src="../../assets/images/logo.png"/>
    </header>
    <header v-else >
      <img  src="../../assets/images/wg/logo.jpg"/>
      <p class="tips c-999 font-size028">欢迎中国宝武武汉总部员工加入钢城e家</p>
    </header>
    <div class="header_bottom"></div>
    <section class="logo_main">
      <form @focusin="focusinMethod" @focusout="focusoutMethod">
        <!--手机登录-->
        <div id="log1" v-if="mobileState">
          <article class="clearfix tel">
            <div class="index_div">
              <input type="tel" v-model="mobileNum" class="form-control" maxlength="11"
                     name="loginMobile" placeholder="请输入手机号码">
            </div>
          </article>
          <article class="clearfix">
            <div class="index_div">
              <input type="tel" v-model="validCodeNum" placeholder="请输入验证码" class="form-control" maxlength="6" id="code"
                     name="code">
              <div class="code_btn_txt" @click="getValidCode" v-if="codeState">获取验证码</div>
              <div class="code_btn_txt" v-if="codeState2">获取验证码</div>
              <div class="code_btn_d" v-if="!codeState&&!codeState2">{{timeNum}}s后重新获取</div>
            </div>
          </article>
          <div class="btn_div_d">
            <button @click="mobileLogin" class="btn" :disabled="log1Disable" id="log1_dl" type="button"
                    :class="classObject1">{{loginText}}
            </button>
          </div>
        </div>

      </form>
      <div class="deal_div clearfix">
        <div v-if="typeAPP" class="fl"><a @click="user_agreement" >用户登录即代表同意<span>《用户协议》</span></a>
        </div>
      </div>
    </section>
    <div  class="coverBg" v-if="nonentityVisible">
      <div class="alt_nonentity">
        <div class="alt_title">账号不存在</div>
        <div class="model_con">此手机号未被激活，无法享受兜礼服务， 是否通过验证激活方式来激活会员账户</div>
        <div class="model_btn_div">
          <button type="button" @click="cancelActivateBtn()" class="cancel">取消</button>
          <button type="button" @click="confirmActivateBtn()" class="active">激活</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import Cookies from 'js-cookie';
  import md5 from 'js-md5';

  export default {
    name: "resetPassword",
    data() {
      let typeAPP = true;
      if(/wiscowechat/.test(window.location.href)){
        typeAPP = false;
      }
      return {
        headerImgSrc: 'http://test1.doooly.com/resources/wechat/images/staff_a/logo_header.jpg',
        typeAPP: typeAPP,
        mobileState: true,
        mobileNum: "",
        accountNum: "",
        validCodeNum: "",
        passwordNum: "",
        codeState: true,
        timeNum: 60,
        loginText: "登录",
        loginText2: "登录",
        isLoading: false,
        isLoading2: false,
        accountState: false,
        nonentityVisible:false,
        alr_show:false,
        min_logo:false,
        screenHeight:'',
        codeState2:false
      }
    },
    computed: {
      // log1 登录状态控制
      log1Disable: function () {
        if ((this.mobileNum == "" || this.validCodeNum == "") || this.isLoading) {
          return true
        }
        else {
          return false
        }
      },
      //log1 登录样式控制
      classObject1: function () {
        if ((this.mobileNum != "" && this.validCodeNum != "") && !this.isLoading) {
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
    mounted(){
    },
    methods: {
      confirmFindPSW(){
        this.alr_show=false;
        this.$router.push('resetPassword');

      },

      focusinMethod() {
        this.min_logo=true
      },
      focusoutMethod() {
        this.min_logo=false
      },
      checkMobile() {
        let re = /^1[3|4|5|6|7|8][0-9]{9}$/;
        if (this.mobileNum == "") {
          this.$toast("手机号不能为空");
          return false;
        }
        else if (!re.test(this.mobileNum) || this.mobileNum.length != 11) {
          this.$toast("手机号格式错误！");
          return false;
        }
        else {
          return true;
        }
      },
      // 60s倒计时
      timingCode() {
        let interval = setInterval(() => {
          if (this.timeNum > 0 && this.timeNum < 61) {
            this.codeState = false;
            this.timeNum--;
          }
          else if (this.timeNum == 0) {
            this.codeState = true;
            clearInterval(interval);
            this.timeNum = 60;
          }
        }, 1000)
      },
      // 获取验证码
      getValidCode() {
        this.codeState=false;
        this.codeState2=true;
        if (this.checkMobile() == false) {
          this.codeState2=false;
          this.codeState=true;
          return false;
        }
        http({
          method: 'post',
          url: api.getLoginVCode,
          data: {
            mobile: this.mobileNum
          }
        }).then((res) => {
            this.codeState2=false;
            if (res.data.code == 1000) {
              this.timingCode();
              this.$toast("发送成功");
            }else {
              this.codeState=true;
              this.$toast("发送失败");
            }
          }
        ).catch((error) => {
          this.codeState2=false;
        })
      },

      mobileLogin() {
        if (this.checkMobile() == false) {
          return false;
        }
        if (isNaN(this.validCodeNum) || this.validCodeNum.length != 6) {
          this.$toast("请输入正确的验证码");
          return false;
        }
        this.loginText = "登录中";
        this.isLoading = true;

        http({
          method: 'post',
          url: api.resetPwd,
          data: {
            mobile: this.mobileNum,
            verifyCode: this.validCodeNum
          }
        }).then((res) => {
            if (res.data.code == "1000") {
              let str=res.data.userInfo;
              dooolyAPP.logIn(str);
            }
            else {
              if (res.data.code == "1004" || res.data.code == "1003") {
                this.$router.push({path: '/vip_activate'});//需求更改直接跳转激活页面
                localStorage.activateMobile = this.mobileNum;
              }else{
                this.$messageBox({
                  title: '提示',
                  message: res.data.msg,
                  showCancelButton: true
                });
              }
              this.loginText = "登录";
              this.isLoading = false;
            }
          })
      },
      //账号不存在
      altNonentity() {
        this.nonentityVisible=true;
      },
      //账号不存在-取消激活
      cancelActivateBtn(){
        this.nonentityVisible=false;
      },
      //账号不存在-确认激活
      confirmActivateBtn(){
        this.$router.push({path: '/activePage'});
        this.nonentityVisible=false;
      },
      //退出当前账户
      altQuit() {
        this.$messageBox('账号不存在');
      },
      altAwaitActive(date) {
        this.$messageBox('等待激活', '您已经在' + date + '提交过申请，我们会在5个工作日内完成审核。如有疑问，您可以拨打客服电话400-158-2212('+dooolyConfig.serviceTime+')');
      },
      //审核未通过
      altUnapprove() {
        this.$messageBox('提示', '很抱歉您自主申请的兜礼会员审核未通过，请与所在单位联系！');
      },
      //账号异常
      altAccountError() {
        this.$messageBox({
          title: '账号异常',
          message: '亲爱的会员，您的账号存在异常，请拨打客服电话“400-158-2212”进行处理 ('+dooolyConfig.serviceTime+')',
          confirmButtonText: '立即拨打',
          cancelButtonText: '取消',
          showCancelButton: true
        }).then(({value, action}) => {
          this.mobileCall();
        });
      },
      user_agreement(){
        this.$router.push('userProtocol');
      },
      appInit() {
        dooolyAPP.getPhoneDeviceId("phoneid");
      },
    },
    created() {
      dooolyAPP.initTitle('忘记密码');
      this.appInit();
    },
  }
</script>

<style scoped>
  .view{
    position: fixed;
    left: 0;
    top:0;
    width: 100%;
    background: #ffffff;
    height: 100%;
  }
  header{
    text-align: center;
    font-size: 0;
    height: 10.5%;
    min-height: 1.4rem;
  }
  .header_top{
    width: 100%;
    height: 10%
  }
  .header_bottom{
    width: 100%;
    height: 7%
  }
  header img {
    width: 1.4rem;
  }
  header img.min_logo{
    width: 1rem;
  }

  .logo_main {
    background: #fff;
    padding: 0 0.6rem;
    height: 4.48rem;
  }
  form{
    height: 85%;
  }
  .clearfix {
    zoom: 1;
  }
  #log1,#log2{
    height: 100%;
  }
  article{
    height: 33%;
  }
  .index_div {
    border: 0;
    border-bottom: 1px solid #ECECEC;
    margin-top: 0.4rem;
    float: left;
    height: 65%;
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

  .btn_div_d {
    margin-top: 0.4rem;
    background: #fff;
    color: #ee3f44;
    border: none;
    width: 100%;
    height: 23%;
    font-size: 0.36rem;
    border-radius: 0 0 5px 5px;
  }

  .btn_div_d .btn {
    text-align: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    border: 0;
    border-radius: 0.08rem;
    display: block;
    font-size: 0.32rem;
  }

  .btn_div_d .dis_btn {
    color: #f9c5c6;
    background: #f58c8f;
  }

  .btn_div_d .click_btn {
    color: #fff;
    background: #ee3f44;
  }

  .deal_div {
    margin-top: 0.3rem;
    font-size: 0.24rem;
  }

  .disableCss {
    color: #333;
    text-decoration: none;
    background: #fff;
    font-size: 0.24rem;
    cursor: pointer;
  }

  .footer_fixed {
    margin: 0;
    background: #fff;
    height: 22%;
    text-align: right;
  }

  .footer-wrapper {
    width: 100%;
    background: #fff;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent; /* For some Androids低版本的安卓，4.0以下 */
    -webkit-tap-highlight-color: #000000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .btn_block {

    font-size: 0.28rem;
    background: #fff;
    color: #ee3f44;
    float: right;
    display: inline-block;
    margin-right:0.6rem;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent; /* For some Androids低版本的安卓，4.0以下 */
    -webkit-tap-highlight-color: #000000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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

  .fl a {
    color: #999;
  }

  .fl span {
    color: #666;
    font-size: 0.24rem;
  }

  .code_btn_d {
    float: right;
    display: inline-block;
    margin: 0;
    font-size: 0.28rem;
    color: #999;
    background: #fff;
    margin-top: 0.2rem;
    width: 2rem;
    text-align: right;
  }

  .alr_bg{position: fixed;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,0.4);z-index: 9999;}

  .model_btn_div{width:100%;display:block;border-top:1px solid #ececec;height:1rem;line-height:1rem;margin-top: 0.3rem;border-radius: 0 0 5px 5px;}
  .model_btn_div .cancel,.model_btn_div .active{float:left;display: inline-block;
    width:49.9%;background: #fff;
    line-height:1rem;font-size: 0.32rem;
    text-align: center;
    border: none;
  }
  .model_btn_div .cancel{color:#333;border-right:1px solid #ececec;border-radius: 0 0 0 0.2rem;}
  .model_btn_div .active{color:#ee3f44;border-radius: 0 0 0.2rem 0;}

  .result{position: absolute; width: 6rem; min-height: 3rem;left: 10%;top: 30%;background: #fff;border-radius: 0.2rem;z-index: 100000;}
  .btn_bottom{border: 0;background: #fff;font-size: 0.3rem;color: #ee3f44;line-height: 1rem;text-align: center;width: 100%;border-radius: 0 0 0.2rem 0.2rem;}
  .model_title{font-size: 0.42rem; margin-top: 0.7rem;color: #333;}
  .model_con{line-height: 0.42rem;font-size: 0.3rem;color: #999;text-align: center;padding:0 0.26rem;}
  .btn_div{background: #fff;color: #ee3f44; border: none;width:100%; line-height: 1rem;font-size: 0.36rem;border-top: 1px solid #ddd;border-radius: 0 0 5px 5px;}
  .btn_div .btn_bottom{border: 0;background: #fff;font-size: 0.42rem;color: #ee3f44;}
  .color_ee3f44{color:#ee3f44;}
  .alt_nonentity,.alt_tate,.alt_succeed{position: absolute;width:70%;min-height: 3rem;left:15%;top: 30%;background: #fff;border-radius: 0.2rem;z-index: 100000;}
  .alt_title{margin-top: 0.6rem;font-size: 0.36rem;}
  .disableCss{color: #333;text-decoration: none;background: #fff;font-size: 0.24rem;cursor: pointer;}

  .coverBg{position: fixed;left: 0;top: 0; width: 100%;height: 100%;background:rgba(0,0,0,0.4);z-index: 9999;}
  .alt,.alt1,.alt2,.alt3{position: absolute; width: 6rem;min-height: 3rem;left: 10%;top: 30%;background: #fff;border-radius: 0.2rem;z-index: 100000;padding-bottom:0.2rem;}
  .alt_title{font-size: 0.32rem; padding-bottom:0.2rem;width:100%;text-align:center;background: #fff!important;margin-top:0.5rem;font-weight:bold}
  .alt p,.alt1 p{font-size: 0.28rem;text-align: center;width:4.9rem;margin:0 auto;color:#323232;text-indent:0!important;}
  .alt2 p,.alt3 p{font-size: 0.28rem;text-align: center;width:80%;margin:0 auto;margin-top:0.5rem;color:#323232;text-indent:0!important;}
  .btn_div{width:100%;text-align:center;background: #fff!important;margin-top:0.5rem;padding: 0;}
  .alt input,.alt1 input,.alt2 input,.alt3 input{line-height: 0.5rem;width: 1.6rem;text-align: center; border-radius: 0.1rem;font-size: 0.24rem;color: #fff;border:0}
  .dial{display:inline-block; width: 1.6rem;line-height: 0.5rem;text-align: center;border-radius: 0.1rem;font-size: 0.24rem;color: #fff;}
  .active{background: #ee3f43;}
  .cancel{background: #868686;}

  .tips{
    margin-top: 0.25rem;
  }
  .font-size028{
    font-size: 0.28rem;
  }
  .c-999{
    color: #999;
  }
</style>
