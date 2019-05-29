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
        if(localStorage.token){
          window.location.href = this.$route.query.url;
        }
      },
    }

</script>

<style scoped>

</style>
