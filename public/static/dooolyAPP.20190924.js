'use strict';

//兜礼app 安卓与ios方法封装
var dooolyAPP = function dooolyAPP() {
  this.allConfig = {
    jumpDomain: globalProperties.getFrontendDomain(),
    logObj: globalProperties.getLocalStorage(),
    apiDomain: globalProperties.getAPIDomain(),
    headers: globalProperties.getHeaders()
  };
  this.browserName = globalProperties.getBrowserName();
};
dooolyAPP.prototype = {
  errorLog: function errorLog() {},
  //1.获取定位信息
  homeLocationVector: function homeLocationVector(channelName, typeName) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getLocationJson.postMessage('1');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.homeLocationVector(channelName, typeName); //(1) channelName渠道名称(2)  typeName:类型名称OPENPERMMISON弹出权限提示框OTHERVALUE 不弹出权限提示框 必填字段
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //2.检测版本升级(关于兜礼)
  checkAppVersion: function checkAppVersion(methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.checkUpdateVersion.postMessage('1');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.checkAppVersion();
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //3.获取版本号方法1.0(关于兜礼)
  getAppVersionName: function getAppVersionName(methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getAppVersionName.postMessage(methods);
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.getAppVersionName(methods);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //4.返回登陆页方法(会员激活)
  forceLoginOut: function forceLoginOut(router, methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.forceLoginOut.postMessage('1');
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.forceLoginOut('');
      } else {
        router.push('/');
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //5.获取设备号方法(会员激活)
  getPhoneDeviceId: function getPhoneDeviceId(methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getPhoneDeviceId.postMessage(methods);
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.getPhoneDeviceId(methods);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //6.返回首页(支付完成)
  jumpIndexPage: function jumpIndexPage() {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.jumpTabarItemIndex.postMessage('0');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.jumpIndexPage();
      } else {
        window.location.replace(this.allConfig.jumpDomain.m + 'nav/newHome');
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //返回个人中心
  jumpPersonPage: function jumpPersonPage(methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.gotoPersonCenter.postMessage('PersonCenter');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.jumpPersonPage();
      } else {
        window.location.replace(this.allConfig.jumpDomain.m + 'v3/mine');
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //返回个人中心
  jumpAppHome: function jumpAppHome(type) {
    //返回app端tab页面-1代表最后打开的页面0,1,2,3依次对应
    try {
      if (this.browserName == "WebKit") {
        window.webkit.messageHandlers.htmlToNativeTabBarIndex.postMessage(String(type));
      } else if (this.browserName == "Chrome WebView") {
        RHNativeJS.jumpAPPHOME(type);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //7.拨打电话方法(商户详情,常见问题,帮助中心)
  callPhone: function callPhone(methods) {
    try {
      if (this.browserName == 'otherAPPAndroid' || this.browserName == 'Chrome WebView') {
        RHNativeJS.callPhone(methods);
      } else if (this.browserName == 'otherAPPIos' || this.browserName == 'WebKit') {
        window.webkit.messageHandlers.callPhone.postMessage(methods);
      } else {
        window.location.href = 'tel:' + methods;
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //8.打开京东首页方法(商户详情)
  openJDHome: function openJDHome(methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.openJDHome.postMessage('1');
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.openJDHome();
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //9.打开APP地图(商户详情,我的福利)
  openMapView: function openMapView(router, company, id) {
    var jsonObj = {
      jumpType: 'InsideJump',
      jumpUrl: 'MapView',
      company: company,
      id: id
    };
    try {
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
      } else {
        localStorage.storeMapCompany = company;
        router.push({
          path: '/storeMap/' + id
        });
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  // 10.打开扫码优惠(商户详情)
  openScanDiscount: function openScanDiscount(router, data) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.openScanDiscount.postMessage(JSON.stringify(data));
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.openScanDiscount(JSON.stringify(data));
      } else {
        router.push({ path: '/scanDetail/' + data.company });
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //11.隐藏头部导航栏及禁止下拉刷新()
  hideNavgationBar: function hideNavgationBar() {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('true');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.setTopDialog(true);
        RHNativeJS.visablePtrFrame(false);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //12.显示头部导航栏及恢复下拉刷新()
  showNavgationBar: function showNavgationBar() {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.hideNavgationBar.postMessage('false');
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.setTopDialog(false);
        RHNativeJS.visablePtrFrame(true);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //13.返回上级页面(支付完成)
  goBackPageIndex: function goBackPageIndex(index) {
    try {
      if (this.browserName == 'WebKit') {
        // ios
        window.webkit.messageHandlers.goBackPageIndex.postMessage(index);
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.backWebPage(index);
      } else {
        window.history.go(-index);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //14.跳转联系客服(我的申诉)
  appealAgainst: function appealAgainst(router, jsonObj, type) {
    try {
      if (this.browserName == "WebKit") {
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
      } else if (this.browserName == "Chrome WebView") {
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
      } else {
        router.push({
          name: 'appeal',
          params: {
            dataType: type
          }
        });
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //15.打开手机通讯录(家属邀请)
  //返回参数(tel,name)
  openTelePhoneList: function openTelePhoneList(methods) {
    try {
      if (this.browserName == 'WebKit') {
        window.webkit.messageHandlers.getAddressBook.postMessage(methods);
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.openTelePhoneList(methods);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //16.app选择上传照片(线下订单)
  photographNative: function photographNative(methods) {
    try {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.photographNative.postMessage(methods);
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        RHNativeJS.photographNative(methods);
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //17.修改APP本地支付方式
  getPaymentType: function getPaymentType(data) {
    try {
      if (this.browserName == 'WebKit') {
        // ios
        window.webkit.messageHandlers.getPaymentType.postMessage(JSON.stringify(data));
      } else if (this.browserName == 'Chrome WebView') {
        RHNativeJS.successPay(JSON.stringify(data)); //保存修改之后的值告诉android
      } else {
        localStorage.isPayPassword = data;
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //18.安卓APP跳转供应商app方法
  androidGoMerchantApp: function androidGoMerchantApp(MerchantName, MerchantUrl) {
    var MerchantInfo = [{
      name: '滴滴出行',
      id: 'com.sdu.didi.psnger'
    }, {
      name: '唯品会',
      id: 'com.achievo.vipshop'
    }, {
      name: '1药网',
      id: 'com.yiwang'
    }, {
      name: '票牛',
      id: 'com.ipiaoniu.android'
    }, {
      name: '西十区',
      id: 'com.aiyou.androidxsq001'
    }, {
      name: '典典养车',
      id: 'com.chediandian.customer'
    }, {
      name: '易果生鲜',
      id: 'com.yiguo.app'
    }, {
      name: '网易严选',
      id: 'com.netease.yanxuan'
    }];
    var merchant = {
      id: '',
      url: MerchantUrl
    };
    for (var i = 0; i < MerchantInfo.length; i++) {
      if (MerchantInfo[i].name === MerchantName) {
        merchant.id = MerchantInfo[i].id;
      }
    }
    try {
      if (this.browserName == 'Chrome WebView') {
        // 安卓中跳第三方app,特殊跳转方式
        RHNativeJS.goCooperationApp(merchant.id, merchant.url);
      } else {
        window.location.href = MerchantUrl;
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //19.app支付
  appPay: function appPay(data, funcName, type) {
    //支付参数,回调函数名,支付方式 ('wx'微信支付,'zfb'支付宝支付)
    try {
      if (type == 'wx') {
        if (this.browserName == "WebKit" || this.browserName == "otherAPPIos") {
          //判断iPhone|iPad|iPod|iOS
          data.func = funcName;
          window.webkit.messageHandlers.wechatPay.postMessage(JSON.stringify(data));
        } else if (this.browserName == "Chrome WebView" || this.browserName == "otherAPPAndroid") {
          //判断Android
          RHNativeJS.wechatPay(JSON.stringify(data), funcName);
        }
      } else if (type == 'zfb') {
        if (this.browserName == 'WebKit') {
          // 判断iPhone|iPad|iPod|iOS
          data.func = funcName;
          window.webkit.messageHandlers.aliPayment.postMessage(JSON.stringify(data));
        } else if (this.browserName == 'Chrome WebView') {
          RHNativeJS.aliPay(data.aLiPayUrl, funcName);
        } else {
          var form = data.aLiPayUrl;
          var div = document.createElement('div');
          div.innerHTML = form; // 此处form就是后台返回接收到的数据
          document.body.appendChild(div);
          document.forms[0].submit();
        }
      } else if (type == 'union') {
        if (this.browserName == 'WebKit') {
          // 判断iPhone|iPad|iPod|iOS
          data.func = funcName;
          window.webkit.messageHandlers.unionPay.postMessage(JSON.stringify(data));
        } else if (this.browserName == 'Chrome WebView') {
          RHNativeJS.unionPay(JSON.stringify(data), funcName);
        } else {
          var _form = data.unionPayUrl;
          var _div = document.createElement("div");
          _div.innerHTML = _form;
          document.body.appendChild(_div);
          document.getElementById('pay_form').submit();
        }
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  },
  //跳转新的收银地址页面
  redirectPay: function redirectPay(orderNum, payVersion,zeroOrderFlag) {
    if(zeroOrderFlag){
      window.location.href = this.allConfig.jumpDomain.cashier + 'cardBuyPayResult/' + orderNum;
    }else{
      window.location.href = this.allConfig.jumpDomain.cashier + 'cardBuyPay/' + orderNum + '?payVersion=' + payVersion;
    }
  },
  //跳转活动项目
  redirectActivity: function redirectActivity(url) {
    window.location.href = this.allConfig.jumpDomain.activity + url;
  },
  //跳转第三方
  gotoJumpJq: function gotoJumpJq(router, url) {
    if (this.browserName == 'WeChat') {
      window.location.href = url;
    } else {
      var jsonObj = {
        jumpType: 'InsideJump',
        jumpUrl: url
      };
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(jsonObj));
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
      } else {
        var currentBaseUrl = window.location.href.substring(0, window.location.href.indexOf('#') + 1);
        if (url.indexOf(currentBaseUrl) > -1) {
          var subUrl = url.substring(url.indexOf('#') + 1);
          router.push({
            path: subUrl
          });
        } else {
          window.location.href = url;
        }
      }
    }
  },
  //项目内部跳转
  gotoJumpVue: function gotoJumpVue(router, url, dataType) {
    var _jsonObj = void 0;
    if (this.browserName == 'WeChat') {
      router.push({
        path: url
      });
    } else {
      var jsonObj = {
        jumpType: 'InsideJump',
        jumpUrl: window.location.href.substring(0, window.location.href.indexOf('#') + 1) + url
      };
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        if (dataType && dataType[this.browserName]) {
          _jsonObj = _.extend(jsonObj, dataType[this.browserName]);
        } else {
          _jsonObj = jsonObj;
        }
        window.webkit.messageHandlers.gotoNativeJump.postMessage(JSON.stringify(_jsonObj));
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.gotoNativeJump(JSON.stringify(jsonObj));
      } else {
        router.push({
          path: url
        });
      }
    }
  },
  // cookie方法
  setCookie: function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
  },
  getCookie: function getCookie(name) {
    var arr = void 0,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
  },
  removeCookie: function removeCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
  },
  //退出登录方法
  logOut: function logOut(type, url) {
    if (this.browserName == "WebKit" || this.browserName == "otherAPPIos") {
      window.webkit.messageHandlers.forceLoginOut.postMessage("1");
    } else if (this.browserName == "Chrome WebView" || this.browserName == "otherAPPAndroid") {
      RHNativeJS.forceLoginOut("");
    } else {
      //cookies本地测试用
      this.removeCookie('token');
      this.removeCookie('userId');
      this.removeCookie('loginUrl');
      if (window.location.href.indexOf('wiscowechat') > 0) {
        //武钢公众号登出
        localStorage.removeItem('wiscoToken');
        localStorage.removeItem('token');
      } else {
        //兜礼公众号登出
        localStorage.removeItem('dooolyToken');
        localStorage.removeItem('token');
      }
      if (type == 1 ) {
        //非正常登出
        if (url) {
          localStorage.setItem('loginUrl', url);
        } else {
          localStorage.setItem('loginUrl', location.href);
        }
      } else {
        localStorage.removeItem('loginUrl');
      }
      localStorage.removeItem('userId');
      localStorage.removeItem('mobile');
      localStorage.removeItem('activateMobile');
      localStorage.removeItem('groupShortName');
      localStorage.removeItem('address');
      localStorage.removeItem('userName');
      localStorage.removeItem('redirectUrl');
      localStorage.removeItem('code');
      localStorage.removeItem('storeMapUrl');
      localStorage.removeItem('latitude');
      localStorage.removeItem('longitude');
      localStorage.removeItem('getAppVersionName');
      localStorage.removeItem('isPayPassword');
      localStorage.removeItem('isSetPayPassword');
      localStorage.removeItem('groupId');
      localStorage.removeItem('blocId');

      sessionStorage.removeItem('oauthCode');
      sessionStorage.removeItem('source');

      var domain = this.allConfig.jumpDomain.m;
      if (/wiscowechat/.test(window.location.href)) {
        location.replace(domain + 'companyLogin/wugang');
      } else if (/zfhwechat/.test(window.location.href)) {
        location.replace(domain + 'companyLogin/zfh');
      } else {
        location.replace(domain);
      }
    }
  },
  //登录/记录用户信息方法
  logIn: function logIn(data, url, type) {
    if (data) {
      var jsonData = JSON.parse(data);
      var token = jsonData.token;
      var hasOpenId = jsonData.hasOpenId;
      this.setCookie('token', token);
      this.setCookie('userId', jsonData.adUserConn.userId);
      this.removeCookie("first_conponShow");
      if (window.location.href.indexOf('wiscowechat') > 0) {
        localStorage.wiscoToken = token;
        localStorage.token = token;
      } else {
        localStorage.dooolyToken = token;
        localStorage.token = token;
      }
      if(hasOpenId == 1){
        localStorage.openId = true
      }else{
        localStorage.openId = false
      }
      localStorage.userId = jsonData.adUserConn.userId;
      localStorage.mobile = jsonData.adUserConn.telephone;
      localStorage.groupShortName = jsonData.adUserConn.groupShortName;
      localStorage.userName = jsonData.adUserConn.name;
      localStorage.isPayPassword = jsonData.adUserConn.isPayPassword;
      localStorage.isSetPayPassword = jsonData.adUserConn.isSetPayPassword;
      localStorage.groupId = jsonData.adUserConn.groupId;
      localStorage.blocId = jsonData.adUserConn.blocId;
    }
    
    var domain = this.allConfig.jumpDomain.m;
    //记录登录特殊跳转url
    if (url && url != '') {
      var reg = new RegExp('^http(s)?://');
      if (reg.test(url)) {
        localStorage.loginUrl = url;
      } else {
        localStorage.loginUrl = domain + url;
      }
    }
    if (this.browserName == "WeChat" && type != 1) {
      // 微信
      location.replace(this.allConfig.jumpDomain.wx);
    }else if (this.browserName == "WebKit") {
      // ios
      var params = {
        "userInfo": jsonData.adUserConn,
        "type": "0",
        "token": jsonData.token,
        'url': url
      };
      window.webkit.messageHandlers.nativeUserInfomation.postMessage(params);
    } else if (this.browserName == "Chrome WebView") {
      // 安卓
      if (url) {
        RHNativeJS.setUserInfo(JSON.stringify(jsonData.adUserConn), jsonData.token, base + localStorage.loginUrl);
      } else {
        RHNativeJS.nativeUserInfomation(JSON.stringify(jsonData.adUserConn), "0", jsonData.token);
      }
    } else {
      var loginUrl = localStorage.loginUrl || dooolyAPP.getCookie('loginUrl');
      localStorage.removeItem('loginUrl');
      this.removeCookie('loginUrl');
      if (loginUrl && loginUrl != domain) {
        location.replace(loginUrl);
      } else {
        location.replace(this.browserName == "otherAPP" ? domain + 'nav/newHome?first=1' : domain + 'nav/newHome');
      }
    }
  },
  //设置头部方法封装(类型待整理)
  initTitle: function initTitle(titleText, key, funcName) {
    document.title = titleText;
    var jsonObj;
    if (key == 1) {
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'lbs',
          text: '城市',
          func: 'goLastPage()',
          visable: 'true'
        },
        rightButton: {
          name: 'notice',
          visable: 'true'
        },
        visable: 'true'
      };
    } else if (key == 2) {
      if (window.location.href.indexOf('/dist/') > -1) {
        //app旧版本兼容
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          visable: 'true'
        };
      } else {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName,
            visable: 'true'
          },
          visable: 'true'
        };
      }
    } else if (key == 3) {
      //导购规则的弹窗
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        };
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNoticeAndriod()',
            visable: 'true'
          },
          visable: 'true'
        };
      }
    } else if (key == 13) {
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'false'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        };
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'false'
          },
          rightButton: {
            name: 'request',
            func: 'altNoticeAndriod()',
            visable: 'true'
          },
          visable: 'true'
        };
      }
    } else if (key == 4) {
      //导购文章分享
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'altNotice()',
            visable: 'true'
          },
          visable: 'true'
        };
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'share',
            func: 'shareShopping()',
            visable: 'true'
          },
          visable: 'true'
        };
      }
    } else if (key == 8) {
      //积分充值
      if (this.browserName == 'WebKit' || this.browserName == 'otherAPPIos') {
        //判断iPhone|iPad|iPod|iOS
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName || 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: '疑问提示',
            func: 'APP_card_question()',
            visable: 'true'
          },
          visable: 'true'
        };
      } else if (this.browserName == 'Chrome WebView' || this.browserName == 'otherAPPAndroid') {
        //判断Android
        jsonObj = {
          title: {
            text: titleText
          },
          leftButton: {
            name: 'return',
            text: '返回',
            func: funcName || 'goLastPage()',
            visable: 'true'
          },
          rightButton: {
            name: 'request',
            func: 'APP_card_question()',
            visable: 'true'
          },
          visable: 'true'
        };
      }
    } else if (key == 5) {
      //发现
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'lbs',
          text: '城市',
          func: 'goLastPage()',
          visable: 'false'
        },
        rightButton: {
          name: 'notice',
          visable: 'false'
        },
        visable: 'true'
      };
    } else if (key == 6) {
      //我的
      jsonObj = {
        title: {
          text: '我的',
          name: 'WhiteTextView'
        },
        leftButton: {
          name: 'whiteSetting',
          func: 'systemSetting()',
          visable: 'true'
        },
        rightButton: {
          name: 'whiteNotice',
          visable: 'true'
        },
        visable: 'true'
      };
    } else {
      jsonObj = {
        title: {
          text: titleText
        },
        leftButton: {
          name: 'return',
          text: '返回',
          func: 'goLastPage()',
          visable: 'true'
        },
        visable: 'true'
      };
    }
    try {
      if (this.browserName == 'WebKit') {
        //判断iPhone|iPad|iPod|iOS
        // jsonObj.title.text += "ios";//测试
        window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(jsonObj));
        window.webkit.messageHandlers.hiddenBotomTabBar.postMessage('true');
      } else if (this.browserName == 'otherAPPIos') {
        window.webkit.messageHandlers.initPageTitle.postMessage(JSON.stringify(jsonObj));
      } else if (this.browserName == 'Chrome WebView') {
        //判断Android
        RHNativeJS.initPageTitle(JSON.stringify(jsonObj));
        if (key == 6) {
          RHNativeJS.setPersonalCenterHeader(true);
        }
        RHNativeJS.hideWaitPanel();
      } else if (this.browserName == 'otherAPPAndroid') {
        RHNativeJS.initPageTitle(JSON.stringify(jsonObj));
      }
    } catch (e) {
      dooolyAPP.errorLog(e);
    }
  }
};
var dooolyAPP = new dooolyAPP();

//设置默认返回方法
function goLastPage() {
  dooolyAPP.goBackPageIndex(1);
}
