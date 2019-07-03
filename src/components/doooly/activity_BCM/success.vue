<template>
  <div class="body_view">
    <img src="../../../assets/images/activity_BCM/success.jpg">
    <div class="scan"><img src="../../../assets/images/activity_BCM/scan.png"></div>
    <footer>
      Copyright@reach-life 2018 all right reserved
    </footer>
  </div>
</template>

<script>
  export default {
    name: "activity_BCM_index",
    data() {
      return {
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#bb220f";
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      document.title = '幸福交行';
    },
    methods: {
    }
  }
</script>

<style scoped>
  footer{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 0.24rem;
    color: #a90b0a;
    text-align: center;
    line-height: 0.9rem;
  }
  .body_view{
    font-size: 0;
    padding-bottom: 0.9rem;
    position: relative;
  }
  .scan{
    position: absolute;
    width: 1.64rem;
    height: 1.64rem;
    left: 50%;
    bottom: 2.82rem;
    margin-left: -0.84rem;
  }
</style>
