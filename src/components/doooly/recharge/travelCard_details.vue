<template>
  <div class="view">
    <ul>
        <li class="clearfix">
            <div class="fl left">姓名</div>
            <div class="fl name">{{name}}</div>
        </li>
        <li class="clearfix">
            <div class="fl left">手机号码</div>
            <div class="fl tel">{{tel}}</div>
        </li>
        <li class="clearfix">
            <div class="fl left">身份证号码</div>
            <div class="fl card">{{card}}</div>
        </li>
    </ul>
  </div>
</template>
<script>

  export default {
    components: {
      
    },
    data() {
      return {
        card:this.$route.params.card,
        name:this.$route.params.name,
        tel:this.$route.params.tel,
      }
    },
    created(){
      initTitle('我的绑定信息','')
    },
    
    
  }
</script>
<style scoped>
    .view{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #f5f5f5;
    }
    ul{
        background: #fff;
        padding: 0 0.3rem;
    }
    ul li{
        height: 0.98rem;
        line-height: 0.98rem;
        width: 100%;
        font-size: 0.26rem;
        color: #acacac;
        border-bottom: 1px solid #ececec;
    }
    ul li:last-child{
        border:0;
    }
    ul li .left{
        width: 2rem;
        color: #666;
    }
</style>
