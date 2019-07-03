<template>
  <div class="container">
    <header>
      <ul>
        <li v-for="(item,index) in tabs" :key="index" v-bind:class='{l1:item.ifAdd==tab}'  @click="link(item.ifAdd)">
          <a href="javascript:void(0);">{{item.value}}</a>
        </li>
      </ul>
    </header>
    <div class="blank"></div>
    <ul class="mui-table-view list" :class='{loadBottom:browserName != "WebKit"&&browserName != "Chrome WebView"}'  v-infinite-scroll="loadMore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
      <li class="mui-table-view-cell" v-for="(item,index) in listData" :key="index">
        <orderItem @pageReload="pageReload" :item="item" :amountListData="amountListData" :hintState="hintState"></orderItem>
      </li>
      <div class="loadContainer" v-if="allLoaded">
        <div class="loadText"></div>
        已经全部加载完毕
        <div class="loadLine"></div>
      </div>
      <div v-show="moreLoading2&&!allLoaded" class="mint-loadmore-bottom">
        <span class="loading_gif"></span>
        <!--<img class="mint-loadmore-bottom-img" src="../../assets/images/loading.gif">-->
      </div>
      <div class="blank"></div>
    </ul>
    <div v-show="emptyList" class="empty-div">
      <img src="../../../assets/images/personalCenter/myOrder/no_icon_order.png"/>
    </div>
    <!-- <footer>
      <button class="btn btn-primary btn-block" @click="myComplaint()">未记录订单申诉</button>
    </footer> -->
  </div>
</template>

<script>
  import myOrderList from './order_list.js';
  export default myOrderList;
</script>

<style lang="scss" scoped>
  @import './order_list.scss';
</style>