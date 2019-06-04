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
    //版本升级
    // const versions = ['dist2.2.1', 'dist2.1.4', 'dist2.2.0'];
    // if(versions.filter(x => location.href.indexOf(x) > -1 ).length > 0){
    //   this.$router.replace({path: '/v3/versionControl'});
    //   return;
    // }
  },
  watch:{
    '$route'(newV,oldV){
      if(newV == oldV){
        return;
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
