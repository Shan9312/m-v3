/**
 * 此文件为axios ajax的统一设置,包括请求拦截，post处理等
 */
import axios from 'axios'
import qs from 'qs'
import {
  Indicator,
  Toast
} from 'mint-ui'
import api from '@/assets/js/api.js'

const http = axios.create({
  timeout: 10000
})
if (!sessionStorage.httpTimestamp) {
  sessionStorage.httpTimestamp = new Date().getTime()
} else if (new Date().getTime() - sessionStorage.httpTimestamp > 86400000) {
  sessionStorage.httpTimestamp = new Date().getTime()
}

http.interceptors.request.use((config) => {
  Indicator.open({
    text: '加载中...',
    spinnerType: 'snake'
  })
  if (config.url.indexOf('?') > -1 && config.url.indexOf('timestamp') < 0) {
    config.url += '&timestamp=' + sessionStorage.httpTimestamp
  } else {
    config.url += '?timestamp=' + sessionStorage.httpTimestamp
  }

  if (browserName == 'WeChat') {
    if (window.location.href.indexOf('wiscowechat') > 0) {
      if (localStorage.wiscoToken) {
        localStorage.token = localStorage.wiscoToken
      }
    } else {
      if (localStorage.dooolyToken) {
        localStorage.token = localStorage.dooolyToken
      }
    }
  }
  if (localStorage.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.token = localStorage.token
  }
  if (localStorage.groupId) {
    config.headers.groupId = localStorage.groupId
  }
  if (browserName == 'WeChat') {
    if (!localStorage.wiscowechatCodeType && window.location.href.indexOf('wiscowechat') > 0) {
      config.headers.channel = 'wiscowechat'
    } else {
      config.headers.channel = 'wechat'
    }
  } else if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
    config.headers.channel = 'app'
  } else if (browserName == 'otherAPPAndroid') {
    config.headers.channel = 'wiscoapp'
  } else if (browserName == 'otherAPPIos') {
    config.headers.channel = 'wiscoapp'
  } else {
    config.headers.channel = 'h5'
  }
  if (localStorage.thirdUserToken && browserName != 'WeChat') {
    config.headers.thirdPartyChannel = 'dahua'
  }
  return config
}, err => {
  Indicator.close()
  sessionStorage.httpTimestamp = new Date().getTime()
  return Promise.reject(err)
})

// 对数据返回进行拦截
http.interceptors.response.use((res) => {
  Indicator.close();
  if (res.data.code && res.data.code == 40001) {
    dooolyAPP.logOut(1);
  }
  return res
}, error => {
  Indicator.close();
  sessionStorage.httpTimestamp = new Date().getTime();
  if (!error.response || error.response.config.url.indexOf('action') > 0) { //action项目不做错误提示
    return;
  }
  if (navigator.onLine) {
    Toast('小兜兜正忙,请稍候重试!')
    if (errorLog != 0) {
      return
    } else {
      errorLog = 1
      dooolyAPP.errorLog(error)
    }
  } else {
    Toast('网络已断开，请检查网络并刷新!')
  }
  return Promise.reject(error)
})
var errorLog = 0
dooolyAPP.errorLog = function (error) {
  var clientChannel = 'h5'
  if (browserName == 'WeChat') {
    clientChannel = 'wechat'
  } else if (browserName == 'WebKit') {
    clientChannel = 'iOS'
  } else if (browserName == 'Chrome WebView') {
    clientChannel = 'Android'
  }
  http({
    method: 'post',
    url: api.errorLog,
    data: {
      'timestamp': sessionStorage.httpTimestamp, // 当前时间戳
      'clientChannel': clientChannel, // 终端渠道 H5/iOS/Android
      'sign': '', // md5 签名，暂可为空
      'param': {
        'logStr': error, // 异常信息
        'terminalModel': '', // 机型及操作系统
        'userId': localStorage.userId, // 用户ID
        'appVersion': localStorage.versionName, // app当前版本
        'pageUrl': window.location.href // 页面请求链接url
      }
    }
  }).then((res) => {})
}

export default http