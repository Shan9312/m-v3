import {
  Ajax
}
from 'v3/common';

/**
 * 获取首页广告位
 */
export const getAdList = () => {
  return Ajax.get(`${Butterfly}wechat/home/indexForAjax.jhtml`, {
    address: localStorage.address
  });
}

/**
 * 添加用户行为统计
 * @param {*} model 设备型号
 * @param {*} product 产品型号
 * @param {*} brand 产品品牌
 * @param {*} manufacturer 产品制造商
 * @param {*} systemVersion //系统型号版本
 * @param {*} os //操作系统
 * @param {*} browser //浏览器
 * @param {*} blocId //集团
 * @param {*} appVersion //应用版本
 * @param {*} headers //请求头
 */
export const addUserAction = (model, product, brand, manufacturer, systemVersion, os, browser, blocId, appVersion, headers) => {
  return Ajax.post(`${Action}visit/v1/`, {
    model,
    product,
    brand,
    manufacturer,
    systemVersion,
    os,
    browser,
    blocId,
    appVersion
  }, headers);
}

/**
 * 查询新手礼
 * @param {*} userId 
 */
export const giftBagList = () => {
  return Ajax.post(`${Activity}gift/bag/giftBagList`, {
    userId: localStorage.userId,
  })
}

/**
 * 获取活动积分
 * @param {*} clientChannel 客户端类型
 * @param {*} params 参数
 * @param {*} timestamp 时间戳
 */
export const getActivityIntegral = (clientChannel, params, timestamp) => {
  return Ajax.post(`${Doooly}jersey/freeCoupon/sendIntegralActivity`, {
    clientChannel,
    params,
    timestamp
  });
}

/**
 * 生活页面，最近常用
 * @param {*} userId 
 */
export const getUserRecentView = (userId) => {
  return Ajax.post(`${Doooly}jersey/lifehome/getUserRecentView`, {
    userId
  });
}

/**
 * 生活页面，生活场景等
 * @param {*} userId 
 */
export const getLifeFloors = (userId) => {
  return Ajax.post(`${Doooly}jersey/lifehome/getLifeFloors`, {
    userId
  })
}

/**
 *  生活页面，获取导购类别
 */
export const getGuideCategory = () => {
  return Ajax.post(`${Doooly}jersey/lifehome/getGuideCategory`)
}

/**
 *  生活页面，按照类别id获取商品
 */
export const getGuideCategoryBusi = (guideCategoryId, pageNum, pageSize) => {
  return Ajax.post(`${Doooly}jersey/lifehome/getGuideCategoryBusi`, {
    guideCategoryId,
    pageNum,
    pageSize
  })
}
/**
 * 个人中心概要信息查询接口3.0
 * @param {*} userId 
 */
export const getUserProfile = (userId) => {
  return Ajax.post(`${Doooly}jersey/dooolyApp/index/user/profile/v3`, {
    userId
  })
}
/**
 * 查询新手礼
 * @param {*} userId 
 */
export const getNewGift = () => {
  return Ajax.post(`${Doooly}jersey/freeCoupon/integralActivity`, {
    params: {
      userId: localStorage.userId
    }
  })
}
/**
 * 新手礼领取积分接口
 */
export const sendIntegralActivity = () => {
  return Ajax.post(`${Doooly}jersey/freeCoupon/sendIntegralActivity`, {
    params: {
      userId: localStorage.userId
    }
  });
}
/**
 * 获取首页楼层
 */
export const getTemplateByType = (data) => {
  return Ajax.post(`${Doooly}jersey/template/getTemplateByType`, data);
}
/**
 * 个人中心概要信息查询接口3.0
 */
export const getProfileV3 = () => {
  return Ajax.post(`${Doooly}jersey/dooolyApp/index/user/profile/v3`, {
    userId: localStorage.userId
  });
}
/**
 * 第三方面登录接口
 */
export const thirdLogin = () => {
  return Ajax.post(`${Doooly}jersey/third/thirdLogin`, {
    thirdUserToken: localStorage.thirdUserToken
  });
}

/**
 * 清理用户标识(小红点)
 * @param {*} userFlag 
 */
export const cannelUserFlag = (userFlag) => {
  return Ajax.post(`${Doooly}jersey/common/cannelUserFlag`, {
    userFlag
  })
}

/**
 * 查询权益列表
 * @param {*} groupId 
 */
export const getGroupEquity = () => {
  return Ajax.post(`${Doooly}jersey/groupEquity/getGroupEquity`, {
    groupId: localStorage.groupId
  })
}
/**
 * 查询单个权益信息
 * @param {*} equityId 
 */
export const getEquityByEquityId = (data) => {
  return Ajax.post(`${Doooly}jersey/groupEquity/getEquityByEquityId`, data)
}

/**
 * 首页自定义弹窗
 * @param {*}  
 */
export const getDialogList = (userId) => {
  return Ajax.post(`${Activity}homepage/spread/list`, {userId})
}
