<template id="">
  <div class="">
    <Login v-if="!isShow">
      <header slot="header">
        <img :src="titleImg"/>
        <p class="tips c-999 font-size028">{{titleText}}</p>
     </header>
    </Login>
  </div>
</template>

<script>
  import Login from './login'
  export default {
    name: "companyLogin",
    components: {
      Login
    },
    data() {
      return {
        isShow: localStorage.token,
        companyName:this.$route.params.companyName
      }
    },
    computed:{
      titleImg() {
        if(this.companyName == 'wugang'){
          return require("../../assets/images/wg/logo.jpg");
        }else if(this.companyName == 'zfh'){
          return require("../../assets/images/zfh.png");
        }
      },
      titleText() {
        if(this.companyName == 'wugang'){
          return "欢迎中国宝武武汉总部员工加入钢城e家";
        }else if(this.companyName == 'zfh'){
          return "";
        }
      },
    },
    mounted(){
      if(sessionStorage['guideArticleUrl']){
        if(window.location.href.split('#/')[0] === sessionStorage['guideArticleUrl'].split('#/')[0]){
          this.$router.push({path: sessionStorage['guideArticleUrl'].split('#/')[1]});
        }
      }
    },
    beforeCreate(){
      if(localStorage.token)
      {
        if (this.$browserName == "WeChat") {
          window.location.href=this.$allConfig.jumpDomain.wx;
        }else {
          this.$router.push({path: '/nav/newHome'});
        }
      }
    }
  }
</script>
<style scoped>
header img{
  width: 1.6rem;
}
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
