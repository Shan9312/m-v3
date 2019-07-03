import axios from 'axios';
import {
  Indicator,
  Toast
} from 'mint-ui';
import api from '@/assets/js/api.js';

let errorLog = 0;

if (!sessionStorage.httpTimestamp) {
  sessionStorage.httpTimestamp = new Date().getTime();
} else if (new Date().getTime() - sessionStorage.httpTimestamp > 86400000) {
  sessionStorage.httpTimestamp = new Date().getTime();
}

const http = axios.create({
  timeout: 10000
});

http.interceptors.request.use(config => {
  Indicator.open({
    text: '加载中...',
    spinnerType: 'snake'
  });

  if (config.url.indexOf("?") > -1 && !config.url.indexOf("timestamp") > -1) {
    config.url += `&timestamp=${sessionStorage.httpTimestamp}`;
  } else {
    config.url += `?timestamp=${sessionStorage.httpTimestamp}`;
  }
  switch (browserName) {
    case 'WeChat':
      if (!localStorage.wiscowechatCodeType && location.href.indexOf('wiscowechat') > -1) {
        config.headers.channel = 'wiscowechat';
      } else {
        config.headers.channel = 'wechat';
      }
      if (location.href.indexOf('wiscowechat') > -1 && localStorage.wiscoToken) {
        localStorage.token = localStorage.wiscoToken;
      } else if (localStorage.dooolyToken) {
        localStorage.token = localStorage.dooolyToken;
      }
      break;
    case 'WebKit':
    case 'Chrome WebView':
      config.headers.channel = 'app';
      break;
    case 'otherAPPAndroid':
    case 'otherAPPIos':
      config.headers.channel = 'wiscoapp';
      break;
    default:
      config.headers.channel = 'h5';
      break;
  }
  if (localStorage.token) {
    config.headers.token = localStorage.token;
  }
  if (localStorage.groupId) {
    config.headers.groupId = localStorage.groupId;
  }
  if (localStorage.thirdUserToken && browserName != 'WeChat') {
    config.headers.thirdPartyChannel = "dahua";
  }

  return config;
}, err => {
  Indicator.close();
  sessionStorage.httpTimestamp = new Date().getTime();
  return Promise.reject(err);
});

http.interceptors.response.use((res) => {
  Indicator.close();
  if (res.data.code && res.data.code == 40001) {
    dooolyAPP.logOut(1);
  }
  return res;
}, error => {
  Indicator.close();
  sessionStorage.httpTimestamp = new Date().getTime();

  if (!error.response ||　error.response.config.url.indexOf('action') > -1) return false;
  if (!navigator.onLine) {
    Toast('网络已断开，请检查网络并刷新!');
  } else {
    Toast('小兜兜正忙,请稍候重试!');
    if (errorLog == 0) {
      errorLog = 1;
      dooolyAPP.errorLog(error);
    }
  }

  return Promise.reject(error);
})

dooolyAPP.errorLog = function (error) {
  let clientChannel = "h5";
  if (browserName == "WeChat") {
    clientChannel = 'wechat';
  } else if (browserName == "WebKit") {
    clientChannel = 'iOS';
  } else if (browserName == "Chrome WebView") {
    clientChannel = 'Android';
  }

  http({
    method: 'post',
    url: api.errorLog,
    data: {
      "timestamp": sessionStorage.httpTimestamp,
      "clientChannel": clientChannel,
      "sign": '',
      "param": {
        "logStr": error,
        "terminalModel": '',
        "userId": localStorage.userId,
        "appVersion": localStorage.versionName,
        "pageUrl": location.href
      }
    },
  });
}

export default {
  get(url, data) {
    let params = '';
    if (data) {
      Object.keys(data).forEach(key => {
        params += `&${key}=${data[key]}`;
      });
      params = `?${params.substring(1)}`;
    }
    return http({
      method: 'get',
      url: `${url}${params}`
    })
  },
  post(url, data = {}, headers = {}) {
    return http({
      method: 'post',
      url,
      data,
      headers
    });
  }
}
