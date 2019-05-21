<template>
  <div class="detail_content">
    <div class="detail_count">
      <div class="div_describe">
        <p class="des_l">订单金额</p>
        <p class="des_r" v-if="Number(supplierOrder.payAmount)">
          ￥{{ supplierOrder.payAmount.toFixed(2) }}
          <span v-if="supplierOrder.amountPayable > 0 && supplierOrder.savePrice > 0">
            (原价:￥{{ supplierOrder.amountPayable.toFixed(2) }})</span>
        </p>
      </div>
      <div class="div_describe" v-if="supplierOrder.savePrice > 0">
        <p class="des_l long_text">{{ supplierOrder.groupShortName }}会员权益优惠</p>
        <p class="des_r short_text">-￥{{ supplierOrder.savePrice.toFixed(2) }}</p>
      </div>
      <div class="div_describe"
        v-if="Number(supplierOrder.serviceCharge)">
        <p class="des_l">手续费</p>
        <p class="des_r">￥{{ supplierOrder.serviceCharge }}</p>
      </div>
    </div>
    <div class="detail_all_div">
      <!-- <div v-if="supplierOrder.savePrice !=  0 ">
        <div v-if="supplierOrder.productType==3||supplierOrder.productType==4||supplierOrder.productType==1 ||supplierOrder.productType==2||supplierOrder.productType==6"></div>
        <div v-else>
          <div class="div_describe" style="margin-top: 0.4rem;">
            <div class="des_l">节省金额</div>
            <div class="des_r" v-if="String(supplierOrder.savePrice).indexOf('.')>0">
              {{supplierOrder.savePrice.toFixed(2)}}
            </div>
            <div class="des_r" v-else>
              {{String(supplierOrder.savePrice)}}.00
            </div>
          </div>
        </div>
      </div> -->
      <div class="div_describe">
        <div class="des_l">订单状态</div>
        <div class="des_r highlight_font" v-if="supplierOrder.state==1 && supplierOrder.type==1">
          <span v-if="supplierOrder.productType==3 && supplierOrder.retState==0">充值中</span>
          <span v-else>已完成</span>
        </div>
        <div class="des_r highlight_font" v-else-if="supplierOrder.state==1 && supplierOrder.type==5">已退货</div>
        <div class="des_r highlight_font" v-else-if="supplierOrder.state==2">已取消</div>
        <div class="des_r highlight_font" v-else-if="supplierOrder.state==0 && supplierOrder.continuePayStatus !='0'">待付款</div>
        <div class="des_r highlight_font" v-else>交易关闭</div>
      </div>
      <div class="div_describe" v-if="supplierOrder.company">
        <div class="des_l">商户名称</div>
        <div class="des_r">{{ supplierOrder.company }}</div>
      </div>
      <div v-if="supplierOrder.productType==1||supplierOrder.productType==2||supplierOrder.productType==6 || supplierOrder.productType==12 || supplierOrder.productType==13">
        <div class="div_describe">
          <div class="des_l">商品名称</div>
          <div class="des_r">{{supplierOrder.goods}}-{{supplierOrder.specification}}</div>
        </div>
        <div v-if="supplierOrder.voucher > 0">
          <div v-if="supplierOrder.totalPrice" class="div_describe">
            <div class="des_l">商品金额</div>
            <div class="des_r" v-if="String(supplierOrder.totalPrice).indexOf('.')>0">
              ￥{{Number(supplierOrder.totalPrice).toFixed()}}</div>
            <div class="des_r" v-else>￥{{supplierOrder.totalPrice}}.00</div>
          </div>
          <div class="div_describe">
            <div class="des_l">抵扣金额</div>
            <div class="des_r" v-if="String(supplierOrder.voucher).indexOf('.')>0">
              ￥{{Number(supplierOrder.voucher).toFixed(2)}}</div>
            <div class="des_r" v-else>￥{{supplierOrder.voucher}}.00</div>
          </div>
        </div>
      </div>
      <div class="div_describe" v-else-if="supplierOrder.productType==3">
        <div class="des_l">商品名称</div>
        <div class="des_r">话费充值</div>
      </div>
      <div class="div_describe" v-else-if="supplierOrder.productType==4">
        <div class="des_l">商品名称</div>
        <div class="des_r">流量充值</div>
      </div>
      <div class="div_describe" v-else-if="supplierOrder.productType==5">
        <div class="des_l">商品名称</div>
        <div class="des_r">都市旅游卡充值</div>
      </div>
      <div class="div_describe">
        <div class="des_l">订单编号</div>
        <div class="des_r">{{supplierOrder.orderNumber}}</div>
      </div>
      <div class="div_describe">
        <div class="des_l">订单时间</div>
        <div class="des_r">{{supplierOrder.orderDate}}</div>
      </div>
      <div class="div_describe" v-if="supplierOrder.state === '1'">
        <div class="des_l">支付方式</div>
        <div class="des_r"
          v-if="supplierOrder.productType==3 && Number(supplierOrder.voucher).toFixed(2)>0 && supplierOrder.payAmount.toFixed(2)==0.00">
          抵扣券</div>
        <div class="des_r" v-else>{{supplierOrder.payTypeStr}}</div>
      </div>
      <!-- 商户预计返利 star -->
      <div>
        <div class="div_describe" v-if="supplierOrder.cardCode">
          <div class="des_l">卡号</div>
          <div class="des_r">{{supplierOrder.cardCode}}</div>
        </div>
        <div class="div_describe" v-if="supplierOrder.cardPass">
          <div class="des_l">卡密</div>
          <div v-if="supplierOrder.cardPass">
            <div class="des_r"
              v-if="supplierOrder.cardPass.substring(0,4)=='http' || supplierOrder.cardPass.substring(0,4)=='HTTP'">
              <a class="copyCode" :href=supplierOrder.cardPass>{{supplierOrder.cardPass}}</a>
            </div>
            <div class="des_r copyCode" v-else>{{supplierOrder.cardPass}}</div>
          </div>
        </div>
      </div>
      <div v-if="supplierOrder.productType==3">
        <div class="div_describe">
          <div class="des_l">手机号码</div>
          <div class="des_r">{{supplierOrder.consigneeMobile}}</div>
        </div>
        <div class="div_describe">
          <div class="des_l">充值金额</div>
          <div class="des_r">{{supplierOrder.specification}}</div>
        </div>
        <!-- <div class="div_describe" v-if="supplierOrder.payTypeStr=='兜礼积分'&& supplierOrder.state=='1' && supplierOrder.type=='1'&&supplierOrder.serviceCharge!= 0">
          <div class="des_l">手续费</div>
          <div class="des_r">{{supplierOrder.serviceCharge}}元</div>
        </div> -->
        <div class="div_describe" v-if="supplierOrder.voucher >0">
          <div class="des_l">抵扣金额</div>
          <div class="des_r">￥{{supplierOrder.voucher}}</div>
        </div>
      </div>
      <div v-else-if="supplierOrder.productType==4">
        <div class="div_describe">
          <div class="des_l">手机号码</div>
          <div class="des_r">{{supplierOrder.consigneeMobile}}</div>
        </div>
        <div class="div_describe">
          <div class="des_l">流量包</div>
          <div class="des_r">{{supplierOrder.specification}}</div>
        </div>
        <div class="div_describe" v-if="supplierOrder.voucher >0">
          <div class="des_l">抵扣金额</div>
          <div class="des_r">￥{{supplierOrder.voucher}}</div>
        </div>
      </div>
      <div v-else-if="supplierOrder.productType==5">
        <div class="div_describe" v-if="supplierOrder.sctcdCardno">
          <div class="des_l">旅游卡号</div>
          <div class="des_r">{{supplierOrder.sctcdCardno}}</div>
        </div>
        <div class="div_describe">
          <div class="des_l">充值金额</div>
          <div class="des_r" v-if="String(supplierOrder.payAmount).indexOf('.')>0">
            {{supplierOrder.payAmount.toFixed(2)}}元</div>
          <div class="des_r" v-else>{{String(supplierOrder.payAmount)}}.00</div>
        </div>
        <div class="div_describe" v-if="supplierOrder.voucher >0">
          <div class="des_l">抵扣金额</div>
          <div class="des_r">￥{{supplierOrder.voucher}}</div>
        </div>
        <div>
          <div class="div_describe" v-if="supplierOrder.sctcdAccountMobile">
            <div class="des_l">绑定手机号码</div>
            <div class="des_r">{{supplierOrder.sctcdAccountMobile}}</div>
          </div>
          <div class="div_describe" v-if="supplierOrder.sctcdAccountIdCard">
            <div class="des_l">绑定身份证号</div>
            <div class="des_r">{{supplierOrder.sctcdAccountIdCard}}</div>
          </div>
        </div>
      </div>

      <!-- businessRebateAmount rebateAmount -->
      <div v-if="supplierOrder.userRebate != 0">
        <div
          v-if="supplierOrder.productType==3||supplierOrder.productType==4||supplierOrder.productType==1 ||supplierOrder.productType==5||supplierOrder.productType==2||supplierOrder.productType==6">
        </div>
        <div v-else>
          <!-- <div class="div_describe">
            <div class="des_l">预计返积分</div>
            <div class="des_r" v-if="String(supplierOrder.userRebate).indexOf('.')>0">
              {{supplierOrder.userRebate.toFixed(2)}}积分
            </div>
            <div class="des_r" v-else>{{String(supplierOrder.userRebate)}}.00</div>
          </div> -->
          <!-- <div class="div_describe" v-if="supplierOrder.state !== '0'">
            <div class="des_l">积分到账状态</div>
            <div class="des_r" v-if="supplierOrder.billingState == '2'">已到账</div>
            <div class="des_r" v-else-if="supplierOrder.billingState == '0'">正在返</div>
          </div> -->
        </div>
      </div>
      <!-- 商户预计返利 end -->

      <div v-if="supplierOrder.courierNumber">
        <div class="div_describe">
          <div class="des_l">物流公司</div>
          <div class="des_r">{{supplierOrder.expressCompanyName}}</div>
        </div>
        <div class="div_describe">
          <div class="des_l">物流单号</div>
          <div class="des_r">
            <div class="wlButton" @click="baidu">查看物流信息</div>{{supplierOrder.courierNumber}}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import detailContent from "./detail_content.js";
  export default detailContent;

</script>

<style lang="scss" scoped>
  @import "./detail_content.scss";

</style>
