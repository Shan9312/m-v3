const DL = {
  //只支持js动态文件加载，后续扩展css动态文件加载
  require(url,fn) {
      var script = document.createElement('script');   // 创建script标签;
      script.type = 'text/JavaScript';          // 设置type属性;
      if(typeof url === "object"){
          for(var attr in url){
              script.setAttribute(attr, url[attr]);
          }
      }else{
          script.src = url;                 // 引入url;
      }

      document.getElementsByTagName('body')[0].appendChild(script);  // 将script引入<body>中;
      script.onload = function() {
              fn && fn()
      }
  },
  getRequest(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            //console.log(unescape(strs[i].split("=")[1]))
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
  },
  use(type,data) {
      var _argumentsLen = arguments.length;
          if(type === 'debug'){
        if(!DL.debugA){
          DL.debugA = true;//启动了debug
          var _url = './static/js/vconsole.min.js'
          DL.require(_url, function(){
            window.vConsole = new window.VConsole();
            if(_argumentsLen > 1){
              if(data.account){
                console.info('debug白名单测试账号：' + data.account);
              }else{
                console.info('已执行DL.use方法启动前端debug调试工具。');
              }
              console.log(data);
            }else{
              console.info('已执行DL.use方法启动前端debug调试工具。');
            }
        //		console.info('欢迎使用 vConsole前端开发者面板，可用于展示 console 日志，方便开发、调试。');
            return;
          })
        }
      }else if(type === 'fundebug'){
        DL.require({
          src: 'https://js.fundebug.cn/fundebug.1.1.1.min.js',
          apikey: '9d175709425b05bd4b1ffcaa04195f38beee1e36c0f25381e932ab3555d4dc11',
          releasestage: Releasestage,
          silentConsole: true,
          //silent:true,//Fundebug不会收集错误信息，因此也不会发送报警邮件
          silentResource:true,//不需要监控资源加载错误，则可以将silentResource属性设为true
          silentHttp:true,//不需要监控HTTP请求错误，则可以将silentHttp属性设为true。
          silentVideo:true,//不需要录屏功能，则可以将silentVideo属性设为true。
        }, function(){
          data && data();
        })
      }
  },
}

export default DL;
