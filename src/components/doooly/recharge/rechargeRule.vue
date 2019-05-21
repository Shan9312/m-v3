<template>
  <div>
    <div class="title">1、屏幕上点击“充值/圈存”服务</div>
    <img src="../../../assets/images/recharge/rechargeRule1.png">
    <div class="title">2、按屏幕提示放入需要圈存的旅游卡</div>
    <img src="../../../assets/images/recharge/rechargeRule2.png">
    <div class="title">3、屏幕显示旅游卡信息，选择“后台账户余额”</div>
    <img src="../../../assets/images/recharge/rechargeRule3.png">
    <div class="title">4、选择交易金额</div>
    <img src="../../../assets/images/recharge/rechargeRule4.png">
    <div class="title">5、输入交易密码，点击“确定”按钮</div>
    <img src="../../../assets/images/recharge/rechargeRule5.png">
    <div class="title">6、屏幕提示是否打印凭条</div>
    <img src="../../../assets/images/recharge/rechargeRule6.png">
  </div>
</template>

<script>

export default {
  name: "rechargeRule",
  data(){
    return {
    }
  },
  created(){
    initTitle('圈存流程','')
  },
  methods:{
  }
}
</script>

<style scoped>
  .title{
    font-size: 0.28rem;
    padding: 0.2rem 0;
    text-align: left;
    text-indent: 0.1rem;
  }
  div{
    text-align: center;
  }
  img{
    width: 94%;
  }
</style>
