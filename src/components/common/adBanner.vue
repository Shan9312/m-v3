<template>
  <div class="adBannerSwipe">
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item,index) in items" :key="index" ><img @click="linkCompany(item.imageLinkUrl,item.linkType,index+1);" :src="item.imagePath"></mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
  import point from '@/assets/js/pointTitle.js';
  export default {
    props:['items'],
    data() {
      return {
      }
    },
    methods:{
      linkCompany(link,type,index){
        if(!link){
          return;
        }
        dooolyAPP.gotoJumpJq.call(this,link);
      },
    }
  }
</script>
<style>

  .adBannerSwipe{
    height: 2.6rem;
  }
  .adBannerSwipe .mint-swipe {
    height: 100%;
    background:#ececec url(../../assets/images/home/banner.png) no-repeat center center;
    background-size:100% auto;
  }

  .adBannerSwipe .mint-swipe img {
    width: 100%;
    height: 100%;
  }

  .adBannerSwipe .mint-swipe-indicators {
    position: absolute !important;
    right: 0.15rem!important;
    left: auto!important;
    bottom: 0.1rem !important;
    -webkit-transform: translateX(0)!important;
    transform: translateX(0)!important;
    font-size: 0;
  }
  .adBannerSwipe .mint-swipe-indicator.is-active {
    background: #ee3f44!important;
    opacity: 0.8!important;
  }
</style>
