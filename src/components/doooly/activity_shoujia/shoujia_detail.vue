<template>
  <div>
    <!-- 确认弹出框 -->
    <div class="isSuccess_bg" v-show="pop_show" @touchmove.prevent>
        <div class="isSuccess">
          <div class="title">成功领取盐汽水</div>
          <p class="min">请保持当前页面至工作人员处领取盐汽水
          <br/>恭喜你额外获得参与首家限量狂减秒杀机会，数量有限，先到先得！</p>
          <div class="input_view">
              <div class="button" @click="pop_click_btn">立即参与</div>
          </div>
        </div>
    </div>
    <!--  弹出框 end-->
    <div class="activity_div">
    <div class="img_div">
      <img src="../../../assets/images/shoujia/img_d1.jpg"/>
    </div>
    <div class="img_div footer_div">
      <img src="../../../assets/images/shoujia/img_d2.jpg" v-show="btn_show" data-baidu-stats="活动-夏日送清凉-立即领取" @click="click_btn" :disabled="disabled"/>
      <img src="../../../assets/images/shoujia/img_d2.png" v-show="btn_show2"/>
    </div>
    </div>
    <div class="foooter_bg"></div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {shareWithFriendsWX,shareWithFriendsAPP,onWechatConfigNew} from '@/assets/js/wechatShare2.js';

  export default {
    name: "shoujia_detail",
    data() {
      return {
        btn_show:true,
        btn_show2:false,
        pop_show:false,
        disabled:true,
      }
    },
    beforeCreate(){
      document.body.style.backgroundColor="#59c9e1";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    created(){
      dooolyAPP.initTitle('夏日送清凉','');
      http({//判断之前是否领取过礼品
          method: 'post',
          url: api.isReceiveGift,
          data:{
            userId:localStorage.userId
          }
        }).then((res) => {
          if(res.data.code == '1000'){//未领取
           this.btn_show=true;
           this.btn_show2=false;
          }else if(res.data.code == '1002'){//已经领取过
           this.btn_show=false;
           this.btn_show2=true;
          }else if(res.data.code == '1001'){//接口异常
            this.$toast("接口异常");
          }else{
            this.$toast("小兜兜正忙,请稍候重试!");
          }

        })
    },
    methods: {
     click_btn(){
      http({//点击领取
          method: 'post',
          url: api.receiveGift,
          data:{
            userId:localStorage.userId
          }
        }).then((res) => {
          if(res.data.code == '1000'){//领取成功
           this.pop_show=true;
           this.disabled=false;
          }else if(res.data.code == '1002'){//已经领取过
            this.$toast("已经领取过");
          }else if(res.data.code == '1001'){//接口异常
            this.$toast("接口异常");
          }else{
            this.$toast("小兜兜正忙,请稍候重试!");
          }

        })
     },
      pop_click_btn(){
        dooolyAPP.gotoJumpVue(this.$router,'/shoujia_index/-1/-1');
      }
    },
  }
</script>

<style scoped>
img{width:100%;}
.activity_div{background:#59c9e1;padding-bottom: 1.1rem;}
.img_div{font-size: 0;}
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
    text-align: left;
    margin-top: 0.8rem;
    padding: 0 0.2rem;
    color:#333;
}
.isSuccess p.min{
    margin-top: 0;
    font-size: 0.28rem;
    padding: 0 0.5rem;
    color: #999;
    min-height: 2.8rem;
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
    line-height: 1rem;
    width:100%;
}
.footer_div{position: fixed;bottom: 0;}
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
  .foooter_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #59c9e1;
    width: 100%;
    height: 34px;
    z-index: 99999999999;
  }
}
</style>
