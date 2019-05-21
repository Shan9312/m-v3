<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template> 
<script>
export default {
  name: 'app',
  data() {
    return {
    }
  },
  mounted() {
    window.onload=function(){window.scrollTo(0,0)};
    const locationHref = location.href.indexOf('#');
    const path = location.href.substring(locationHref + 2);
    //版本升级
    // const versions = ['dist2.2.1', 'dist2.1.4', 'dist2.2.0'];
    // if(versions.filter(x => location.href.indexOf(x) > -1 ).length > 0){
    //   this.$router.replace({path: '/v3/versionControl'});
    //   return;
    // }
    //配置无需登陆的页面数组
    const pathArr = ['groupCommandPage', 'activate', 'userProtocol', 'guideArticle', 'activePage', 'activity_index',
      'activity_ground', 'baili2_index', 'resetPassword', 'companyLogin', 'family_ground', 'vip_activate',
      'vip_activate2', 'groupCommand', 'card_question', 'activity_BCM_success', 'activity_BCM_index',
      'activity_activate', 'activity_activate2', 'activity_invitation','memberEquity'
    ];
    if (!localStorage.token && path != '' && pathArr.filter(x => path.indexOf(x) > -1 ).length == 0) {
      if (path) {
        localStorage.loginUrl = path;
      }
      dooolyAPP.logOut.call(this);
    }
  }
}
</script>

<style>
#app {
  font-family: "PingFang",Helvetica, Arial, "Avenir", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>


