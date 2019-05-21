<template>
  <div>
  <article id="h5applyvip">
    <div class="app_con">
      <header>
        <div class="header_img">
          <div class="buis_logo">
            <img src="../../assets/images/familyinvite/invite_bg.png"/>
          </div>
        </div>
      </header>
      <section class="fill_info">
        <div class="input_div content">
        <form>
          <input v-model="mobileNum" type="tel" minlength="11" maxlength="11" class="input_text" :placeholder="placeholderTxt" @click.stop="linksInputEvent" />
          <div class="getTel" v-show="isTeldiv" @click="click_teldiv">
           <p class="tel">{{tel}}</p>
           <p class="tel_name">{{tel_name}}</p>
          </div>
          <div class="icon_tel" @click="click_tel" v-show="isTel"><img src="../../assets/images/familyinvite/icon_tel.png"/></div>
          <div class="icon_tel" @click="click_telClose" v-show="isTel_close"><img src="../../assets/images/lighten_business/tel_close.png"/></div>
        </form>
        </div>
        <div class="btn_div">
          <button @click="inviteFamily" class="btn btn-primary btn-block" id="add_btn">立即邀请</button>
        </div>
      </section>
      <section class="main_div">
        <div class="title">邀请流程</div>
        <div class="line"><img src="../../assets/images/familyinvite/line.png"></div>
        <div class="progress">
          <p>1. 每位{{member}}只能邀请3位亲友</p>
          <p>2. 填写亲友手机号，邀请亲友成为{{member}}</p>
          <p>3. 亲友使用手机号登录,即可成为{{member}}，享受福利</p>
          <p>4. 受邀亲友超出7个自然日未激活名额将自动收回</p>
          <p>5. 如有疑问 , 请及时联系客服 : <span>400-158-2212</span></p>
        </div>
      </section>
      <section class="main_div">
        <div class="title">已邀请的亲友</div>
        <div class="line"><img src="../../assets/images/familyinvite/line.png"></div>
        <div class="div_ulfamily">
          <ul>
            <!--<#list inviteeList as recordList>-->
            <li v-for="(item,index) in familyInviteList" :key="index" class="clearfix">
              <div class="head">
                <img v-if="item.headImgurl" :src="item.headImgurl"/>
                <img v-if="!item.headImgurl && item.isActive == 1"
                     src="../../assets/images/familyinvite/favicon.png"/>
                <img src="../../assets/images/familyinvite/inviting.png" v-else/>
              </div>
              <div class="lottery_name">
                {{item.name?item.name:'***'}}
              </div>
              <div class="lottery_rule">
                <span v-if="item.isActive==1">邀请成功</span>
                <span v-if="item.isActive==2">邀请中</span>
                <span v-if="item.isActive==3">邀请失败</span>
               <!-- {{item.isActive==2?'邀请成功':'邀请中'}} -->
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
    <div v-if="shareBgState" @click="changeShareBgState" class="share_bg">
      <img src="../../assets/images/familyinvite/share.png">
    </div>
   </article>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP} from '@/assets/js/wechatShare2.js';

  let globalVue;
  window["getTel"] = function(model_tel,model_name) {
   globalVue.getTel(model_tel,model_name);

  };
  export default {
    name: "family-invite",
    data() {
      return {
        familyInviteList: [
        ],
        shareBgState: false,
        mobileNum: '',
        isTel:true,
        isTeldiv:false,
        isTel_close:false,
        tel:"",
        tel_name:"",
        ChinaTel:"",
        member:memberFrom,
        placeholderTxt: '填写亲友手机号'
      }
    },
    methods: {
      linksInputEvent() {  //联系方式输入和聚焦事件,解决手机虚拟键盘遮挡输入框问题
        var self = this;
        var timer = setTimeout(function () {
        var pannel = document.querySelector('.input_text');
        pannel.scrollIntoView(true);
        pannel.scrollIntoViewIfNeeded();
        clearTimeout(timer);
        timer = null;
        }, 200);
      },
      //获取手机通讯录
      click_tel(){
        dooolyAPP.openTelePhoneList.call(this,'getTel');
      },
      click_teldiv(){
        this.isTel_close=true;
        this.isTel=false;
      },
      click_telClose(){
        this.isTel=true;
        this.isTel_close=false;
        this.isTeldiv=false;
        this.placeholderTxt = '填写亲友手机号'
        this.mobileNum="";
      },
      getTel(model_name,model){
       if(model){
       /**
       * 手机号码
       * 移动：134[0-8],135,136,137,138,139,150,151,157,158,159,182,187,188
       * 联通：130,131,132,152,155,156,185,186,176
       * 电信：133,1349,153,180,189
       */
        var isChinaMobileTel = /^1(34[0-8]|(3[5-9]|5[017-9]|8[278])\\d)\\d{7}$/; //移动
        var isChinaUnionTel = /^1(3[0-2]|5[256]|8[56]|7[168])\\d{8}$/; //联通
        var isChinaTelcomTel = /^1((33|53|8[09])[0-9]|349)\\d{7}$/; //电信

        if(model.length !== 11){
         this.$toast('不是11位的手机号码');
        }else{
          if(isChinaMobileTel.test(model)){
            this.ChinaTel='(移动)';
          }
          else if(isChinaUnionTel.test(model)){
            this.ChinaTel='(联通)';
          }
          else if(isChinaTelcomTel.test(model)){
            this.ChinaTel='(电信)';
          }
          else{
            this.ChinaTel='';
          }
        }
        this.isTeldiv=true;
        this.placeholderTxt = ''
        this.tel=model;
        this.tel_name=model_name+this.ChinaTel;
        this.mobileNum = '';
      }else{
        this.$toast('可能兜礼已被禁止该权限或手机号为空');
      }
      },
      loadPageData(){
        http({
          method: 'post',
          url: api.familyInviteApp,
          data:{}
        }).then((res) => {
          this.familyInviteList=res.data.inviteeList;
        })
      },

      checkMobile() {
        let re = /^1[3|4|5|6|7|8][0-9]{9}$/;
        let mobileNum = this.mobileNum;
        if(this.isTeldiv){
          mobileNum = this.tel;
        }
        if (mobileNum == "") {
          this.$toast("手机号不能为空");
          return false;
        }
        else if (!re.test(mobileNum) || mobileNum.length != 11) {
          this.$toast("手机号格式错误！");
          return false;
        }
        else {
          return true;
        }
      },
      index_click(val, index) {
        this.$baiduStats('首页中部-邀请亲友-立即邀请');
      },

      changeShareBgState(){
        this.shareBgState=false;
      },
      inviteFamily() {
        this.index_click();
        if (this.checkMobile() == false) {
          return false;
        }

        let mobileNum = this.mobileNum;
        if(this.isTeldiv){
          mobileNum = this.tel;
        }

        http({
          method: 'post',
          url: api.new_inviteFamily,
          data:{
            telephone:mobileNum,
          }
        }).then((res) => {
          if (res.data.code == '1000') {
            if (browserName == "WeChat") {
              this.shareBgState = true;
               this.Wechatshare('swing', res.data.userId);
              setTimeout(function () {
                this.shareBgState = false;
              }, 2000)
            } else {
              this.Wechatshare('swing', res.data.userId);
            }
          }else if(res.data.code == '1001'){
            this.$toast("该手机已经是会员！");
          }else if (res.data.code == '1003') {
            this.$toast("您为亲友，不可以邀请亲友！");
          } else if (res.data.code == '1002') {
            if (browserName == "WeChat") {
              this.shareBgState = true;
              this.Wechatshare('swing', res.data.userId);
              setTimeout(function () {
                this.shareBgState = false;
              }, 2000)
            } else {
              this.Wechatshare('swing', res.data.userId);
            }
          }else if (res.data.code == '1011') {
            this.$toast("该手机号码已是您的亲友!");
          }else {
            this.$toast(res.data.msg);
          }
        })

      },
      jsonpCallback(data){

      },
     Wechatshare(prefix,params){
        var client = 'doooly';
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          client = 'wechat';//是微信
        } else {
          client = 'doooly';//不是微信
        }
        let channel;
        if(browserName == "WeChat"){
          channel = 'wechat';
        }else if(browserName == "WebKit"||browserName == "Chrome WebView"){
          channel = 'app';
        }else if(browserName == "otherAPPAndroid"){
          channel = 'wiscoapp';
        }else if(browserName == "otherAPPIos"){
          channel = 'wiscoapp';
        }else {
          channel = 'h5';
        }
        if(/wiscowechat/.test(window.location.href)){
          channel = 'wiscowechat'
        }
        this.$jsonp(api.commonShareJSONPConfig+"?client="+client+"&prefix="+prefix+"&params="+params+"&params="+channel+"&url="+encodeURIComponent(window.location.href)+"&channel="+channel,{callbackName: 'jsonpCallback',}).then((res) => {
            if(res.code == 4001){
              //40001微信配置
              shareWithFriendsWX(res.data);
            }else if(res.code == 4002){
              //40002兜里配置
              shareWithFriendsAPP(res);
            }
        });
      }
    },

    created() {
      this.loadPageData();
      initTitle('邀请亲友');
      if(browserName=="WeChat"){
        this.isTel=false;
      }
      else if(browserName=="WebKit"){
        this.isTel=true;
      }
      else if(browserName=="Chrome WebView"){
        this.isTel=true;
      }
      else{
        this.isTel=false;
      }
      globalVue = this;

    }
  }
</script>

<style scoped>
button{
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  -webkit-appearance:none;
  outline: none;
  border: none;
}
#h5applyvip{
    width: 100%;
    min-height: 100vh;   /*撑满整个屏幕 */
    display: flex;
    flex-direction: column;  /*竖向排列*/
    .content {
      flex: 1;    /*content是撑满 */
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .content {
    width:100px;
    height:100px;
   }
}
  .share_bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
    text-align: right;
  }

  .share_bg img {
    width: 6.07rem;
  }

  #alr_loading {
    display: none;
  }

  .div_ulfamily {
    margin-top: 0.41rem
  }

  .div_ulfamily ul li {
    height: 0.8rem;
    line-height: 0.8rem;
    margin: 0.4rem 0.3rem;
    overflow: hidden;
  }

  .div_ulfamily ul li .head {
    width: 0.8rem;
    height: 0.8rem;
    float: left;
    display: inline-block;
  }

  .div_ulfamily ul li .head img {
    width: 0.79rem;
    height: 0.79rem;
    border-radius: 50%;
    display: block;
  }

  .div_ulfamily ul li .lottery_name {
    font-family: "Courier", "Courier New", "Andale Mono";
    margin-left: 0.3rem;
    float: left;
    font-size: 0.3rem;
    color: #999999;
    display: inline-block;
  }

  .div_ulfamily ul li .lottery_rule {
    text-align: right;
    float: right;
    font-size: 0.24rem;
    color: #ee3f44;
    display: inline-block;
  }

  /* 家属邀请 */

  .header_img {
    width: 100%;
    height: auto;
  }

  .buis_logo {
    overflow: hidden;
    position: relative;
    top: 0;
  }

  .buis_logo img {
    width: 100%
  }

  .fill_info {
    margin-top: 0.4rem
  }

  .input_div {
    margin: 0 auto;
    border: 1px solid #c9c9c9;
    border-radius: 0.1rem;
    height: 0.88rem;
    width: 6rem;
    padding-bottom: 0.02rem
  }

  .input_text {
    width: 6rem;
    height: 0.88rem;
    background: #fff;
    font-size: 0.3rem;
    display: block;
    outline: none;
    border-radius: 0.1rem;
    text-align: center;
    position: absolute;

  }

  .btn_div {
    width: 6rem;
    margin: 0 auto;
    margin-top: 0.22rem;
  }

  .btn {
    display: inline-block;
    height: 0.82rem;
    padding-top: 0.1rem;
    box-shadow: 0 7px 0 #d8262b;
    margin-bottom: 0;
    font-size: 0.3rem;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 0.01rem solid transparent;
    border-radius: 0.1rem;
  }

  .btn-primary {
    color: #fff;
    background-color: #ee3f44;
    border-color: #ee3f44;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .div_describe {
    text-align: center;
    color: #333;
    margin-top: 0.16rem;
  }

  .div_describe .desc_name {
    font-size: 0.3rem;
    color: #383838;
  }

  .div_describe .desc_infor {
    color: #c9c9c9;
    margin-top: 0.2rem;
    font-size: 0.24rem;
  }

  .div_describe .desc_price {
    color: #c9c9c9;
    margin-top: 0.1rem;
    font-size: 0.24rem;
  }

  .main_div {
    width: 6.6rem;
    margin: 0 auto;
    margin-top: 0.4rem;
    border-radius: 0.2rem;
    background-color: #fff;
    padding-top: 0.4rem;
    padding-bottom: 0.38rem
  }

  .title {
    text-align: center;
    color: #333333;
    font-size: 0.3rem;
  }

  .line {
    width: 100%;
    text-align: center;
    margin-top: 0.21rem;
    font-size: 0
  }

  .line img {
    width: 0.83rem;
  }

  /*激活流程*/
  .progress {
    margin-top: 0.41rem;
    padding: 0 0.3rem;
  }

  .progress p {
    font-size: 0.24rem;
    color: #999999;
    margin-bottom: 0.13rem
  }

  .progress p span {
    color: #ee3f44
  }

  .progress p:last-child {
    margin-bottom: 0
  }

  .app_con {
    padding-bottom: 0.28rem;
  }

  .result {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    background-color: rgba(0, 0, 0, 0.75);
    filter: alpha(opacity=90);
  }

  .model_div {
    width: 6rem;
    text-align: center;
    min-height: 3.5rem;
    background: #fff;
    position: absolute;
    z-index: 1060;
    border-radius: 0.1rem;
    top: 15%;
    left: 50%;
    margin-left: -3rem;
  }

  #resultTxt {
    margin-top: 0.6rem;
    padding: 0 0.3rem;
  }

  #resultTxt1 {
    margin-top: 0.6rem;
    padding: 0 0.3rem;
  }

  .model_div h1 {
    color: #000;
    font-size: 0.4rem;
    font-weight: 700;
    text-align: center;
    margin: 0.3rem 0 0.2rem 0;
  }

  .model_div p {
    color: #000;
    font-size: 0.3rem;
    margin: 0.3rem 0;
  }

  .button_div {
    margin-top: 0.6rem;
  }

  .icon_tel{    width: 0.42rem;
    position: absolute;
    z-index: 100;
    float: right;
    right: 12%;
    height: 0.52rem;
    display: inline-block;
    line-height: 0.42rem;
    margin-top: 0.1rem;}
  .getTel{
    width: 5rem;
    font-size: 0.3rem;
    display: block;
    text-align: left;
    padding: 0.1rem 0.2rem 0.04rem 0.1rem;
    position: absolute;
    z-index: 30;
    overflow: hidden;
    height: 0.78rem;
  }
  .getTel .tel{font-size: 0.36rem;}
  .getTel .tel_name{font-size: 0.2rem;color:#808080;}

  @media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .getTel{
    padding: 0.04rem 0.2rem 0.04rem 0.1rem;
  }
}
</style>
