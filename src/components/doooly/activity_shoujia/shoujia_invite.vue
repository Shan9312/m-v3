<template>
  <div>
    <!--  弹出框  start-->
    <div class="share_bg" v-show="isShare" @click="click_share"  @touchmove.prevent>
       <img class="share_person" src="../../../assets/images/shoujia/share.png"/>
    </div> 
    <div class="activity_div">
      <div class="img_div">
        <img src="../../../assets/images/shoujia/invite.png"/>
      </div>
      <div class="img_div input_div">
        <input type="tel" placeholder="请输入同事手机号" maxlength="11" v-model="telephone">
      </div>
      <div class="img_div input_div input_button" data-baidu-stats="活动-夏日送清凉-分享再得20元现金券" @click="invite">
        立即邀请
      </div>
      <div class="text_div">
        <div>
          <span>1、</span><span>成功邀请3名同事可再获得“来伊份20元现金抵用券”（此券仅限上海各门店使用）</span>
        </div>
        <div>
          <span>2、</span><span>输入同事手机号，发出邀请，待同事成功登录活动页面，即为邀请成功。</span>
        </div>
        <div>
          <span>3、</span><span>每人限领一张现金券</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfigNew} from '@/assets/js/wechatShare2.js';
  import {checkMobile} from '@/assets/js/verify.js';

  export default {
    name: "shoujia_index",
    data() {
      return {
        isShare:false,
        delete_card_show:false,
        disabled:true,
        telephone:'',
      }
    },
    created(){
      initTitle('夏日送清凉','');
      onWechatConfigNew('hideMenuItems');
    },
    mounted(){

    },
    methods: {
      invite(){
        if(!this.telephone){
          this.$toast('手机号不能为空')
          return;
        }
        if (checkMobile(this.telephone)){
          this.$toast("手机号格式错误");
          return;
        }
        http({
          method: 'post',
          url: api.isSetShareRecord,
          data:{
            "userId":localStorage.userId,
            "telephone":this.telephone
          }
        }).then((res) => {
          if(res.data.code == 1000){
            this.$toast("邀请成功");
            this.Wechatshare('bringCoolnessActivity',localStorage.userId,this.telephone);
            //分享弹框
            this.isShare=true;
          }else if(res.data.code == 10001){
            this.$toast("该号码不在工会信息库中，具体请至工会咨询");
          }else if(res.data.code == 10003){
            this.$toast("购买后才能发起分享");
          }else if(res.data.code == 11001){
            this.$toast("输入的手机号是自己的手机号");
          }else if(res.data.code == 11003){
            this.$toast("该手机号已被邀请过了");
          }else if(res.data.code == 30000){
            this.$toast("系统异常");
          }
        })
      },
      click_share(){
        this.isShare=false;
      },
      Wechatshare(prefix,userId,telephone){
        var client = 'wechat';
        var channel = 'wechat';
        if(browserName != "WeChat"){
          client = 'doooly';
          channel = 'app';
        }

        var requestUrl = api.commonShareJSONPConfig+"?client="+client+"&prefix="+prefix+"&params="+telephone+"&params="+userId+"&url="+encodeURIComponent(window.location.href)+"&channel="+channel;
        this.$jsonp(requestUrl,
          {
            callbackName: 'jsonpCallback',
          }).then((res) => {
            if(res.code == 4001){
              wx.showMenuItems({
                menuList: ['menuItem:share:appMessage']
              });
              shareWithFriendsWX(res.data);//40001微信配置
            }else if(res.code == 4002){
              wx.showMenuItems({
                menuList: ['menuItem:share:appMessage']
              });
              shareWithFriendsAPP(res);//40002兜里配置
            }else{
            }

        });
      },
      onlink(type){
        if(type == 1){
          dooolyAPP.gotoJumpVue.call(this,'/cardBuyDetail/145');
        }else if(type == 2){
          dooolyAPP.gotoJumpVue.call(this,'/cardBuyDetail/148');
        }
      }
    }
  }
</script>

<style scoped>
body{background:#5dc2be !important;}
img{width:100%;pointer-events: none;}
.activity_div{padding-bottom: 1.1rem;}
.img_div{
  font-size: 0;
  position: relative;
  background:#fff;
}
.firstCommodity{
  position: absolute;
  width: 1.6rem;
  height: 100%;
  left: 3.6rem;
}
.lastCommodity{
  position: absolute;
  width: 4.1rem;
  height: 50%;
  left: 1.7rem;
}
.input_div{
  width: 6.6rem;
  height: 0.9rem;
  line-height: 0.9rem;
  margin: 0 auto;
  border-radius: 0.1rem;
  border:1px solid;
  text-align: center;
  margin-top: 0.6rem;
  border-color: #e9e9e9;
}
.input_button{
  margin-top: 0.4rem;
  border-color: #ff733b;
  background: #ff733b;
  color: #fff;
  font-size: 0.34rem;
}
.text_div{
  font-size: 0.24rem;
  color:#a5a5a5;
  width: 6.6rem;
  margin: 0 auto;
  margin-top: 0.8rem;
}
.text_div div{
  display: flex;
  margin: 0.05rem 0;
}
.input_div input{
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 0.3rem;
  outline: none;
}
.share_bg{position:fixed;left:0;top:0;width:100%;height:100%;z-index: 120;background: rgba(0,0,0,0.7); }
.share_person{
  width: 2.2rem;
  position: absolute;
  z-index: 40;
  right:0.45rem;
  top: 0.3rem;
}
.share_finger{width: 0.6rem;position: absolute;z-index: 30;right: 0.3rem;top: 0.6rem;}
.share_finger {  
   animation: myfirst 0.2s infinite;  
}          
@keyframes myfirst {  
   0% {  
       transform: translate(0px, 0px);  
   }  
   50% {  
       transform: translate(0px, -16px);  
   }  
   100% {  
       transform: translate(0px, 0px);  
   }  
}  
/*确认弹出框*/
.isSuccess_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
}
.isSuccess{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    min-height: 3.2rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
}
.isSuccess .title{
    padding-top: 0.3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
}
.isSuccess p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    color:#333;
}
.isSuccess p.min{
    margin-top: 0;
    font-size: 0.28rem;
    padding: 0 0.5rem;
    color: #999;
}
.isSuccess p span{
    font-size: 0.26rem;
    margin-top: 0.1rem;
    color:#9c9c9c;
}
.isSuccess .input_view{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1rem;
    width: 100%;
    font-size: 0;
    border-top:1px solid #ececec;
}
.isSuccess .input_view div{
    font-size: 0.36rem;
    text-align: center;
    display: inline-block;
    line-height: 1rem;
    width:50%;
}
.isSuccess .input_view .line{
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background: #ececec;
}
.isSuccess .input_view .right{
    color:#ee3f44;
}
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #56beb7;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
  .activity_botton{margin-bottom: 34px;z-index: 9999999999;}
}

</style>
