const butterfly = globalProperties.getAPIDomain().butterfly;
const doooly = globalProperties.getAPIDomain().doooly;
const activity = globalProperties.getAPIDomain().activity;
const order = globalProperties.getAPIDomain().order;
const action = globalProperties.getAPIDomain().action;
const WxAppIdUrl = globalProperties.getFrontendDomain().wx;
const api = {
  WxAppIdUrl: WxAppIdUrl,
  getLoginVCode: butterfly + 'wechat/register/getValidCode.jhtml', // 获取登录验证码
  telLogin: butterfly + 'wechat/login/telLogin.jhtml', // 验证码登录
  submit1: butterfly + 'wechat/login/submit.jhtml', // 账号密码登录
  resetPwd: butterfly + 'doooly/password/resetPwd.jhtml', // 忘记密码-登录-new
  getTargetUrl: butterfly + 'wechat/oneNumber/getTargetUrl.jhtml', // 获取一号通url
  getHotActivityList: butterfly + 'wechat/hotActivity/getHotActivityList.jhtml', // 获取发现列表
  first: butterfly + 'doooly/selfProduct/first.jhtml', // 获取卡券列表
  getCurrentTime: butterfly + 'doooly/selfProduct/getCurrentTime.jhtml', // 获取服务器当前时间
  businessInfoForAjax: butterfly + 'wechat/hotBusiness/businessInfoForAjax.jhtml', // 商户详情
  indexForAjax: butterfly + 'wechat/home/indexForAjax.jhtml', // 首页banner
  getPayForm: butterfly + 'doooly/member/pay/getPayForm.jhtml', // 收银台下单接口
  getStoreList: butterfly + 'wechat/mall/getStoreList.jhtml', // 获取门店位置列表
  getVoucherCouponNum: butterfly + 'doooly/mycoupons/getVoucherCouponNum.jhtml', // 获取优惠券数量
  scanList: butterfly + 'wechat/member/scan/scanList.jhtml', // 获取付款码列表
  toRecharge: butterfly + 'doooly/member/order/toRecharge.jhtml', // 获取充值中心信息接口
  rechargeIndex: butterfly + 'doooly/sctcd/rechargeIndex.jhtml', // 获取旅游卡绑定信息接口
  queryBalance: butterfly + 'doooly/sctcd/queryBalance.jhtml', // 查询旅游卡余额接口
  findRechargeHistory: butterfly + 'doooly/sctcd/findRechargeHistory.jhtml', // 查询旅游卡充值记录
  bindNewAccount: butterfly + 'doooly/sctcd/bindNewAccount.jhtml', // 添加旅游卡接口
  abandonedSctcdAccount: butterfly + 'doooly/sctcd/abandonedSctcdAccount.jhtml', // 删除旅游卡接口
  verifyCardNo: butterfly + 'doooly/sctcd/verifyCardNo.jhtml', // 验证旅游卡是否绑定
  accountSecurityPage: butterfly + 'wechat/myaccount/accountSecurityRestful.jhtml', // 获取个人信息
  modifyMobileGetCode: butterfly + 'wechat/activation/getCode.jhtml', // 修改手机号获取验证码
  modifyMobileStepOne: butterfly + 'wechat/member/modifymobile.jhtml', // 修改手机号验证验证码
  modifyMobileStepTwo: butterfly + 'wechat/member/modifymobiletwo.jhtml', // 修改手机号接口
  updatePersonalData: butterfly + 'wechat/myaccount/updatePersonalData.jhtml', // 修改个人信息接口
  modifyLoginPw: butterfly + 'wechat/member/modifyLoginPw.jhtml', // 修改密码接口
  myPoint: butterfly + 'doooly/member/point/listRestful.jhtml', // 获取我的积分余额
  myPointList: butterfly + 'doooly/member/point/first.jhtml', // 获取我的积分列表
  myPointDetail: butterfly + 'doooly/member/point/pointInfoRestful.jhtml', // 获取我的积分详情
  myOrderList: butterfly + 'doooly/member/supplier_order/first.jhtml', // 获取我的订单列表
  myComplaint: butterfly + 'wechat/complaint/listRestFul.jhtml', // 获取我的申诉列表
  myComplaintDetail: butterfly + 'wechat/complaint/viewRestFul.jhtml', // 获取我的申诉详情
  getActivityCategoryList: butterfly + 'doooly/hotActivity/getActivityCategoryList.jhtml', // 获取活动列表
  appealDetail: butterfly + 'wechat/complaint/appealRestful.jhtml', // 提交申诉接口
  getUserDelivery: butterfly + 'doooly/userDelivery/listRestful.jhtml', // 获取收货地址
  listRestful: butterfly + 'doooly/mycoupons/listRestful.jhtml', // 获取抵扣券列表
  to_useRestful: butterfly + 'doooly/mycoupons/to_useRestful.jhtml', // 获取抵扣券详情
  secretKeyLogin: butterfly + 'doooly/activate/groupCommandActive.jhtml', // 企业口令登陆
  getSecretQuestion: butterfly + 'doooly/activate/groupCommandPage.jhtml', // 企业口令获取问题
  getBusiness: butterfly + 'doooly/activate/getGroupByCommand.jhtml', // 企业口令获取公司列表
  validateAndActive: butterfly + 'doooly/activate/validateAndActive.jhtml', // 专属码激活
  logout: butterfly + 'wechat/logout.jhtml', // 退出登录
  wechatBinding: butterfly + 'callback/wechatBinding.jhtml?t=1', // 查询appid绑定状态
  getDeliveryStoreList: butterfly + 'wechat/orderDelivery/storeList.jhtml', // 获取送货门店列表
  userDeliveryList: butterfly + 'wechat/userDelivery/listRestful.jhtml', // 获取用户收货地址列表
  setDefaultAddr: butterfly + 'wechat/userDelivery/setDefault.jhtml', // 设置默认收货地址
  deleAddr: butterfly + 'wechat/userDelivery/delete.jhtml', // 删除收货地址
  saveDeliveryAddr: butterfly + 'wechat/userDelivery/saveRestful.jhtml', // 保存用户收货地址
  appUploadImg: butterfly + 'doooly/orderDelivery/appUploadImage.jhtml', // 微信上传图片
  // //活动话费充值
  resetPwd: butterfly + 'wechat/password/resetPwd.jhtml', // 钢城e家验证码登录
  verifyCodeToActive: butterfly + 'wechat/activate/verifyCodeToActive.jhtml', // 激活接口
  checkValidCode: butterfly + 'doooly/register/checkValidCode.jhtml', // 校验验证码

  SplashScreen: doooly + 'jersey/dooolyApp/index/SplashScreen/' + localStorage.groupId, // 获取企业引导图
  commonShareJSONPConfig: doooly + 'jersey/share/commonShareJSONPConfig',
  getScanDiscount: doooly + 'jersey/scanBusiness/getScanDiscount',
  businessInfoService: doooly + 'jersey/hotBusiness/businessInfoService', // 可用积分服务进入的商户详情
  cancleOrder_v2: doooly + 'jersey/order/cancleOrder',
  unifiedorder: doooly + 'jersey/doooly/payment/unifiedorder', // 查询订单信息接口-2.1
  jd: 'https://coupon.m.jd.com/union?&mtm_source=kepler-m&mtm_subsource=7553efb413f041b2a256679e84067dd4&returl=http%3A%2F%2Funion-click.jd.com%2Fjdc%3Fd%3DLu4haH',
  getPayForm: doooly + 'jersey/doooly/payment/getPayForm', // 获取支付信息
  integralPay: doooly + 'jersey/doooly/payment/integralPay', // 验证支付验证码2.1
  getPayResult: doooly + 'jersey/doooly/payment/getPayResult', // 查询支付结果
  getArticleList: doooly + 'jersey/guide/getArticleList',
  getGuideProductList: doooly + 'jersey/guide/getGuideProductList',
  addSellCount: doooly + 'jersey/guide/addSellCount',
  getArticleProductList: doooly + 'jersey/guide/getArticleProductList',
  getDiDiIntegral: doooly + 'jersey/didiIntegral/getDiDiIntegral', // 查询商户可用滴滴积分
  getCode: doooly + 'jersey/didiIntegral/getCode', // 滴滴验证码接口
  exchangeIntegral: doooly + 'jersey/didiIntegral/exchangeIntegral', // 滴滴积分兑换接口
  toExchangeIntegral: doooly + 'jersey/didiIntegral/toExchangeIntegral', // 滴滴进入页面接口
  getGuideCategaryList: doooly + 'jersey/guide/getGuideCategaryList', // 获取导航类目
  getGuideProductListV2: doooly + 'jersey/guide/getGuideProductList/v2', // 导航列表v2
  getGuideProductListV3: doooly + 'jersey/guide/getGuideProductList/v3', // 导航列表v3
  appealSubmit: doooly + 'jersey/complaint/save',
  saveForAppTwo: doooly + 'jersey/complaint/saveForAppTwo',
  getPointsService: doooly + 'jersey/hotBusiness/businessServiceData',
  getPointsServiceV21: doooly + 'jersey/hotBusiness/businessServiceDataV21',
  getIntegralActivity: doooly + 'jersey/freeCoupon/integralActivity',
  getSendIntegralActivity: doooly + 'jersey/freeCoupon/sendIntegralActivity',
  getmerchantDetail: doooly + 'jersey/hotBusiness/businessInfo', // 积分商户详情
  CouponActivity: doooly + 'jersey/dooolyApp/exclusiveCoupon/CouponActivity', // 王晨宇-发现
  // 首页个人信息概要
  gerneralInfo: doooly + 'jersey/dooolyApp/index/user/profile',
  profilev2_2: doooly + 'jersey/dooolyApp/index/user/profile/v2_2', // 获取个人信息2.2
  // 权益新手引导&积分新手引导，状态查询接口
  flow: doooly + 'jersey/dooolyApp/index/guide/flow',
  // 权益新手引导&积分新手引导，状态修改接口
  finish: doooly + 'jersey/dooolyApp/index/guide/finish',
  exclusiveCoupon: doooly + 'jersey/dooolyApp/exclusiveCoupon',
  receive: doooly + 'jersey/dooolyApp/exclusiveCoupon/receive',
  isReceiveGift: doooly + 'doubleEleven/isReceiveGift', // 夏日送清凉活动进入活动页面时判断之前是否领取过礼品
  receiveGift: doooly + 'doubleEleven/receiveGift', // 夏日送清凉活动点击领取
  isSetShareRecord: doooly + 'jersey/shareRecord/isSetShareRecord', // 夏日送清凉活动点击邀请
  sendByShareRecord: doooly + 'jersey/shareRecord/sendByShareRecord', // 夏日送清凉活动验证邀请
  familyInviteApp: doooly + 'jersey/wechat/familyInviteApp/familyInviteApp', // 家属邀请
  new_inviteFamily: doooly + 'jersey/wechat/familyInviteApp/inviteFamily', // 立即邀请
  InviteInfoRestFul: doooly + 'jersey/wechat/familyInviteApp/share/getFamilyInviteInfoRestFul', // 分享落地接口
  isReceiveGift: doooly + 'jersey/doubleEleven/isReceiveGift', // 夏日送清凉活动进入活动页面时判断之前是否领取过礼品
  receiveGift: doooly + 'jersey/doubleEleven/receiveGift', // 夏日送清凉活动点击领取
  newIndex: doooly + 'jersey/wechat/indexService/index/v2', // 首页2.1接口
  indexV2_2: doooly + 'jersey/wechat/indexService/index/v2_2', // 兜礼首页查询接口V2.2
  indexV3_3: doooly + 'jersey/wechat/indexService/index/v3_3', // 兜礼首页查询接口V3.3
  spendIntegral: doooly + 'jersey/wechat/indexService/index/spendIntegral', // 花积分页面查询接口
  integralRechargeList: doooly + 'jersey/mypoint/integralRechargeList', //
  integralRechargeDo: doooly + 'jersey/mypoint/integralRechargeDo', //
  receiveCoupon: doooly + 'jersey/freeCoupon/receiveCoupon', // 世界杯活动
  mobikeProductInfo: doooly + 'jersey/productService/mobikeProductInfo', // 摩拜商品信息接口
  nexusProductInfo: doooly + 'jersey/productService/nexusProductInfo', // 全家商品信息接口
  nexusBind: doooly + 'jersey/productService/nexusBind', // 添加集享和兜礼用户绑定
  nexusBindQuery: doooly + 'jersey/productService/nexusBindQuery', // 集享绑定验证
  sendCoupon: doooly + 'jersey/enterprises/activity/send-coupon', // 东航拉新活动发券接口
  issetPassword: doooly + 'jersey/myAccount/isSetPayPassword', // y-密码设置:是否设置过密码
  setPayPassword: doooly + 'jersey/myAccount/setPayPassword', // y-密码设置：设置支付密码
  validPayPassword: doooly + 'jersey/myAccount/validPayPassword', // y-校验原先支付密码
  openPayPassword: doooly + 'jersey/myAccount/openPayPassword', // 设置验证方式
  getOrderReportIdByOrderNum: doooly + 'jersey/myorder/getOrderReportIdByOrderNum', // 根据订单号获取订单报表Id
  getActivityCoupon: doooly + 'jersey/freeCoupon/getActivityCoupon', // 交行活动获取礼品
  jiaohang: doooly + 'jersey/daily-activity/v1/jiaohang', // 交行活动提交
  userReturnPoints: doooly + 'jersey/hotBusiness/userReturnPoints', // 首页获取预返积分接口
  receiveUserReturnPoints: doooly + 'jersey/hotBusiness/receiveUserReturnPoints', // 领取预返积分接口
  dailyQuery: doooly + 'jersey/daily-activity/v1/dailyQuery', // 查询活动优惠券接口
  daily: doooly + 'jersey/daily-activity/v1/daily', // 查询活动优惠券接口
  businessList: doooly + 'jersey/homeCoupon/businessList', // 获取优惠券对应的商家列表
  couponList: doooly + 'jersey/homeCoupon/couponList', // 获取商家的优惠券列表
  getRechargeActivityByType: doooly + 'jersey/selfProduct/getActivityByType', // 暂时供话费充值活动使用
  getRechargeActivity: doooly + 'jersey/selfProduct/getSelfProductByName', // 根据活动名称获取活动sku
  // -----------------订单2.2优化接口-------------------------
  getOrderList: doooly + 'jersey/myorder/list/v2/',
  getOrderDetail: doooly + 'jersey/myorder/detail/v2/',
  orderDelete: doooly + 'jersey/myorder/deleteOrder/v2/',
  getOrderHint: doooly + 'jersey/myorder/hint/v2/',
  errorLog: doooly + 'jersey/app/error-log/save/v1', // 捕获错误信息接口
  registerForum: doooly + 'jersey/forumInvitation/registerForum', // 论坛邀请活动报名接口
  detailForAjax: doooly + 'jersey/selfProduct/detail',
  createOrder_v2_2: doooly + 'jersey/order/createOrder/V2',
  createOrder_CCB: doooly + 'jersey/order/createOrder/CCB',
  userBizRelation: doooly + 'jersey/oneNumber/userBizRelation', //查询兜礼会员绑定的第三方商家账户
  getOrderBuy: doooly + 'jersey/cbc/getOrderBuy', // 判断建行礼品是否超过3000份
  getCoupon: doooly + 'jersey/daily-activity/v1/daily', // 通用  领券
  fordProductIndex: activity + 'ford/fordProductIndex', // 福特商品聚合列表
  shopList: order + 'shopCart/list/v1/', // 购物车查询
  shopHandle: order + 'shopCart/handle/v1/', // 购物车编辑
  actionVisit: action + 'visit/v1/', // 用户访问接口
  getGroupInfo: doooly + 'jersey/third/getGroupInfo', // 免登录获取企业信息
  thirdLogin: doooly + 'jersey/third/thirdLogin', // 第三方免登录
  giftBagList: activity + 'gift/bag/giftBagList', // 获取用户所有礼包接口
  findlist: activity + 'guide/findlist', // 发现新接口
  giftBagIsReceive: activity + 'gift/bag/isReceive', // 判断能否领取
  ccbActivityList: activity + 'cbcAct/findCbcActivityProList' // 判断建行一元购是否重复提交
}
export default api