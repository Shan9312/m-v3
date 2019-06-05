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
},  {
  path: 'memberEquity',
  name: 'memberEquity',
  component: memberEquity
},  {
  path: 'memberEquity/:id',
  name: 'memberEquity',
  component: memberEquity
},{
  path: 'versionControl',
  name: 'versionControl',
  component: versionControl
}]

export default routes;