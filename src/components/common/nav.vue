<template>
    <div>
      <!-- <keep-alive exclude="new-home"> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
      <div v-show="showType != 1">
        <div class="include_footer_bg"></div>
        <div v-if="dyfooterState" class="include_footer">
          <ul>
            <li class="liCommon" v-for="(item,index) in footerTobarData" :key="index" :class="{liActive:isActive===index}" @click="toLink(item.tobarLink,index,item.tobarContent)">
              <span :class="item.tobarIcon" class="liActive" ></span><br><i>{{item.tobarContent}}</i>
            </li>
          </ul>
          <!-- <div class="scan" @click="toLink( '/scanDiscounts',2,'付款码')"><img src="../../assets/images/fkm.png"><span></span></div> -->
        </div>
      </div>
    </div>
</template>

<script>
  import point from '@/assets/js/pointTitle.js';
    export default {
      name: "Nav",
      data(){
          return{
            dyfooterState:true,
            footerTobarData: [
              {
                tobarLink: '/home',
                tobarIcon: 'index',
                tobarContent: '会员权益'
              },
              {
                tobarLink: '/life',
                tobarIcon: 'shop',
                tobarContent: '花积分'
              },
              {
                tobarLink: '/makeMoney',
                tobarIcon: 'find',
                tobarContent: '发现'
              },
              {
                tobarLink: '/mine',
                tobarIcon: 'me',
                tobarContent: '我的'
              }
            ],
            statsFilter: {
              '/home': '首页',
              '/life': '生活',
              '/makeMoney': '内购',
              '/mine': '我的',
            },
            isActive:0,
            footerState:true,
            showType:this.$route.query.showType,
          }
      },
      methods:{
        toLink(tobarLink,index,tobarContent) {
          this.isActive=index;
          this.$router.replace({
            path: '/v3'+tobarLink
          });
          this.$baiduStats(this.statsFilter[tobarLink]);
        },
        changeFooterState(){
          if(browserName == "WebKit"|| browserName == "Chrome WebView"){
            this.footerState=false;
          }
        },
        initDyfooterTable(){
          var link=window.location.href;
          if(link.indexOf('life')>0){
            this.isActive=1;
          }
          else if(link.indexOf('makeMoney')>0) {
            this.isActive=2
          }
          else if(link.indexOf('mine')>0) {
            this.isActive=3;
          }
        }
      },
      mounted(){
        if(browserName == "WebKit" || browserName == "Chrome WebView"){
          this.dyfooterState=false;
        }
        else{
          this.dyfooterState=true;
        }
        this.changeFooterState();
        this.initDyfooterTable();
      },
      beforeRouteUpdate(to,from,next){
        if(to.name=="home"){
          this.isActive=0;
        }else if(to.name=="life") {
          this.isActive=1;
        }
        else if(to.name=="makeMoney") {
          this.isActive=2;
        }
        else if(to.name=="mine") {
          this.isActive=3;
        }
        next();
      },
      beforeDestroy(){
      },
      beforeCreate(){
      },
    }
</script>

<style scoped>

  @font-face {
    font-family: 'icomoon';
    src:  url('../../assets/fonts2/icomoon.eot?vamz14');
    src:  url('../../assets/fonts2/icomoon.eot?vamz14#iefix') format('embedded-opentype'),
    url('../../assets/fonts2/icomoon.ttf?vamz14') format('truetype'),
    url('../../assets/fonts2/icomoon.woff?vamz14') format('woff'),
    url('../../assets/fonts2/icomoon.svg?vamz14#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  [class^="icon-"], [class*=" icon-"] {
    font-family: 'icomoon' !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-find:before {
    content: "\e900";
    color: #b4b6bd;
  }
  .icon-pay:before {
    content: "\e901";
    color: #ffffff;
    visibility: hidden;

  }

  .icon-pay2:before {
    content: "\e901";
    color: #ffffff;
    position: absolute;
    left:0.3rem;
    bottom: 0.28rem;
    font-size: 0.42rem;

  }
  .icon-shop:before {
    content: "\e902";
    color: #b4b6bd;

  }
  .icon-index:before {
    content: "\e903";
    color: #b4b6bd;
  }
  .icon-me:before {
    content: "\e904";
    color: #b4b6bd;
  }
  .include_footer_bg {
    height: 1.6rem;
    width: 100%;
  }

  .include_footer {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    height: 1rem;
    background: #f5f5f5;
    box-shadow: 0px -2px 6px 0 rgba(0,0,0,0.10);
  }

  .include_footer ul {
    font-size: 0;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .scan{
    width:1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 0;
    margin-left: -0.5rem;
    margin-top: -0.42rem;
  }

  .icon-scan{
    position: absolute;
    left:3.54rem;
    bottom: 0.66rem;
  }

  .circle{
    background-image: linear-gradient(-139deg, #FF6237 3%, #FF2403 98%);
    box-shadow: 0 0 5px 0 rgba(255,39,5,0.50);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    text-align: center;
    color: #fff;
  }

  .liCommon {
    display: inline-block;
    font-size: 0.24rem;
    line-height: 0.3rem;
    color: #7d7d7d;
    width: 1.5rem;
    text-align: center;
    padding-top: 0.2rem;
    line-height: 100%;
  }

  .liActive span:before{
    color:  #FD5739;
  }

  .liActive{
    color:  #FD5739;
  }
  .include_footer ul li span {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    margin-bottom: 0.08rem;
  }
  .include_footer ul li span img{
    height: 100%;
  }
  .index{
    background: url(../../assets/images/nav/nav1.png) no-repeat 0 0;
    background-size: 100%;
  }
  .liActive .index{
    background-image: url(../../assets/images/nav/navs1.png);
  }
  .shop{
    background: url(../../assets/images/nav/nav2.png) no-repeat 0 0;
    background-size: 100% 100%;
  }
  .liActive .shop{
    background-image: url(../../assets/images/nav/navs2.png);
  }
  .find{
    background: url(../../assets/images/nav/nav3.png) no-repeat 0 0;
    background-size: 100%;
  }
  .liActive .find{
    background-image: url(../../assets/images/nav/navs3.png);
  }
  .me{
    background: url(../../assets/images/nav/nav4.png) no-repeat 0 0;
    background-size: 100%;
  }
  .liActive .me{
    background-image: url(../../assets/images/nav/navs4.png);
  }
  i{
    font-style: normal;
    font-size: 0.24rem;
    display: inline-block;
  }
</style>
