<template>
  <div class="result" v-if="popupVisible">
    <div class="model_div">
      <div class="model_title">{{ tipsTitle }}</div>
      <div class="model_con" id="div_name"><p>{{ detailCompanyName }}</p></div>
      <div class="button_div" id="btn_model_div">
        <button type="button" @click="close_btn()" class="btn_primary no_btn">取消</button>
        <button type="button" @click="affirm_btn()" class="btn_primary yes_btn">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import orderDialog from "./dialog.js";
export default orderDialog;
</script>

<style lang="scss" scoped>
@import "./dialog.scss";
</style>