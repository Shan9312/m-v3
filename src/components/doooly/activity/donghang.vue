<template>
  <div>
    <!-- 确认弹出框 -->
    <div class="rule_bg" v-show="rule_show" @touchmove.prevent>
        <div class="rule_tasot">
          <img @click="rule_show = !rule_show" src="../../../assets/images/activity/close2.png">
          <div class="title">活动规则</div>
          <div class="content">
            · 活动时间：即日起~11月30日；<br>
            · 本活动仅限机场员工参与；<br>
            · 抵用券有限，发完即止；<br>
            · 领券时间2018年11月30日；<br>
            · 每人可获得充值抵用券1次，且充值抵用券仅限充值手机话费；<br>
            · 请在2018年12月15日0点前使用，逾期未使用则失效；<br>
            · 客服电话：400-158-2212；<br>
            · 本次活动最终解释权归兜礼所有。
          </div>
        </div>
    </div>
    <!--  弹出框 end-->
    <div class="activity_div" ref="homePage">
      <img src="../../../assets/images/activity/donghang_banner1.jpg"/>
      <div class="button" data-baidu-stats="活动-东航活动-话费限量领-领取按钮" @click="refer"></div>
      <div class="rule" @click="rule_show = !rule_show"></div>
      <div class="order" @click="order"></div>
      <img src="../../../assets/images/activity/donghang_banner2.jpg"/>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {onWechatConfigNew} from '@/assets/js/wechatShare2.js';

  export default {
    name: "activityDonghang",
    data() {
      return {
        rule_show: false,
      }
    },
    created(){
      dooolyAPP.initTitle('话费限量领','');
      onWechatConfigNew('hideMenuItems');
    },
    mounted(){
      if(`${document.documentElement.clientHeight}` > this.$refs.homePage.clientHeight){
        this.$refs.homePage.style.height = `${document.documentElement.clientHeight}` + 'px';
        this.$refs.homePage.style.padding = 0;
      }
    },
    methods: {
      refer(){
        http({
          method: 'post',
          url: api.sendCoupon,
          data:{
            userId:localStorage.userId,
            activityId:this.$route.params.activityid
          }
        }).then((data) => {
            if(data.data.code == 1000){
              this.$toast('抵扣券已到账');
              dooolyAPP.gotoJumpVue(this.$router,'/recharge/0/0');
            }else if(data.data.code == 1002){
              this.$toast('抵扣券已领取');
              dooolyAPP.gotoJumpVue(this.$router,'/recharge/0/0');
            }else{
              if(data.data.mess){
                this.$toast(data.data.mess);
              }
            }
        })
      },
      order(){
        dooolyAPP.gotoJumpVue(this.$router,'/myOrderList/0/all');
      }
    },
  }
</script>

<style scoped>
  .activity_div{
    font-size: 0;
    position: relative;
    width: 100%;
    background: #dd0103;
    height: 13.46rem;
    padding-bottom: 1.24rem;
  }
  .activity_div::after{
    content: "";
    width: 0.14rem;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.2);
  }
  .activity_div::before{
    content: "";
    width: 0.14rem;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(0,0,0,0.2);
  }
  .activity_div img{
    position: relative;
    z-index: 1;
  }
  .activity_div img:last-child{
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .button{
    position: absolute;
    left: 50%;
    top: 11.6rem;
    width: 3.6rem;
    height: 1rem;
    margin-left: -1.8rem;
    z-index: 99;
  }
  .rule{
    position: absolute;
    left: 1.25rem;
    top: 13rem;
    width: 2.2rem;
    height: 0.4rem;
    z-index: 99;
  }
  .order{
    position: absolute;
    left: 4rem;
    top: 13rem;
    width: 2.2rem;
    height: 0.4rem;
    z-index: 99;
  }
  .rule_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(27,28,128,0.7);
  }
  .rule_tasot{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -2.92rem;
    margin-top: -2.72rem;
    border-radius: 0.1rem;
    width: 5.84rem;
    min-height: 5.44rem;
    background: #ffece8;
    font-size: 0;
  }
  .title{
    font-size: 0.3rem;
    color: #cc391a;
    line-height: 100%;
    text-align: center;
    padding: 0.35rem 0 0.38rem 0;
    border-bottom: 1px solid #cc391a;
    margin: 0 0.2rem;
  }
  .content{
    margin-top: 0.4rem;
    padding: 0 0.2rem;
    font-size: 0.24rem;
    color: #cc391a;
    line-height: 0.34rem;
  }
  .rule_tasot img{
    position: absolute;
    left: 50%;
    top: 110%;
    width: 0.5rem;
    height: 0.5rem;
    margin-left: -0.25rem;
    margin-top: -0.25rem;
  }
</style>
