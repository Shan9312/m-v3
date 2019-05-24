<template>
  <div class="recycling-confirm">
    <div class="banner">
      <img src="../../../assets/images/recycling/recycling-confirm/banner.png" alt="" />
    </div>
    <div class="content">
      <p>根据近一个月的数据，商品回收价预计为<span>10000元</span>我们将在回收两天后给予您准确的商品回收价</p>
    </div>
    <div class="recycling-Info">
      <h3>请寄回您要回收的物品</h3>
      <ul>
        <li>快递类型：普通快递</li>
        <li>寄件人：彭于晏</li>
        <li>联系号码：18550004166</li>
        <li>寄回地址：上海市黄浦区人民广场888号8楼</li>
        <li></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RecyclingConfirm',
  data () {
    return {}
  },
  created () {
    initTitle('我的回收订单', '')
  }
}
</script>
<style lang="scss">
  .recycling-confirm {
    background:rgb(246,246,246);
    padding: 0.2rem;
    .banner{
      width: 100%;
    }
  }
</style>
