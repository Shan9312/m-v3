
//校验手机号
export function checkMobile(mobile){
  if (mobile.match(/^1[3456789]\d{9}/)){
    return false;
  }else{
    return true;
  }
}
//校验手机号运营商
export function checkOperator(tel){
  var rtn;
  //移动号段  
  var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(198)|(147))[\d]{8}$/;  
  if (regtel.test(tel)) {  
      rtn = 'cmcc';  
  }  
  //电信号段  
  regtel = /^((133)|(153)|(199)|(18[0|1|9])|(17[3|7]))[\d]{8}$/;  
  if (regtel.test(tel)) {  
      rtn = 'ctcc'; 
  }  
  //联通号段  
  regtel = /^((13[0-2])|(145)|(166)|(15[5-6])|(17[5-6])|(18[5-6]))[\d]{8}$/;  
  if (regtel.test(tel)) {  
      rtn = 'cucc'; 
  }  
  return rtn;
}
                    
//校验中文
export function isChinaName(name) {
 var pattern = /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/;
 return pattern.test(name);
}
//校验身份证
export function isCardNo(card) {
 var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
 return pattern.test(card);
}
//校验纯数字
export function isNumber(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
//校验名字
export function isNmae(name) {
    var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
    return !reg.test(name);
}