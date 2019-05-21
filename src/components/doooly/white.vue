<template>
<div>
</div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import Cookies from 'js-cookie';
    export default {
      name: "white",
      methods: {
        //微信端登录后，绑定微信信息
        postWechatCode() {
          let data = {
           wechatCode: localStorage.code,
           userId: localStorage.userId
         }
         http({
           method: 'post',
           url: api.wechatBinding,
           data: data
         }).then((res) => {
          this.goWhite();
         }).catch((err)=>{
          this.goWhite();
         })
       },
       // 绑定信息后的回调函数
       goWhite(){
          let url = window.location.href;
          if(!localStorage.wiscowechatCodeType && window.location.href.indexOf('wiscowechat') > 0){

            localStorage.wiscowechatCodeType = 1;
            var channelText = encodeURIComponent(api.baseURL+'wiscowechat/#/white');
            var appidText = 'wx2d328083c1b00c6a';
            if(window.location.href.indexOf('reachtest')>0 || window.location.href.indexOf('reach_dist')>0){
              channelText = encodeURIComponent(api.baseURL+'wiscowechat/#/white');
              appidText = 'wx2d328083c1b00c6a';
            }else if(window.location.href.indexOf('pre_dist')>0 || window.location.href.indexOf('pro_dist')>0){
              channelText = encodeURIComponent(api.baseURL+'wiscowechat/#/white');
              appidText = 'wx07dc2a87c3d4ec88';
            }
            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appidText +'&redirect_uri='+ channelText +'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
          }else{
            let index =url.indexOf('?');
            var base;
            if(index > 0){
              base = url.substring(0,index);
            }
            localStorage.removeItem('wiscowechatCodeType');
            if(localStorage.loginUrl){
              let _loginUrl = localStorage.loginUrl;
              let strReg = '^http(s)?://';
              let reg = new RegExp(strReg);
              let loginUrl_cookie = Cookies.get('loginUrl');
              // 先判断localstorage
              if(reg.test(_loginUrl)){
                window.location.replace(_loginUrl)
                return false
              }else if(reg.test(loginUrl_cookie)){
                // 再判断loginUrl_cookie
                window.location.replace(loginUrl_cookie)
                return false
              }
              if(localStorage.loginUrl[0] === '/'){
                _loginUrl = _loginUrl.slice(1);
              }
              if(base){
                window.location.href= base + '#/' +_loginUrl;
              }else{
                this.$router.replace({path:'/'+_loginUrl});
              }
              localStorage.removeItem('loginUrl');
            }else{
              if(base){
                window.location.href= base +'#/nav/newHome';
              }else{
                this.$router.replace({path: 'nav/newHome'});
              }
            }
          }
       }
      },
      mounted() {
        let url = window.location.href;
        if (url.match(/code=([^&]+)/)) {
          let code = url.match(/code=([^&]+)/)[1];
          localStorage.code = code;
          this.postWechatCode();
        }else{
          this.goWhite();
        }
        bus.$on('mapStore',(function(data){}).bind(this));//调用地图经纬度存储
      },
    }

</script>

<style scoped>

</style>
