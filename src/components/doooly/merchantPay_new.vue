<template>

</template>
<script>
export default {
  name: 'merchant-pay',
  mounted() {
    dooolyAPP.redirectPay(this.$route.params.orderNum)
  }
}
</script>