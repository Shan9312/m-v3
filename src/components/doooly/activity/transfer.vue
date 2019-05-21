<template>
<div>
</div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
    export default {
      name: "transfer",
      methods: {
      },
      mounted() {
        if(!localStorage.token){
          localStorage.loginUrl = 'transfer?url='+this.$route.query.url;
          var a = window.location.href;
          var b = a.indexOf("#");
          var url = a.substring(0,b+2);
          window.location.href= url;
        }else{
          window.location.href = this.$route.query.url;
        }
      },
    }

</script>

<style scoped>

</style>
