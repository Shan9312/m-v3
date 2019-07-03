<template>
  <div class="bodyView">
    <div class="banner">
        <div class="logo">
            <img src="../../assets/images/didi_integral/doooly_logo.png">
        </div>
        <div class="center">
            <img src="../../assets/images/didi_integral/didi_center.png">
        </div>
        <div class="logo">
            <img src="../../assets/images/didi_integral/didi_logo.png">
        </div>
    </div>
    <div class="title">
        欢迎开通滴滴积分服务
    </div>
    <div class="view">
        <div class="pirce_title">
            兜礼积分余额
        </div>
        <div class="pirce">
            {{pirce}}
        </div>
        <div class="input_view">
            <input v-model="integral" type="tel" placeholder="请输入兑换积分数量(整数)">
        </div>
        <div class="input_view">
            <input v-model="code" class="left" type="tel" placeholder="请输入验证码"  oninput="if(value.length>6)value=value.slice(0,6)" >
            <div class="fr get" @click="onGetCode" v-show="!time">获取验证码</div>
            <div class="fr lod" v-show="time"><span>{{counter}}s</span>后重新获取</div>
        </div>
        <div class="subitm" @click="subitm">
            确认兑换
        </div>
        <div class="balance">
            滴滴打车积分余额：<span id="balance">{{balance}}</span>
        </div>
        <div class="order" @click="gotoOrder">
            查看交易记录
        </div>
        <div class="explain">
            <div class="explain_title">滴滴打车积分兑换及使用说明：</div>
            <div class="explain_content">
                1、兑换比例为：1兜礼积分＝1元人民币；<br>
                2、兜礼积分兑换后，概不可赎回，请知晓；<br>
                3、下载滴滴打车APP并登录，符合用车规则的员工，APP将
                     自动识别默认企业支付。<br>
                4、如何查看滴滴出行积分剩余额度：请至滴滴APP—点击个人中心“企业版”按钮——进入我的企业主页即可查看。
            </div>
        </div>
    </div>
    <div class="isSuccess_bg" v-show="alr_show">
        <div class="isSuccess">
            <p>恭喜您兑换成功</p>
            <span>成功兑换<b class="integral">{{integral}}</b>滴滴打车积分<br>开始你的滴滴出行之旅吧</span>
            <div class="input" @click="close()">确定</div>
        </div>
    </div>
  </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  export default {
    components: {
      api
    },
    data() {
      return {
        pirce:'***',
        integral:'',
        code:'',
        counter:0,
        time:false,
        balance:'',
        id:this.$route.params.id,
        orderNumber:'',
        businessNumber:'',
        alr_show:false,
      }
    },
    watch :{
        counter:function(){
            if(this.counter == 0){
                this.time = false;
            }else{
                this.time = true;
                this.timeOut = setTimeout(() => {
                    this.counter--;
                }, 1000);
            }
        }
    },
    created(){
        this.getbalance();
        initTitle('滴滴打车积分兑换','')
    },
    mounted (){

    },
    methods: {
      close(){
          this.alr_show = false;
      },
      getbalance() {
        http({
          method: 'post',
          url: api.toExchangeIntegral,
          data: {
            businessId: this.id,
            userId: localStorage.userId,
          },
          notNeedTransfer: true
        }).then((res) => {
          if (res.data.code == 1000) {
            this.pirce = res.data.data.integral;
            this.balance = res.data.data.businessIntegral;
            this.businessNumber = res.data.data.businessNumber;
            this.orderNumber = res.data.data.orderNumber;
          } else {
            this.$toast(res.data.data.msg);
          }
        })
      },
      subitm() {
        if (this.integral == '') {
          this.$toast("请输入兑换积分数量");
          return;
        }
        var reg = /^[1-9]\d*$|^0$/;
        if (!reg.test(this.integral)) {
          this.$toast("兑换积分数量请输入整数");
          return;
        }
        if (this.code == '') {
          this.$toast("请输入手机验证码");
          return;
        }
        http({
          method: 'post',
          url: api.exchangeIntegral,
          data: {
            businessId: this.id,
            userId: localStorage.userId,
            amount: this.integral,
            orderNumber: this.orderNumber,
            code: this.code
          }
        }).then((res) => {
          if (res.data.code == '1000') {
            window.scrollTo(0,0);
            this.alr_show = true;
            this.getbalance();
          }else if(res.data.code == '50224') {
            this.$messageBox('提示', '可能存在未支付的订单,请至“我的行程”中查看行程状态或联系滴滴客服：400-000-0999');
          } else {
            this.$toast(res.data.msg);
          }
        })
      },
      onGetCode() {
        if (this.integral == '') {
          this.$toast("请输入兑换积分数量");
          return;
        }
        var reg = /^[1-9]\d*$|^0$/;
        if (!reg.test(this.integral)) {
          this.$toast("兑换积分数量请输入整数");
          return;
        }
        http({
          method: 'post',
          url: api.getCode,
          data: {
            businessId: this.id,
            userId: localStorage.userId,
            amount: this.integral,
            orderNumber: this.orderNumber
          }
        }).then((res) => {
          if (res.data.code == 1000) {
            this.counter = 59;
          } else {
            this.$toast(data.msg);
          }
        })
      },
      gotoOrder() {
        dooolyAPP.gotoJumpVue.call(this, '/myOrderList/0/' + this.id);
      },
    },
    beforeCreate(){
      document.body.style.backgroundColor="#ee3f44";
    },
    beforeDestroy () {
      document.body.style.backgroundColor="";
    },
  }
</script>
<style scoped>
input{
    outline: none;
}
.bodyView{
    background: #ee3f44 url(../../assets/images/didi_integral/didi_bg.png) no-repeat 0 0;
    background-size: 100%;
    padding-top: 2rem;
    padding-bottom: 0.26rem;
}
.banner{
    height: 1.2rem;
    width: 100%;
    text-align: center;
    font-size: 0;
    position: relative;
}
.banner .logo{
    width: 1.2rem;
    height: 1.2rem;
    display: inline-block;
}
.banner .logo:first-child{
    margin-right: 2.1rem;
}
.banner img{
    width: 100%;
    height: 100%;
}
.banner .center{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0.48rem;
    height: 0.16rem;
    margin-top: -0.08rem;
    margin-left: -0.24rem;
}
.title{
    font-size: 0.28rem;
    color: #fff;
    text-align: center;
    margin-top: 0.24rem;
    margin-bottom: 1.1rem;
}
.view{
    background: #fff;
    margin: 0 0.2rem;
}
.pirce_title{
    text-align: center;
    font-size: 0.32rem;
    color: #333333;
    margin-bottom: 0.3rem;
}
.pirce{
    text-align: center;
    font-size: 0.64rem;
    color: #ee3f44;
    margin-bottom: 0.34rem;
}
.input_view{
    width: 5.6rem;
    height: 0.88rem;
    border:1px solid #ddd;
    border-radius: 0.05rem;
    margin: 0 auto;
    margin-bottom: 0.2rem;
    font-size: 0;
}
.input_view input{
    width: 100%;
    height: 100%;
    font-size: 0.28rem;
    color: #333;
    text-indent: 0.3rem;
}
.input_view .left{
    width: 2.5rem;
}
.input_view .fr{
    margin-right: 0.4rem;
    font-size: 0.28rem;
    color: #333;
    line-height: 0.88rem;
}
.input_view .lod{
    color: #999;
}
.input_view .lod span{
    color: #ee3f44;
}
.subitm{
    width: 5.6rem;
    height: 0.88rem;
    line-height: 0.88rem;
    background: #ee3f44;
    color: #fff;
    font-size: 0.36rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 0.4rem;
}
.balance{
    font-size: 0.28rem;
    color: #999;
    text-align: center;
    margin-top: 0.44rem;
}
#balance{
    color: #ee3f44
}
.order{
    width: 2.4rem;
    height: 0.56rem;
    line-height: 0.56rem;
    border:1px solid #bababa;
    margin: 0 auto;
    margin-top: 0.24rem;
    text-align: center;
    font-size: 0.24rem;
}
.explain{
    width: 6.5rem;
    border-top: 1px solid #ececec;
    margin: 0 auto;
    margin-top: 0.38rem;
    padding-bottom: 0.5rem;
}
.explain_title{
    font-size: 0.32rem;
    color: #333333;
    margin-top: 0.34rem;
}
.explain_content{
    margin-top: 0.18rem;
    font-size: 0.24rem;
    color: #999999;
}

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
    height: 3.56rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -1.5rem;
    border-radius: 0.2rem;
    font-size: 0;
    text-align: center;
}
.isSuccess p{
    font-size: 0.36rem;
    text-align: center;
    margin-top: 0.72rem;
    padding: 0 0.2rem;
    color:#333;
    font-weight: bold;
}
.isSuccess span{
    font-size: 0.28rem;
    display: inline-block;
    margin-top: 0.1rem;
    color: #999;
}
.isSuccess span b{
    font-weight: normal;
    color: #ee3f44;
}
.isSuccess .input{
    position: absolute;
    left: 0;
    bottom: 0;
    line-height: 1rem;
    width: 100%;
    border-top: 1px solid #ececec;
    font-size: 0.36rem;
    color: #ee3f44;
    text-align: center;
}
</style>
