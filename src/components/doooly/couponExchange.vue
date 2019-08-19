<template>
  <div>
    <header>
      <div class="clearfix">
        <div class="fr">
          <span class="logo"><img :src="couponDetail.adBusiness.logo" :onerror="defaultImg"></span><br>
          <span class="company">{{couponDetail.coupon.businessName}}</span>
        </div>
        <span class="coupon">{{couponDetail.coupon.productName}}</span><br>
        <span class="price" v-if="couponDetail.coupon.couponValue > 0 && couponDetail.coupon.kind==1">
          <b>{{couponDetail.coupon.couponValue}}</b><span v-if="couponDetail.coupon.kind==0">元</span><span  v-else-if="couponDetail.coupon.kind==1">折</span>
        </span>
        <br>
        <span class="time">有效期：{{beginDate}}—{{endDate}}</span>
      </div>
      <span class="button" @click="exchangeCard()">立即兑换</span>
    </header>
    <section>
      <ul>
        <li class="clearfix explain">
          <span>兑换说明</span>
          <div class="fr">
            <!--<span class="icon-right"></span>-->
            <i class="icon iconfont" @click="changeExplainState" v-html="iconNum1"></i>
          </div>
          <p v-html="couponDetail.coupon.wechatConvertMethod" v-if="explainState" class="newExplain">
          </p>
        </li>
        <li v-if="couponDetail.coupon.businessAppUrl" class="app_lod clearfix">
          <a :href="couponDetail.coupon.businessAppUrl">
            <span>下载APP</span>
            <div class="fr">
              <!--<span class="red">领万元现金大红包</span>-->
              <i class="icon iconfont">&#xe804;</i>
            </div>
          </a>
        </li>
        <li v-if="couponDetail.coupon.businessActivityUrl" class="clearfix">
          <a :href="couponDetail.coupon.businessActivityUrl">
            <span>商户活动</span>
            <div class="fr">
              <!--<span class="icon-right"></span>-->
              <i class="icon iconfont">&#xe804;</i>
            </div>
          </a>
        </li>
        <li v-if="couponDetail.adBusiness.dealType==1" class="clearfix" @click="businessDetail(couponDetail.adBusiness.id,couponDetail.adBusiness.company)">
            <span>适用门店(线下)</span>
            <div class="fr">
              <i class="icon iconfont">&#xe804;</i>
            </div>
        </li>
      </ul>
    </section>
    <div v-if="popupVisible" class="popup_bg">
      <div v-if="cardPopupVisible" class="cardPopup">
        <div class="title"><span>兑换礼券</span></div>
        <div class="coupon_div">
          <div class="coupon">
                    <span class="left">
                        <span>兑换码</span><br>
                        <span>密码</span>
                    </span>
            <span class="right">
                        <span>{{cardCouponCode}}</span><br>
                        <span>{{cardPSW}}</span>
                    </span>
          </div>
          <div class="bottom_btn">
            <div v-if="couponDetail.adBusiness.dealType==0">
              <input @click="cloe()" type="button" value="关闭">
              <input class="last_child" @click="link(couponDetail.coupon.businessOnlineUrl)" type="button" value="去使用">
            </div>
            <div v-else>
              <input class="confirm" @click="cloe()" type="button" value="确定">
            </div>
          </div>
        </div>
      </div>
      <div v-if="usualPopupVisible" class="usualPopup">
        <div class="close" @click="cloe()"></div>
        <div class="title"><span>兑换礼券</span></div>
        <div v-if="couponDetail.couponId !== 1072 && couponDetail.couponId !== 1073 && couponDetail.couponId !== 1074" class="coupon">
          <span class="coupon_title">兑换码</span><span id="copyCode" class="detail">{{couponDetail.couponCode}}</span>
          <div class="bottom_btn">
            <div v-if="couponDetail.adBusiness.dealType == 0">
              <input class="confirm copy_btn" data-clipboard-action="copy" data-clipboard-target="#copyCode"
                     type="button" :value="couponDetail.coupon.businessOnlineUrl ? '复制去使用' : '复制'" @click="copyBtn()">
            </div>
            <div v-else>
              <input class="confirm" @click="cloe()" type="button" value="确定">
            </div>
          </div>
        </div>
        <div v-else class="coupon">
          <p class="tips-msg">
            您的门票将于出游前2日左右通过短信形式发出
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
    export default {
      name: "couponExchange",
      data() {
        return {
          logo: "",
          businessName: "",
          productName: "",
          couponValue: "",
          kind: "",
          beginDate: "",
          endDate: "",
          wechatConvertMethod: "",
          businessAppUrl: "",
          businessOnlineUrl: "",
          dealType: "",
          couponCode: "123456789abc",
          popupVisible: false,
          cardPopupVisible: false,
          usualPopupVisible: false,
          url: "",
          company: "",
          miniLogo: "",
          id: "",
          cardCouponCode: "",
          cardPSW: "",
          couponDetail:{
            adBusiness:{},
            coupon:{},
          },
          explainState:true,
          iconNum1:'&#xe600;',
          defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"'
        }
      },
      methods: {
        link() {
          if (!this.couponDetail.coupon.businessOnlineUrl) return;
          window.location.href=this.couponDetail.coupon.businessOnlineUrl;
          this.$baiduStats('我的福利-点击去使用-' + this.couponDetail.coupon.productName);
        },
        businessDetail: function (id, company) {
          dooolyAPP.openMapView(this.$router,company,id);
        },
        cloe: function () {
          this.popupVisible = false;
          this.cardPopupVisible = false;
          this.usualPopupVisible = false;
        },
        exchangeCard: function () {
          this.popupVisible = true;
          let strs = new Array();
          strs = this.couponDetail.couponCode.split("@");
          if (strs.length == 2) {
            this.cardCouponCode = strs[0];
            this.cardPSW = strs[1];
            this.cardPopupVisible = true;
          }else {
            this.usualPopupVisible = true;
          }
          this.$baiduStats('我的福利-点击立即兑换-' + this.couponDetail.coupon.productName);
        },
        //复制到剪贴板
        copyBtn () {
          let clipboard = new Clipboard('.copy_btn');
          clipboard.on('success', e => {
            this.$toast("兑换码复制成功");
            let t = setTimeout(() => {
              this.link();
              clearTimeout(t);
            }, 1000);
            // 释放内存
            clipboard.destroy()
          });
          clipboard.on('error', e => {
            // 不支持复制
            let r = confirm("是否已经手动复制完成？")
            if(r){
              this.link();
            }
            clipboard.destroy()
          });
          this.$baiduStats('我的福利-点击复制去使用-' + this.couponDetail.coupon.productName);
        },
        loadPageData() {
          http({
            method: 'get',
            url: api.to_useRestful + "?actConnId=" + this.$route.params.actConnId
          }).then((res) => {
            this.couponDetail=res.data.actConn;
            this.beginDate=res.data.beginDate;
            this.endDate=res.data.endDate;
          })
        },
        changeExplainState(){
          this.explainState=!this.explainState;
          if(this.iconNum1=="&#xe600;"){
            this.iconNum1="&#xe804;"
          }
          else if(this.iconNum1=="&#xe804;"){
            this.iconNum1="&#xe600;"
          }
        }
      },
      created() {
        this.loadPageData();
        dooolyAPP.initTitle('我的福利');
      },
    }
</script>
<style>
  img{
    width:100%;
  }
</style>
<style scoped>
  .tips-msg{
    padding: 1rem 1rem 0rem;
    font-size: 0.26rem;
    text-align: center;
  }
  @font-face {
    font-family: 'iconfont';  /* project id 402124 */
    src: url('//at.alicdn.com/t/font_402124_r3z8okj55855ewmi.eot');
    src: url('//at.alicdn.com/t/font_402124_r3z8okj55855ewmi.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_402124_r3z8okj55855ewmi.woff') format('woff'),
    url('//at.alicdn.com/t/font_402124_r3z8okj55855ewmi.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_402124_r3z8okj55855ewmi.svg#iconfont') format('svg');
  }

  .iconfont {
    font-family:"iconfont" !important;
    font-size:0.32rem;
    color:#999;
    margin-top: 0.1rem;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
.newExplain{
  width: 100%;
  height: auto;
}
  .newExplain img{
    width: 100% !important;
  }
  header{
    background: #fff url(../../assets/images/coupon/to_use_banner.png) center top no-repeat;
    background-size: 100% auto;
    min-height: 4.6rem;
    font-size: 0;
    text-align: center;
    padding-top: 0.32rem;
  }
  header div.clearfix{
    width: 6.46rem;
    height: 2.4rem;
    padding-left: 0.4rem;
    border-radius: 0.1rem;
    background: #fff;
    margin:0 auto;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    text-align: left;
  }
  header span{
    display: inline-block;
    margin: 0 auto;
    line-height: 100%;
  }
  header span.logo{
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.4rem 0.4rem 0 0;
    font-size: 0;
  }
  header span.logo img{
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }
  header span.company{
    width: 1.2rem;
    margin: 0.16rem 0.4rem 0 0;
    font-size: 0.28rem;
    color: #666;
    text-align: center;
  }
  header span.coupon{
    padding-top: 0.6rem;
    font-size: 0.36rem;
    font-weight: bold;
    color: #333;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    width: 4rem;
  }
  header span.price{
    margin-top: 0.24rem;
    font-size: 0.36rem;
    color: #f66151;
  }
  header span.price b{
    font-weight: normal;
  }
  header span.time{
    margin-top: 0.24rem;
    font-size: 0.28rem;
    color: #666;
  }
  header span.button{
    margin-top: 0.5rem;
    width: 6.82rem;
    height: 1rem;
    line-height: 1rem;
    background: #ee3f44;
    color: #fff;
    font-size: 0.32rem;
    text-align: center;
    border-radius: 2rem;
  }

  section{
    margin-top: 0.2rem;
    background: #fff;
  }
  section ul li{
    line-height: 0.98rem;
    font-size: 0.3rem;
    /*text-align: both;*/
    margin: 0 0.3rem;
    border-bottom:1px solid #ececec;
    overflow: hidden;
  }
  section ul li.explain{
    overflow: initial;
  }
  section ul li.explain .fr{
    line-height: 100%;
    margin-top: 0.3rem;
  }
  section ul li .rotot{
    transform: rotate(-90deg);
  }
  section ul li a{
    display: block;
    text-decoration: none;
    color: #000;
  }
  section ul li:last-child{
    border: 0;
  }
  section ul li .fr .red{
    color: #999;
    margin-right: 0.2rem;
    font-size: 0.24rem;
  }
  section ul li .fr .icon-down{
    font-size: 0.1rem;
  }
  section ul li p{
    font-size: 0.28rem;
    line-height: 0.34rem;
    color: #999;
    padding: 0.28rem 0;
    border-top: 1px solid #ececec;
    background-size: 0.2rem 0.2rem;
  }

  section ul li p img{
    width: 100%;
  }
  .popup_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.4);
    z-index: 99;
  }
  .title{
    width:100%;
    font-size: 0.36rem;
    color: #ffffff;
    height: 1.16rem;
    line-height: 1.16rem;
    background: url("../../assets/images/coupon/title_bg.png") no-repeat top left;
    background-size: 100% 100%;
    text-align: center;
  }
  .title span{
    line-height: 1.16rem;
  }
  /*卡密弹出框开始*/
  .popup_bg .cardPopup{
    position: fixed;
    width: 6rem;
    height: 4.76rem;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;
    font-size: 0;
    text-align: center;
  }
  .popup_bg .cardPopup span{
    display: inline-block;
  }
  .popup_bg .cardPopup .coupon_div{
    width: 100%;
    background-color: #fff;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    background: url("../../assets/images/coupon/card_bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .popup_bg .cardPopup .coupon_div .coupon{padding-top: 0.7rem}
  .popup_bg .cardPopup .coupon_div .coupon .left{line-height: 0.6rem; text-align: right}
  .popup_bg .cardPopup .coupon_div .coupon .left span{line-height: 0.6rem; font-size: 0.28rem; color: #999999}
  .popup_bg .cardPopup .coupon_div .coupon .left span:last-child{margin-top: 0.3rem}
  .popup_bg .cardPopup .coupon_div .coupon .right{line-height: 0.6rem; text-align: left; margin-left: 0.2rem}
  .popup_bg .cardPopup .coupon_div .coupon .right span{padding:0 0.3rem;line-height: 0.6rem; font-size: 0.32rem; color: #333333; background-color: #f5f5f5;border-radius: 0.1rem}
  .popup_bg .cardPopup .coupon_div .coupon .right span:last-child{margin-top: 0.3rem}
  .popup_bg .cardPopup .coupon_div .bottom_btn{
    margin-top: 0.4rem;
    text-align: center;
    border-top: solid 0.01rem #ececec;}
  .popup_bg .cardPopup input{
    width: 2.9rem;
    line-height: 0.99rem;
    text-align: center;
    background: transparent;
    color: #000;
    font-size: 0.36rem;
  }
  .popup_bg .cardPopup .last_child{
    color: #ee3f44;
    border-left: solid 0.01rem #ececec;
  }
  .popup_bg .cardPopup .confirm{
    color: #ee3f44;
  }
  /*卡密弹出框结束*/
  /*卡券弹出框开始*/
  .popup_bg .usualPopup{
    position: fixed;
    width: 6rem;
    height: 3.6rem;
    top: 30%;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 100;
    font-size: 0;
    text-align: center;
  }
  .popup_bg .usualPopup .close{
    position: absolute;
    right: -0.6rem;
    top: -0.6rem;
    background: rgba(0,0,0,0) url(../../assets/images/coupon/closeNew.png) no-repeat 0.25rem 0.75rem;;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 100%;
    background-size: 0.2rem;
  }
  .popup_bg .usualPopup span{
    display: inline-block;
  }
  .popup_bg .usualPopup .coupon{
    width: 100%;
    background-color: #fff;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    height:2.9rem;
    background: url("../../assets/images/coupon/card_bg_short.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
  }
  .popup_bg .usualPopup .coupon span{
    line-height: 0.6rem;
    color: #333;
    font-size: 0.32rem;
    margin-top: 0.7rem;
  }
  .popup_bg .usualPopup .coupon .detail{margin-left: 0.2rem; padding:0 0.3rem; background-color: #f5f5f5; border-radius: 0.1rem}
  .popup_bg .usualPopup .coupon .coupon_title{font-size: 0.28rem; color: #999}
  .popup_bg .usualPopup .coupon .bottom_btn{
    margin-top: 0.6rem;
    text-align: center;
    border-top: solid 0.01rem #ececec;
  }
  .popup_bg .usualPopup input{
    width: 2.9rem;
    line-height: 0.99rem;
    text-align: center;
    background: transparent;
    color: #000;
    font-size: 0.36rem;
  }
  .popup_bg .usualPopup .last_child{
    color: #ee3f44;
    border-left: solid 0.01rem #ececec;
  }
  .popup_bg .usualPopup .confirm{
    color: #ee3f44;
  }
  /*卡券弹出框结束*/
  img{width: 100%;}
</style>
