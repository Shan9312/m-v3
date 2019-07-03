<template>
  <div class="version-page">
    <img src="./page.jpg">
    <a data-baidu-stats="版本升级" v-if="browserName == 'Chrome WebView'" href="https://a.app.qq.com/o/simple.jsp?pkgname=com.reach.doooly" class="button"></a>
    <a data-baidu-stats="版本升级" v-else-if="browserName == 'WebKit'" href="https://itunes.apple.com/cn/app/%E5%85%9C%E7%A4%BC/id1280284298?mt=8" class="button"></a>
    <a data-baidu-stats="版本升级" v-else href="https://a.app.qq.com/o/simple.jsp?pkgname=com.reach.doooly" class="button"></a>
  </div>
</template>

<script>
  export default {
    name: 'version',
    props: {

    },
    data() {
      return {
        browserName:browserName
      };
    },
    computed: {

    },
    created() {
    },
    mounted() {
    },
    methods: {
    },
    beforeDestroy(){
    },
    watch: {
    },
    components: {
    },
  };
</script>

<style scoped lang="scss">
  .version-page{
    font-size: 0;
    position: relative;
  }
  .button{
    position: absolute;
    left: 50%;
    top: 57.5%;
    transform: translate(-50%,0);
    z-index: 1;
    width: 56%;
    height: 6%;
  }
</style>