<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {}
  },
  mounted() {
    window.onload=function(){window.scrollTo(0,0)};
  },
  watch:{
    '$route'(newV,oldV){
      if(newV == oldV){
        return;
      }
      //版本升级
      if (browserName == "WebKit" || browserName == "Chrome WebView") {
        const versions = ['dist_v3.0.0', 'cashier_v3.0.0', 'activity_v3.0.0'];
        if(versions.filter(x => location.href.indexOf(x) > -1 ).length == 0){
          this.$router.replace({path: '/v3/versionControl'});
          return;
        }
      }
      if (!localStorage.token && !newV.meta.requireAuth) {
        dooolyAPP.logOut(1);
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: "PingFang", Helvetica, Arial, "Avenir", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
