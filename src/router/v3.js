// 首页
const home = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/home/home.vue'))
  }, 'home')
};
// 生活
const life = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/life/life.vue'))
  }, 'life')
};
// 我的
const mine = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/mine/mine.vue'))
  }, 'mine')
};
// 会员权益
const memberEquity = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/member/equity/equity.vue'))
  }, 'memberEquity')
};
// 版本控制
const versionControl = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/version/version.vue'))
  }, 'versionControl')
};
// 秒杀商品详情页
const seckillGoodsDetail = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/product-detail/seckill-goods-detail/detail.vue'))
  }, 'seckillGoodsDetail')
};
// 提货券商品详情页
const pickUpGoodsDetail = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/product-detail/pick-up-goods/detail.vue'))
  }, 'pickUpGoodsDetail')
};
// 404
const error = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/error-page/404.vue'))
  }, 'error')
};
// 建设活动详情页
const constructOrderDetail = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/order-detail-activity/order-detail.vue'))
  }, 'constructOrderDetail')
}
const routes = [{
  path: 'home',
  name: 'home',
  component: home,
  meta: {
    isShowBar: true
  }
}, {
  path: 'life',
  name: 'life',
  component: life,
  meta: {
    isShowBar: true
  }
}, {
  path: 'mine',
  name: 'mine',
  component: mine,
  meta: {
    isShowBar: true
  }
}, {
  path: 'memberEquity',
  name: 'memberEquity',
  component: memberEquity
}, {
  path: 'memberEquity/:id',
  name: 'memberEquity1',
  component: memberEquity
}, {
  path: 'versionControl',
  name: 'versionControl',
  component: versionControl,
  meta: {
    requireAuth: true
  }
}, {
  path: 'seckillGoodsDetail/:productId/:activityName',
  name: 'seckillGoodsDetail',
  component: seckillGoodsDetail,
  meta: {
    title: '秒杀商品详情'
  }
}, {
  path: 'pickUpGoodsDetail/:productId/:activityName',
  name: 'pickUpGoodsDetail',
  component: pickUpGoodsDetail,
  meta: {
    title: '提货券商品详情'
  }
}, {
  path: 'error',
  name: 'error',
  component: error
}, {
  path: 'constructOrderDetail/:productId/:activityName',
  name: 'constructOrderDetail',
  component: constructOrderDetail,
  meta: {
    title: '建行活动订单详情页'
  }
}]

export default routes;