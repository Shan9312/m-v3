<template>
  <div class="love-recycling">
    <div class="goods-info">
      您的商品已经发货，兜礼特为您准备了回收增值券
    </div>
    <div
      class="recycling-stamps-list unreceived"
      v-for="(item, index) in list"
      :key="index"
    >
      <div class="price">
        <div class="price-number">￥<span>15</span></div>
        <div class="price-available"><span>满1000可用</span></div>
      </div>
      <div class="full-reduction">
        <div class="value-added-stamps">增值券</div>
        <div>限时高价满1500加15</div>
      </div>
      <div class="receive">
        <div class="receive-btn">点击领取<span class="arrow redArrow"></span></div>
      </div>
    </div>
    <div class="aihuishou-btn">
      前往爱回收
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoveRecycling',
  data () {
    return {
      list: [1, 2, 3]
    }
  },
  created () {
    initTitle('我的回收订单', '')
  },
  methods: {}
}
</script>
<style lang="scss">
  .love-recycling {
    padding: 0.2rem;
    .goods-info {
      font-size: 0.24rem;
      color: rgba(153, 153, 153, 1);
    }
    .already-received {
      background: url("../../../assets/images/recycling/love-recycling/stampsBg2.png");
    }
    .unreceived {
      background: url("../../../assets/images/recycling/love-recycling/stampsBg1.png");
    }
    .recycling-stamps-list {
      margin: 0.2rem 0;
      width: 100%;
      height: 1.76rem;
      display: flex;
      background-size: cover;
      color: #fff;
      .price {
        width: 2.2rem;
        text-align: center;
        border-right: 1px solid #fff;
        .price-number {
          font-size: 0.4rem;
          span {
            font-family: Impact;
            font-size: 1.24rem;
          }
        }
        .price-available {
          margin-top: -0.25rem;
          margin-left: 0.1rem;
          font-size: 0.2rem;
        }
      }
      .full-reduction {
        flex: 1;
        font-size: 0.24rem;
        padding-left: .4rem;
        .value-added-stamps {
          font-size: 0.3rem;
          margin-top: 0.5rem;
        }
      }
      .receive {
        font-size: 0.22rem;
        width: 2rem;
        position: relative;
        .receive-btn {
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: -0.21rem;
          background: #fff;
          color: rgba(254, 0, 3, 1);
          text-align: center;
          line-height: 0.42rem;
          width: 1.63rem;
          height: 0.42rem;
          border-radius: 0.21rem;
          .arrow {
            position: absolute;
            right: 0.12rem;
            top: 0.12rem;
            display: inline-block;
            width: 0.1rem;
            height: 0.12rem;
            background: url("../../../assets/images/recycling/love-recycling/triangle.png");
            background-size: cover;
          }
        }
      }
    }
    .aihuishou-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.99rem;
      font-size: 0.36rem;
      text-align: center;
      line-height: .99rem;
      color: rgba(51, 51, 51, 1);
      background: linear-gradient(
        90deg,
        rgba(254, 239, 98, 1) 0%,
        rgba(248, 215, 82, 1) 100%
      );
    }
  }
</style>
