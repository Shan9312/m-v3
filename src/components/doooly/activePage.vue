<template>
  <div class="container" data-role="page">
    <header>
      <div><img src="../../../src/assets/images/active/logo.png" /></div>
      <span>未查找到您的手机号，您可以通过以下方式进行登录</span>
    </header>
    <!-- main开始 -->
    <section>
      <div @click="corporatePassword()">
        <img src="../../../src/assets/images/active/activate_bg1.png">
        <!--<button type="button">-->
        <!--<span>企业口令</span>-->
        <!--</button>-->
      </div>
      <div class="last_div"  @click="skip()">
        <img src="../../../src/assets/images/active/activate_bg2.png">
        <!--<button type="button">-->
        <!--<span>个人专属码</span>-->
        <!--</button>-->
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: "activePage",
    created(){
      initTitle('会员激活','')
    },
    mounted(){
    },
    methods:{
      corporatePassword:function () {
        this.$router.push({path: '/groupCommandPage'});
      },
      skip:function () {
        this.$router.push({path: '/activate'});
      }
    }
  }
</script>

<style scoped>
  .container{background-color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  header{
    text-align: center;
    padding-top: 1rem;
    font-size: 0;
  }
  header img{
    width: 1.48rem;
    height: 1.48rem;
  }
  header span{
    display: inline-block;
    margin-top: 0.6rem;
    font-size: 0.28rem;
    color: #999999;
  }
  section {
    margin-top: 1.6rem;
    text-align: center;
  }

  section div{
    width: 6.3rem;
    height: 1.4rem;
    margin: 0 auto;
    font-size: 0;
    box-shadow: 0 0 18px #e5e6ee;
  }
  section .last_div{margin-top: 0.6rem}
  section div img{
    width: 0.5rem;
    vertical-align: middle;
    margin-right: 0.4rem;
  }

  section div button{
    width: 1.6rem;
    height: 1.4rem;
    background-color: transparent;
    font-size: 0.32rem;
    color: #666666;
    vertical-align: middle;
    border: none;
  }
  section div button span{display: block; width: 1.6rem; text-align: justify; text-align-last: justify}
  section div img{width: 100%}
</style>

