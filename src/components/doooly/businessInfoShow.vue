<template>
  <div>
    <div class="novice" @click="finish" @touchmove.prevent v-show="novice">
      <img src="../../assets/images/equities/novice3.png" >
    </div>
    <div class="detail">
      <div class="sub-tc" v-html="adBusiness.businessIntroduce">
        <!--{{adBusiness.businessIntroduce}}-->
      </div>
    </div>
    <dialogBox :businessId="adBusiness.id" v-on:chaildChangeState="chaildDialogState" :dialogState="dialogState" :detailUrl="dialogBoxData.detailUrl" :company="dialogBoxData.company" :logo="dialogBoxData.logo" :openOneNnumber="dialogBoxData.openOneNnumber" :activityType="dialogBoxData.activityType"></dialogBox>
  </div>
</template>
<script>
  import http from '@/http/http'
  import dialogBox from '@/components/common/dialogBox';
  import {Wechatshare,shareWithFriendsWX} from '@/assets/js/wechatShare2.js';

  import api from '@/assets/js/api.js';
  export default {
    name: "businessDetail",
    components:{
      dialogBox
    },
    data(){
      return{
        adBusiness:'',
        dealType:"",
        url:"../../../static/images/testP1.jpg",
        businessId:"",
        channel:"",
        productId:'',
        novice:false,
        dialogState:false,
        dialogBoxData:{
          detailUrl:'',
          company:'',
          logo:'',
          openOneNnumber:0
        }
      }
    },
    created(){
      this.init();
      if(this.$browserName == "WebKit" || this.$browserName == "Chrome WebView"){
        http({
            method: 'post',
            url: api.flow,
            notNeedTransfer:true,
            data:{
              userId:localStorage.userId
            }
        }).then((data) => {
            if(data.data.data.noviceGuideFinished != '1'){
              this.novice = true;
            }
        });
      }
    },
    methods:{
      finish(){
        http({
            method: 'post',
            url: api.finish,
            data:{
              userId:localStorage.userId,
              secretCode:'1'
            },
            notNeedTransfer:true
        }).then((data) => {
          if(data.data.code == 1000){
            this.novice = false;
          }
        });
      },
      init() {
        this.dealType=this.$route.params.dealType1;
        this.id=this.$route.params.id1;
        //this.businessId=this.$route.params.businessId;
        http({
          method: 'get',
          url: api.businessInfoForAjax+'?token='+localStorage.token+'&dealType='+this.dealType+'&id='+this.id,
        }).then((res) => {
            // for (let [index, elem] of res.data.data.ads.entries()) {
            //   this.itemList.push(elem.imagePath);
            // }
          this.adBusiness=res.data.data.adBusiness;
          this.productId=res.data.productId;
          document.title = res.data.data.adBusiness.company;
          dooolyAPP.initTitle(res.data.data.adBusiness.company);
          this.checkWelsh(res.data.data.adBusiness.company,res.data.data.adBusiness.id,res.data.data.adBusiness.dealType);
      })
      },
      business(url,company,logo,openOneNnumber){
        this.dialogState=!this.dialogState;
        this.dialogBoxData={
          detailUrl:'',
          company:'',
          logo:''
        };
        this.dialogBoxData.detailUrl=url;
        this.dialogBoxData.company=company;
        this.dialogBoxData.logo=logo;
        this.dialogBoxData.openOneNnumber=openOneNnumber;
      },
      applink:function () {
        // alert(111);
      },
      chaildDialogState(data){
        this.dialogState=false;
      },
      //link是vue和jquery混用
      link(link,type,id) {
        if(type==1){
         dooolyAPP.gotoJumpJq(this.$router,link);
        }
        else{
          dooolyAPP.gotoJumpVue(this.$router,'/cardBuyDetail/' + id);
        }
      },
     businessDetail(company,miniLogo,id){
  dooolyAPP.gotoJumpJq(this.$router,'/reachtest/wechat/mall/businessDetail.jhtml?company='+company +'&miniLogo='+miniLogo+'&id='+id);
},
      checkWelsh(company,id,dealType){
        if(this.$browserName == "WeChat"){
          // if(res.data.data.adBusiness.company=='威尔士'){
          //   Wechatshare('hotbusiness',[res.data.data.adBusiness.id,res.data.data.adBusiness.dealType]);
          // }

          if(company=='威尔士'){
            Wechatshare('hotbusiness',[id,dealType]);
          }


        }

      }




    },
  }
</script>
<style>
  img{
    width: 100%;
  }
</style>
<style scoped>
  img{
    width: 100%;
  }
  .line{margin-bottom:1rem;}
  .detail{position: relative;width: 100%}
  .sub-tc{width:100%;font-size:18px;position: relative;}
  .sub-tc img {width: 100%;}
  footer{
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    font-size: 0.34rem;
    background: #ee3f44;
    line-height: 1rem;
    color: #fff;

  }
  footer div{
    width:50%;
    font-size: 0.32rem;
    line-height: 1rem;
    text-align: center;
  }
  footer .fl{
    background: #fff;
    color: #333;
    border-top:1px solid #ececec;
  }
  footer .fr{
    background: #ee3f44;
    color: #fff;
  }
  .novice{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:10;
  }
  .novice img{
    width: 100%;
  }
</style>
