const api = {
  WxAppIdUrl: WxAppIdUrl,
  baseURL: base,
  getLoginVCode: Butterfly + 'wechat/register/getValidCode.jhtml', // 获取登录验证码
  telLogin: Butterfly + 'wechat/login/telLogin.jhtml', // 验证码登录
  submit1: Butterfly + 'wechat/login/submit.jhtml', // 账号密码登录
  resetPwd: Butterfly + 'doooly/password/resetPwd.jhtml', // 忘记密码-登录-new
  getTargetUrl: Butterfly + 'wechat/oneNumber/getTargetUrl.jhtml', // 获取一号通url
  getHotActivityList: Butterfly + 'wechat/hotActivity/getHotActivityList.jhtml', // 获取发现列表
  first: Butterfly + 'doooly/selfProduct/first.jhtml', // 获取卡券列表
  getCurrentTime: Butterfly + 'doooly/selfProduct/getCurrentTime.jhtml', // 获取服务器当前时间
  businessInfoForAjax: Butterfly + 'wechat/hotBusiness/businessInfoForAjax.jhtml', // 商户详情
  indexForAjax: Butterfly + 'wechat/home/indexForAjax.jhtml', // 首页banner
  getPayForm: Butterfly + 'doooly/member/pay/getPayForm.jhtml', // 收银台下单接口
  getStoreList: Butterfly + 'wechat/mall/getStoreList.jhtml', // 获取门店位置列表
  getVoucherCouponNum: Butterfly + 'doooly/mycoupons/getVoucherCouponNum.jhtml', // 获取优惠券数量
  scanList: Butterfly + 'wechat/member/scan/scanList.jhtml', // 获取付款码列表
  toRecharge: Butterfly + 'doooly/member/order/toRecharge.jhtml', // 获取充值中心信息接口
  rechargeIndex: Butterfly + 'doooly/sctcd/rechargeIndex.jhtml', // 获取旅游卡绑定信息接口
  queryBalance: Butterfly + 'doooly/sctcd/queryBalance.jhtml', // 查询旅游卡余额接口
  findRechargeHistory: Butterfly + 'doooly/sctcd/findRechargeHistory.jhtml', // 查询旅游卡充值记录
  bindNewAccount: Butterfly + 'doooly/sctcd/bindNewAccount.jhtml', // 添加旅游卡接口
  abandonedSctcdAccount: Butterfly + 'doooly/sctcd/abandonedSctcdAccount.jhtml', // 删除旅游卡接口
  verifyCardNo: Butterfly + 'doooly/sctcd/verifyCardNo.jhtml', // 验证旅游卡是否绑定
  accountSecurityPage: Butterfly + 'wechat/myaccount/accountSecurityRestful.jhtml', // 获取个人信息
  modifyMobileGetCode: Butterfly + 'wechat/activation/getCode.jhtml', // 修改手机号获取验证码
  modifyMobileStepOne: Butterfly + 'wechat/member/modifymobile.jhtml', // 修改手机号验证验证码
  modifyMobileStepTwo: Butterfly + 'wechat/member/modifymobiletwo.jhtml', // 修改手机号接口
  updatePersonalData: Butterfly + 'wechat/myaccount/updatePersonalData.jhtml', // 修改个人信息接口
  modifyLoginPw: Butterfly + 'wechat/member/modifyLoginPw.jhtml', // 修改密码接口
  myPoint: Butterfly + 'doooly/member/point/listRestful.jhtml', // 获取我的积分余额
  myPointList: Butterfly + 'doooly/member/point/first.jhtml', // 获取我的积分列表
  myPointDetail: Butterfly + 'doooly/member/point/pointInfoRestful.jhtml', // 获取我的积分详情
  myOrderList: Butterfly + 'doooly/member/supplier_order/first.jhtml', // 获取我的订单列表
  myComplaint: Butterfly + 'wechat/complaint/listRestFul.jhtml', // 获取我的申诉列表
  myComplaintDetail: Butterfly + 'wechat/complaint/viewRestFul.jhtml', // 获取我的申诉详情
  getActivityCategoryList: Butterfly + 'doooly/hotActivity/getActivityCategoryList.jhtml', // 获取活动列表
  appealDetail: Butterfly + 'wechat/complaint/appealRestful.jhtml', // 提交申诉接口
  getUserDelivery: Butterfly + 'doooly/userDelivery/listRestful.jhtml', // 获取收货地址
  listRestful: Butterfly + 'doooly/mycoupons/listRestful.jhtml', // 获取抵扣券列表
  to_useRestful: Butterfly + 'doooly/mycoupons/to_useRestful.jhtml', // 获取抵扣券详情
  secretKeyLogin: Butterfly + 'doooly/activate/groupCommandActive.jhtml', // 企业口令登陆
  getSecretQuestion: Butterfly + 'doooly/activate/groupCommandPage.jhtml', // 企业口令获取问题
  getBusiness: Butterfly + 'doooly/activate/getGroupByCommand.jhtml', // 企业口令获取公司列表
  validateAndActive: Butterfly + 'doooly/activate/validateAndActive.jhtml', // 专属码激活
  logout: Butterfly + 'wechat/logout.jhtml', // 退出登录
  wechatBinding: Butterfly + 'callback/wechatBinding.jhtml?t=1', // 查询appid绑定状态
  getDeliveryStoreList: Butterfly + 'wechat/orderDelivery/storeList.jhtml', // 获取送货门店列表
  userDeliveryList: Butterfly + 'wechat/userDelivery/listRestful.jhtml', // 获取用户收货地址列表
  setDefaultAddr: Butterfly + 'wechat/userDelivery/setDefault.jhtml', // 设置默认收货地址
  deleAddr: Butterfly + 'wechat/userDelivery/delete.jhtml', // 删除收货地址
  saveDeliveryAddr: Butterfly + 'wechat/userDelivery/saveRestful.jhtml', // 保存用户收货地址
  appUploadImg: Butterfly + 'doooly/orderDelivery/appUploadImage.jhtml', // 微信上传图片
  // //活动话费充值
  resetPwd: Butterfly + 'wechat/password/resetPwd.jhtml', // 钢城e家验证码登录
  verifyCodeToActive: Butterfly + 'wechat/activate/verifyCodeToActive.jhtml', // 激活接口
  checkValidCode: Butterfly + 'doooly/register/checkValidCode.jhtml', // 校验验证码

  SplashScreen: Doooly + 'jersey/dooolyApp/index/SplashScreen/' + localStorage.groupId, // 获取企业引导图
  commonShareJSONPConfig: Doooly + 'jersey/share/commonShareJSONPConfig',
  getScanDiscount: Doooly + 'jersey/scanBusiness/getScanDiscount',
  businessInfoService: Doooly + 'jersey/hotBusiness/businessInfoService', // 可用积分服务进入的商户详情
  cancleOrder_v2: Doooly + 'jersey/order/cancleOrder',
  unifiedorder: Doooly + 'jersey/doooly/payment/unifiedorder', // 查询订单信息接口-2.1
  jd: 'https://coupon.m.jd.com/union?&mtm_source=kepler-m&mtm_subsource=7553efb413f041b2a256679e84067dd4&returl=http%3A%2F%2Funion-click.jd.com%2Fjdc%3Fd%3DLu4haH',
  getPayForm: Doooly + 'jersey/doooly/payment/getPayForm', // 获取支付信息
  integralPay: Doooly + 'jersey/doooly/payment/integralPay', // 验证支付验证码2.1
  getPayResult: Doooly + 'jersey/doooly/payment/getPayResult', // 查询支付结果
  getArticleList: Doooly + 'jersey/guide/getArticleList',
  getGuideProductList: Doooly + 'jersey/guide/getGuideProductList',
  addSellCount: Doooly + 'jersey/guide/addSellCount',
  getArticleProductList: Doooly + 'jersey/guide/getArticleProductList',
  getDiDiIntegral: Doooly + 'jersey/didiIntegral/getDiDiIntegral', // 查询商户可用滴滴积分
  getCode: Doooly + 'jersey/didiIntegral/getCode', // 滴滴验证码接口
  exchangeIntegral: Doooly + 'jersey/didiIntegral/exchangeIntegral', // 滴滴积分兑换接口
  toExchangeIntegral: Doooly + 'jersey/didiIntegral/toExchangeIntegral', // 滴滴进入页面接口
  getGuideCategaryList: Doooly + 'jersey/guide/getGuideCategaryList', // 获取导航类目
  getGuideProductListV2: Doooly + 'jersey/guide/getGuideProductList/v2', // 导航列表v2
  getGuideProductListV3: Doooly + 'jersey/guide/getGuideProductList/v3', // 导航列表v3
  appealSubmit: Doooly + 'jersey/complaint/save',
  saveForAppTwo: Doooly + 'jersey/complaint/saveForAppTwo',
  getPointsService: Doooly + 'jersey/hotBusiness/businessServiceData',
  getPointsServiceV21: Doooly + 'jersey/hotBusiness/businessServiceDataV21',
  getIntegralActivity: Doooly + 'jersey/freeCoupon/integralActivity',
  getSendIntegralActivity: Doooly + 'jersey/freeCoupon/sendIntegralActivity',
  getmerchantDetail: Doooly + 'jersey/hotBusiness/businessInfo', // 积分商户详情
  CouponActivity: Doooly + 'jersey/dooolyApp/exclusiveCoupon/CouponActivity', // 王晨宇-发现
  // 首页个人信息概要
  gerneralInfo: Doooly + 'jersey/dooolyApp/index/user/profile',
  profilev2_2: Doooly + 'jersey/dooolyApp/index/user/profile/v2_2', // 获取个人信息2.2
  // 权益新手引导&积分新手引导，状态查询接口
  flow: Doooly + 'jersey/dooolyApp/index/guide/flow',
  // 权益新手引导&积分新手引导，状态修改接口
  finish: Doooly + 'jersey/dooolyApp/index/guide/finish',
  exclusiveCoupon: Doooly + 'jersey/dooolyApp/exclusiveCoupon',
  receive: Doooly + 'jersey/dooolyApp/exclusiveCoupon/receive',
  isReceiveGift: Doooly + 'doubleEleven/isReceiveGift', // 夏日送清凉活动进入活动页面时判断之前是否领取过礼品
  receiveGift: Doooly + 'doubleEleven/receiveGift', // 夏日送清凉活动点击领取
  isSetShareRecord: Doooly + 'jersey/shareRecord/isSetShareRecord', // 夏日送清凉活动点击邀请
  sendByShareRecord: Doooly + 'jersey/shareRecord/sendByShareRecord', // 夏日送清凉活动验证邀请
  familyInviteApp: Doooly + 'jersey/wechat/familyInviteApp/familyInviteApp', // 家属邀请
  new_inviteFamily: Doooly + 'jersey/wechat/familyInviteApp/inviteFamily', // 立即邀请
  InviteInfoRestFul: Doooly + 'jersey/wechat/familyInviteApp/share/getFamilyInviteInfoRestFul', // 分享落地接口
  isReceiveGift: Doooly + 'jersey/doubleEleven/isReceiveGift', // 夏日送清凉活动进入活动页面时判断之前是否领取过礼品
  receiveGift: Doooly + 'jersey/doubleEleven/receiveGift', // 夏日送清凉活动点击领取
  newIndex: Doooly + 'jersey/wechat/indexService/index/v2', // 首页2.1接口
  indexV2_2: Doooly + 'jersey/wechat/indexService/index/v2_2', // 兜礼首页查询接口V2.2
  indexV3_3: Doooly + 'jersey/wechat/indexService/index/v3_3', // 兜礼首页查询接口V3.3
  spendIntegral: Doooly + 'jersey/wechat/indexService/index/spendIntegral', // 花积分页面查询接口
  integralRechargeList: Doooly + 'jersey/mypoint/integralRechargeList', //
  integralRechargeDo: Doooly + 'jersey/mypoint/integralRechargeDo', //
  receiveCoupon: Doooly + 'jersey/freeCoupon/receiveCoupon', // 世界杯活动
  mobikeProductInfo: Doooly + 'jersey/productService/mobikeProductInfo', // 摩拜商品信息接口
  nexusProductInfo: Doooly + 'jersey/productService/nexusProductInfo', // 全家商品信息接口
  nexusBind: Doooly + 'jersey/productService/nexusBind', // 添加集享和兜礼用户绑定
  nexusBindQuery: Doooly + 'jersey/productService/nexusBindQuery', // 集享绑定验证
  sendCoupon: Doooly + 'jersey/enterprises/activity/send-coupon', // 东航拉新活动发券接口
  issetPassword: Doooly + 'jersey/myAccount/isSetPayPassword', // y-密码设置:是否设置过密码
  setPayPassword: Doooly + 'jersey/myAccount/setPayPassword', // y-密码设置：设置支付密码
  validPayPassword: Doooly + 'jersey/myAccount/validPayPassword', // y-校验原先支付密码
  openPayPassword: Doooly + 'jersey/myAccount/openPayPassword', // 设置验证方式
  getOrderReportIdByOrderNum: Doooly + 'jersey/myorder/getOrderReportIdByOrderNum', // 根据订单号获取订单报表Id
  getActivityCoupon: Doooly + 'jersey/freeCoupon/getActivityCoupon', // 交行活动获取礼品
  jiaohang: Doooly + 'jersey/daily-activity/v1/jiaohang', // 交行活动提交
  userReturnPoints: Doooly + 'jersey/hotBusiness/userReturnPoints', // 首页获取预返积分接口
  // userReturnPoints: '/zhaoyang/Doooly/' + 'hotBusiness/userReturnPoints', // 首页获取预返积分接口
  receiveUserReturnPoints: Doooly + 'jersey/hotBusiness/receiveUserReturnPoints', // 领取预返积分接口
  dailyQuery: Doooly + 'jersey/daily-activity/v1/dailyQuery', // 查询活动优惠券接口
  daily: Doooly + 'jersey/daily-activity/v1/daily', // 查询活动优惠券接口
  businessList: Doooly + 'jersey/homeCoupon/businessList', // 获取优惠券对应的商家列表
  couponList: Doooly + 'jersey/homeCoupon/couponList', // 获取商家的优惠券列表
  getRechargeActivityByType: Doooly + 'jersey/selfProduct/getActivityByType', // 暂时供话费充值活动使用
  getRechargeActivity: Doooly + 'jersey/selfProduct/getSelfProductByName', // 根据活动名称获取活动sku
  // -----------------订单2.2优化接口-------------------------
  getOrderList: Doooly + 'jersey/myorder/list/v2/',
  getOrderDetail: Doooly + 'jersey/myorder/detail/v2/',
  orderDelete: Doooly + 'jersey/myorder/deleteOrder/v2/',
  getOrderHint: Doooly + 'jersey/myorder/hint/v2/',
  errorLog: Doooly + 'jersey/app/error-log/save/v1', // 捕获错误信息接口
  registerForum: Doooly + 'jersey/forumInvitation/registerForum', // 论坛邀请活动报名接口
  detailForAjax: Doooly + 'jersey/selfProduct/detail',
  // createOrder_v2: Doooly+'jersey/order/createOrder',
  createOrder_v2_2: Doooly + 'jersey/order/createOrder/V2',
  createOrder_v3_3: Doooly + 'jersey/order/createOrder/V3',
  getOrderBuy: Doooly + 'jersey/cbc/getOrderBuy', // 判断建行礼品是否超过3000份
  getCoupon: Doooly + 'jersey/daily-activity/v1/daily', // 通用  领券
  fordProductIndex: Activity + 'ford/fordProductIndex', // 福特商品聚合列表
  shopList: Order + 'shopCart/list/v1/', // 购物车查询
  shopHandle: Order + 'shopCart/handle/v1/', // 购物车编辑
  actionVisit: Action + 'visit/v1/', // 用户访问接口
  getGroupInfo: Doooly + 'jersey/third/getGroupInfo', // 免登录获取企业信息
  thirdLogin: Doooly + 'jersey/third/thirdLogin', // 第三方免登录
  giftBagList: Activity + 'gift/bag/giftBagList', // 获取用户所有礼包接口
  findlist: Activity + 'guide/findlist', // 发现新接口
  giftBagIsReceive: Activity + 'gift/bag/isReceive', // 判断能否领取
  ccbActivityList: Activity + 'cbcAct/findCbcActivityProList' // 判断建行一元购是否重复提交
}
export default api
