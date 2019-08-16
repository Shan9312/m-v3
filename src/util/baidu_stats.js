const browserName = globalProperties.getBrowserName();
// 百度统计
function baiduStats(operation, label, vm){
  var $route = (this && this.$route) || (vm && vm.$route);
  if (!label) {
    label = $route.name;
  }
  var sort = '';
  if (browserName === 'otherAPP') {
    sort = '第三方';
  } else if (browserName === "WeChat") {
    sort = 'WeChat'
  } else {
    sort = 'H5';
  }
  if (localStorage.groupShortName || localStorage.groupId) {
    sort = sort + '-' + (localStorage.groupShortName || localStorage.groupId);
  } else {
    sort = sort + '-' + '未登录';
  }
  // operation
  let versions = location.pathname.replace(/[^0-9|\.]/ig, '') || 3;
  operation = `点击-兜礼V${versions}-${operation}`;
  if(typeof(_hmt) != "undefined"){
    _hmt.push(['_trackEvent', sort, operation, label]); // sort: 来源 + 企业名称  operation: 页面路径   label: 域名
  }
};

export default baiduStats;