<template>
  <div class="adbanner_view">
    <v-touch tag="div" v-on:swipeleft="swipeLeft()" v-on:swiperight="swipeRight()" class="list_view" >
        <div class="list" v-for="(item,index) in items" :key="index" :class="{left:index==0 && swipe_left == 1,right:index==0 && swipe_right == 1,left2:index==0 && swipe_right == 3,right2:index==0 && swipe_left == 3,first:index==0 &&items.length <=2}">
          <img @click="linkCompany(item.imageLinkUrl,item.linkType,index+1);" :src="item.imagePath" :onerror="defaultImg">
          <img class="bg" src="../../assets/images/home/newHome_bg.png">
        </div>
    </v-touch>
  </div>
</template>
<script>
  import point from '@/assets/js/pointTitle.js';
  export default {
    props:['items'],
    data() { 
      return {
        swipe_right:0,
        swipe_left:0,
        defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"',
        first:0,
      }
    },
    watch:{
      items(){
        if(this.items.length > 2 && this.first == 0){
          var a = this.items.pop();
          this.items.unshift(a);
          this.first = 1;
        }
      }
    },
    mounted(){
      var interval = setInterval(() => {
        this.swipeLeft();
      }, 4000)
    },
    methods:{
      linkCompany(link,type,index){
        this.$baiduStats('轮播图' + index);
        if(!link){
          return;
        }
        dooolyAPP.gotoJumpJq.call(this,link);
      },
      swipeRight(){
        if(this.swipe_left != 0 || this.items.length < 2){
          return;
        }else if(this.items.length == 2){
          this.swipe_right = 0;
          this.swipe_left = 3;
        }else{
          var a = this.items.pop();
          this.items.unshift(a);
          this.swipe_left = 1;
          this.timeOut = setTimeout(() => {
            this.swipe_left = 0;
          }, 500);
        }
      },
      swipeLeft(){
        if(this.swipe_right != 0 || this.items.length < 2){
          return;
        }else if(this.items.length == 2){
          this.swipe_left = 0;
          this.swipe_right = 3;
        }else{
          this.swipe_right = 1;
          this.timeOut = setTimeout(() => {
            var a = this.items.shift();
            this.items.push(a);
            this.swipe_right = 0;
          }, 500);
        }
      },
    },
  }
</script>
<style scoped>
  .adbanner_view{
    overflow: hidden;
  }
  .adBannerSwipe{
    height: 2.6rem;
  }
  .adbanner_view .mint-swipe {
    height: 100%;
    background:#ececec url(../../assets/images/home/banner.png) no-repeat center center;
    background-size:100% auto;
  }

  .adbanner_view .mint-swipe img {
    width: 100%;
    height: 100%;
  }

  .adbanner_view .mint-swipe-indicators {
    position: absolute !important;
    right: 0.15rem!important;
    left: auto!important;
    bottom: 0.1rem !important;
    -webkit-transform: translateX(0)!important;
    transform: translateX(0)!important;
    font-size: 0;
  }
  .adbanner_view .mint-swipe-indicator.is-active {
    background: #ee3f44!important;
    opacity: 0.8!important;
  }
  .list_view{
    width: 99999px;
    white-space: nowrap;
  }
  .list{
    height: 2.68rem;
    width: 6.7rem;
    border-radius: 0.1rem;
    display: inline-block;
    margin-top: 0.2rem;
    padding: 0 0.1rem;
    padding-bottom: 0.2rem;
    position: relative;
  }
  .list img{
    width: 100%;
    height: 100%;
    border-radius: 0.1rem;
  }
  .list .bg{
    position: absolute;
    left: 50%;
    top: 55%;
    width: 7.5rem;
    transform: translate(-50%,-50%);
    z-index: -1;
  }
  .list:nth-child(1){
    margin-left: -6.6rem;
  }
  .list.first{
    margin-left: 0.4rem;
  }
  .left{
    animation:slide_left 0.5s linear;
  }
  .right{
    animation:slide_right 0.5s linear;
  }
  .left2{
    animation:slide_left2 0.5s linear forwards;
  }
  .right2{
    animation:slide_right2 0.5s linear forwards;
  }
  @keyframes slide_left2{
    0%{
        margin-left: 0.4rem;
      }
    100% {
        margin-left: -6.5rem;
      }
  }
  @keyframes slide_right2{
    0%{
        margin-left: -6.5rem;
      }
    100% {
        margin-left: 0.4rem;
      }
  }
  @keyframes slide_right{
    0%{
        margin-left: -6.5rem;
      }
    100% {
        margin-left: -13.4rem;
      }
  }
  @keyframes slide_left{
    0%{
        margin-left: -13.4rem;
      }
    100% {
        margin-left: -6.5rem;
      }
  }
</style>
