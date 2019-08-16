<template>
  <div class="app_bg">
    <div v-if="showDetail">
      <section class="clearfix">
        <!-- 订单返积分信息 -->
        <detailHeader v-if="isShowDetailHeader" :isUserRebate="supplierOrder.isUserRebate"
          :courierNumber="supplierOrder.courierNumber"
          :orderDetail="supplierOrder"
          :userRebate="supplierOrder.userRebate" :type="supplierOrder.type" :state="supplierOrder.state"
          :integrateReturnDate="supplierOrder.integrateReturnDate" :minutes="minutes" :seconds="seconds"></detailHeader>
        <!-- 订单主要信息展示 -->
        <detailContent :supplierOrder=supplierOrder></detailContent>
        <!-- footer -->
        <div class="detail_footer">
          <p class="service_time">服务时间：{{serviceTime}}</p>
          <p class="service_time">客服电话：<span class="line">
              <a href="tel:400-158-2212">400-158-2212</a>
            </span></p>
        </div>
        <!-- 订单列表url跳转 -->
        <div
          v-if="supplierOrder.productType==3||supplierOrder.productType==4||supplierOrder.productType==5 ||supplierOrder.productType==1||supplierOrder.productType==2||supplierOrder.productType==6">
        </div>
        <div v-else>
          <div class="details_record" data-baidu-stats="订单详情-查看此商户的交易记录" @click="order_details(supplierOrder.businessId)">
            <div class="fl">查看此商户的交易记录</div>
            <div class="fr">
              <img src="../../../assets/images/personalCenter/myOrder/right_arrow.png" style="width: 0.2rem;">
            </div>
          </div>
        </div>
        <!-- 卡券兑换url跳转 -->
        <div v-if="supplierOrder.productType==2||supplierOrder.productType==6">
          <div v-if="supplierOrder.duihuanUrl!='' && supplierOrder.type === 1">
            <div class="promptly_div copy_btn" data-clipboard-action="copy" data-clipboard-target=".copyCode"
              @click="copyBtn()">
              立即前往兑换
            </div>
          </div>
        </div>
        <!-- btn -->
        <div class="footer_btn_wrap" v-if="supplierOrder.type === 10 && supplierOrder.cashDeskSource === 'd' && (!countDownEnd || supplierOrder.isSource !== 3) && supplierOrder.continuePayStatus != '0'">
          <p class="footer_btn" data-baidu-stats="订单详情-继续付款" @click="keepBuying(supplierOrder.orderNumber)">
            继续付款
          </p>
        </div>
        <!-- <div class="footer_btn_wrap" v-else-if="supplierOrder.type === 99 && supplierOrder.cashDeskSource === 'd' && supplierOrder.orderType != 1">
          <p class="footer_btn" data-baidu-stats="订单详情-再次购买" @click="buyAgain(supplierOrder.businessId, supplierOrder.isSource, supplierOrder.productId)">
            再次购买
          </p>
        </div> -->
      </section>
    </div>
  </div>
</template>

<script>
import myOrderDetail from './order_detail.js'
export default myOrderDetail

</script>

<style lang="scss" scoped>
  @import './order_detail.scss';

</style>
