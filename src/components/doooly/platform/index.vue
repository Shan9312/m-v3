<template>
  <div>
    <!-- 中间页跳转美团等第三方商户 -->
  </div>
</template>

<script>
import { getUrlParams } from '@/util/methods.js';
export default {
  name: 'platform',
  data() {
    return {
      link: getUrlParams('redirect_url')
    }
  },
  computed: {

  },
  created() {
    this.jump();
  },
  mounted() {

  },
  methods: {
    jump() {
      let token = localStorage.token;
      let userId = localStorage.userId;
      let deviceHash = localStorage.getItem('deviceHash');
      let paramsUrl = '';
      let url = '';
      if (this.link) {
        paramsUrl = this.link.indexOf('?') > -1 ? '&' : '?'
        url = `${this.link}${paramsUrl}token=${token}&userId=${userId}&deviceHash=${deviceHash}`
        window.location.replace(url);
      }
    }
  },
  watch: {

  },
  components: {

  },
};
</script>

<style scoped lang="scss">
</style>
