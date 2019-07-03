<template v-cloak>
  <div class="g-doc c-F5F5F5" v-cloak>
    <div class="m-setting">
      <div class="ui-cells">
        <div class="ui-cell clearfix" @click="link(1)">
          <div class="ui-cell-primary fl">修改支付密码</div>
          <i class="with_arrow fr"></i>
        </div>
        <div class="ui-cell clearfix" @click="link(2)">
          <div class="ui-cell-primary fl">忘记支付密码</div>
          <i class="with_arrow fr"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  export default {
    name: "settingPassword",
    data(){
        return{
        numbers: ''
        }
    },
    methods:{
      link(type){
        if(type ==1){
          dooolyAPP.gotoJumpVue.call(this,'/verification/1/3')
        }else{
          dooolyAPP.gotoJumpVue.call(this,'/verification/0/3')
        }
      }
    },
    created(){
      initTitle('密码设置')
    },
    watch:{
        
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

    </style>
