<template>
  <div>
    <!--  弹出框  start-->
    <div class="novice_guide" v-show="isPointfrist" @touchmove.prevent>
      <div class="defaultBox">
        <img src="../../assets/images/make_money/money_emptyBg2.png" @click="link()"/>
        <p>即将上线，敬请期待</p>
      </div>
    </div>
  </div>
</template>


<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';

  export default {
    name: "makeMoney",
     data(){
          return{
            isPointfrist:true,
            }
    },
    created(){
 	    initTitle('发现','')
    },
    activated(){
      initTitle('发现','')
    },
    methods:{
      link() {
        var sort = "发现";
      }
    }
  }
</script>

<style scoped>
img{width: 100%}
.novice_guide{position:fixed;left:0;top:0;width:100%;height:100%;z-index: 20; }
.novice_guide .defaultBox{ text-align: center;width: 3rem;left: 50%;top: 50%;position: fixed;margin-top: -2rem; margin-left: -1.5rem;}
.novice_guide .defaultBox img{width: 1.5rem;}
.novice_guide .defaultBox p{font-size: 0.32rem;}
@media (device-width: 375px) and (device-height: 812px) and (-webkit-min-device-pixel-ratio : 3){
        .novice_guide .defaultBox{
          margin-top: -3.5rem;
        }
}
</style>
