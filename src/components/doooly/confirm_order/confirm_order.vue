<template>
  <div class="view" v-show="viewShow">
    <div class="top"></div>
    <header
      v-if="!userDeliveryList || userDeliveryList.length <= 0"
      @click="link()"
      class="add clearfix"
    >
      <div class="fl">
        点击添加收货地址
      </div>
      <div class="fr">
        <img src="../../../assets/images/userDelivery/right.png" />
      </div>
    </header>
    <!-- 收货地址 -->
    <header v-else @click="link()" class="clearfix">
      <div>
        <div class="fl clearfix">
          <span class="name">收货人：{{ userDeliveryList.receiverName }}</span>
          <span class="fr tel">{{ userDeliveryList.receiverTelephone }}</span>
          <br />
          <span class="address"
            >收货地址：{{
              userDeliveryList.province +
                userDeliveryList.city +
                userDeliveryList.area +
                userDeliveryList.address
            }}</span
          >
        </div>
        <div class="fr">
          <img src="../../../assets/images/userDelivery/right.png" />
        </div>
      </div>
    </header>
    <div class="main"></div>
    <div class="line_bold"></div>
    <div class="company">
      <div class="clearfix picture_view" v-for="item in postData">
        <div class="fl picture">
          <img :src="item.img" />
        </div>
        <div class="fl price">
          <span class="name">{{ item.name }}</span
          ><br />
          <span class="type">规格：{{ item.specification }}</span
          ><br />
          <span
            ><span style="font-size:0.24rem;margin: 0;padding: 0;color:#ee3f44;"
              >￥</span
            ><span
              style="display: inline;margin: 0;padding: 0;"
              class="sellPrice"
              >{{ item.sellPrice }}</span
            ></span
          >
        </div>
      </div>
      <div class="line_bold"></div>
      <div class="freight clearfix">
        <div class="fl">
          运费
        </div>
        <div class="fr">
          ￥0.00
        </div>
      </div>
    </div>
    <div class="line_bold"></div>
    <div class="footer_bg"></div>
    <footer>
      <div class="fl">
        应付金额：<span
          ><span style="font-size:0.24rem;margin: 0;padding: 0;">￥</span
          ><span class="sellPrice">{{ postData | formatPrice }}</span></span
        >
      </div>
      <div class="fr dis_btn" @click="refer" :class="confirmClassObj">
        确认提交
      </div>
    </footer>
    <div class="modal" v-show="isBankNumber" @click="isBankNumber = false"></div>
    <div class="bank-modal" v-show="isBankNumber">
      <div class="bank-header">
        <h3>请填写信息</h3>
        <div class="bank-header-info">
          <span>根据建设银行要求，需要验证您的银行卡是否满足参与活动条件</span>
        </div>
      </div>
      <div class="bank-content">
        <div class="bank-number">
          <label for="">银行卡号</label>
          <input type="tel" id="card" v-model="cardNumber" placeholder="请输入银行卡号" @blur="cardBlur"/>
          <div class="bank-err" v-show="bankError">{{bankError}}</div>
        </div>
        <div class="bank-mobile">
          <label for="">手机号码</label>
          <input type="tel" id="mobile" v-model="mobile" placeholder="请输入手机号码" @blur="mobileBlur"/>
          <div class="mobile-err" v-show="mobileError">{{mobileError}}</div>
        </div>
      </div>
      <div class="bank-btn">
        <div class="btn-submit">
          <button @click="handlBankSub" :disabled="disabled">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import confirmOrder from './confirm_order.js'
export default confirmOrder
</script>

<style lang="scss" scoped>
  @import "./confirm_order.scss";
</style>
