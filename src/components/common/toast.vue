<template>
  <div class="JDK_alr_bg" v-if="firstShow == 1&&appShow==1">
    <div class="JDK_alr">
      <div class="img">
        <span><img class="logo" src="../../assets/images/equities/logo.png"></span>
        <span><img class="JDK_lod" src="../../assets/images/equities/JDK_lod.gif"></span>
        <span><img class="JDK_logo" :src="toastData.miniLogo"></span>
      </div>
      <div class="txt">
        <span class="gray">即将前往</span><br>
        <span class="block">{{toastData.discount}} {{toastData.maxUserRebate}}</span><br>
        <!-- <span class="red" @click="gotoJumpJq_old()">查看此商户介绍</span><br> -->
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "toast",
        props:['toastData','firstShow'],
      data (){
        return {
          timeOut:'',
          toaState:true,
          appShow:1,
        }
      },
      methods:{
        gotoJumpJq_old(){
          clearTimeout(this.timeOut);
          this.sendfirstShow();
          dooolyAPP.gotoJumpVue.call(this,'/businessinfo/'+this.toastData.dealType+'/'+this.toastData.id);
        },
        sendfirstShow(){
          this.$emit('child-say',0);
        }
      },
      mounted(){
        this.timeOut=setTimeout(() => {
          this.sendfirstShow();
          if(this.toastData.openOneNnumber == 1){
            if(!this.toastData.openOneNnumberUrl){
              this.toastData.openOneNnumberUrl = '1';
            }
            dooolyAPP.gotoJumpVue.call(this,'/openOneNnumber/'+this.toastData.openOneNnumberId+'/'+encodeURIComponent(this.toastData.openOneNnumberUrl));
          }else{
            dooolyAPP.gotoJumpJq.call(this,this.toastData.url);
          }
        }, 1000);
      },
    }
</script>

<style scoped>
  /*跳转弹出框*/
  .JDK_alr_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.4);
    z-index: 9999;
  }
  .JDK_alr{
    position: fixed;
    width: 5.2rem;
    height: 3.56rem;
    left: 50%;
    top: 50%;
    margin-left: -2.6rem;
    margin-top: -1.78rem;
    background: #ffffff;
    border-radius: 0.2rem;
    z-index: 10000;
    font-size: 0;
    text-align: center;
  }
  .JDK_alr .img{
    margin-top: 0.6rem;
  }
  .JDK_alr .img span{
    display: inline-block;
    vertical-align: top;
  }
  .JDK_alr .img span img{
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 100%;
  }
  .JDK_alr .img span .JDK_lod{
    width: 1.4rem;
    height: auto;
    margin: 0 0.28rem;
    margin-top: 0.38rem;
  }
  .JDK_alr .txt{
    margin-top: -0.08rem;
  }
  .JDK_alr .txt span{
    display: inline-block;
  }
  .JDK_alr .txt .gray{
    font-size: 0.24rem;
    color: #999;
    line-height: 100%;
  }
  .JDK_alr .txt .block{
    font-size: 0.32rem;
    color: #333;
    margin-top: 0.5rem;
    line-height: 100%;
  }
  .JDK_alr .txt .red{
    margin-top: 0.3rem;
    font-size: 0.24rem;
    line-height: 100%;
    color: #ee3f44;
    padding-right: 0.2rem;
    background: url(../../assets/images/equities/enter.png) no-repeat top right;
    background-size: 0.12rem 0.2rem;
  }
</style>
