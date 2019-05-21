<template>
  <div>
<div class="app_con">
  <div>
    <div class="header_img">
      <div class="buis_logo">
        <img src="../../../assets/images/lighten_business/shop_assistant_invite.jpg"/>
      </div>
    </div>
  </div>
  <div class="fill_info">
    <div class="input_div">
      <input data-role="none" id="telephone" type="tel" v-model="mobile_tel" minlength="11" maxlength="11" class="input_text" placeholder="请输入受邀人手机号"/>
    </div>
    <div class="btn_div">
      <button class="btn btn-primary btn-block" data-baidu-stats="首页-邀请亲友-立即邀请成为体验官" @click="add_btn()">立即邀请成为体验官</button>
    </div>
  </div>
  <div class="main_div">
    <div class="title">邀请规则</div>
    <div class="line"><img src="../../../assets/images/lighten_business/line.png"></div>
    <div class="progress">
      <p>1. 每天仅限邀请1人成为兜礼体验官</p>
      <p>2. 填写受邀者手机号码，为受邀者开通兜礼体验官权限</p>
      <p>3. 受邀者微信扫描二维码，使用手机号登陆即可享受兜礼体验官福利</p>
      <p>4. 本次活动最终解释权归兜礼所有</p>
    </div>
  </div>
  <div class="yard_div">
    <img :src="qrCodeUrl"/>
    <p>扫描付款码&nbsp;&nbsp;&nbsp;验证付款</p>
  </div>
  <section class="main_div" v-show="isMain_none">
    <div class="title">邀请记录</div>
    <div class="line"><img src="../../../assets/images/lighten_business/line.png"></div>

    <div class="div_ulfamily">
      <ul>
        <li v-for="(item,index) in inviteeList" :key="index" class="clearfix">
          <div class="head">
            <img v-if="item.headImgurl" :src="item.headImgurl"/>
            <img v-if="!item.headImgurl&&item.isActive == 2"
                 src="../../../assets/images/lighten_business/favicon.png"/>
            <img src="../../../assets/images/lighten_business/inviting.png" v-else/>
          </div>
          <div class="lottery_name">
            {{item.name?item.name:'***'}}
          </div>
          <div class="lottery_rule">
            {{item.isActive==2?'邀请成功':'邀请中'}}
          </div>
        </li>
      </ul>
    </div>
  </section>
</div>
    <div class="foooter_bg"></div> 
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfigNew} from '@/assets/js/wechatShare2.js';
  import {checkMobile} from '@/assets/js/verify.js';

  export default {
    name: "shop_assistant_invite_add",
    data() {
      return {
      mobile_tel:"",
      inviteeList:[],
      qrCodeUrl:"",
      isMain_none:true,
      }
    },
    created(){
      initTitle('兜礼体验官','');
      onWechatConfigNew('hideMenuItems');
      this.postShopAssistantInvite();
    },
    mounted:function(){
    },
    methods: {
    postShopAssistantInvite(){
      http({
            method: 'post',
            url: api.shopAssistantInvite,
            notNeedTransfer:true
        }).then((data) => {
            if (data.data.code == '1000') {
              this.inviteeList=data.data.data.inviteeList;
              if(this.inviteeList!=""){
                this.isMain_none=true;
              }else{
                this.isMain_none=false;
              }
              this.qrCodeUrl=data.data.data.qrCodeUrl;
            } else {
              this.$toast(data.msg);
            } 

        });   
    },
    add_btn: function () {
      // this.$baiduStats('首页-邀请亲友-立即邀请成为体验官');
      if (checkMobile(this.mobile_tel)) {
        this.$toast('请输入正确手机号码');
        return false;
      } else {
      http({
            method: 'post',
            url: api.shopAssistantClickInviteButton,
            data:{
              telephone:this.mobile_tel
             },
            notNeedTransfer:true
        }).then((data) => {
            if (data.data.code == '1000') {
              this.$toast("邀请成功!");
            } else if (data.data.code == '1003') {
              this.$toast("该手机已是您的亲友，可直接登录!");
            } else {
              this.$toast(data.data.msg);
            } 

        });
        
      }
    }    
      
    }
  }
</script>

<style scoped>
/* 家属邀请 */
.header_img{ width: 100%; height:auto;}
.buis_logo{overflow: hidden;position: relative;top: 0;}
.buis_logo img{width: 100%}

.fill_info{margin-top:0.4rem}
.input_div{margin:0 auto; border: 1px solid #c9c9c9;border-radius: 0.1rem;height: 0.83rem;width: 6rem;padding-bottom:0.02rem}
.input_text{width: 6rem;height: 0.83rem;background: #fff;font-size: 0.3rem;display: block;outline: none; border-radius: 0.1rem;text-align: center;}

.btn_div{width: 6rem;  margin: 0 auto; margin-top: 0.22rem;}
.btn{display: inline-block;height: 0.82rem;
    padding-top: 0.1rem;
    box-shadow: 0 7px 0 #d8262b;
    margin-bottom: 0;
    font-size: 0.3rem;
    font-weight:400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 0.01rem solid transparent;border-radius: 0.1rem;}
.btn-primary{color: #fff;background-color: #ee3f44;border-color: #ee3f44;}
.btn-block{display: block;width: 100%;}

.div_describe{ text-align: center; color: #333;margin-top: 0.16rem;}
.div_describe .desc_name{font-size: 0.3rem; color: #383838;}
.div_describe .desc_infor{color: #c9c9c9;margin-top: 0.2rem; font-size: 0.24rem;}
.div_describe .desc_price{color: #c9c9c9;margin-top: 0.1rem; font-size: 0.24rem;}

.main_div{width: 6.6rem;margin: 0 auto; margin-top: 0.4rem; border-radius: 0.2rem;background-color: #fff; padding-top: 0.4rem; padding-bottom: 0.38rem}
.title{ text-align: center; color: #333333;font-size: 0.3rem;}
.line{width: 100%; text-align: center; margin-top: 0.21rem;font-size: 0}
.line img{width:0.83rem;}
/*激活流程*/
.progress{margin-top: 0.41rem;padding: 0 0.3rem;}
.progress p{font-size: 0.24rem; color: #999999; margin-bottom: 0.13rem}
.progress p span{color: #ee3f44}
.progress p:last-child{margin-bottom: 0}

.app_con{padding-bottom:0.28rem;background:#f8f8f8;}

.result { display: none; position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 1050;overflow: hidden;-webkit-overflow-scrolling: touch;outline: 0; background-color: rgba(0,0,0,0.75); filter: alpha(opacity=90);}
.model_div{width: 6rem; text-align: center; min-height: 3.5rem; background: #fff; position: absolute;z-index: 1060;border-radius: 0.1rem;top: 15%;left: 50%;margin-left: -3rem;}
#resultTxt{ margin-top: 0.6rem;padding:0 0.3rem;}
#resultTxt1{ margin-top: 0.6rem;padding:0 0.3rem;}
.model_div h1{color: #000;font-size:0.4rem;font-weight: 700;text-align: center;margin: 0.3rem 0 0.2rem 0;}
.model_div p{color: #000;font-size: 0.3rem;margin: 0.3rem 0;}
.result a { position: absolute; right: -0.2rem; top: -0.2rem; width: 0.5rem; height: 0.5rem; text-indent: -1rem; background: url(../../../assets/images/lighten_business/close.png) #fff no-repeat; overflow: hidden;background-size: 100%;border: 3px solid #fff;border-radius: 50%;}
.button_div{margin-top: 0.6rem;}
.share_bg {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(51, 51, 51, 0.8);
      text-align: right;
      display: none
    }

    .share_bg img {
      width: 6.07rem;
    }

    #alr_loading {
      display: none
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

    .yard_div {
      font-size: 0.24rem;
      color: #999;
      text-align: center;
      margin: 0.2rem 0.4rem;
      padding: 0.4rem 0;
      background: #fff;
      border-radius: 0.2rem;
    }

    .yard_div img {
      width:2.8rem;    margin-bottom: 0.2rem;
    }
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #ec3837;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
}

</style>
