<template>
  <section >
    <div class="own tabs_ul">
      <div class='clearfix' v-if="item.showTitleHtml">
        <div class='statistics_div'>
          <div class='statistics_time'>{{item.orderDate.substring(0,4)}}年{{item.orderDate.substring(5,7)}}月</div>
          <div class='statistics_expend' v-for="(d,i) in amountListData" :key="i">
            <span v-if="item.orderDate.substring(0,4)+'-'+item.orderDate.substring(5,7) == d.orderDate">
              总支出￥{{d.totalMonthMount.toFixed(2)}}
            </span>
            <span class="member" v-if="item.orderDate.substring(0,4)+'-'+item.orderDate.substring(5,7) == d.orderDate">{{ d.groupShortName }}会员权益</span>
            <span v-if="item.orderDate.substring(0,4)+'-'+item.orderDate.substring(5,7) == d.orderDate">
              <span v-if="String(d.totalMonthsaveMount).substring(0,1)!='-' && String(d.totalMonthsaveMount).substring(0,1)>0">共节省￥{{d.totalMonthsaveMount.toFixed(2)}}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- 充值 -->
      <div class="order_item_wrap" v-if="item.productType==1||item.productType==2||item.productType==3||item.productType==4||item.productType==5||item.productType==6">
        <div class="order_item_head">
          <!-- title -->
          <img src="../../../../assets/images/personalCenter/myOrder/shop_icon.png" alt="">
          <p class="oreder_title" v-if="item.productType==3||item.productType==4">手机充值</p>
          <p class="oreder_title" v-else-if="item.productType==5">旅游卡充值</p>
          <p class="oreder_title" v-else>{{ item.goods }}-{{ item.specification }}</p>
          <!-- title -->
          <p class="order_date">{{ item.orderDate && item.orderDate.substr(0, item.orderDate.length - 3) }}</p>
          <p class="order_status" v-if="item.type == 10 && item.continuePayStatus == '0'">交易关闭</p>
          <p class="order_status" v-else>{{ typeFilter[item.type] }}</p>
        </div>
        <div class="order_list_div clearfix">
          <a href="javascript:void(0);" @click="order_Detail(item.orderId)">
            <div>
              <div class="order_list_img">
                <img :onerror="defaultImg" v-if="item.productType == 3 || item.productType == 4" src="../../../../assets/images/personalCenter/myOrder/telephone.png" />
                <img :onerror="defaultImg" v-else-if="item.productType == 5" src="../../../../assets/images/personalCenter/myOrder/pay_card.png" />
                <img :onerror="defaultImg" v-else :src="item.productImg" />
              </div>
              <div class="order_list_txt">
                <!-- <p class="oreder_text" v-if="">{{item.goods}}-{{item.specification}}</p>
                <p class="oreder_time">{{item.orderDateStr}}</p> -->
                <p class="oreder_text">{{ rebateReturnMsg(item.isUserRebate, item.userRebate, item.type) }}</p>
                <p class="oreder_time">{{ rebateReturnTime(item.isUserRebate, item.userRebate, item.type, item.integrateReturnDate) }}</p>
              </div>
            </div>
            <div class="oreder_money"><span class="span_money">￥</span>
              <span class="span_num">
                {{item.payAmount.toFixed(2)}}
              </span>
              <!-- <p v-if="item.type==99">交易关闭</p> -->
              <div>
                <div class="span_savePrice" v-if="item.savePrice > 0">
                原价：<span>{{item.amountPayable.toFixed(2)}}</span>
                </div>
              </div>
            </div>
          </a>
        </div>
        <!-- test fllll -->
        <!-- 自营isSource: 3, 接收银台cashDeskSource: d -->
        <div class="div_btn" v-if="item.type==10 && item.cashDeskSource === 'd' && item.continuePayStatus == '1'">
          <button v-if="item.productType==3||item.productType==4" type="button" class="no_btn" @click="order_cancel('手机充值',item.orderNumber)">
            取消订单
          </button>
          <button v-else-if="item.productType==5" type="button" class="no_btn" @click="order_cancel('旅游卡充值',item.orderNumber)">
            取消订单
          </button>
          <button v-else-if="item.isSource === 3" type="button" class="no_btn" @click="order_cancel(item.goods+'-'+item.specification,item.orderNumber)">
            取消订单
          </button>
          <button type="button" class="yes_btn" @click="order_payment(item.orderNumber)">继续支付</button>
        </div>
        <!-- delete -->
        <div class="div_btn" v-if="item.type==99">
          <button type="button" class="no_btn" @click="orderDelete(item.goods, item.orderId)">删除订单</button>
        </div>
      </div>
      <!-- 非充值 -->
      <div class="order_item_wrap" v-else>
        <div class="order_item_head">
          <!-- title -->
          <!-- <p class="oreder_title" v-if="item.productType==3||item.productType==4">手机充值</p>
          <p class="oreder_title" v-else-if="item.productType==5">旅游卡充值</p> -->
          <!-- <p class="oreder_title" v-else>{{ item.goods }}-{{ item.specification }}</p> -->
          <img src="../../../../assets/images/personalCenter/myOrder/shop_icon.png" alt="">
          <p class="oreder_title" v-if="item.storeName != undefined && item.storeName != ''">{{item.company}}</p>
          <p class="oreder_title" v-else>{{item.company}}{{item.storeName}}</p>
          <!-- title -->
          <p class="order_date">{{ item.orderDate && item.orderDate.substr(0, item.orderDate.length - 3) }}</p>
          <p class="order_status" v-if="item.type == 10 && item.continuePayStatus == '0'">交易关闭</p>
          <p class="order_status" v-else>{{ typeFilter[item.type] }}</p>
        </div>
        <!-- list -->
        <div class="order_list_div clearfix">
          <a href="javascript:void(0);" @click="order_Detail(item.orderId)">
            <div class="order_list_img">
              <img :onerror="defaultImg" :src="item.logo" />
            </div>
            <div class="order_list_txt">
              <!-- <p class="oreder_text" v-if="item.storeName != undefined && item.storeName != ''">{{item.company}}</p>
              <p class="oreder_text" v-else>{{item.company}}{{item.storeName}}</p> -->
              <p class="oreder_text">{{ rebateReturnMsg(item.isUserRebate, item.userRebate, item.type) }}</p>
              <p class="oreder_time">{{ rebateReturnTime(item.isUserRebate, item.userRebate, item.type, item.integrateReturnDate) }}</p>
              <!-- <p class="oreder_time">{{item.orderDateStr}}</p> -->
            </div>
            <div class="oreder_money">
              <div class="span_num">
                <span class="span_money">￥</span>{{item.payAmount.toFixed(2)}}
              </div>
              <!-- <p v-if="item.type==99">交易关闭</p> -->
              <div>
                <div class="span_savePrice" v-if="String(item.savePrice).substring(0,1)!='-' && String(item.savePrice).substring(0,1)>0">
                原价：<span>{{item.amountPayable.toFixed(2)}}</span>
                </div>
              </div>
              <!-- <div class="span_savePrice" v-if="String(item.savePrice).substring(0,1)!='-' && String(item.savePrice).substring(0,1)>0">
                共{{item.savePrice.toFixed(2)}}
              </div> -->
            </div>
          </a>
        </div>
        <!-- 自营isSource: 3, 接收银台cashDeskSource: d -->
        <div class="div_btn" v-if="item.type==10 && item.cashDeskSource === 'd' && item.continuePayStatus == '1'">
          <button v-if="item.productType==3||item.productType==4" type="button" class="no_btn" @click="order_cancel('手机充值',item.orderNumber)">
            取消订单
          </button>
          <button v-else-if="item.productType==5" type="button" class="no_btn" @click="order_cancel('旅游卡充值',item.orderNumber)">
            取消订单
          </button>
          <button v-else-if="item.isSource === 3" type="button" class="no_btn" @click="order_cancel(item.goods+'-'+item.specification,item.orderNumber)">
            取消订单
          </button>
          <button type="button" class="yes_btn" @click="order_payment(item.orderNumber)">继续支付</button>
        </div>
        <!-- delete -->
        <div class="div_btn" v-if="item.type==99">
          <button type="button" class="no_btn" @click="orderDelete(item.goods, item.orderId)">删除订单</button>
        </div>
      </div>
    </div>
    <orderDialog @pageReload="pageReload" @changePopupVisible="changePopupVisible" :popupVisible="popupVisible" :type="type" :tipsTitle="tipsTitle" :detailCompanyName="detailCompanyName" :detailOrderNum="detailOrderNum" :detailOrderId="orderId" :hintState="hintState"></orderDialog>
  </section>
</template>

<script>
import orderItem from "./order_item.js";
export default orderItem;
</script>

<style lang="scss" scoped>
@import "./order_item.scss";
</style>