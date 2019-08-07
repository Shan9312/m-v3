<template>
  <div class="page" v-show="pageShow">
    <!-- main开始 -->
    <!--<header>此验证码供当面身份验证时使用</header>-->
    <div class="padding_top"></div>
    <section class="section-wrapper">
      <div class="vip"><img src="../../assets/images/scan/doooly.png" alt="doooly" />

      </div>
      <div class="vip-characters">兜礼会员</div>
      <article class="top">
        <div class="yzm">
          <p id="dimensionCode">{{this.codenumShow}}</p>
          <vue-barcode :value="codenum" :options="barcode_option" tag="img" ></vue-barcode>
        </div>
      </article>
      <article class="bot">
          <qrcode-vue :value="codenum" className="yzm" level="H"></qrcode-vue>
      </article>
      <span class="company" @click="businessDetail(apiGetparams.dealType,apiGetparams.id)">查看此商户详情</span>
    </section>
    <div class="header_top"></div>
    <header>此验证码供当面身份验证时使用</header>


    <div class="footer clearfix">
      <input id="viewType" type="hidden" value="0">
      <div class="points" :class="{viewoffss:viewoffState}" @click="changePointState">
        可用积分
        <span v-if="viewoffState" class="viewoff">******</span>
        <span v-if="!viewoffState" class="view">{{scanDetailDatalist.availablePoint}}</span>
        <span class="eyeWrap">
          <img v-if="!viewoffState" src="../../assets/images/scan/view.png">
          <img v-else src="../../assets/images/scan/view_off.png">
        </span>
      </div>
      <div class="checkMap" @click='checkBusiness(scan.businessId,scan.company,scan.miniLogo,scan.userId)'>
      查看附近商家
      </div>
    </div>
  </div>
  <!--item.id,item.company,item.miniLogo,"139642","test"-->
</template>

<script>
import bus from '@/components/common/bus';
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
import { mapState,mapMutations,mapGetters,mapActions } from 'vuex';
import QrcodeVue from 'qrcode.vue';
import VueBarcode from '@xkeshi/vue-barcode';
export default {
  name: "scan-detail",
  data(){
    return{
      viewoffState:true,
      apiGetparams:{},
      scanDetailDatalist:{},
      i:'',
      codenumShow:'***',
      codenum:'1111111111111',
      barcode_option:{
        displayValue: false, //是否默认显示条形码数据
        width:'2px',
        height: '40px',
      },
      pageShow:false,
    }
  },
  components:{
    QrcodeVue,VueBarcode
  },
  computed:{
    ...mapState(["scan"]),
    ...mapState(["cardbuy"]),
  },
  methods:{
    changePointState(){
      this.viewoffState=!this.viewoffState;
    },
    ...mapActions(['addScanAction','deleteScanAction']),
    getCode(){//获取二维码
      http({
        method: 'post',
        url: api.getScanDiscount,
        data: {
          userId: localStorage.userId,
          company:this.$route.params.company,
          businessId:this.scan.businessId,
          groupShortName:localStorage.groupShortName,
          miniLogo:this.scan.miniLogo,
          timestamp:new Date().getTime(),
        }
      }).then((res) => {
        this.pageShow = true;
        if(res.data.code == 1000){
          this.codenum = res.data.data.dimensionCode;
          this.codenumShow = res.data.data.dimensionCodeForShow;
          this.scanDetailDatalist=res.data.data;
        }else{
          this.$toast("网络异常，请重试！");
        }
      })
    },
    checkBusiness(businessId,company,miniLogo,userId){
      localStorage.storeMapCompany=company;
      this.$router.push({path:'/storeMap/'+businessId});
    },
    //商户详情跳转
    businessDetail(dealType, id) {
      dooolyAPP.gotoJumpVue(this.$router,'/businessinfo/'+dealType+'/'+id);
    },
  },
  created(){
    this.apiGetparams=this.scan;
    dooolyAPP.initTitle('付款码');
  },
  beforeDestroy () {
    clearInterval(this.i);
  },
  mounted(){
    this.apiGetparams=this.scan;
    this.getCode();
    this.i= setInterval(this.getCode,60000);
  },
}
</script>
<style scoped>

  .page{
    background: #ee3f44;
    height: 100%;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
  }
  .section-wrapper{
    margin-top: 0;

  }
  .padding_top{
    width: 100%;
    height: 9%;
  }
  /*main开始*/
  .header_top{
    width: 100%;
    height: 3%;
  }
  header{
    font-size: 0.28rem;
    color: #fff;
    text-align: center;
  }
  section{
    width: 93%;
    margin: 0 auto;
    background: #fff;
    border-radius: 0.1rem;
    margin-top: 0.88rem;
    position: relative;
    height: 68%;
    font-size: 0;
    position: relative;
  }
  section article{position: relative;}

  section .vip{position: absolute;
    left: 50%;
    top: 0;
    margin-left: -0.45rem;
    margin-top: -0.65rem;
    width:1rem;
    border-radius: 50%;
    box-sizing: border-box;
    border: 0.1rem solid #fff;
    font-size: 0;
    z-index: 1;
  }
  section .vip img{width: 100%;
     height: 100%;
  }

  .vip-characters{
    font-size: 0.28rem;
    color: #EE3F44;
    width: 100%;
    text-align: center;
    position: absolute;
    top:5%;
  }

  .company{
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 4% 0;
    line-height: 100%;
    background: #FAFAFA;
    font-size: 0.28rem;
    color: #333333;
    text-align: center;
    display: inline-block;
    width: 100%;
    border-top:1px solid #DDDDDD;
    border-radius: 0.1rem;
  }

  section .top{
    padding-bottom: 6%;
    margin: 0 auto;
    padding-top: 16%;
    height: 18%;
  }
  section .bot{
    text-align: center;
    height: 42%;
    width: 55%;
    margin: 0 auto!important;
  }
  section .top div{
    width: 77%;
    margin: 0 auto;
    background: #fff;
    height: 100%;
  }
  section .top div p{font-size: 0.36rem;color: #000;text-align: center;white-space: nowrap;     margin-bottom: 1%;}
  section .bot div{width: 100%;height: 100%;}
  .refresh_div{text-align: center;margin-top: 0.44rem; margin-bottom: 0.3rem;width: 100%; -webkit-tap-highlight-color:rgba(0,0,0,0);}
  .refresh_div img{width: 3.4rem; cursor: pointer;}
  section .top .yzm_big{position: fixed;left: 0;top: 0;width: auto;height: 7.5rem; z-index: 99999;transform:rotate(90deg);text-align: center;}
  section .top .yzm_big p{font-size: 0.7rem;}
  section .top .yzm_big img{height: 3.2rem;width: auto;margin-top: 2rem;}
  section .bot .yzm_big{position: fixed;left:0;top:0;width: 100%; height: 100%;z-index: 99999;margin: 0;}
  section .bot .yzm_big img{margin-top: 2.5rem;width: 6rem;}
  .footer{position: fixed;left: 0;bottom: 0; background-color:#f16569; font-size: 0.34rem;color: #fff;margin: 0 auto;    width: 100%;height: 9%;}
  .footer2{background:rgba(255,255,255,0.15); font-size: 0.34rem;color: #fff;margin: 0 auto;width: 7.5rem;height: 1.3rem; text-align: center; padding-top: 0.4rem;font-weight: bold;margin-top: 0.3rem;}
  .footer2 a{display: inline-block;text-align: center;color: #fff; -webkit-tap-highlight-color:rgba(0,0,0,0);}
  .footer .points{
    float:left;
    width:50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .footer .points .eyeWrap{
    width: 0.4rem;
    margin-left: 0.2rem;
  }

  .footer .points .viewoff{
    vertical-align: middle;
    margin-bottom: -0.15rem;
    margin-left: 0.05rem;
  }
  .footer .checkMap{
    float:right;
    border-left:solid 1px #f59496;
    width:40%;
    text-align: center;
    height: 100%;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 扫码优惠 */
  .comingSoon_div{text-align: center;margin-top:40%;}
  .comingSoon_div img{width:2.7rem;height:2.16rem;}
  .comingSoon_p{color:#666;font-size:0.3rem;text-align: center;margin-top:0.2rem;} 
@media(max-height: 480px){
  section .bot{
    width: 50%;
  }
}
</style>
