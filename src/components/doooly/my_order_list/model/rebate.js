// 返积分判断逻辑
function countRebateState(isUserRebate, userRebate, type) {
  type = Number(type); // 确定type为number类型
  let state = 0;
  let resultState = 0;
  if (isUserRebate === 0 && userRebate > 0 && (type === 1 || type === 5)) { // 返积分 && 积分大于0 && 订单完成  -- 已返积分
    state = 2;
  } else if (isUserRebate === 1 && userRebate > 0) { // 不返积分 && 积分大于0  -- 预返积分
    state = 1;
  } else { // 无返积分
    state = 0;
  }
  // 计算状态
  if (state === 2) { // 已完成-已返利 or 退货订单-已返积分
    resultState = 1;
  } else if (type === 99) { // 已取消
    resultState = 6;
  } else if (state === 1 && (type === 1 || type === 5)) { // 已完成-预返利 or 退货订单-预返积分
    resultState = 2;
  } else if (state === 1 && type === 10) { // 待支付-预返积分
    resultState = 3;
  } else if (state === 0 && type === 10) { // 待支付-无返积分
    resultState = 4;
  } else if (state === 0 && (type === 1 || type === 5)) { // 已完成-无返积分 or 退货订单-无返积分
    resultState = 5;
  } else {
    resultState = 0;
  }
  return resultState;
}

export {
  countRebateState
};