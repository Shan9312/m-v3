<template v-cloak>
  <div class="g-doc c-F5F5F5">
    <div class="m-setting" @click="jump()">
      <div class="ui-cells"> 
        <div class="ui-cell clearfix">
          <div class="ui-cell-primary fl">启用支付密码</div>
          <i class="with_arrow fr"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http'
  import api from '@/assets/js/api.js';
  export default {
    name: "startusePassword",
    data(){
      return{   
       type :this.$route.params.type,
        
      }
    },
    mounted(){
    },
    methods: { 
      // 启用支付密码--身份验证
      jump(){
        if(this.type==0){ 
          dooolyAPP.gotoJumpVue(this.$router,'/verification/0/0');
        }else if(this.type==1){ 
          dooolyAPP.gotoJumpVue(this.$router,'/verification/0/1');
        }
      }
    },
    created(){
      dooolyAPP.initTitle('密码设置')
    },
  }

</script>
  <style lang="scss" scoped>
    @import "../../../assets/css/components/cells";
    [v-cloak] {
      display: none;
    }
    .m-setting{
      margin-top: 0.2rem;
    }
    .g-doc {
      position: fixed;
      left:0;
      top:0;
      background:#f5f5f5;
      width:100%;
      height:100%;
    }
    .c-999{
        color: #999;
    }

    .with_arrow{
        font-size: 0.1rem;
    }
    footer.signOut{
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
    .ui-cells{
      border-bottom: none;
      background: none;
    }
    .ui-cell{
      border-bottom: none;
      background: #fff;
      margin: 0.2rem 0;
      padding: 0 0.3rem;
    }
    .ui-cell:nth-child(1){
      margin-top: 0;
    }
    .second-one{
      border-bottom: 1px solid #ECECEC;
      box-shadow: inset 0 0 0 0 #ECECEC;
    }
    .ui-cell:nth-child(3){
      margin-top: 0;
      margin-top: -0.2rem;
    }
    .mint-switch-input:checked + .mint-switch-core {
      border-color: #4CD964;
      background-color: #4CD964;
    }
    </style>
