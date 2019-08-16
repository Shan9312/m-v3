<template>
  <div class="g-doc c-F5F5F5">
    <div class="m-setting">
      <div class="ui-cells">
        <div class="ui-cell clearfix">
          <div class="ui-cell-primary fl">短信动态验证</div>
          <!-- <mt-switch v-model="value1" @change="changeStatus($event,1)" ></mt-switch> -->
          <div @click="changeStatus()" class="fr">
            <switchlabel :check="value1"></switchlabel>
          </div>
        </div>
        <div class="ui-cell clearfix">
          <div class="ui-cell-primary fl">支付密码验证</div>
          <div @click="changeStatus()" class="fr">
            <switchlabel :check="!value1"></switchlabel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import switchlabel from '@/components/common/switchlabel';

  export default {
    name: "settingValidation",
    components: {
      switchlabel
    },
    data() {
      return {
        value1: (localStorage.isPayPassword != 2 || !localStorage.isPayPassword ? true : false),
        option: 1,
      }
    },
    mounted() {},
    methods: {
      changeStatus() {
        if (this.value1 == true) {
          this.option = 2;
        } else {
          this.option = 1;
        }
        if (!localStorage.isPayPassword) {
          this.$messageBox({
            title: '提示',
            message: '选择支付密码验证，需先设置支付密码',
            confirmButtonText: '立即拨打',
            cancelButtonText: '取消',
            showCancelButton: true
          }).then(action => {
            if (action == 'confirm') {
              dooolyAPP.gotoJumpVue(this.$router, '/startusePassword/1'); //未设置支付密码跳转密码启动
              this.value1 = !this.value1;
            }
          })
        }
        http({
          method: 'post',
          url: api.openPayPassword,
          data: {
            userId: localStorage.userId,
            isPayPassword: this.option,
          }
        }).then((res) => {
          if (res.data.code == 1000) {
            this.value1 = !this.value1;
            dooolyAPP.getPaymentType(this.option);
          } else if (res.data.code == 1001) {
            this.$messageBox({
              title: '提示',
              message: '选择支付密码验证，需先设置支付密码',
              confirmButtonText: '立即设置',
              cancelButtonText: '取消',
              showCancelButton: true
            }).then(action => {
              if (action == 'confirm') {
                dooolyAPP.gotoJumpVue(this.$router, '/startusePassword/1'); //未设置支付密码跳转密码启动
                this.value1 = !this.value1;
              }
            })
          }
        })
      },
    },
    created() {
      dooolyAPP.initTitle('设置支付验证', '')
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../../assets/css/components/cells";

  html,
  body,
  #app,
  .g-doc {
    height: 100%;
  }

  .m-setting {
    margin-top: 0.2rem;
  }

  .c-F5F5F5 {
    background: #F5F5F5;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #F5F5F5;
  }

  .c-999 {
    color: #999;
  }

  .mint-switch-input:checked+.mint-switch-core {
    border-color: #4CD964;
    background-color: #4CD964;
  }

  .view {
    margin-top: 0.17rem;
  }

  .fr {
    line-height: normal;
  }

</style>
