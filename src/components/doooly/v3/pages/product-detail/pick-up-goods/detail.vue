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
    <div>
      <!-- 底部悬浮 -->
      <div class="footer_bg"></div>
      <footer class="box_item">
        <!-- <div class="item fl-1" v-if="!isStart && !isEnd && specialStartDate">
          {{countdownTim}}
        </div> -->
        <div
          class="item fr-2"
          :class="{ gary: inventory === 0 }"
          @click="order()"
        >
          <span v-if="activityName === 'jianhangTicket' || activityName === 'jianhangTicketOther'">
            {{
              inventory === 0 ? "已售罄" : "立即抢购"
            }}
          </span>
          <span v-else>
            {{
              inventory === 0 ? "已售罄" : "立即领取"
            }}
          </span>
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

