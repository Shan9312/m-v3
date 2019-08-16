<template>
  <div class='app_alr_bg' v-if="dialogState" @click="appAlrClose()">
    <div class='app_alr_lighten'>
      <img class='app_alr_lighten_banner' :src='logo' >
      <section class='app_alr_lighten_section'>
        <div class='app_alr_lighten_title'>正在为你跳转{{company}}</div>
        <p class='app_alr_lighten_p'>您即将浏览{{company}}网页，请使用您的兜礼会员对应的手机号注册并登录购买，即可享受兜礼会员折扣。</p>
        <input @click="appLink(detailUrl,openOneNnumber,businessId)" class='single_close' type='button' value="我知道了">
      </section>
    </div>
  </div>
</template>
<script>
  import api from '@/assets/js/api.js';
  import http from '@/http/http.js';
    export default {
      name: "dialogBox",
      data(){
        return{
          resultUrl:'',
        }
      },
      props:['detailUrl','company','logo','activityType','dialogState','openOneNnumber','businessId'],
      methods:{
        appAlrClose:function () {
          this.$emit("chaildChangeState",false);

        },

    appLink(link,openOneNnumber,businessId){
      if(openOneNnumber==1){
        this.getTargetUrl(link,businessId).then((link)=> {
          link = this.resultUrl;
         dooolyAPP.gotoJumpJq(this.$router,link);
        })
      }
      else{
        dooolyAPP.gotoJumpJq(this.$router,link);
      }
    },

    async getTargetUrl(link,businessId) {
        try{
          var res = await http({
            method: 'get',
            url: api.getTargetUrl+'?businessId='+businessId+'&targetUrl='+link,
          });
          if(res.data.code == 1000){
            this.resultUrl = res.data.resultUrl;
          }
          if(res.data.code == 1001){
            this.$toast("获取1号通跳转链接出错,请稍候重试!");
          }
        }catch (e){
          
        }
      return this.resultUrl;
    }


      },
      mounted(){
      }
    }
</script>

<style scoped>
  .app_alr_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.4);
    z-index: 9999;
  }
  .app_alr_lighten{
    position: fixed;
    width: 6rem;
    left: 0;
    right: 0;
    margin: auto;
    top: 20%;
    background: #ffffff;
    border-radius: 0.2rem;
    z-index: 10000;
    font-size: 0;
    text-align: center;
    font-family: '微软雅黑';
  }
  .app_alr_lighten_banner{
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.6rem 0 0.4rem;
    border-radius: 50%;
  }
  .app_alr_lighten_section{
    background: #f8f8f8 url(/src/assets/images/alr_arc.jpg) no-repeat 0 0;
    background-size: 100%;
    border-bottom-left-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
  }
  .app_alr_lighten_title{
    font-size: 0.36rem;
    color: #333;
    line-height: 0.36rem;
    text-align: center;
    padding-top: 0.56rem;
    margin: 0 0 0.6rem 0;
  }
  .app_alr_lighten_p{
    padding: 0 0.54rem;
    font-size: 0.28rem;
    line-height: 0.38rem;
    color: #666;
    text-align: left;
  }
  .single_close{
    margin: 0.6rem 0 0.7rem 0;
    width: 4.28rem;
    line-height: 0.7rem;
    color: #fff;
    border-radius: 1rem;
    font-size:0.28rem;
    background: linear-gradient(to right,#ee603f, #ee3f44);
    background: -webkit-linear-gradient(left,#ee603f, #ee3f44);
    background: -o-linear-gradient(right, #ee603f, #ee3f44);
    background: -moz-linear-gradient(right, #ee603f, #ee3f44);
  }
  .srollhidden{
    height:100%;
    overflow: hidden;
  }
</style>
