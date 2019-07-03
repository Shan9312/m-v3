const handleUrlParams = () => {
  let url = window.location.href;
  url = url.replace(/^((http|https):\/\/|\/)\S+\?(\S+)$/, '$3')
  if (url.indexOf('=') > -1) {
    let parmasList = url.split('&')
    return parmasList.map((item, index) => {
      if (item.indexOf('=') > -1) {
        let temp = item.split('=')
        return {
          key: temp[0],
          value: temp[1]
        }
      }
    })
  }
}
/**
 * 
 * @param {获取的参数名} name 
 */
const getUrlParams = (name) => {
  let paramsArr = handleUrlParams() || []
  let value = ''
  paramsArr.map((item, index) => {
    if (item.key == name) {
      value = item.value
    }
  })
  return window.decodeURIComponent(value)
}
export {
  getUrlParams
}
