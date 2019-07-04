<template>
  <div id="error">
    <div class="error-img">
      <img src="./images/error.png" alt="">
    </div>
    <p>您访问的页面不存在</p>
    <button @click="goIndex">去首页</button>
  </div>
</template>
<script>
export default {
  name: 'Error',
  data() {
    return {}
  },
  created() {
    initTitle('出错啦')
  },
  methods: {
    goIndex() {
      dooolyAPP.jumpIndexPage.call(this);
    }
  }
}
</script>
<style scoped lang="scss">
#error {
  padding-top: 26%;
  text-align: center;
  .error-img {
    width: 36%;
    height: auto;
    margin-left: 32%;
    img {
      width: 100%;
    }
  }
  p {
    text-align: center;
    font-size: 0.14rem;
    color: #666;
    margin-top: 21px;
  }
  button {
    border: 0;
    margin-top: 37px;
    width: 32%;
    height: 0.36rem;
    min-height: 35px;
    line-height: 0.36rem;
    border-radius: 5px;
    background-color: #ee3f44;
    color: #fff;
    font-size: 0.14rem;
  }
}
</style>


