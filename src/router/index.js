import Vue from 'vue';
import Router from 'vue-router';
// 登录相关
const login = r => {return require.ensure([], () => { return r(require('@/components/doooly/login'))}, 'login')};
const userProtocol = r => {return require.ensure([], () => { return r(require('@/components/doooly/userProtocol'))}, 'login')};
const resetPassword = r => {return require.ensure([], () => { return r(require('@/components/doooly/resetPassword'))}, 'login')};
const white = r => {return require.ensure([], () => { return r(require('@/components/doooly/white'))}, 'white')};
const transfer = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/transfer'))}, 'login')};//第三方登录拦截

// 会员激活相关
const activePage = r => {return require.ensure([], () => { return r(require('@/components/doooly/activePage'))}, 'activePage')};
const groupCommandPage = r => {return require.ensure([], () => { return r(require('@/components/doooly/groupCommandPage'))}, 'activePage')};
const activate = r => {return require.ensure([], () => { return r(require('@/components/doooly/activate'))}, 'activePage')};
const companyLogin = r => {return require.ensure([], () => { return r(require('@/components/doooly/companyLogin'))}, 'activePage')};
const vip_activate = r => {return require.ensure([], () => { return r(require('@/components/doooly/vip_activate'))}, 'activePage')};//会员激活
const vip_activate2 = r => {return require.ensure([], () => { return r(require('@/components/doooly/vip_activate2'))}, 'activePage')};//会员激活 
const groupCommand = r => {return require.ensure([], () => { return r(require('@/components/doooly/groupCommand'))}, 'activePage')};//会员激活 

//导航页
const nav = r => {return require.ensure([], () => { return r(require('@/components/common/nav'))}, 'nav')};
const hotActivity = r => {return require.ensure([], () => { return r(require('@/components/doooly/hotActivity'))}, 'hotActivity')};
const hotActivityDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/hotActivityDetail'))}, 'nav')};
const scanDiscounts = r => {return require.ensure([], () => { return r(require('@/components/doooly/scanDiscounts'))}, 'nav')};
const scanDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/scanDetail'))}, 'nav')};
const makeMoney = r => {return require.ensure([], () => { return r(require('@/components/doooly/shoppingGuide'))}, 'nav')};
const couponWelfare = r => {return require.ensure([], () => { return r(require('@/components/doooly/couponWelfare'))}, 'nav')};
//商户相关
const businessInfoShow = r => {return require.ensure([], () => { return r(require('@/components/doooly/businessInfoShow'))}, 'businessInfoShow')};
const storeMap = r => {return require.ensure([], () => { return r(require('@/components/doooly/storeMap'))}, 'businessInfoShow')};
const takeIntegral = r => {return require.ensure([], () => { return r(require('@/components/doooly/takeIntegral'))}, 'businessInfoShow')};

//支付和订单相关
const cardBuyDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/cardBuyDetail'))}, 'cardBuyOrder')};
const cardBuyOrder = r => {return require.ensure([], () => { return r(require('@/components/doooly/cardBuyOrder'))}, 'cardBuyOrder')};
const cardBuyPay = r => {return require.ensure([], () => { return r(require('@/components/doooly/merchantPay'))}, 'cardBuyOrder')};
const cardBuyPayResult = r => {return require.ensure([], () => { return r(require('@/components/doooly/cardBuyPayResult'))}, 'cardBuyOrder')};
const cardBuyPayResultH5 = r => {return require.ensure([], () => { return r(require('@/components/doooly/cardBuyPayResultH5'))}, 'cardBuyOrder')};
const travelCard_details = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/travelCard_details'))}, 'cardBuyOrder')};
const travelCard_add = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/travelCard_add'))}, 'cardBuyOrder')};

const rechargeList = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/rechargeList'))}, 'rechargeList')};
const rechargeHelpCenter = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/rechargeHelpCenter'))}, 'rechargeList')};
const rechargeRule = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/rechargeRule'))}, 'rechargeList')};
const rechargeAddress = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/rechargeAddress'))}, 'rechargeList')};
const cardBuy = r => {return require.ensure([], () => { return r(require('@/components/doooly/cardBuy'))}, 'cardBuy')};
const userDeliveryList = r => {return require.ensure([], () => { return r(require('@/components/doooly/userDeliveryList'))}, 'rechargeList')};
const userDeliveryAdd = r => {return require.ensure([], () => { return r(require('@/components/doooly/userDeliveryAdd'))}, 'rechargeList')};
const orderInfo_entity = r => {return require.ensure([], () => { return r(require('@/components/doooly/orderInfo_entity'))}, 'rechargeList')};
const coupon_r = r => {return require.ensure([], () => { return r(require('@/components/doooly/coupon_r'))}, 'rechargeList')}; //抵扣券我的福利
const confirmOrder = r => {return require.ensure([], () => { return r(require('@/components/doooly/confirm_order/confirm_order.vue'))}, 'rechargeList')};

//个人中心功能相关
const familyInvite = r => {return require.ensure([], () => { return r(require('@/components/doooly/familyInvite'))}, 'familyInvite')};
const couponExchange = r => {return require.ensure([], () => { return r(require('@/components/doooly/couponExchange'))}, 'coupon')};
const coupon = r => {return require.ensure([], () => { return r(require('@/components/doooly/coupon'))}, 'coupon')};
const accountSecurity = r => {return require.ensure([], () => { return r(require('@/components/doooly/accountSecurity'))}, 'accountSecurity')};
const aboutDoooly = r => {return require.ensure([], () => { return r(require('@/components/doooly/aboutDoooly'))}, 'accountSecurity')};
const saveSuccess = r => {return require.ensure([], () => { return r(require('@/components/doooly/saveSuccess'))}, 'accountSecurity')};
const saveFailed = r => {return require.ensure([], () => { return r(require('@/components/doooly/saveFailed'))}, 'accountSecurity')};
const complaint = r => {return require.ensure([], () => { return r(require('@/components/doooly/complaint'))}, 'complaint')};
const complainDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/complainDetail'))}, 'complaint')};
const modifyMobile = r => {return require.ensure([], () => { return r(require('@/components/doooly/modifyMobile'))}, 'familyInvite')};
const modifyMobileTwo = r => {return require.ensure([], () => { return r(require('@/components/doooly/modifyMobileTwo'))}, 'familyInvite')};
const myPointDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/myPointDetail'))}, 'familyInvite')};
const appeal = r => {return require.ensure([], () => { return r(require('@/components/doooly/appeal'))}, 'familyInvite')};
const family_ground = r => {return require.ensure([], () => { return r(require('@/components/doooly/family_ground'))}, 'accountSecurity')};//家属邀请落地页
const point_recharge = r => {return require.ensure([], () => { return r(require('@/components/doooly/point_recharge'))}, 'point_recharge')};//积分充值 
const card_question = r => {return require.ensure([], () => { return r(require('@/components/doooly/card_question'))}, 'point_recharge')};//卡券激活常见问题 
const setting = r => {return require.ensure([], () => { return r(require('@/components/doooly/setting/setting'))}, 'setting')};// 系统设置
const settingPassword = r => {return require.ensure([], () => { return r(require('@/components/doooly/setting/settingPassword'))}), 'setting'};// 系统设置
const settingValidation = r => {return require.ensure([], () => { return r(require('@/components/doooly/setting/settingValidation'))}), 'setting'};// 系统设置
const verification = r => {return require.ensure([], () => { return r(require('@/components/doooly/setting/verification'))}), 'setting'};// 系统设置
const startusePassword = r => {return require.ensure([], () => { return r(require('@/components/doooly/setting/startusePassword'))}), 'setting'};// 密码设置
// 订单相关
const myOrderList = r => {return require.ensure([], () => { return r(require('@/components/doooly/my_order_list/order_list.vue'))}, 'myOrderList')};
const myOrderDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/my_order_detail/order_detail.vue'))}, 'myOrderList')};
const fordBuyDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/ford/buyDetail.vue'))}, 'myOrderList')};
const fordBuyList = r => {return require.ensure([], () => { return r(require('@/components/doooly/ford/buyList.vue'))}, 'myOrderList')};
const fordBuyOrder = r => {return require.ensure([], () => { return r(require('@/components/doooly/ford/buyOrder.vue'))}, 'myOrderList')};


//活动相关
const didi_integral = r => {return require.ensure([], () => { return r(require('@/components/doooly/didi_integral'))}, 'didi_integral')};
const guideArticle = r => {return require.ensure([], () => { return r(require('@/components/doooly/guideArticle'))}, 'guideArticle')};
const activity_index = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_vue/activity_index'))}, 'activity_index')};//话费充值活动
const activity_ground = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_vue/activity_ground'))}, 'activity_ground')};//分享落地页
const activity_cardBuyPayResult = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_vue/activity_cardBuyPayResult'))}, 'activity_cardBuyPayResult')};//活动支付成功页面
const baili2_index = r => {return require.ensure([], () => { return r(require('@/components/doooly/baili/baili2_index'))}, 'baili2_index')};//百丽加强版活动页
const shop_assistant_invite_add = r => {return require.ensure([], () => { return r(require('@/components/doooly/shop_assistant_invite/shop_assistant_invite_add'))}, 'shop_assistant_invite_add')};//兜礼体验官
const shop_assistant_invite_ground = r => {return require.ensure([], () => { return r(require('@/components/doooly/shop_assistant_invite/shop_assistant_invite_ground'))}, 'shop_assistant_invite_ground')};//兜礼体验官付款码
const openOneNnumber = r => {return require.ensure([], () => { return r(require('@/components/doooly/openOneNnumber'))}, 'openOneNnumber')};//兜礼体验官付款码
const openOneNnumberGeneralize = r => {return require.ensure([], () => { return r(require('@/components/doooly/openOneNnumberGeneralize'))}, 'openOneNnumberGeneralize')};//兜礼体验官付款码
const shoujia_index = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_shoujia/shoujia_index'))}, 'shoujia_index')};//首家
const shoujia_detail = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_shoujia/shoujia_detail'))}, 'shoujia_detail')};//首家
const shoujia_invite = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_shoujia/shoujia_invite'))}, 'shoujia_invite')};//首家
const world_cup = r => {return require.ensure([], () => { return r(require('@/components/doooly/World_Cup/world_cup'))}, 'world_cup')};//世界杯
const piaoniu = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/piaoniu'))}, 'piaoniu')};//世界杯
const mobikeRecharge = r => {return require.ensure([], () => { return r(require('@/components/doooly/mobike/mobikeRecharge'))}, 'mobikeRecharge')};//膜拜骑行
const familyRecharge = r => {return require.ensure([], () => { return r(require('@/components/doooly/familyMart/familyRecharge'))}, 'familyRecharge')};//全家
const familyTo = r => {return require.ensure([], () => { return r(require('@/components/doooly/familyMart/familyTo'))}, 'familyTo')};//全家
const familyHelpCenter = r => {return require.ensure([], () => { return r(require('@/components/doooly/familyMart/familyHelpCenter'))}, 'familyHelpCenter')};//全家帮助中心
const activityDonghang = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/donghang'))}, 'donghang')};//东航话费
const activity = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/activity'))}, 'activity')};//活动整理
const activity_BCM_index = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_BCM/index'))}, 'activity_BCM_index')};// 交行活动
const activity_BCM_success = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity_BCM/success'))}, 'activity_BCM_success')};// 交行活动
const activity_activate = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/activity_activate'))}, 'activity_activate')};// 活动激活
const activity_activate2 = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/activity_activate2'))}, 'activity_activate2')};// 活动激活

const rechargeActivity = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/recharge_activity'))}, 'rechargeActivity')};// 活动激活

const personalCenter = r => {return require.ensure([], () => { return r(require('@/components/doooly/personalCenter'))}, 'personalCenter')};
const newHome = r => {return require.ensure([], () => { return r(require('@/components/doooly/newHome'))}, 'newHome')};
const pointsService = r => {return require.ensure([], () => { return r(require('@/components/doooly/pointsService'))}, 'pointsService')};
const businessInfo = r => {return require.ensure([], () => { return r(require('@/components/doooly/businessInfo'))}, 'businessInfo')};
const recharge = r => {return require.ensure([], () => { return r(require('@/components/doooly/recharge/recharge'))}, 'recharge')};
const merchantDetail = r => {return require.ensure([], () => { return r(require('@/components/doooly/merchantDetail'))}, 'merchantDetail')};
const helpCenter = r => {return require.ensure([], () => { return r(require('@/components/doooly/helpCenter'))}, 'helpCenter')};
const shoppingGuide = r => {return require.ensure([], () => { return r(require('@/components/doooly/shoppingGuide'))}, 'shoppingGuide')};
const activity_invitation = r => {return require.ensure([], () => { return r(require('@/components/doooly/activity/invitation'))}, 'invitation')};
const platform = r => {return require.ensure([], () => { return r(require('@/components/doooly/platform/index'))}, 'platform')};
// v3
const myPointList = r => {return require.ensure([], () => { return r(require('@/components/doooly/v3/pages/my-point-list/point.vue'))}, 'myPointList')};

// v3
const v3Layout = r => {
  return require.ensure([], () => {
    return r(require('@/components/doooly/v3/pages/Layout.vue'))
  }, 'v3Layout')
};
import dooolyV3 from './v3';


Vue.use(Router);
export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/white',
      name: 'white',
      component: white
    },
    {
      path: '/openOneNnumber/:id/:url',
      name: 'openOneNnumber',
      component: openOneNnumber
    },
    {
      path: '/openOneNnumberGeneralize/:id/:url',
      name: 'openOneNnumberGeneralize',
      component: openOneNnumberGeneralize
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/companyLogin/:companyName',
      name: 'companyLogin',
      component: companyLogin
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      component: resetPassword
    },
    {
      path: '/recharge/:index/:novice',
      name: 'recharge',
      component: recharge
      // meta: {
      //   keepAlive: true // 需要被缓存
      // }
    },
    // 充值活动
    {
      path: '/rechargeActivity/:type',
      // path: '/rechargeActivity',
      name: 'rechargeActivity',
      component: rechargeActivity
    },
    {
      path: '/travelCard_details/:card/:name/:tel',
      name: 'travelCard_details',
      component: travelCard_details
    },
    {
      path: '/rechargeList/:cardno',
      name: 'rechargeList',
      component: rechargeList
    },
    {
      path: '/rechargeHelpCenter',
      name: 'rechargeHelpCenter',
      component: rechargeHelpCenter
    },
    {
      path: '/rechargeAddress',
      name: 'rechargeAddress',
      component: rechargeAddress
    },
    {
      path: '/rechargeRule',
      name: 'rechargeRule',
      component: rechargeRule
    },
    {
      path: '/travelCard_add/:cardno',
      name: 'travelCard_add',
      component: travelCard_add
    },
    {
      path: '/coupon/:couponCategory',
      name: 'coupon',
      component: coupon
    },
    {
      path: '/cardBuyPay/:orderNum',
      name: 'cardBuyPay',
      component: cardBuyPay
    },
    {
      path: '/cardBuyPayResult/:code/:totalAmount/:orderId/:orderNum/:productType',
      name: 'cardBuyPayResult',
      component: cardBuyPayResult
    },
    {
      path: '/cardBuyPayResultH5/:orderNum/:productType',
      name: 'cardBuyPayResultH5',
      component: cardBuyPayResultH5
    },
    {
      path: '/businessInfo/:dealType/:id',
      name: 'businessinfo',
      component: businessInfo,
      meta: {
        // keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/businessInfoShow/:dealType1/:id1',
      name: 'businessInfoShow',
      component: businessInfoShow
    },
    {
      path: '/didi_integral/:id',
      name: 'didi_integral',
      component: didi_integral
    },
    {
      path: '/orderInfo_entity',
      name: 'orderInfo_entity',
      component: orderInfo_entity
    },
    {
      path: '/nav',
      name: 'nav',
      component: nav,
      children: [
        {
          path: 'newHome',
          name: 'newHome',
          redirect:'/v3/home',
          // component: newHome,
          meta: {
          //  keepAlive: true // 需要被缓存
          }
        },
        {//赚钱
          path: 'makeMoney',
          name: 'makeMoney',
          component: makeMoney,
          meta: {
          //  keepAlive: true // 需要被缓存
          }
        }, 
        {//花积分
          path: 'takeIntegral',
          name: 'takeIntegral',
          component: takeIntegral
        },
        {
          path: 'hotActivity',
          name: 'hotActivity',
          component: hotActivity,
          meta: {
          //  keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'scanDiscounts',
          name: 'scanDiscounts',
          component: scanDiscounts,
          meta: {
          //  keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'personalCenter',
          name: 'personalCenter',
          component: personalCenter,
          meta: {
          //  keepAlive: true // 需要被缓存
          }
        },

      ]
    },
    {//花积分
      path: '/takeIntegral',
      name: 'newtakeIntegral',
      component: takeIntegral
    },
    {
      path: '/hotActivityDetail/:activityId',
      name: 'hotActivityDetail',
      component: hotActivityDetail
    },
    {
      path: '/cardBuy',
      name: 'cardBuy',
      component: cardBuy
    },
    {
      path: '/familyInvite',
      name: 'familyInvite',
      component: familyInvite
    },
    {
      path: '/scanDetail/:company',
      name: 'scanDetail',
      component: scanDetail,
      meta: {
        // keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/cardBuyDetail/:productId',
      // redirect:{
        name: 'cardBuyDetail',
      // },
      component: cardBuyDetail
    },
    {
      path: '/cardBuyDetail/:productId/:activityName',
      name: 'cardBuyDetail',
      component: cardBuyDetail
    },
    {
      path: '/cardBuyDetail/:productId/:activityName/:skuId/:giftBagId/:productTypeId/:isReceive',
      // redirect:{
        name: 'cardBuyDetail',
      // },
      component: cardBuyDetail
    },
    {
      path: '/cardBuyOrder',
      name: 'cardBuyOrder',
      component: cardBuyOrder
    },
    {
      path: '/cardBuyOrder/:activityName',
      // redirect:{
        name: 'cardBuyOrder',
      // },
      component: cardBuyOrder
    },
    {
      path: '/cardBuyOrder/:activityName/:productId/:skuId/:giftBagId/:productTypeId',
      // redirect:{
        name: 'cardBuyOrder',
      // },
      component: cardBuyOrder
    },
    {
      path: '/confirm_order',
      name: 'confirm_order',
      component: confirmOrder
    },
    {
      path: '/confirm_order/:activityName',
      // redirect:{
        name: 'confirm_order',
      // },
      component: confirmOrder
    },
    {
      path: '/confirm_order/:activityName/:productId/:skuId/:giftBagId/:productTypeId',
      // redirect:{
        name: 'confirm_order',
      // },
      component: confirmOrder
    },
    {
      path: '/storeMap/:businessId',
      name: 'storeMap',
      component: storeMap
    },
    {
      path: '/shoppingGuide',
      name: 'shoppingGuide',
      component: shoppingGuide
    },
    {
      path: '/shoppingGuide/:activityId',
      // redirect:{
        name: 'shoppingGuide',
      // },
      component: shoppingGuide
    },
    {
      path: '/guideArticle/:articleId',
      name: 'guideArticle',
      component: guideArticle
    },
    //个人中心
    {
      path: '/accountSecurity/:userid',
      name: 'accountSecurity',
      component: accountSecurity
    },
    {
      path: '/myOrderList/:tab/:businessId',
      name: 'myOrderList',
      component: myOrderList
    },
    {
      path: '/myOrderDetail/:Id',
      name: 'myOrderDetail',
      component: myOrderDetail
    },
    {
      path:'/couponExchange/:actConnId',
      name:'couponExchange',
      component:couponExchange
    },
    {
      path:'/complaint',
      name:'complaint',
      component:complaint
    },
    {
      path:'/complainDetail/:complainId',
      name:'complainDetail',
      component:complainDetail
    },
    {
      path:'/modifyMobile',
      name:'modifyMobile',
      component:modifyMobile
    },
    {
      path:'/modifyMobileTwo',
      name:'modifyMobileTwo',
      component:modifyMobileTwo
    },
    {
      path:'/aboutDoooly',
      name:'aboutDoooly',
      component:aboutDoooly
    },
    // {
    //   path:'/modifyLoginPw',
    //   name:'modifyLoginPw',
    //   component:modifyLoginPw
    // },
    {
      path:'/myPointList/:pointType',
      name:'myPointList',
      component:myPointList
    },
    {
      path:'/myPointDetail/:itemId/:itemPointType',
      name:'myPointDetail',
      component:myPointDetail
    },
    {
      path:'/appeal/:dataType',
      name:'appeal',
      component:appeal
    },
    {//可用积分服务
      path: '/pointsService',
      name: 'pointsService',
      component: pointsService
    },
    {//企业口令引导页
      path: '/activePage',
      name: 'activePage',
      component: activePage
    },
    {//企业口令激活
      path: '/groupCommandPage',
      name: 'groupCommandPage',
      component: groupCommandPage
    },
    // {//完善个人资料
    //   path: '/improvePersonalData',
    //   name: 'improvePersonalData',
    //   component: improvePersonalData
    // },
    {//激活
      path: '/activate',
      name: 'activate',
      component: activate
    },
    {//帮助中心
      path: '/helpCenter',
      name: 'helpCenter',
      component: helpCenter
    },
    {//积分商户详情
      path: '/merchantDetail/:id/:dealType',
      name: 'merchantDetail',
      component: merchantDetail
    },
    {//保存申诉成功
      path: '/saveSuccess',
      name: 'saveSuccess',
      component: saveSuccess
    },
    {//保存申诉失败
      path: '/saveFailed',
      name: 'saveFailed',
      component: saveFailed
    },
    {
      path: '/userDeliveryList',
      name: 'userDeliveryList',
      component: userDeliveryList
    },
    {
      path: '/userDeliveryAdd/:type',
      name: 'userDeliveryAdd',
      component: userDeliveryAdd
    },
    {//用户协议
      path: '/userProtocol',
      name: 'userProtocol',
      component: userProtocol
    },
    {//活动话费充值宣传页
      path: '/activity_index',
      name: 'activity_index',
      component: activity_index
    },
    {//分享落地页
      path: '/activity_ground',
      name: 'activity_ground',
      component: activity_ground
    },
    {//手机充值我的福利券
      path: '/coupon_r/:couponType',
      name: 'coupon_r',
      component: coupon_r
    },
    {//活动支付成功
      path: '/activity_cardBuyPayResult/:code/:totalAmount/:orderId/:orderNum/:activityParam/:openId',
      name: 'activity_cardBuyPayResult',
      component: activity_cardBuyPayResult
    },
    {//百丽活动加强版页
      path: '/baili2_index',
      name: 'baili2_index',
      component: baili2_index
    },
    // {//兜礼体验官
    //   path: '/shop_assistant_invite_add',
    //   name: 'shop_assistant_invite_add',
    //   component: shop_assistant_invite_add
    // },
    // {//兜礼体验官
    //   path: '/shop_assistant_invite_ground',
    //   name: 'shop_assistant_invite_ground',
    //   component: shop_assistant_invite_ground
    // },
    {//家属邀请落地页
      path: '/family_ground',
      name: 'family_ground',
      component: family_ground
    },
    {//首家页
      path: '/shoujia_index/:telephone/:userId',
      name: 'shoujia_index',
      component: shoujia_index
    },
    {//首家页
      path: '/shoujia_detail',
      name: 'shoujia_detail',
      component: shoujia_detail
    },
    {//首家页
      path: '/shoujia_invite',
      name: 'shoujia_invite',
      component: shoujia_invite
    },
    {//积分充值
      path: '/point_recharge',
      name: 'point_recharge',
      component: point_recharge
    },
    {//卡券激活常见问题
      path: '/card_question',
      name: 'card_question',
      component: card_question
    },
    {//会员激活
      path: '/vip_activate',
      name: 'vip_activate',
      component: vip_activate
    },
    {//会员激活2
      path: '/vip_activate2/:code',
      name: 'vip_activate2',
      component: vip_activate2
    },
    {//会员激活3
      path: '/groupCommand/:code',
      name: 'groupCommand',
      component: groupCommand
    },
    {//世界杯活动
      path: '/world_cup/:activityid/:couponid',
      name: 'world_cup',
      component: world_cup
    },
    {//票牛
      path: '/piaoniu/:activityid/:couponid',
      name: 'piaoniu',
      component: piaoniu
    },
    {
      path: '/mobikeRecharge',
      name: 'mobikeRecharge',
      component: mobikeRecharge
    },
    {
      path: '/familyRecharge',
      name: 'familyRecharge',
      component: familyRecharge
    },
    {
      path: '/familyTo/:orderNum',
      name: 'familyTo',
      component: familyTo
    },
    {
      path: '/familyHelpCenter',
      name: 'familyHelpCenter',
      component: familyHelpCenter
    },
    {
      path: '/activityDonghang/:activityid',
      name: 'activityDonghang',
      component: activityDonghang
    },
    {
      path: '/activity',
      name: 'activity',
      component: activity
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: transfer
    },
    // {
    //   path: '*',
    //   name: 'notFound',
    //   component: notFound
    // }
	{// 系统设置-密码设置
      path: '/setting',
      name: 'setting',
      component: setting
    },
    {// 系统设置
      path: '/settingPassword',
      name: 'settingPassword',
      component: settingPassword
    },
    {// 系统设置
      path: '/settingValidation',
      name: 'settingValidation',
      component: settingValidation
    },
    {// 系统设置
      path: '/verification/:type/:way',
      name: 'verification',
      component: verification
    },
    {// 密码设置
      path: '/startusePassword/:type',
      name: 'startusePassword',
      component: startusePassword
    },
    {// 交行活动
      path: '/activity_BCM_index',
      name: 'activity_BCM_index',
      component: activity_BCM_index
    },
    {// 交行活动
      path: '/activity_BCM_success',
      name: 'activity_BCM_success',
      component: activity_BCM_success
    },
    {
      path: '/activity_activate',
      name: 'activity_activate',
      component: activity_activate
    },
    {
      path: '/activity_activate2/:code',
      name: 'activity_activate2',
      component: activity_activate2
    },
    {//我的福利
      path: '/couponWelfare',
      name: 'couponWelfare',
      component: couponWelfare
    },
    {
      path: '/activity_invitation',
      name: 'activity_invitation',
      component: activity_invitation
    },
    {//福特商品列表
      path: '/fordBuyList',
      name: 'fordBuyList',
      component: fordBuyList
    },
    {//福特商品详情
      path: '/fordBuyDetail/:id/:skuId',
      name: 'fordBuyDetail',
      component: fordBuyDetail
    },
    {//福特购物车订单
      path: '/fordBuyOrder',
      name: 'fordBuyOrder',
      component: fordBuyOrder
    },
    {//福特购物车订单
      path: '/fordBuyOrder/:skuId',
      // redirect:{
        name: 'fordBuyOrder',
      // },
      component: fordBuyOrder
    },
    {
      path:'/v3',
      name:'dooolyV3',
      component:v3Layout,
      children:dooolyV3
    },
    {
      path:'/platform',
      name: 'platform',
      component: platform
    }
  ]

});




