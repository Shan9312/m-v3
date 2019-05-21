<template>
  <div class="detail_header">
    <div class="header_status_card">
      <!-- 倒计时 -->
      <span class="fl" v-if="userRebateState === 3 || userRebateState === 4" v-show="minutes > 0 || seconds > 0">
        订单已生成，请在
        <span v-show="minutes > 0">{{minutes}}分</span>
        <span v-show="seconds > 0">{{seconds}}秒</span>
        内付款
      </span>
      <span v-else class="fl">{{ tipsText }}</span>
      <img :src="statusCardImg" alt="">
    </div>
    <div class="header_msg">
      <p class="msg_title" v-if="showContentTitle">{{ showContentTitle }}</p>
      <p class="msg_count" v-if="(userRebateState === 1 || userRebateState === 2 || userRebateState === 3) && userRebate > 0">
        {{ userRebate }}积分
        <span>(1积分可抵1元)</span>
      </p>
      <p class="msg_tips" v-if="1 <= userRebateState && userRebateState <= 3">{{ showContentTips }}</p>
    </div>
  </div>
</template>

<script>
import detailHeader from "./detail_header.js";
export default detailHeader;
</script>

<style lang="scss" scoped>
@import "./detail_header.scss";
</style>