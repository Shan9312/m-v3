var keepAliveArr = []

var browserName = getBrowser()
var memberFrom = '兜礼会员'
if (browserName == 'WeChat' && navigator.userAgent.indexOf('wxwork') > -1) {
  browserName = 'enterpriseWX'
}
if (browserName == 'Android Browser') {
  browserName = 'Chrome WebView'
}
if (browserName == 'Chrome WebView' && localStorage.ownApp == 'other') {
  browserName = 'otherAPPAndroid'
  memberFrom = '武钢会员'
}
if (browserName == 'WebKit' && localStorage.ownApp == 'other') {
  browserName = 'otherAPPIos'
  memberFrom = '武钢会员'
}

if (/wiscowechat/.test(window.location.href)) {
  memberFrom = '钢城e家会员'
}
var userAgent = window.navigator.userAgent 
var dooolyRegx = /doooly/i// 兜礼app会有标识
var dahuatechApp = /dahuatechApp/i//大华app特殊标识
if (browserName == "WebKit" || browserName == "Chrome WebView") {
  //第三方app兼容，第三方渠道需新建文件目录根据目录名称对browserName进行修改
  if (/thirdParty/.test(window.location.href) || localStorage.appUrlChannel == 'thirdParty') {
    if (!dooolyRegx.test(userAgent)) {
      browserName = 'otherAPP'
      localStorage.appUrlChannel = 'thirdParty'
    }
  }
}
//大华app特殊标识
if (dooolyRegx.test(dahuatechApp)) {
  browserName = 'otherAPP'
  localStorage.appUrlChannel = 'thirdParty'
}
// 获取设备id回调方法
window.getDeviceHash = function (id) {
  localStorage.setItem('deviceHash', id)
}
// 获取用户信息
if (browserName == 'Chrome WebView' || browserName == 'otherAPPAndroid') {
  localStorage.token = RHNativeJS.getToken()
  localStorage.mobile = RHNativeJS.getPhone()
  localStorage.userId = RHNativeJS.getUserId()
  localStorage.groupShortName = RHNativeJS.getGroupShortName()
  localStorage.address = RHNativeJS.nativeLbsCity()
  localStorage.activateMobile = RHNativeJS.getLoginUserNumber()
  localStorage.ownApp = RHNativeJS.isOwnApp()
  localStorage.userName = RHNativeJS.getUserName()
  if (RHNativeJS.getPhoneDeviceId) {
    RHNativeJS.getPhoneDeviceId('getDeviceHash')
  }
  // 新增版本号方法
  if (RHNativeJS.getVersionName) {
    localStorage.versionName = RHNativeJS.getVersionName()
  }
  // 获取前端地址版本号
  if (RHNativeJS.getHtmlVersion) {
    localStorage.htmlVersion = RHNativeJS.getHtmlVersion()
  }
  if (RHNativeJS.getPaymentType) {
    localStorage.isPayPassword = RHNativeJS.getPaymentType()
    if (localStorage.isPayPassword == 0) {
      localStorage.isSetPayPassword = 0
    } else {
      localStorage.isSetPayPassword = 1
    }
  }
  if (RHNativeJS.getGroupID) {
    localStorage.groupId = RHNativeJS.getGroupID()
    localStorage.blocId = RHNativeJS.getBlocID()
  }
}
if (browserName == 'WebKit') {
  window.webkit.messageHandlers.getPhoneDeviceId.postMessage('getDeviceHash')
}

function getBrowser() {
  var parser = new UAParser()
  var result = parser.getResult()
  var name = result.browser.name
  browserName = name
  //	alert(browserName);
  return name
}

function getDeviceId() {
  if (navigator.userAgent.match(/iphone\sOS/i) == 'iphone os') {
    // 识别设备ios/android
    var ASIdentifierManager = plus.ios.importClass('ASIdentifierManager')
    var sharedManager = ASIdentifierManager.sharedManager()
    if (sharedManager.isAdvertisingTrackingEnabled()) {
      var advertisingIdentifier = sharedManager.advertisingIdentifier()
      var idfa = plus.ios.invoke(advertisingIdentifier, 'UUIDString')
      return idfa // 获取并返回idfa
    }
    // return device_id;
  } else {
    if (window.plus) {
      var device_id = plus.device.uuid.valueOf()
      return device_id.substring(0, 15) // 获取andriod的uuid
    }
  }
}

/**
 * url后面带的param转换成object对象
 * @param {*} url url
 */
function param2Obj(url) {
  if (!url) return {}
  var search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') +
    '"}'
  )
}

// 大华app获取登录令牌
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  if (window.location.hash.indexOf('?') < 0) {
    return null
  }
  var r = window.location.hash.split('?')[1].match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}
if (browserName == 'otherAPP' && getQueryString('JsonData')) {
  localStorage.removeItem('token');
  localStorage.thirdUserToken = getQueryString('JsonData')
}
// 第三方通用免登
if (getQueryString('oauthCode') && getQueryString('source')) {
  sessionStorage.oauthCode = getQueryString('oauthCode')
  sessionStorage.source = getQueryString('source')
}

// 判断是否为微信浏览器
function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
};
// 判断是否为pc浏览器
function IsPC() {
  var userAgentInfo = navigator.userAgent
  var Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod'
  ]
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

// 判断App环境
function judgeAppUrl() {
  if (window.location.href.indexOf('dist2.2.1') > -1) {
    payUrl = payUrl.replace('/cashier/', '/cashier_v2.2.1/')
    activityUrl = activityUrl.replace('/activity/', '/activity_v2.2.1/')
  } else if (window.location.href.indexOf('dist2.2.0') > -1) {
    payUrl = payUrl.replace('/cashier/', '/cashier_v2.2.0/')
    activityUrl = activityUrl.replace('/activity/', '/activity_v2.2.1/')
  } else if (localStorage.htmlVersion) {
    var version = localStorage.htmlVersion
    payUrl = payUrl.replace('/cashier/', '/cashier_v' + version + '/')
    activityUrl = activityUrl.replace('/activity/', '/activity_v' + version + '/')
  }
}

// 域名配置
var baseUrl = {
  baseUrlTest: 'http://test1.doooly.com/reachtest/',
  baseUrlMain: 'http://test1.doooly.com/reach_dist/',
  fabuButter: 'http://reach-life.com:85/pre_dist/'
}
var basesUrl = {
  baseUrlTest: 'https://admin.doooly.com/reachtest/',
  baseUrlMain: 'https://admin.doooly.com/reach_dist/',
  // fabuButter:'https://reach-life.com:6443/pre_dist/',
  fabuButter: 'https://reach-life.com/pre_dist/',
  Doooly: 'https://reach-life.com/pro_dist/'
}
var payUrls = {
  baseUrlTest: 'https://admin.doooly.com/reachtest/cashier/#/cardBuyPay/',
  baseUrlMain: 'https://admin.doooly.com/reach_dist/cashier/#/cardBuyPay/',
  fabuButter: 'https://reach-life.com/pre_cashier/cashier/#/cardBuyPay/',
  Doooly: 'https://reach-life.com/pro_cashier/cashier/#/cardBuyPay/'
}
var activityUrls = {
  baseUrlTest: 'https://admin.doooly.com/reachtest/activity/#/',
  baseUrlMain: 'https://admin.doooly.com/reach_dist/activity/#/',
  fabuButter: 'https://reach-life.com/pre_activity/activity/#/',
  Doooly: 'https://reach-life.com/pro_activity/activity/#/'
}
var otherPayUrls = {
  baseUrlTest: 'https://admin.doooly.com/reachtest/thirdPartyPay/#/cardBuyPay/',
  baseUrlMain: 'https://admin.doooly.com/reach_dist/thirdPartyPay/#/cardBuyPay/',
  fabuButter: 'https://reach-life.com/pre_cashier/thirdPartyPay/#/cardBuyPay/',
  Doooly: 'https://reach-life.com/pro_cashier/thirdPartyPay/#/cardBuyPay/'
}
// 微信首页跳转签名url
if (/wiscowechat/.test(window.location.href)) {
  var channelText = encodeURIComponent('https://admin.doooly.com/reachtest/wiscowechat/#/white')
  var channelMain = encodeURIComponent('https://admin.doooly.com/reach_dist/wiscowechat/#/white')
  var channeltextDoooly = encodeURIComponent('https://reach-life.com/pre_dist/wiscowechat/#/white')
  var channelDoooly = encodeURIComponent('https://reach-life.com/pro_dist/wiscowechat/#/white')

  // var appidText = 'wx5c433c925b44ad2e';
  var appidText = 'wx58ada8d1e44c4f7b'
  var appidMain = 'wx58ada8d1e44c4f7b'
  var appidDoooly = 'wx93b36cf949d5fb6c'
} else if (/zfhwechat/.test(window.location.href)) {
  var channelText = encodeURIComponent('https://admin.doooly.com/reachtest/zfhwechat/#/white')
  var channelMain = encodeURIComponent('https://admin.doooly.com/reach_dist/zfhwechat/?t=1#/white')
  var channeltextDoooly = encodeURIComponent('https://reach-life.com/pre_dist/zfhwechat/#/white')
  var channelDoooly = encodeURIComponent('https://reach-life.com/pro_dist/zfhwechat/#/white')

  var appidText = 'wx2d328083c1b00c6a'
  var appidMain = 'wx2d328083c1b00c6a'
  var appidDoooly = 'wx07dc2a87c3d4ec88'
} else {
  var channelText = encodeURIComponent('https://admin.doooly.com/reachtest/dist/#/white')
  var channelMain = encodeURIComponent('https://admin.doooly.com/reach_dist/dist/?t=1#/white')
  var channeltextDoooly = encodeURIComponent('https://reach-life.com/pre_dist/dist/#/white')
  var channelDoooly = encodeURIComponent('https://reach-life.com/pro_dist/dist/#/white')

  var appidText = 'wx2d328083c1b00c6a'
  var appidMain = 'wx2d328083c1b00c6a'
  var appidDoooly = 'wx07dc2a87c3d4ec88'
}

var _weixinUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
var WxAppIdUrls = {
  text: _weixinUrl + appidText + '&redirect_uri=' + channelText + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
  Main: _weixinUrl + appidMain + '&redirect_uri=' + channelMain + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
  textDoooly: _weixinUrl + appidDoooly + '&redirect_uri=' + channeltextDoooly + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect',
  Doooly: _weixinUrl + appidDoooly + '&redirect_uri=' + channelDoooly + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
}

// 接口
var httpbase = {
  baseUrlTestButterfly: 'http://admin.doooly.com/reachtest/',
  baseUrlTestDoooly: 'http://test2.doooly.com/Doooly/',
  baseUrlMainButterfly: 'http://test1.doooly.com/reach_api/',
  baseUrlMainDoooly: 'http://admin.doooly.com/doooly_api/',
  fabuButterfly: 'http://reach-life.com:85/pre_api/',
  fabuDoooly: 'http://api.doooly.com:82/pre_doooly/'
}
var httpsbase = {
  baseUrlTestButterfly: 'https://admin.doooly.com/reachtest/',
  baseUrlMainButterfly: 'https://admin.doooly.com/reach_api/',
  fabuButterfly: 'https://reach-life.com/pre_api/',
  Butterfly: 'https://reach-life.com/pro_api/',

  baseUrlTestDoooly: 'https://admin.doooly.com/Doooly/',
  baseUrlMainDoooly: 'https://admin.doooly.com/doooly_api/',
  fabuDoooly: 'https://api.doooly.com/pre_doooly/',
  Doooly: 'https://api.doooly.com/pro_doooly/',

  baseUrlTestActivity: 'https://admin.doooly.com/activity/',
  baseUrlMainActivity: 'https://admin.doooly.com/activity/',
  fabuActivity: 'https://reach-life.com/pre_activity_api/',
  Activity: 'https://reach-life.com/pro_activity_api/',

  baseUrlTestOrder: 'https://admin.doooly.com/doooly-order/',
  baseUrlMainOrder: 'https://admin.doooly.com/doooly-order/',
  fabuOrder: 'https://api.doooly.com/pre_order/',
  Order: 'https://api.doooly.com/pro_order/',

  baseUrlTestAction: 'https://admin.doooly.com/doooly-action/',
  baseUrlMainAction: 'https://admin.doooly.com/doooly-action/',
  fabuAction: 'https://api.doooly.com/pre_action/',
  Action: 'https://api.doooly.com/pro_action/'
}

var Butterfly
var Doooly
var Activity
var Order
var Action
var base
var is_https = document.location.protocol == 'https:'
var WxAppIdUrl
var Releasestage
var payUrl
var activityUrl
if (is_https) {
  if (window.location.href.indexOf('reachtest') > 0) {
    Butterfly = httpsbase.baseUrlTestButterfly
    Doooly = httpsbase.baseUrlTestDoooly
    Activity = httpsbase.baseUrlTestActivity
    Order = httpsbase.baseUrlTestOrder
    Action = httpsbase.baseUrlTestAction
    base = basesUrl.baseUrlTest
    WxAppIdUrl = WxAppIdUrls.text
    Releasestage = 'reachtest'
    if (browserName == 'otherAPP') {
      payUrl = otherPayUrls.baseUrlTest
      activityUrl = activityUrls.baseUrlTest
    } else if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      payUrl = payUrls.baseUrlTest
      activityUrl = activityUrls.baseUrlTest
      judgeAppUrl()
    } else {
      payUrl = payUrls.baseUrlTest
      activityUrl = activityUrls.baseUrlTest
    }
  } else if (window.location.href.indexOf('reach_dist') > 0) {
    Butterfly = httpsbase.baseUrlMainButterfly
    Doooly = httpsbase.baseUrlMainDoooly
    Activity = httpsbase.baseUrlMainActivity
    Order = httpsbase.baseUrlMainOrder
    Action = httpsbase.baseUrlMainAction
    base = basesUrl.baseUrlMain
    WxAppIdUrl = WxAppIdUrls.Main
    Releasestage = 'reach_dist'
    if (browserName == 'otherAPP') {
      payUrl = otherPayUrls.baseUrlMain
      activityUrl = activityUrls.baseUrlMain
    } else if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      payUrl = payUrls.baseUrlMain
      activityUrl = activityUrls.baseUrlMain
      judgeAppUrl()
    } else {
      payUrl = payUrls.baseUrlMain
      activityUrl = activityUrls.baseUrlMain
    }
  } else if (window.location.href.indexOf('pre_dist') > 0) {
    Butterfly = httpsbase.fabuButterfly
    Doooly = httpsbase.fabuDoooly
    Activity = httpsbase.fabuActivity
    Order = httpsbase.fabuOrder
    Action = httpsbase.fabuAction
    base = basesUrl.fabuButter
    WxAppIdUrl = WxAppIdUrls.textDoooly
    Releasestage = 'pre_dist'
    if (browserName == 'otherAPP') {
      payUrl = otherPayUrls.fabuButter
      activityUrl = activityUrls.fabuButter
    } else if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      payUrl = payUrls.fabuButter
      activityUrl = activityUrls.fabuButter
      judgeAppUrl()
    } else {
      payUrl = payUrls.fabuButter
      activityUrl = activityUrls.fabuButter
    }
  } else if (window.location.href.indexOf('pro_dist') > 0) {
    Butterfly = httpsbase.Butterfly
    Doooly = httpsbase.Doooly
    Activity = httpsbase.Activity
    Order = httpsbase.Order
    Action = httpsbase.Action
    base = basesUrl.Doooly
    WxAppIdUrl = WxAppIdUrls.Doooly
    Releasestage = 'pro_dist'
    if (browserName == 'otherAPP') {
      payUrl = otherPayUrls.Doooly
      activityUrl = activityUrls.Doooly
    } else if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      payUrl = payUrls.Doooly
      activityUrl = activityUrls.Doooly
      judgeAppUrl()
    } else {
      payUrl = payUrls.Doooly
      activityUrl = activityUrls.Doooly
    }
  } else {
    Butterfly = httpsbase.baseUrlTestButterfly
    Doooly = httpsbase.baseUrlTestDoooly
    Activity = httpsbase.baseUrlTestActivity
    Order = httpsbase.baseUrlTestOrder
    Action = httpsbase.baseUrlTestAction
    base = basesUrl.baseUrlTest
    WxAppIdUrl = WxAppIdUrls.text
    if (browserName == 'otherAPP') {
      payUrl = otherPayUrls.baseUrlTest
      activityUrl = activityUrls.baseUrlTest
    } else {
      payUrl = payUrls.baseUrlTest
      activityUrl = activityUrls.baseUrlTest
    }
  }
} else {
  if (window.location.href.indexOf('reachtest') > 0) {
    Butterfly = httpbase.baseUrlTestButterfly
    Doooly = httpbase.baseUrlTestDoooly
    base = baseUrl.baseUrlTest
    Releasestage = 'reachtest'
  } else if (window.location.href.indexOf('reach_dist') > 0) {
    Butterfly = httpbase.baseUrlMainButterfly
    Doooly = httpbase.baseUrlMainDoooly
    base = baseUrl.baseUrlMain
    Releasestage = 'reach_dist'
  } else if (window.location.href.indexOf('pre_dist') > 0) {
    Butterfly = httpbase.fabuButterfly
    Doooly = httpbase.fabuDoooly
    base = baseUrl.fabuButter
    Releasestage = 'pre_dist'
  } else {
    Butterfly = httpsbase.baseUrlTestButterfly
    Doooly = httpsbase.baseUrlTestDoooly
    Activity = '/admin/activity/'
    Order = '/admin/doooly-order/'
    Action = '/admin/doooly-action/'
    base = basesUrl.baseUrlTest
  }
  if (browserName == 'otherAPP') {
    payUrl = otherPayUrls.baseUrlTest
  } else {
    payUrl = payUrls.baseUrlTest
  }
}