<template>
  <div>
    <img src="../../assets/images/JDK_rule.jpg" width="100%">
    <footer @click="JDK_jump()">立即进入京东</footer>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  export default {
    components: {
      api
    },
    data() {
      return {
        id:this.$route.params.id,
        url:'',
      }
    },
    created(){
      initTitle('京东返利规则','');
      http({
          method: 'get',
          url: api.businessInfoForAjax+'?dealType=0&id='+this.id,
        }).then((res) => {
          this.url = res.data.data.adBusiness.url;
      })
    },
    methods:{
      JDK_jump(){
        if(browserName == "WebKit" || browserName == "Chrome WebView"){
          dooolyAPP.openJDHome();
        }else{
          window.location.href = this.url + '&mopenbp5='+localStorage.mobile;
        }
      }
    }
  }
</script>
<style scoped>
    img{
        margin-bottom: 1rem;
    }
    footer{
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: center;
        width: 100%;
        font-size: 0.34rem;
        background: #ee3f44;
        line-height: 1rem;
        color: #fff;
    }
</style>
