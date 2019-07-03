<template>
  <div class="container">
    <section class="topSection">
      <div class="div_header clearfix">
        <div class="fl left">
          <div class="usable_point">
            <span>{{firstPointText}}</span>
            <p :class="{'big_p':isbig_small,'small_p':!isbig_small}">{{availablePoint}}</p>
          </div>
          <div class="to_point">
            <span>{{secondPointText}}</span>
            <p class="small_p" v-if="pointType == 3">0.00</p>
            <p v-else :class="{'big_p':!isbig_small,'small_p':isbig_small}">{{pointType == 1 ? recentArrivalIntefral : returnPoint}}</p>
          </div>
        </div>
        <div class="fr right">
          <span>1积分可抵1元</span>
        </div>
      </div>
      <div v-show="isShow">
        <ul class="usable_ul">
          <li
            v-for="(item,index) in tabs"
            :key="index"
            v-bind:class="{l1:item.ifAdd==tab}"
            @click="link(item.ifAdd, item.content)"
          >
            <div class="div_bot">{{item.value}}</div>
          </li>
        </ul>
      </div>
    </section>
    <section>
      <div
        v-if="mainPointList"
        class="main-body"
        :style="{'-webkit-overflow-scrolling': scrollMode}"
      >
        <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
        :bottomDistance="bottomDistanceValue" bottomDropText="" bottomPullText="">-->
        <ul
          class="tabs1_usableUl mui-table-view list"
          :class="{loadBottom:browserName != 'WebKit' && browserName != 'Chrome WebView'}"
          v-infinite-scroll="loadBottom"
          infinite-scroll-disabled="false"
          infinite-scroll-distance="0"
          infinite-scroll-immediate-check="false"
        >
          <li
            class="clearfix div_con"
            v-for="(item,index) in listData"
            :key="index"
            @click="businessDetail(item.id, pointType)"
          >
            <div class="fl icon_div">
              <div v-if="item.type==7 || item.type==11">
                <div>
                  <img src="~@/assets/images/logo.png">
                </div>
              </div>
              <div v-else-if="item.logo==undefined">
                <div v-if="item.groupLogo == undefined">
                  <img src>
                </div>
                <div v-else>
                  <img :src="item.groupLogo" :onerror="defaultImg">
                </div>
              </div>
              <div v-else>
                <img :src="item.logo" :onerror="defaultImg">
              </div>
            </div>
            <div class="fl con">
              <div v-if="!item.orderId">
                <div v-if="!item.rechargeId && item.type != '13'">
                  <div v-if="item.type==10">
                    <p class="shop_name">{{item.integralName}}-奖品</p>
                  </div>
                  <div v-if="item.type==7">
                    <p class="shop_name">积分绑定-福利</p>
                  </div>
                  <div v-if="item.type==11">
                    <p class="shop_name">兜礼签到领积分</p>
                  </div>
                </div>
                <div v-else>
                  <p class="shop_name">{{item.groupShortName}}-福利</p>
                </div>
              </div>
              <div v-else>
                <div v-if="item.storeName == undefined">
                  <p class="shop_name">{{item.company}}</p>
                </div>
                <div v-else>
                  <p class="shop_name">{{item.company}}-{{item.storeName}}</p>
                </div>
              </div>
              <p class="con_date">{{String(item.createDateStr).substring(5,17)}}</p>
            </div>
            <div
              class="fr con_money"
              v-if="tab==0&&item.businessRebateAmount>=0"
            >+{{item.businessRebateAmount.toFixed(2)}}</div>
            <div
              class="fr con_money"
              v-else-if="tab==1&&item.businessRebateAmount>0"
            >-{{item.businessRebateAmount.toFixed(2)}}</div>
            <div
              class="fr con_money"
              v-else-if="tab==1&&item.businessRebateAmount<0"
            >{{item.businessRebateAmount.toFixed(2)}}</div>
            <div class="fr con_money" v-else>
              <div class="type_div_red" v-if="item.type==1 && item.amount">
                <span>+{{item.amount.toFixed(2)}}</span>
                <span>返利中</span>
              </div>
              <div class="type_div_red" v-if="item.type!=1 && item.amount">
                <span>-{{item.amount.toFixed(2)}}</span>
                <span>退款中</span>
              </div>
            </div>
          </li>
          <div class="loadContainer" v-if="loadContainerState">
            <div class="loadText">
              <span class="loadLine"></span>
              <span>已经全部加载完毕</span>
              <span class="loadLine"></span>
            </div>
          </div>
        </ul>
        <div class="mint-loadmore-bottom" v-if="isLoading">
          <span class="loading_gif"></span>
        </div>
        <!-- </mt-loadmore> -->
      </div>
      <div v-if="noRecords" class="noRecord" style="text-align: center;">
        <img
          style="width: 2.4rem;margin-top:1rem;"
          src="~@/assets/images/personalCenter/myPoint/no_point.png"
        >
        <p style="color:#666;font-size:0.28rem;">您还没有{{remindingText}}</p>
      </div>
    </section>
    <footer>
      <button class="btn btn-primary btn-block" data-baidu-stats="我的积分-可用积分服务" @click="appeal()">
        <span>可用积分服务</span>
      </button>
    </footer>
  </div>
</template>

<script>
import point from "./point.js";
export default point;
</script>

<style lang="scss" scoped>
@import "./point.scss";
</style>