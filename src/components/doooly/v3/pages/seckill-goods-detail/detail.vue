<template>
  <div>
    <!--轮播图-->
    <adBanner :items="imagesList"></adBanner>

    <!--{{imagesList}}-->
    <!-- 标题 -->
    <div class="explain padding_frm">
      <div class="title">
        {{ cardBuyDetailList.selfProduct.name }}
      </div>

      <div
        class="details"
        v-if="cardBuyDetailList.selfProduct.brandDescription"
      >
        {{
          activityName
            ? cardBuyDetailList.selfProduct.introduction
            : cardBuyDetailList.selfProduct.brandDescription
        }}
      </div>

      <div class="price">
        <span class="red">￥</span
        ><span id="sellPrice_view">{{ showSellPrice }}</span
        ><span v-if="!recyclingType" v-show="cardBuyDetailList.selfProduct.productAttr != '1'"
          >市场价￥<span id="marketPrice_view">{{
            showMarketPrice
          }}</span></span
        >
        <div
          class="fr"
          :class="{ red: inventory < 10 }"
          v-show="cardBuyDetailList.selfProduct.productAttr != '1'"
        >
          {{ inventoryText }}
        </div>
      </div>
      <ul class="label">
        <li>{{ groupShortName }}专享</li>
      </ul>
    </div>
    <div class="line_bold"></div>
    <!-- 商品规格 -->
    <div class="specification padding_frm">
      <div class="title">规格</div>
      <ul class="label">
        <!--<#list skuList as skuList>-->
        <!--<li <#if skuList_index == 0>class="check"</#if> data-id="${skuList.id}" data-buyNumberLimit="${skuList.buyNumberLimit}" data-overBuyLimit="${skuList.overBuyLimit?string ("true","false")}" data-inventory="${skuList.inventory}" data-sellPrice="${skuList.sellPrice}" data-marketPrice="${skuList.marketPrice}">${skuList.specification}</li>-->
        <!--</#list>-->
        <li
          :class="{ check: checkSkuClass == index }"
          v-for="(item, index) in cardBuyDetailList.skuList"
          :key="index"
          @click="skuClick(index)"
        >
          {{ item.specification }}
        </li>
      </ul>
    </div>
    <!-- 类型 -->
    <div class="type padding_frm">
      <div class="title">类型</div>
      <ul class="label">
        <!--<#list productTypeList as productTypeList>-->
        <!--<li <#if productTypeList_index == 0>class="check"</#if> data-id="${productTypeList.id}">${productTypeList.name}</li>-->
        <!--</#list>-->
        <li
          :class="{ check: checkProTypeClass == index }"
          v-for="(item, index) in cardBuyDetailList.productTypeList"
          :key="index"
          @click="proTypeClick(index)"
        >
          {{ item.name }}
        </li>
        {{
          cardBuyDetailList.productTypeList
        }}
      </ul>
    </div>
    <div class="line_bold"></div>
    <!-- 详情 -->
    <div
      class="commodity_details"
      v-html="cardBuyDetailList.selfProduct.detail"
    ></div>
    <!-- 返回顶部 -->
    <div
      class="go_top"
      :class="{ hide: goTop == 2, show: goTop == 1 }"
      @click="goTopfunction"
    >
      <img src="~@/assets/images/cardbuy/go_top.png" />
    </div>
    <div v-if="!ccbType">
      <!-- 底部悬浮 -->
      <div class="footer_bg"></div>
      <footer class="box_item" v-if="!giftBagId">
        <div class="item fl-1" v-if="!recyclingType">
          <!-- 可用积分：<span>{{ cardBuyDetailList.availablePoint }}</span> -->
          {{countdownTim}}
        </div>
        <div
          class="item fr-2"
          :class="{ gary: inventory === 0 || (!isStart && activityName) }"
          @click="order()"
        >
          <span v-if="!activityName">{{
            inventory === 0 ? "补货中" : "立即订购"
          }}</span>
          <span v-else-if="isStart && activityName">{{
            inventory === 0 ? "已售罄" : "立即抢购"
          }}</span>
          <span v-else>即将开抢</span>
          <!--{{inventory!=0?'立即订购':'已售罄'}}-->
        </div>
      </footer>
      <footer class="box_item" v-else>
        <div
          class="item fr-2"
          v-if="!giftType"
          :class="{ gary: inventory == 0 || isReceive == 1 }"
          @click="order('38')"
        >
          <span v-if="isReceive == 1">已领取</span>
          <span v-else-if="inventory == 0">已领完</span>
          <span v-else>{{ giftType ? "立即兑换" : "立即领取" }}</span>
          <!--{{inventory!=0?'立即订购':'已售罄'}}-->
        </div>
        <div
          class="item fr-2"
          v-else
          :class="{ gary: inventory == 0 || isReceive == 1 }"
          @click="order()"
        >
          <span>立即兑换</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import detail from "./detail.js";
export default detail;
</script>

<style lang="scss" scoped>
@import "./detail.scss";
</style>

