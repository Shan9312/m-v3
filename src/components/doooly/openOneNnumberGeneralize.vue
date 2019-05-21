<template>
<div>
</div>
</template>
 
<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
  name: "openOneNnumberGeneralize",
  data(){
    return{
    }
  },
  methods: {
  },
  mounted() {
    http({
      method: 'get',
        url: api.getTargetUrl+"?businessId="+this.$route.params.id+"&targetUrl="+this.$route.params.url,
      }).then((result) => {
        if(result.data.code == 1000){
          window.location.href = result.data.resultUrl;
        }else if(result.data.code == 1001){
          this.$toast("小兜兜正忙,请稍候重试!");
          dooolyAPP.gotoJumpVue.call(this,'/nav/newHome');
        }
    })
  },
}
</script>
 
<style scoped>
 
</style>