<template>
  <div class="container">
    <div class="logo">
      <img src="../../assets/images/personalCenter/aboutDoooly/logo_min.png" ><br>
      <p style="font-size:0.36rem;color: #333;">兜礼</p>
      <span v-if="browserVersion">版本v<span class="VersionName">{{versionName}}</span></span>
    </div>
    
    <footer>
      <div class="button_view">
        <div class="button" @click="check" v-if="browserVersion">检查更新</div>
        <div class="button" @click="user_agreement">隐私声明</div>
      </div>
      <span>上海睿渠网络技术有限公司版权所有</span><br>
      <span>Copyring@reach-life 2016-2018 all right reserved</span>
    </footer>
  </div>
</template>

<script>
  var globalVue;
  window["getAppVersionName"] = function(data) {
    globalVue.versionName=data;
  };
  export default {
    name: "aboutDoooly",
    data(){
        return{
          browserVersion:false,
          versionName:"",
        }
    },
    created(){
      dooolyAPP.initTitle('关于兜礼','');
      globalVue = this;
      dooolyAPP.getAppVersionName('getAppVersionName');
      if(this.$browserName == "WebKit" || this.$browserName == "Chrome WebView"){
        this.browserVersion=true;
      }else {
        this.browserVersion=false;
      }
    },
    methods: {
      user_agreement(){
        dooolyAPP.gotoJumpVue(this.$router,'/userProtocol');
      },
      check(){
        dooolyAPP.checkAppVersion.call(this);
      },
    },
  }
</script>

<style scoped>
  .container{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .container .logo{
    position: fixed;
    top: 2.6rem;
    width: 100%;
    text-align: center;
    font-size: 0;
    display: inline-block;
    text-align: center;
  }
  .container .logo img{
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.2rem;
  }
  .container .logo span{
    font-size: 0.3rem;
    color: #999999;
  }
  .container footer{
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    text-align: center;
    font-size: 0;
    padding-bottom: 0.6rem;
  }
  .container footer img{
    width: 5.78rem;
    margin-bottom: 0.5rem;
  }
  .container footer img.doooly{
    width: 1.56rem;
    margin-bottom: 0.3rem;
  }
  .container footer span{
    font-size:0.24rem;
    color:#999;
    line-height: 0.3rem;
  }
  .button_view{
    margin-bottom: 1.04rem;
  }
  .button{
    margin:0 auto;
    margin-top: 0.4rem;
    width: 2.6rem;
    line-height: 0.72rem;
    border: 1px solid #A2A2A2;
    border-radius: 0.1rem;
    text-align: center;
    font-size: 0.28rem;
    color: #333;
  }
</style>
