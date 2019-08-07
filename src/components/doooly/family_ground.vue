<template>
  <div>
    <div class="app_con">
      <header>
        <div class="header_img">
          <div class="buis_logo">
            <img src="../../assets/images/lighten_business/invite_bg.png" />
          </div>
          <div class="logo_bg">
            <div class="header_logo">
              <img v-if="wechatheadImgurl != ''" :src="wechatheadImgurl" />
              <img
                v-else
                src="../../assets/images/lighten_business/favicon.png"
              />
            </div>
          </div>
          <div class="div_describe">
            <div class="desc_name">{{ wechatBinding_name }}</div>
            <div class="desc_infor">你的亲友发送了一条邀请给你</div>
            <div class="desc_price">一起成为{{ member }}会员享受折扣之旅</div>
            <!-- 兜礼会员 -->
          </div>
        </div>
      </header>
      <section class="main_div" v-show="douli_div">
        <div class="title">以下商户都可以享受兜礼专享价</div>
        <div class="line">
          <img src="../../assets/images/lighten_business/line.png" />
        </div>
        <ul class="img_list clearfix">
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/weipinhui.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/darunfa.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/didi.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/belle.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/laiyifen.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/luosen.png" />
            </a>
          </li>
        </ul>
      </section>
      <!-- 兜礼会员 -->

      <section class="main_div" v-show="e_div">
        <div class="title">以下商户都可以享受兜礼专享价</div>
        <div class="line">
          <img src="../../assets/images/lighten_business/line.png" />
        </div>
        <ul class="img_list clearfix">
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/weipinhui.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img
                src="../../assets/images/lighten_business/diandianyangche.png"
              />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/baobei.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/yiguo.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/shoujia.png" />
            </a>
          </li>
          <li>
            <a href="javascript:void(0);">
              <img src="../../assets/images/lighten_business/zhewo.png" />
            </a>
          </li>
        </ul>
      </section>
      <!-- 钢城e家 -->
      <section class="main_div" v-show="douli_div">
        <div class="title">激活流程</div>
        <div class="line">
          <img src="../../assets/images/lighten_business/line.png" />
        </div>
        <div class="progress">
          <p v-show="code_img">1. 识别图中二维码关注“{{ member }}”公众号</p>
          <p v-show="code_app">1. 识别图中二维码下载“兜礼”APP</p>
          <p>2. 使用手机号登录，即可成为{{ member }}，享受福利</p>
        </div>
        <div class="dimension_div">
          <div class="dimensionCode">
            <img
              src="../../assets/images/lighten_business/dimensionCode.png"
              v-show="code_img"
            />
            <img
              src="../../assets/images/lighten_business/app.png"
              v-show="code_app"
            />
            <img
              src="../../assets/images/lighten_business/wiscowechat.jpg"
              v-show="code_wiscowechat"
            />
          </div>
          <div class="top" v-show="code_img">
            <span>长按识别图中二维码关注{{ member }}公众号</span>
          </div>
          <div class="top" v-show="code_app">
            <span>长按识别图中二维码下载兜礼APP</span>
          </div>
        </div>
      </section>
      <!-- 兜礼会员 -->
      <section class="main_div" v-show="e_div">
        <div class="title">激活流程</div>
        <div class="line">
          <img src="../../assets/images/lighten_business/line.png" />
        </div>
        <div class="progress">
          <p>1. 识别图中二维码关注“{{ member }}”公众号</p>
          <p>2. 使用手机号登录，即可成为{{ member }}享受福利</p>
        </div>
        <div class="dimension_div">
          <div class="dimensionCode">
            <img src="../../assets/images/lighten_business/e_jia.png" />
          </div>
          <div class="top">
            <span>长按识别图中二维码关注{{ member }}公众号</span>
          </div>
        </div>
      </section>
      <!-- 钢城e家 -->
    </div>
  </div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import {
  shareWithFriendsWX,
  shareWithFriendsAPP
} from '@/assets/js/wechatShare2.js';

export default {
  name: 'family-guound',
  data () {
    return {
      wechatheadImgurl: '',
      wechatBinding_name: '',
      channel: this.$route.query.channel,
      userId: this.$route.query.userId,
      code_img: true,
      code_app: false,
      code_wiscowechat: false,
      douli_div: true,
      e_div: false,
      member: memberFrom
    }
    },
  methods: {
    loadPageData () {
      http({
        // 分享落地接口
        method: 'post',
        url: api.InviteInfoRestFul,
        data: {
          userId: this.userId
        }
      }).then(res => {
        if (res.data.code == '1000') {
          const pat = /(\d{3})\d*(\d{4})/
            this.wechatheadImgurl = res.data.wechatBinding.headImgurl
            this.wechatBinding_name = res.data.wechatBinding.name.replace(
            pat,
            '$1****$2'
          )
          } else {
          this.$toast('获取失败')
          }
      })
      }
  },
  created () {
    dooolyAPP.initTitle('邀请亲友')
      if (this.channel == 'wechat') {
      // 兜礼微信公众号
      this.code_img = true
        this.douli_div = true
        this.e_div = false
      } else if (this.channel == 'wiscoapp') {
      // 武钢app
      this.e_div = true
        this.code_wiscowechat = true
        this.douli_div = false //暂时没有不武钢的APP显示关注公众账号图片
      } else if (this.channel == 'wiscowechat') {
      // 钢城e家公众号
      this.e_div = true
        this.code_wiscowechat = true
        this.douli_div = false
      } else if (this.channel == 'h5') {
      // H5
    } else if (this.channel == 'app') {
      // 兜礼app
      this.code_app = true
        this.code_img = false
      } else {
    }
    this.loadPageData()
    }
}
</script>

<style scoped>
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
    margin-top: 0.41rem;
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
    width: 100%;
  }

  .fill_info {
    margin-top: 0.4rem;
  }

  .input_div {
    margin: 0 auto;
    border: 1px solid #c9c9c9;
    border-radius: 0.1rem;
    height: 0.88rem;
    width: 6rem;
    padding-bottom: 0.02rem;
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
    padding-bottom: 0.38rem;
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
    font-size: 0;
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
    margin-bottom: 0.13rem;
  }

  .progress p span {
    color: #ee3f44;
  }

  .progress p:last-child {
    margin-bottom: 0;
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

  .icon_tel {
    width: 0.42rem;
    position: absolute;
    z-index: 100;
    float: right;
    right: 12%;
    height: 0.52rem;
    display: inline-block;
    line-height: 0.42rem;
    margin-top: 0.1rem;
  }
  .getTel {
    width: 4rem;
    background: #fff;
    font-size: 0.3rem;
    display: block;
    text-align: left;
    margin: 0.1rem 0.2rem;
    position: absolute;
    z-index: 30;
    overflow: hidden;
  }
  .getTel .tel {
    font-size: 0.36rem;
  }
  .getTel .tel_name {
    font-size: 0.2rem;
    color: #808080;
  }

  /* 家属邀请落地页  */
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
    width: 100%;
  }
  .buis_title {
    font-size: 0.36rem;
    color: #fff;
    text-align: center;
  }
  .header_logo {
    text-align: center;
    position: absolute;
    height: 1.5rem;
    width: 1.5rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: -1.1rem;
  }
  .header_logo img {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    border: 0.07rem solid #fff;
  }
  .logo_bg {
    height: 0.6rem;
    position: relative;
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
    color: #999999;
    margin-top: 0.2rem;
    font-size: 0.24rem;
  }
  .div_describe .desc_price {
    color: #999999;
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
    padding-bottom: 0.38rem;
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
    font-size: 0;
  }
  .line img {
    width: 0.83rem;
  }
  /* 商户列表  */
  .img_list {
    margin: 0 auto;
    padding: 0 0.3rem;
    display: inline-block;
    font-size: 0;
    margin-top: 0.14rem;
  }
  .img_list li {
    display: inline-block;
    width: 1.8rem;
    margin-top: 0.3rem;
    margin-right: 0.3rem;
    height: 1.8rem;
    font-size: 0;
  }
  .img_list li a {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .img_list li a img {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 0.1rem;
  }
  .img_list li:nth-child(3n) {
    margin-right: 0;
  }
  /*激活流程*/
  .progress {
    margin-top: 0.41rem;
    padding: 0 0.3rem;
  }
  .progress p {
    font-size: 0.24rem;
    color: #999999;
    margin-bottom: 0.13rem;
  }
  .progress p:last-child {
    margin-bottom: 0;
  }
  /*二维码*/
  .dimension_div {
    width: 100%;
    margin-top: 0.5rem;
  }
  .dimensionCode {
    width: 2.6rem;
    margin: 0 auto;
  }
  .dimensionCode img {
    width: 100%;
  }
  .top {
    text-align: center;
  }
  .top span {
    font-size: 0.2rem;
    color: #999999;
    white-space: nowrap;
  }
  .app_con {
    padding-bottom: 0.28rem;
  }
</style>
