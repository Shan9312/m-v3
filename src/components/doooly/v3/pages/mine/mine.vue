<template>
  <div class="personal-center-page">
    <div class="header-bg">
      <img src="~v3/assets/images/mine/header_bg.png" alt>
    </div>
    <div class="home-top">
      <div class="card-bg-wrap" data-route-name="mine" data-baidu-stats="会员卡" @click="jumpPersonalInfo()">
        <img class="grade" @click.stop="groupLevel && jump('memberEquity', '/v3/memberEquity'); $baiduStats('会员权益等级', 'mine')" :src="levelArr[0]" alt>
        <img class="company-logo" :src="miniLogoUrl" alt>
        <p class="piont-use" data-route-name="mine" data-baidu-stats="花积分" @click.stop="jump('takeIntegral', '/takeIntegral'); $baiduStats('花积分', 'mine')">花积分
          <img src="~v3/assets/images/mine/hua_right.png" alt>
        </p>
        <p class="nickname">{{ memberName || 'Carmen Electra' }}</p>
        <p class="piont-view">
          <span>{{ availablePoints }}</span>
        </p>
        <div class="rights">
            <img v-for="(equityLogoUrl, index) in equityLogoUrlArr" @click.stop="jump('memberEquity', '/v3/memberEquity'); $baiduStats('会员权益等级', 'mine')" :src="equityLogoUrl" :key="index" v-show="index < 3" alt>
            <span class="icon-more" v-if="hasMoreEquity"></span>
        </div>
      </div>
    </div>

    <section>
      <ul class="my_center_list margin-top-20">
        <li data-route-name="mine" data-baidu-stats="全部订单" @click="jump(3,'/myOrderList/0/all')" class="margin">
          <span class="left-span">我的订单</span>
          <div class="fr right">
            <span>全部订单</span>
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
        <li class="orderTab">
          <div data-route-name="mine" data-baidu-stats="最近下单" @click="jump(4,'/myOrderList/1/all')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/lately_order.png">
              <img v-show="recentlyPlacedOrderFlag" class="redDot" src="~v3/assets/images/mine/red_dot.png">
            </div>
            <span>最近下单</span>
          </div>
          <div data-route-name="mine" data-baidu-stats="待支付订单" @click="jump(5,'/myOrderList/4/all')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/unpaid_order.png">
              <img v-show="pendingPaymentFlag" class="redDot" src="~v3/assets/images/mine/red_dot.png">
            </div>
            <span>待支付订单</span>
          </div>
          <div data-route-name="mine" data-baidu-stats="已完成订单" @click="jump(6,'/myOrderList/5/all')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/completed_order.png">
              <!-- <img v-if="newCancelFlag" class="redDot" src="~v3/assets/images/mine/red_dot.png"> -->
            </div>
            <span>已完成订单</span>
          </div>
        </li>
      </ul>
      <ul class="my_center_list margin-top-20">
        <li data-route-name="mine" data-baidu-stats="积分明细" @click="jump('myPointList', '/myPointList/1/')" class="margin">
          <span class="left-span">我的积分</span>
          <div class="fr right">
            <span>积分明细</span>
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
        <li class="orderTab">
          <div data-route-name="mine" data-baidu-stats="最近到账" @click="jump('myPointList', '/myPointList/1/')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/recently_integral.png">
              <img v-show="recentArrivalFlag" class="redDot" src="~v3/assets/images/mine/red_dot.png">
            </div>
            <span>最近到账</span>
          </div>
          <div data-route-name="mine" data-baidu-stats="即将到账" @click="jump('myPointList', '/myPointList/0/')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/about_integral.png">
              <img v-show="imminentArrivalFlag" class="redDot" src="~v3/assets/images/mine/red_dot.png">
            </div>
            <span>即将到账</span>
          </div>
          <div data-route-name="mine" data-baidu-stats="即将过期" @click="jump('myPointList', '/myPointList/3/')" class="tabs">
            <div class="tabImg">
              <img src="~v3/assets/images/mine/expire_integral.png">
            </div>
            <span>即将过期</span>
          </div>
        </li>
      </ul>

      <ul class="my_center_list margin-top-20">
        <li
          data-route-name="mine" data-baidu-stats="礼券绑定"
          @click="jump(11, '/point_recharge')"
          v-if="groupName != '中福匯'"
        >
          <span class="left-span">礼券绑定</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
        <li data-route-name="mine" :data-baidu-stats="'我的礼包-' + giftBagCount + '个礼包待领取'" @click="jumpGiftList()" v-if="groupName != '中福匯'">
          <span class="left-span">我的礼包</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
          <p class="tips-coupons" v-if="giftBagCount >= 1">{{ giftBagCount }}个礼包待领取</p>
        </li>
        <li data-route-name="mine" :data-baidu-stats="'我的福利-' + couponNum + '张礼券'" @click="jump('coupon', '/coupon/0')" v-if="groupName != '中福匯'">
          <span class="left-span">我的福利</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
          <p class="tips-coupons" v-if="couponNum">{{couponNum}}
            <span>张礼券</span>
          </p>
        </li>
      </ul>
      <ul class="my_center_list margin-top-20">
        <li
          data-route-name="mine" data-baidu-stats="邀请亲友"
          @click="jump(12, '/familyInvite')"
          v-if="groupName != '中福匯'"
        >
          <span class="left-span">邀请亲友</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
      </ul>
      <ul class="my_center_list margin-top-20 fill-blanks">
        <li data-route-name="mine" data-baidu-stats="客服投诉和问题反馈" @click="jump(8,'/complaint/')" v-if="groupName != '中福匯'">
          <span class="left-span">客服投诉和问题反馈</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
        <li
          data-route-name="mine" data-baidu-stats="帮助中心"
          @click="jump(9,'/helpCenter/')"
          v-if="groupName != '中福匯'"
        >
          <span class="left-span">帮助中心</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
        <li data-route-name="mine" data-baidu-stats="系统设置" @click="jump(11,'/setting')">
          <span class="left-span">系统设置</span>
          <div class="fr right">
            <img src="~v3/assets/images/mine/rightArrow.png">
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import personalCenter from "./mine.js";
export default personalCenter;
</script>

<style lang="scss" scoped>
@import "./mine.scss";
</style>
