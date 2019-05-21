<template>
  <div class="points_service">
  <div v-show="!isTest" class="points_div">
  <div class="point_title"><span></span>常用功能</div>
    <ul>
      <li v-for="(item,index) in pointsServiceList" :class="classObject" :key="index" @click="linkPointsService(item.serviceUrl,item.serviceName,item.businessId,item.dealType,index+1)">
        <img :src="item.logo" :onerror="defaultImg">
        <div class="title">{{item.serviceName}}</div>
      </li>
    </ul>
    <div class="point_title"><span></span>热门商户</div>
    <ul class="ul_o">
      <li v-for="(item,index) in pointsServiceList2" :class="classObject" :key="index" @click="linkPointsService(item.serviceUrl,item.serviceName,item.businessId,item.dealType,index+1)">
        <img :src="item.logo" :onerror="defaultImg">
        <div class="title">{{item.serviceName}}</div>
      </li>
    </ul>
  </div>
  <!-- test -->
 </div>
</template>
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
 
  export default {
    name: "pointsService",
    data() {
      return {
        isTest: false,
        pointsServiceList: [],
        pointsServiceList2: [],
        businessId:"",
        dealType:"",
        isPointfrist:false,
        serviceUrl:"",
        defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"',
      }
    },
    created(){
      initTitle('可用积分商户','');
      this.getlist();
      this.$baiduStats('我的-可用积分-可用积分商户');
    },
    activated(){
      initTitle('可用积分商户','');
      this.getlist();
    },
    computed:{
      //样式控制
      classObject: function () {
        if (this.isPointfrist) {
          return {
            btn_after: true
          }
        }
        else {
          return {
            btn_after: false
          }
        }
      }
    },
    methods:{
      getlist(){
        http({
          method: 'post',
          url: api.getPointsServiceV21,
          data: {
            userId:localStorage.userId,
          },
        }).then((res) => {
          if(res.data.code==1000){  //成功返回数据
            this.pointsServiceList=res.data.data.list1;
            this.pointsServiceList2=res.data.data.list2;
          }else{
            this.$toast("暂无可使用服务");
          }
        })
      },
      //埋点统计
      linkPointsService(url,name,businessId,dealType,index) {
        this.$baiduStats('我的-可用积分-可用积分商户-' + name);
        if(url.substring(0,4)=='http' || url.substring(0,4)=='HTTP'){
          dooolyAPP.gotoJumpJq.call(this,url);
        }else if(!isNaN(url)){//判断是否是一号通链接
          dooolyAPP.gotoJumpVue.call(this,'/openOneNnumber/'+url+'/1');
        }else{
           dooolyAPP.gotoJumpVue.call(this,url);
        }
      },
    },
    beforeDestroy(){
      localStorage.removeItem('storeMapCompany');
    },
  }
</script>
 
<style scoped>
  body{background: #f7f7f8;}
  img{width: 100%;}
  .model_bg{position: fixed;left: 0;top: 0;width: 100%;height: 100%;z-index: 9999;display: block;}
  .new_model{position: fixed; width:100%;height: 100%; background-size: 100%;display: block;z-index: 100000;text-align: center;overflow: hidden;}
  .block_bg{height: 100%;display: block; background: rgba(0,0,0,0.7);margin-top: -0.24rem;}
  .points_div {border-top: 0.2rem solid #f7f7f8;background: #f5f5f5;}
  .points_div ul {font-size: 0;background: #fff;margin-bottom: 0.2rem;}
  .points_div ul li {display: inline-block;width:1.5rem;height: 1.5rem; overflow: hidden;text-align: center;font-size: 0; margin-left: 0.3rem;padding-bottom: 0.1rem;}
  .points_div ul li img {width: 0.8rem;height: 0.8rem;margin-top: 0.2rem;margin-bottom: 0.1rem;}
  .points_div ul li .title {font-size: 0.24rem;color: #666;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
 .ul_o li img {border-radius: 50%;}
.points_div ul li:first-child{position: relative;z-index: 21;background: #fff;border-radius: 50%;}
/*新手指引*/
.novice_guide{position:fixed;left:0;top:0;width:100%;height:100%;z-index: 20;background: rgba(0,0,0,0.7);}
.novice_guide img{width:76%; position:absolute;top: 6%;left: 0%;}
 
li:first-child.btn_after img,li:first-child.btn_after span{
    animation:twinkling 1s infinite 0.9s ease-in-out alternate;
}
@keyframes twinkling{
    0%{opacity: 0;}
    100%{opacity: 1;}
}
 
.point_title{padding-left: 0.3rem;font-size: 0.36rem; line-height: 0.8rem;background: #fff;}
.point_title span{width: 0.1rem;height: 0.3rem;color: #ee3f44;background: #ee3f44;display: inline-block;border-radius: 36%;margin-right: 0.3rem;}

/* test */
#mainContent-point{
  position: absolute;
  top: 0;
  left: 0;
}
#close-point{
  height: 0.5rem;
  width: 1rem;
  position: fixed;
  z-index: 10;
  top: 0.14rem;
  font-size: 0.30rem;
  text-align: center;
  line-height: 0.5rem;
  right: 0.14rem;
}
#close-point img{
  width: 0.5rem;
}
</style>