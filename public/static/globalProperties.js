'use strict';

/**
 * The global properties of doooly
 * 兜礼全局属性
 */
var globalProperties = {
  /**
   * 获取设备id,在ios中使用idfa，其它机型中使用uuid
   * Get device id, in ios used idfa otherwise uuid is used
   */
  getDeviceId: function getDeviceId() {
    if (navigator.userAgent.match(/iphone\sOS/i) == 'iphone os') {
      var ASIdentifierManager = plus.ios.importClass('ASIdentifierManager');
      var sharedManager = ASIdentifierManager.sharedManager();
      if (sharedManager.isAdvertisingTrackingEnabled()) {
        var advertisingIdentifier = sharedManager.advertisingIdentifier();
        var idfa = plus.ios.invoke(advertisingIdentifier, 'UUIDString');
        return idfa;
      }
    } else {
      if (window.plus) {
        var device_id = plus.device.uuid.valueOf();
        return device_id.substring(0, 15);
      }
    }
  },

  /**
   * 获取url hash值中键为JsonData的值
   * Get value of the key named JsonData in the url hash value
   */
  getJsonData: function getJsonData(key) {
    if (location.hash.indexOf('?') < 0) return null;

    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    var r = location.hash.split('?')[1].match(reg);

    return r != null ? decodeURIComponent(r[2]) : null;
  },

  /**
   * 通过原生方法获取参数并存储到localstorage
   * Get parameters by native's function and store them to localstorage
   */
  getLocalStorage: function getLocalStorage() {
    if (typeof RHNativeJS != 'undefined') {
      if (RHNativeJS.getToken) localStorage.setItem('token', RHNativeJS.getToken());

      if (RHNativeJS.getPhone) localStorage.setItem('mobile', RHNativeJS.getPhone());

      if (RHNativeJS.getUserId) localStorage.setItem('userId', RHNativeJS.getUserId());

      if (RHNativeJS.getGroupShortName) localStorage.setItem('groupShortName', RHNativeJS.getGroupShortName());

      if (RHNativeJS.nativeLbsCity) localStorage.setItem('address', RHNativeJS.nativeLbsCity());

      if (RHNativeJS.getLoginUserNumber) localStorage.setItem('activateMobile', RHNativeJS.getLoginUserNumber());

      if (RHNativeJS.isOwnApp) localStorage.setItem('ownApp', RHNativeJS.isOwnApp());

      if (RHNativeJS.getUserName) localStorage.setItem('userName', RHNativeJS.getUserName());

      if (RHNativeJS.getVersionName) localStorage.setItem('versionName', RHNativeJS.getVersionName());

      if (RHNativeJS.getHtmlVersion) localStorage.setItem('htmlVersion', RHNativeJS.getHtmlVersion());

      if (RHNativeJS.getGroupID) localStorage.setItem('groupId', RHNativeJS.getGroupID());

      if (RHNativeJS.getBlocID) localStorage.setItem('blocId', RHNativeJS.getBlocID());

      if (RHNativeJS.getPaymentType) localStorage.setItem('isPayPassword', RHNativeJS.getPaymentType());
    }

    localStorage.setItem('isSetPayPassword', localStorage.getItem('isPayPassword') == 0 ? 0 : 1);

    var jsonData = this.getJsonData('JsonData');
    var oauthCode = this.getJsonData('oauthCode');
    var source = this.getJsonData('source');
    // in app of dahua
    // if the hash of url contains a key that named 'JsonData' then set value of thirdUserToken to that key's value
    if (jsonData) {
      localStorage.removeItem('token');
      localStorage.setItem('thirdUserToken', jsonData);
    }
    if (oauthCode && source) {
      sessionStorage.setItem('oauthCode', oauthCode);
      sessionStorage.setItem('source', source);
    }

    return localStorage;
  },

  /**
   * 通过本地存储数据和浏览器的userAgent获取浏览器名称
   * Get browser's name by localstorage data and browser's user-agent
   */
  getBrowserName: function getBrowserName() {
    var storage = this.getLocalStorage();
    var browserName = new UAParser().getResult().browser.name; // default browser name

    if (browserName == 'WeChat' && navigator.userAgent.indexOf('wxwork') > -1) {
      //enterprise wechat
      browserName = 'enterpriseWX';
    } else if (browserName == 'Android Browser') {
      //own's andriod app
      browserName = 'Chrome WebView';
      if (storage.getItem('ownApp') == 'other')
        // andriod app of wisco
        browserName = 'wiscoAppAndriod';
    } else if (browserName == 'WebKit') {
      //own's ios app
      if (storage.getItem('ownApp') == 'other')
        // ios app of wisco
        browserName = 'wiscoAppIOS';
    }
    var userAgent = navigator.userAgent; // 兜礼app会有标识
    var dahuatechApp = /dahuatechApp/i; //大华app特殊标识
    if (dahuatechApp.test(userAgent)) {
      browserName = 'otherAPP';
      storage.setItem('appUrlChannel', 'thirdParty');
    }
    if (browserName == 'WebKit' || browserName == 'Chrome WebView') {
      var dooolyRegx = /doooly/i;
      if (!dooolyRegx.test(userAgent)) {
        browserName = 'otherAPP';
        storage.setItem('appUrlChannel', 'thirdParty');
      }
    }
    return browserName;
  },

  /**
   * 获取当前环境 local,dev,test,pre,pro
   * Get current enviroment by url
   */
  getCurrentEnv: function getCurrentEnv() {
    var env = 'local'; // set default enviorment value is local
    // Determine if the current enviorment is development by the host name is starts with 'f' or the href is contains 'reachtest'
    if (location.host.indexOf('f') == 0 || location.href.indexOf('reachtest') > -1) {
      env = 'dev';
    }
    // Determine if the current enviorment is test by the host name is starts with 't' or the href is contains 'reach_dist'
    else if (location.host.indexOf('t') == 0 || location.href.indexOf('reach_dist') > -1) {
      env = 'test';
    }
    // Determine if the current enviorment is pre by the href is contains 'pre_'
    else if (location.href.indexOf('pre_') > -1) {
      env = 'pre';
    }
    // Determine if the current enviorment is pre by the href is contains 'pro_'
    else if (location.href.indexOf('pro_') > -1) {
      env = 'pro';
    }

    return env;
  },

  /**
   * 通过url获取匹配到的接口域名
   * Get matching api domain by url
   */
  getAPIDomain: function getAPIDomain() {
    var apiDomainMap = {
      local: {
        butterfly: 'https://admin.doooly.com/reach_api/',
        doooly: 'https://admin.doooly.com/doooly_api/',
        activity: 'https://admin.doooly.com/activity/',
        order: 'https://admin.doooly.com/doooly-order/',
        action: 'https://admin.doooly.com/doooly-action/'
      },
      dev: {
        butterfly: 'https://admin.doooly.com/reachtest/',
        doooly: 'https://admin.doooly.com/Doooly/',
        activity: 'https://admin.doooly.com/activity/',
        order: 'https://admin.doooly.com/doooly-order/',
        action: 'https://admin.doooly.com/doooly-action/'
      },
      test: {
        butterfly: 'https://admin.doooly.com/reach_api/',
        doooly: 'https://admin.doooly.com/doooly_api/',
        activity: 'https://admin.doooly.com/test_activity/',
        order: 'https://admin.doooly.com/doooly-order/',
        action: 'https://admin.doooly.com/doooly-action/'
      },
      pre: {
        butterfly: 'https://reach-life.com/pre_api/',
        doooly: 'https://api.doooly.com/pre_doooly/',
        activity: 'https://reach-life.com/pre_activity_api/',
        order: 'https://api.doooly.com/pre_order/',
        action: 'https://api.doooly.com/pre_action/'
      },
      pro: {
        butterfly: 'https://reach-life.com/pro_api/',
        doooly: 'https://api.doooly.com/pro_doooly/',
        activity: 'https://reach-life.com/pro_activity_api/',
        order: 'https://api.doooly.com/pro_order/',
        action: 'https://api.doooly.com/pro_action/'
      }
    };

    var currentEnv = this.getCurrentEnv();

    return apiDomainMap[currentEnv];
  },

  /**
   * 通过url获取匹配到的前端域名
   * Get matching frontend domain by url
   */
  getFrontendDomain: function getFrontendDomain() {
    var frontendDomain = {};

    var appId = ['wx2d328083c1b00c6a', // dev and test's appid
      'wx07dc2a87c3d4ec88' // pre and prod's appid
    ];
    var redirectType = '/dist/'; // default type
    if (/wiscowechat/.test(location.href)) {
      // in wechat of wisco
      appId = ['wx58ada8d1e44c4f7b', 'wx93b36cf949d5fb6c'];
      redirectType = '/wiscowechat/';
    } else if (/zfhwechat/.test(location.href)) {
      // in wechat of zfh
      redirectType = '/zfhwechat/';
    }

    var frontendDomainMap = {
      local: {
        m: 'http://' + window.location.hostname + ':8080/#/',
        activity: 'http://' + window.location.hostname + ':8001/#/',
        cashier: 'http://' + window.location.hostname + ':8002/#/',
        thirdWebSite: 'http://' + window.location.hostname + ':8080/#/',
        wx: '',
        ICBCCashier: 'https://admin.doooly.com/Doooly/jersey/icbc/icbcOrderPay'

      },
      dev: {
        m: 'https://admin.doooly.com/reachtest/dist/#/',
        activity: 'https://admin.doooly.com/reachtest/activity/#/',
        cashier: 'https://admin.doooly.com/reachtest/cashier/#/',
        thirdWebSite: 'https://admin.doooly.com/reachtest/thirdParty/#/',
        wx: '',
        ICBCCashier: 'https://admin.doooly.com/Doooly/jersey/icbc/icbcOrderPay'
      },
      test: {
        m: 'https://admin.doooly.com/reach_dist/dist/#/',
        activity: 'https://admin.doooly.com/reach_dist/activity/#/',
        cashier: 'https://admin.doooly.com/reach_dist/cashier/#/',
        thirdWebSite: 'https://admin.doooly.com/reach_dist/thirdParty/#/',
        wx: '',
        ICBCCashier: 'https://admin.doooly.com/doooly_api/jersey/icbc/icbcOrderPay'
      },
      pre: {
        m: 'https://reach-life.com/pre_dist/dist/#/',
        activity: 'https://reach-life.com/pre_activity/activity/#/',
        cashier: 'https://reach-life.com/pre_cashier/cashier/#/',
        thirdWebSite: 'https://reach-life.com/pre_dist/thirdParty/#/',
        wx: '',
        ICBCCashier: 'https://api.doooly.com/pre_doooly/jersey/icbc/icbcOrderPay'
      },
      pro: {
        m: 'https://reach-life.com/pro_dist/dist/#/',
        activity: 'https://reach-life.com/pro_activity/activity/#/',
        cashier: 'https://reach-life.com/pro_cashier/cashier/#/',
        thirdWebSite: 'https://reach-life.com/pro_dist/thirdParty/#/',
        wx: '',
        ICBCCashier: 'https://api.doooly.com/pro_doooly/jersey/icbc/icbcOrderPay'

      }
    };
    var currentEnv = 'local';
    // new version domain judge rules
    if (location.host.indexOf('f') == 0 || location.host.indexOf('t') == 0) {
      frontendDomain = {
        m: location.protocol + '//' + location.host + '/m/#/',
        activity: location.protocol + '//' + location.host + '/activity/#/',
        cashier: location.protocol + '//' + location.host + '/cashier/#/',
        wx: ''
      };
    }
    // old version domain judge rules
    else {
      currentEnv = this.getCurrentEnv();

      frontendDomain = frontendDomainMap[currentEnv];
      var storage = this.getLocalStorage();
      var htmlVersion = storage.getItem('htmlVersion') || '';
      // if localstorage has exists htmlVersion then replace version
      if (htmlVersion) {
        frontendDomain.m = frontendDomain.m.replace('/dist/', '/dist_v' + htmlVersion + '/');
        frontendDomain.activity = frontendDomain.activity.replace('/activity/', '/activity_v' + htmlVersion + '/');
        frontendDomain.cashier = frontendDomain.cashier.replace('/cashier/', '/cashier_v' + htmlVersion + '/');
      }
      if(location.href.indexOf("thirdParty") > -1){
        frontendDomain.m = frontendDomain.m.replace('/dist/', '/thirdParty/');
        frontendDomain.activity = frontendDomain.activity.replace('/activity/', '/thirdPartyActivity/');
        frontendDomain.cashier = frontendDomain.cashier.replace('/cashier/', '/thirdPartyPay/');
      }
    }

    var currentAppId = ['pre', 'pro'].indexOf(currentEnv) > -1 ? appId[1] : appId[0];
    frontendDomain.wx = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + currentAppId + '&redirect_uri=' + encodeURIComponent(frontendDomain.m.replace('/dist/', redirectType)) + 'white&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';

    return frontendDomain;
  },

  /**获取http请求的头文件
   * Get headers for http request
   */
  getHeaders: function getHeaders() {
    var storage = this.getLocalStorage();
    var browserName = this.getBrowserName();
    var headers = {
      channel: '', // 区分大致来源
      thirdPartyChannel: '', // 区分具体某一个第三方来源
      deviceId: this.getDeviceId() || storage.getItem('userId'), // 设备ID
      thirdUserToken: '' // 大华的免登录令牌
    };

    switch (browserName) {
      case 'WeChat':
        // in wechat browser
        if (location.href.indexOf('wiscowechat') > -1 && storage.getItem('wiscowechatCodeType')) {
          headers.channel = 'wiscowechat'; // in wechat browser of wisco
        } else {
          headers.channel = 'wechat'; // in other wechat browsers besides wisco
        }

        var wiscoToken = storage.getItem('wiscoToken');
        var dooolyToken = storage.getItem('dooolyToken');
        // wiscotoken is used in wechat browser of wisco,otherwise dooolytokne is used
        if (location.href.indexOf('wiscowechat') > -1 && wiscoToken) {
          headers.token = wiscoToken;
        } else if (dooolyToken) {
          headers.token = dooolyToken;
        }
        break;
      case 'WebKit':
      case 'Chrome WebView':
        headers.channel = 'app'; // in own's app
        break;
      case 'otherAPPAndroid':
      case 'otherAPPIos':
        headers.channel = 'wiscoapp'; // in app of wisco
        break;
      default:
        headers.channel = 'h5'; // other scenarios besides above
        break;
    }

    if (storage.getItem('thirdUserToken') && browserName != 'WeChat') {
      headers.thirdPartyChannel = 'dahua';
    }

    return headers;
  }
};