<template>
  <div class="g-doc c-F5F5F5">
    <div class="m-setting">
      <div class="ui-cells">
        <div class="boxItem_border"></div>
        <div class="ui-cell clearfix" v-if="wechatisShow">
          <div class="ui-cell-primary fl">消息推送</div>
          <mt-switch class="fr" v-model="bindPassword"></mt-switch>
        </div>
        <div class="boxItem_border" v-if="wechatisShow"></div>
        <div class="ui-cell clearfix second-one" data-baidu-stats="我的-系统设置-密码设置" @click="diffLink">
          <div class="ui-cell-primary fl">密码设置</div>
          <i class="with_arrow fr"></i>
        </div>
        <div class="ui-cell clearfix second-two" @click="link(2)">
          <i class="with_arrow fr"></i>
          <span class="c-999 fr">{{(isPayPassword == 2? '支付密码验证' : '短信动态验证')}}</span>
          <div class="ui-cell-primary fl">支付验证</div>
        </div>
        <div class="boxItem_border" v-if="wechatisShow"></div>
        <div class="ui-cell clearfix" v-if="wechatisShow">
          <div class="ui-cell-primary fl">清除缓存</div>
          <span class="c-999 fr">2.55MB</span>
        </div>
        <div class="boxItem_border"></div>
      </div>
        <div class="ui-cell clearfix aboutDl"  @click="link(3)">
          <div class="ui-cell-primary fl">关于兜礼</div>
          <span class="c-999 fr" v-if="wechatisShow">当前版本<span>{{versionName}}</span></span>
        </div>
      <footer class="f-tac signOut" data-baidu-stats="我的-系统设置-退出登录" v-show="dahuaShow" @click='quitBtn()'>退出账号</footer>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http'
  import api from '@/assets/js/api.js';
  export default {
    name: "setting",
    data() {
      return {
        numbers: '',
        bindPassword: false,
        wechatisShow: false, //微信和其他端
        versionName: localStorage.versionName,
        isSetPayPassword: '',
        isPayPassword: localStorage.isPayPassword,
        dahuaShow: (localStorage.thirdUserToken && this.$browserName != 'WeChat' ? false : true),
      }
    },
    // 退出账号
    mounted() {
      if (this.$browserName == "WebKit" || this.$browserName == "Chrome WebView") { // 判断iPhone|iPad|iPod|iOS
        this.wechatisShow = true;
      } else {
        this.wechatisShow = false; //测试改成true  记得改回
      }
    },
    methods: {
      link(number) {
        if (number == 2) {
          dooolyAPP.gotoJumpVue(this.$router, '/settingValidation');
          this.$baiduStats('我的-系统设置-支付验证');
        } else if (number == 3) {
          dooolyAPP.gotoJumpVue(this.$router, '/aboutDoooly');
          this.$baiduStats('我的-系统设置-关于兜礼');
        }
      },
      diffLink() {
        http({
          method: 'post',
          url: api.issetPassword,
          data: {
            userId: localStorage.userId,
          }
        }).then((res) => {
          if (res.data.code == 1000) {
            this.data = res.data.data;
            this.isSetPayPassword = res.data.data.isSetPayPassword;
            localStorage.isSetPayPassword = this.isSetPayPassword;
          }
          if (this.isSetPayPassword === 0) { // 未设置过跳转启用密码设置
            dooolyAPP.gotoJumpVue(this.$router, '/startusePassword/0');
          } else if (this.isSetPayPassword === 1) { // 设置过跳转密码设置
            dooolyAPP.gotoJumpVue(this.$router, '/settingPassword');
          }
        })
        this.$baiduStats('我的-系统设置-密码设置');
      },
      // 退出登录
      quitBtn() {
        http({
          method: 'post',
          url: api.logout,
          headers: {
            appSource: 'H5', //渠道
            deviceId: this.$allConfig.headers.deviceId, //设备id
            userId: localStorage.userId,
          }
        }).then((res) => {
          let code = res.data.code;
          if (code == "1000") {
            // 清除cookie中的userId
            this.$cookies.set('userId', null);
            localStorage.userId = null;
            dooolyAPP.logOut();
          }
        });
        this.$baiduStats('我的-系统设置-退出登录');
      }
    },
    created() {
      dooolyAPP.initTitle('系统设置')
    },
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/css/components/cells";

  .g-doc {
    position: fixed;
    left: 0;
    top: 0;
    background: #f5f5f5;
    width: 100%;
    height: 100%;
  }

  .c-999 {
    color: #999;
  }

  .with_arrow {
    font-size: 0.1rem;
  }

  footer.signOut {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.32rem;
    color: #FFF;
    background: #EE3F44;
  }

  .ui-cells {
    border-bottom: none;
    margin-top: 0.2rem;
  }

  .ui-cell {
    background: #fff;
    margin: 0;
    margin: 0 0.3rem;
  }

  .boxItem_border {
    height: 0;
  }

  .second-one {
    border-bottom: 1px solid #ECECEC;
    box-shadow: inset 0 0 0 0 #ECECEC;
  }

  .second-two {
    border-bottom: none;
  }

  .aboutDl {
    margin: 0;
    padding: 0 0.3rem;
    width: 100%;
  }

</style>
