/**vue全家桶**/
import Vue from 'vue';
import router from './router';
import store from './vuex/store';
import App from './app';
import '@/assets/js/deviceInit.js';

/**本地公共组建**/
import Component from '@/components/common/component';
Component(Vue);

/**第三方插件库**/
import '@babel/polyfill';

import baiduStats from './util/baidu_stats.js';
Vue.prototype.$baiduStats = baiduStats;

import VueJsonp from 'vue-jsonp';
Vue.use(VueJsonp);

import AMap from 'vue-amap';
Vue.use(AMap);
AMap.initAMapApiLoader({
  key: 'b71258e6348a78d285e5645dda910d5a',
  plugin: ['AMap.Geocoder', 'AMap.Driving', 'AMap.Walking', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

import VueTouch from 'vue-touch';
VueTouch.config.swipe = {
  direction: 'horizontal'
};
Vue.use(VueTouch, {
  name: 'v-touch'
});

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

import {
  MessageBox
} from 'mint-ui';

/**本地样式资源**/
import '@/assets/css/base/common.scss';
import '@/assets/css/base/my-mintui.scss'

/**vue-router拦截**/
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { // 匹配前往的路由不存在
    from.name ? next({
      name: from.name
    }) : next('v3/error') // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  }else{
    //配置无需登陆的页面数组
    if (!localStorage.token && !to.meta.requireAuth) {
      dooolyAPP.logOut(1);
    } else {
      if (locationHref.indexOf('companyLogin') > -1) {
        router.replace({
          path: '/v3/home'
        });
      }
    }
    next();
  }
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0);
  if (MessageBox.close) {
    MessageBox.close();
  }
  // 百度统计
  if (typeof _hmt != 'undefined') {
    _hmt.push(['_setAutoPageview', false])
    _hmt.push(['_trackPageview', `${location.pathname}custom${to.path}`])
  }
});

router.onError((error) => {
  const targetPath = router.history.pending.fullPath;
  router.replace(targetPath);
});

/**实例化Vue**/
let vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 百度统计事件点击统一处理
window.addEventListener('click', (event) => {
  // let name = vm.$route.name;
  let name = '';
  let target = event.target || event.srcElement
  while (target && target.dataset && !target.dataset.baiduStats) {
    target = target.parentNode ? target.parentNode : ''
  }
  if (target && target.dataset && target.dataset.baiduStats) {
    name = target.dataset.routeName;
    baiduStats(target.dataset.baiduStats, name, vm);
  }
})

// import './error-log';