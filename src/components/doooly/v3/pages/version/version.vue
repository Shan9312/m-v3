<template>
  <div class="version-page">
    <img src="./page.jpg">
    <a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.reach.doooly" class="button"></a>
  </div>
</template>

<script>
  export default {
    name: 'version',
    props: {

    },
    data() {
      return {
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