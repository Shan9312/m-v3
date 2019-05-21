<template>
<div>
</div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
  name: "family-to",
  methods: {

  },
  mounted() {
    http({
      method: 'post',
      url: api.nexusBind, 
      data:{
          'userId':localStorage.userId,
          'bindId':this.$route.query.bindId,
      }
    }).then((data) => {
        if(data.data.code == 1000){
          dooolyAPP.redirectPay(this.$route.params.orderNum)
        }else if(data.data.code == 1003){
          dooolyAPP.gotoJumpVue.call(this,'/familyRecharge');
        }else if(data.data.code == 1008){
          this.$messageBox({
            title: '授权失败',
            message: '此集享卡账号已被其他兜礼会员绑定',
            confirmButtonText: '重新授权',//right
            cancelButtonText: '取消',//left
            showCancelButton: true,
            confirmButtonClass:'confirmButton',
          }).then(action => {
            if(action == 'cancel'){
                dooolyAPP.gotoJumpVue.call(this,'/familyRecharge');
            }else if(action == 'confirm'){
              if(window.location.href.indexOf('pre_dist') > 0 ||window.location.href.indexOf('pro_dist') > 0){
                dooolyAPP.gotoJumpJq.call(this,'http://api.maxxipoint.com/NexusService/auth.do?response_type=token&client_id=74D33C18BF3811B2&redirect_uri='+encodeURIComponent(api.baseURL)+'dist%2f%23%2ffamilyTo%2f'+this.orderNum+'&status=199210219');
              }else{
                dooolyAPP.gotoJumpJq.call(this,'http://app-uat.maxxipoint.com/NexusService/auth.do?response_type=token&client_id=844AB181D6878FF9&redirect_uri='+encodeURIComponent(api.baseURL)+'dist%2f%23%2ffamilyTo%2f'+this.orderNum+'&status=199210219');
              }
            }
          })
        }else{
            this.$toast('小兜兜正忙,请稍候重试!');
            dooolyAPP.gotoJumpVue.call(this,'/nav/newHome');
        }
    }).catch(err => {
        dooolyAPP.gotoJumpVue.call(this,'/nav/newHome');
    })
  },
}

</script>

<style scoped>
  .confirmButton{
    color: #ee3f44;
  }
</style>
