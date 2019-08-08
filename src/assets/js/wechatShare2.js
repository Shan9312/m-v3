import Vue from 'vue';
import VueJsonp from 'vue-jsonp';
Vue.use(VueJsonp);

import bus from '@/components/common/bus';
import api from '@/assets/js/api.js';
var address;
const browserName = globalProperties.getBrowserName();
export function Wechatshare(prefix, params) {
  var client = 'doooly';
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    client = 'wechat'; //是微信
  } else {
    client = 'doooly'; //不是微信
  }
  //调用微信接口获取用户数据
  // Vue.jsonp("http://test1.doooly.com/share/commonShareJSONPConfig",
  Vue.jsonp(api.commonShareJSONPConfig, { //请求参数
    params: {
      url: location.href.split('/#')[0] + location.href.split('/#')[1],
      'client': client, // wechat, doooly
      'prefix': prefix, // 配置文件前缀(活动名称,后台配置)
      'params': params //文案里需要替换的参数, 只替换title imgUrl desc里的占位符
    },
    jsonp: 'callback',
    callback: "success_jsonpCallback",
  }).then((res) => {
    if (res.code == 1000) {
      shareWithFriendsWX(res);
    }
  });
};

//获取省
export function getAddress(count) {
  if (browserName == "WeChat") {
    //    if(false){
    onWechatConfig.call(this);
    // address_func.call(this);
  } else if (browserName == "WebKit") { //判断iPhone|iPad|iPod|iOS
    window.webkit.messageHandlers.nativeLbsCity.postMessage("address_func");
  } else if (browserName == "Chrome WebView") { //判断Android
    RHNativeJS.nativeLbsCity("address_func");
  } else {
    address = "全国"; 
    localStorage.address = address;
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function (data){
        address_func(data.coords);
      },function (data){
        if(!count){
          getAddress(1);
        }else if(count < 3){
          getAddress(count+1);
        }
      },{
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0,
      });
    }
  }
};
export function address_func(data) {
  if (browserName == "WeChat") {
    var lnglatXY = [data.longitude, data.latitude]; //已知点坐标
    // localStorage.longitude=data.longitude;
    // localStorage.latitude=data.latitude;
    bus.$emit('mapStore', data);
    var geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(lnglatXY, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        address = result.regeocode.addressComponent.province;
        localStorage.address = address;
      }
    });
  }else if(browserName == "otherAPP"){
    var lnglatXY = [data.longitude, data.latitude]; //已知点坐标
    localStorage.longitude=data.longitude;
    localStorage.latitude=data.latitude;
    bus.$emit('mapStore', data);
    var geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(lnglatXY, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        address = result.regeocode.addressComponent.province;
        localStorage.address = address;
      }
    });
  } else {
    address = data;
    localStorage.address = address;
  }
};
export function shareWithFriendsWX(data) {
  wx.config({
    debug: false, // 是否开启调试模式
    //debug: true,
    appId: data.appid, // 必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.nonceStr, // 必填，生成签名的随机串
    signature: data.signature, // 必填，签名，见附录1
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

  });
  wx.ready(function() {
    //微信JS接口: 分享给朋友
    wx.onMenuShareAppMessage({
      title: data.shareConfig.title, // 分享标题
      desc: data.shareConfig.desc, // 分享描述
      link: data.shareConfig.link, // 分享链接
      imgUrl: data.shareConfig.imgUrl, // 分享图标
      type: data.shareConfig.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: data.shareConfig.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
    });
    //微信JS接口: 分享到朋友圈
    wx.onMenuShareTimeline({
      title: data.shareConfig.title, // 分享标题
      link: data.shareConfig.link, // 分享链接
      imgUrl: data.shareConfig.imgUrl, // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
        // MtaH5.clickShare('wechat_moments');  //这里加上h5分享代码
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  });






};


export function shareWithFriendsWX2(data) {
  wx.config({
    debug: false, // 是否开启调试模式
    //debug: true,
    appId: data.appid, // 必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.nonceStr, // 必填，生成签名的随机串
    signature: data.signature, // 必填，签名，见附录1
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

  });
  wx.ready(function() {
    //获取经纬度和城市
    wx.getLocation({
      type: 'gcj02',
      success: function(data) {
        address_func(data);
      },
      cancel: function(res) {
        alert('用户拒绝授权获取地理位置');
      },
      error: function(res) {}
    })
    // var data = {
    //   latitude: 31.22114,
    //   longitude: 121.54409
    // }
    // address_func(data);

  });
};
//调用微信接口获取用户数据
export function onWechatConfig() {
  Vue.jsonp(api.commonShareJSONPConfig + "?client=wechat&url=" + encodeURIComponent(window.location.href), {
    callbackName: 'jsonpCallback',
  }).then((res) => {
    if (res.code == 4001) {
      shareWithFriendsWX2(res.data);
    }
  })
};

//调用微信接口获取用户数据
export function onWechatConfigNew(data) {
  var configName = data;
  Vue.jsonp(api.commonShareJSONPConfig + "?client=wechat&url=" + encodeURIComponent(window.location.href), {
    callbackName: 'jsonpCallback',
  }).then((res) => {
  if (res.code == 4001) {
    shareWithFriendsWXNew(res.data,configName);
  }
  })
};
export function shareWithFriendsWXNew(data, name) {
  wx.config({
    debug: false, // 是否开启调试模式
    //debug: true,
    appId: data.appid, // 必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.nonceStr, // 必填，生成签名的随机串
    signature: data.signature, // 必填，签名，见附录1
    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });

  wx.ready(function() {
    if (name == 'hideMenuItems') {
      wx.hideMenuItems({
        menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      });
    } else if (name == 'showMenuItems') {
      wx.showMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
      });
    }
  });
};






export function shareWithFriendsAPP(data) {
  // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {  //判断iPhone|iPad|iPod|iOS

  if (browserName == "WebKit" || browserName == "otherAPPIos") {

    window.webkit.messageHandlers.share.postMessage(data);
  }
  // else if (/(Android)/i.test(navigator.userAgent)) {   //判断Android
  else if (browserName == "Chrome WebView" || browserName == "otherAPPAndroid") { //判断Android

    RHNativeJS.share(JSON.stringify(data));
  }

};