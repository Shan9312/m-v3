<template>
<div>
</div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
    export default {
      name: "activity",
      methods: {
      },
      mounted() {
        this.$router.push({path: this.$route.query.url});
      },
    }

</script>

<style scoped>

</style>
