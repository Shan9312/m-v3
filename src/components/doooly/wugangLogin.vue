<template id="">
  <div class="">
    <Login v-if="!isShow">
      <header slot="header">
        <img  src="../../assets/images/wg/logo.jpg"/>
        <p class="tips c-999 font-size028">欢迎中国宝武武汉总部员工加入钢城e家</p>
     </header>
    </Login>
  </div>
</template>

<script>
  import Login from './login'
  export default {
    name: "wugangLogin",
    components: {
      Login
    },
    data() {
      return {
        isShow: localStorage.token
      }
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
