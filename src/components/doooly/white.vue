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
            window.location.href=this.$allConfig.jumpDomain.wx;
          }else{
            localStorage.removeItem('wiscowechatCodeType');
            dooolyAPP.logIn('','',1);
          }
       }
      },
      mounted() {
        alert(localStorage.loginUrl)
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
