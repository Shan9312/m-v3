<template>
  <div class="bg">
    <header><img src="../../assets/images/personalCenter/accountSecurity/doooly_logo.png" /></header>
    <!-- main开始 -->
    <section>
      <article>
        <div class="input_div">
          <input v-model="oldpsw" maxlength="6" minlength="6" type="tel" placeholder="请输入旧密码"
                 name="oldPassword"/>
        </div>
      </article>
      <article>
        <div class="input_div">
          <input v-model="newpsw" maxlength="6" minlength="6" type="tel" placeholder="请输入新密码"
                 name="newPassword"/>
        </div>
      </article>
      <article>
        <div class="input_div">
          <input v-model="confirmPassword" maxlength="6" minlength="6" type="tel"
                 name="okPassword" placeholder="请确认新密码"/>
        </div>
      </article>
      <p class="p_txt">密码为6位数字</p>
      <div class="btn-div">
        <button class="validate" id="okBtn" @click="confirmBtn()">确认修改</button>
      </div>
    </section>
  </div>
</template>

<script>
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  import Cookies from 'js-cookie';
    export default {
        name: "modifyLoginPw",
      data(){
          return{
            oldpsw:"",
            newpsw:"",
            confirmPassword:"",
          }
      },
      created(){
        initTitle('修改登录密码','')
      },
      mounted(){
      },
      methods:{
        confirmBtn:function () {
          if(isNaN(this.newpsw)){
            this.$toast("请输入数字密码!");
            return;
          }
          if(isNaN(this.confirmPassword)){
            this.$toast("请输入数字密码!");
            return;
          }
          if (this.oldpsw.length != 6) {
            this.$toast("请输入正确旧密码!");
            return;
          }
          if (this.newpsw.length != 6) {
            this.$toast("请输入6位新密码!");
            return;
          }
          if (this.confirmPassword.length != 6) {
            this.$toast("请确认6位新密码!");
            return;
          }
          if (this.newpsw != this.confirmPassword) {
            this.$toast("两次新密码输入不一致,请重新输入!");
            return;
          }
          http({
            method: 'post',
            url: api.modifyLoginPw+"?oldPassword="+this.oldpsw+"&newPassword="+this.newpsw,
          }).then(
            (res) => {
              if (res.data.code == "1001") {
                this.$toast("密码修改成功,请返回登录!");
                this.app_url();
              }
              else if (res.data.code == '1003') {
                this.$toast("超时，请重新登录!");
                this.app_url();
              }
              else {
                this.$toast("服务异常，请稍后再试");
              }
            }
          );
        },
        app_url:function () {
          if(browserName == "WebKit"){
            window.webkit.messageHandlers.forceLoginOut.postMessage('forceLoginOut');
          }else if(browserName == "Chrome WebView"){
            RHNativeJS.forceLoginOut('修改成功！');//登录页
          }
          else {
            localStorage.redirectUrl="/nav/personalCenter";
            this.$router.push('/');
          }
        }
      }
    }
</script>

<style scoped>
  .bg{
    background-color:#ECECEC;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
  .divCheckCode {
    background: white;
    border-top: 1px;
    border-bottom: 1px;
    margin-top: 3%;
  }

  .divChecktext {
    border-top: 1px;
    border-bottom: 1px;
    margin-top: 3%;
    text-align: center;
  }

  .onePassword {
    padding: 3%;
  }

  .promptBoxOne {
    POSITION: absolute;
    background-color: white;
    text-align: center;
    z-index: 9999;
    padding: 20px;
    width: 220px;
    height: 150px;
    top: 13%;
    left: 22%;
    border-radius: 15px;
  }

  .mask {
    background: #000;
    opacity: 0.5; 
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100; 
  }

  .float-right {
    float: right;
    font-size: 1.2rem;
  }

  .weidaojishi {
    background: #fe9002;
  }

  .daijishi {
    background: #b1b0b0;
  }

  .inputcheckcode {
    padding: 5% 3% 5% 3%;
    width: 70%;
    float: left;
    background: #ffffff;
  }

  .yanzhengmadiv {
    padding: 5% 3% 5% 3%;
    width: 30%;
    float: right;
    color: #ffca7b;
    text-align: center
  }
  header{
    background:#ECECEC;
    width: 100%;
    text-align: center;
    font-size: 0.3rem;
  }
  header img {
    width: 2.14rem;
    padding-top: 0.75rem;
    padding-bottom: 0.85rem;
  }
  section{background-color:#ECECEC;}
  section article {
    width: 6.68rem;
    margin: 0.3rem auto 0;
  }
  section article input{ -webkit-text-security:disc; text-security:disc; }
  section article div{padding:0 !important;}
  .p_txt {
    width: 6.68rem;
    margin: 0 auto;
    font-size: 0.3rem;
    color:#999;
  }
  .input_div{
    border: 1px solid #c9c9c9;
    border-radius: 0.1rem;
    height: 0.77rem;
    width: 6.66rem;
    padding: 0 !important;
  }
  .input_div input{
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 0.3rem;
    display: block;
    text-indent: 0.1rem;
    outline: none;
    border-radius: 0.1rem;
    margin: 0 !important;
    border: 0 !important;
  }
  .btn-div{margin-top:10% }
  .btn-div button {
    width: 6.67rem;
    height: 1.05rem;
    margin: 0 auto;
    border: 0;
    background: #ee3f44;
    display: block;
    border-radius: 0.17rem;
    font-size: 0.36rem;
    color: #fff;
  }
  #alr_loading{display:none;}
</style>
