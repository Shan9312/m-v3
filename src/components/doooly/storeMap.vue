<template>
  <div>
    <!--<div id="panel"></div>-->
    <div class="amap-page-container" id="container">
      <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
      </el-amap>
    </div>

    <!--<amap></amap>-->
    <footer v-show="footer1State" class="footer1">
      <!--<div class="title">附近的{{this.$route.params.company}}店铺</div>-->
      <div class="title">附近的{{storeMapCompany}}店铺</div>
      <ul class="mui-table-view"  v-infinite-scroll="loadMore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
        <div v-if="loadGifState" class="mint-loadmore-bottom">
          <span class="loading_gif"></span>
        </div>
        <li v-for="(item,index) in pageData" v-if='item.longitude!=""&&item.latitude!=""' :key="index" @click="linkDetail(item)" class='clearfix'><div class='fr'>{{item.distance<1?item.distance*1000 +"m":parseFloat(item.distance).toFixed(1) +"km"}}</div><div class='fl logo marker-route'>{{index+1}}</div><div class='fl name'><span>{{item.storeName}}</span><br>{{item.address}}</div><input type='hidden' class='addname' :value='item.storeName'><input type='hidden' class='address' :value='item.address'><input type='hidden' class='tel' :value='item.phoneNumber'><input type='hidden' class='time' :value='item.desc'><input type='hidden' class='lng' :value='item.longitude'><input type='hidden' class='lat' :value='item.latitude'></li>

        <div  v-show="!queryLoading">

          <div class="loadContainer" v-if="finishState">
            <div class="finish">已经到底部了</div>
          </div>

          <div v-show="moreLoading&&!finishState" class="mint-loadmore-bottom">
            <span class="loading_gif"></span>
          </div>

        </div>


      </ul>
    </footer>
    <footer v-show="!footer1State" class="footer2">
      <div class="title clearfix">
        <div class="fl">
          {{footer2Data.storeName}}
        </div>
        <div class="fr">
          <span>{{footer2Data.distance<1?footer2Data.distance*1000 +"m":parseFloat(footer2Data.distance).toFixed(1) +"km"}}</span>
        </div>
      </div>
      <ul>
        <li class="address">地址：<span>{{footer2Data.address}}</span></li>
        <li class="tel"><a class="u-tel" :href="'tel:'+ footer2Data.phoneNumber">电话：<span>{{footer2Data.phoneNumber}}</span></a></li>
        <li class="time">时间：<span>{{footer2Data.desc}}</span></li>
      </ul>
      <a href="javascript:;" @click="goBack" id="navigation">返回</a>
    </footer>
  </div>
</template>

<script>
  import storeMap from '../../assets/images/storeMap/my_map.png';
  import timg from '../../assets/images/storeMap/timg.png';
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  import bus from '@/components/common/bus';
  import {getAddress} from '@/assets/js/wechatShare2.js';

  export default {
    name: "store-map",
    data(){
      return{
        searchCondition: {  //分页属性
          pageNo: "1",
          pageSize: "10"
        },
        footer1State:true,
        resCountPage:'begin',
        loadGifState:true,
        moreLoading: false,
        pageData:[],
        queryLoading: false,
        count: 1,
        zoom: 14,
        center: [121.500754,31.191462],
        timeout1:'',
        map:'',
        footer2Data:'',
        storeMapCompany:localStorage.storeMapCompany,
      }
    },
    computed:{
      finishState(){
        if(this.searchCondition.pageNo<this.resCountPage||this.resCountPage=="begin"){
          return false;
        }else{
          return true;
        }
      },
    },
    methods:{
      nearby(data){
        this.loadFirstPage(this.$route.params.businessId,data.latitude,data.longitude);
      },
      loadFirstPage(id,lat,lng){
        http({
          method: 'get',
          url: api.getStoreList+'?id='+id+'&pageNumber='+this.searchCondition.pageNo+'&pageSize='+this.searchCondition.pageSize+'&lat='+lat+'&lng='+lng+'&token='+localStorage.token,
        }).then((res) => {
          this.resCountPage=res.data.list.countPage;
          this.loadGifState=false;
          this.moreLoading=false;
          this.pageData=res.data.list.list;
        })
      },
      more(id,lat,lng) {
        // 分页查询
        http({
          method: 'get',
          url: api.getStoreList+'?id='+id+'&pageNumber='+this.searchCondition.pageNo+'&pageSize='+this.searchCondition.pageSize+'&lat='+lat+'&lng='+lng+'&token='+localStorage.token,
        }).then((res) => {
          this.moreLoading=false;
          this.pageData.push(...res.data.list.list);
          this.resCountPage=res.data.list.countPage;
        });
      },
      loadMore() {
        this.searchCondition.pageNo = parseInt(this.searchCondition.pageNo) + 1;
        if(this.searchCondition.pageNo <= this.resCountPage)
        {
          var data = {'latitude':localStorage.latitude,'longitude':localStorage.longitude};
          this.more(this.$route.params.businessId,data.latitude,data.longitude);
          this.moreLoading=true;
        }
      },
      point() {
        for (let [index, elem] of this.pageData.entries()) {
          if (elem.longitude == "" || elem.latitude == "") {
            return;
          }
          var marker = new AMap.Marker({
            position: [elem.longitude,elem.latitude],
            title: elem.name,
            content: "<div style='background: url("+timg+") no-repeat 0 0;background-size: 100%;width: 0.4rem;height: 0.6rem;line-height: 0.4rem;font-size: 0.26rem;color: #fff;text-align: center;font-family: \"微软雅黑\";'>" + (index + 1) + '</div>'
          });
          marker.setMap(this.map);
        }
      },
      addMarker2(){
        this.timeout1=setTimeout(this.addMarker,1000);
      },
      //实例化marker
      addMarker(){
        this.map = new AMap.Map("amapDemo", {
          resizeEnable: true,
          zooms:[13,19],
          center:[localStorage.longitude,localStorage.latitude]
        });
        //设置地图中心点
        var marker = new AMap.Marker({
          position:[localStorage.longitude,localStorage.latitude],
          icon:storeMap,//图标
          title:'我的位置',
          size : new AMap.Size(25,25)
        });
        marker.setMap(this.map);
        //画圆
        var circle = new AMap.Circle({
          center: this.map.getCenter(),   // 圆心位置
          radius: 1000, //半径 2000
          strokeColor: "#ee3f44", //线颜色
          strokeOpacity: 0.5, //线透明度
          strokeWeight: 1, //线粗细度
          fillColor: "#fff", //填充颜色
          fillOpacity: 0.4//填充透明度
        });
        circle.setMap(this.map);
        this.point();
      },
      linkDetail(item){
        this.footer1State=false;
        this.footer2Data=item;
        this.getLng(item.longitude,item.latitude);
      },
      goBack(){
        this.footer1State=true;
        this.addMarker();
      },
      getLng(longitude,latitude) {
        var geocoder = new AMap.Geocoder({
          city: "全国", //城市，默认：“全国”
          radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        this.map = new AMap.Map("amapDemo", {
          resizeEnable: true,
          zoom:14,
          zooms:[1,19],
          center: [localStorage.longitude,localStorage.latitude]
        });
        var driving = new AMap.Driving({
          map: this.map,
        });
        driving.search(new AMap.LngLat(localStorage.longitude,localStorage.latitude), new AMap.LngLat(longitude, latitude));
      }
    },
    mounted(){
      getAddress.call(this);
      bus.$on('mapStore',(function(data){
        localStorage.latitude=data.latitude;
        localStorage.longitude=data.longitude;
        this.nearby(data);
        this.addMarker2();
      }).bind(this));
      dooolyAPP.initTitle(localStorage.storeMapCompany);
    },
    beforeCreate(){
      if(!localStorage.reload){
        localStorage.reload=1;
        let url = window.location.href;
        let index =url.indexOf('?');
        let index2 =url.indexOf('#');
        let base;
        let base2;
        if(index > 0){
          base = url.substring(0,index);
          base2 = url.substring(index2);
          window.location.href= base + base2;
        }else{
          location.reload();
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      if(from.name){
        localStorage.removeItem('reload');
      }
      next();
    },
    destroyed(){   
      localStorage.removeItem('reload');
    },
  }
</script>

<style>
  .amap-icon img{
    width:0.5rem !important;
  }
</style>
<style scoped>
  #container{width: 100%;font-size: 0.24rem;}
  header{position: fixed;top: 0;left: 0;padding: 0.38rem 0 0.28rem 0;background: #fff;border-bottom: 1px solid #d1d1d1;font-size: 0.22rem;line-height: 0.3rem;color: #362e2b;z-index: 99999999;width: 100%;}
  header img{width: 0.7rem;margin:0 0.3rem;vertical-align: top;margin-top: -0.1rem;}
  header p{display: inline-block;line-height: 0.3rem;width: 76%;}
  header div{ width: 100%; text-align: right;margin-top: 0.1rem;}
  header div span{display: inline-block;text-align: center; width: 1.35rem;line-height: 0.5rem;border-radius: 5px; margin-right: 0.3rem;background: #fff;color: #ee3f43;border:1px solid #ee3f43;}
  .amap-icon img{
    width: 0.5rem;
  }
  a{
    text-decoration: none;
  }
  .footer1{
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 0.3rem;
    background: #fff;
    width: 100%;
    z-index: 999;
  }
  .footer1 .title{
    font-size: 0.3rem;
    color: #000;
    line-height: 0.88rem;
    text-align: center;
    margin:0 0.3rem;
    border-bottom: 1px solid #ececec;
  }
  .footer1 .title img{
    width: 0.34rem;
    vertical-align: top;
    margin-top: 0.24rem;
    margin-right: 0.1rem;
  }
  .footer1 ul{
    height: 4.5rem;
    overflow: scroll;
    font-size: 0;
  }
  .footer1 ul li{
    border-bottom: 1px solid #ececec;
    height: 1.42rem;
    margin: 0 0.3rem;
    overflow: hidden;
  }
  .footer1 ul li .logo{
    margin-top: 0.36rem;
    margin-right: 0.2rem;
  }
  .footer1 ul li .name{
    width: 4rem;
    text-overflow:ellipsis;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font-size: 0.28rem;
    color: #999;
    padding-top: 0.36rem;
    line-height: 100%;
  }
  .footer1 ul li .name span{
    display: inline-block;
    font-size: 0.32rem;
    margin-bottom: 0.2rem;
    color: #333;
  }
  .footer1 ul li .fr{
    color: #ee3f43;
    text-align: center;
    font-size: 0.28rem;
    line-height: 1.42rem;
  }
  .footer1 ul li .fr span{
    font-size: 0.28rem;
  }
  .footer1 ul li .fr img{
    width: 0.2rem;
    vertical-align: top;
    margin-top: 0.44rem;
    margin-left: 0.1rem;
  }
  .footer1 input[type='button']{
    width: 100%;
    height: 0.7rem;
    font-size: 0.3rem;
    background: #ee3f44;
    color: #fff;
  }
  .footer2{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0.2rem;
    font-size: 0.3rem;
    background: #fff;
    width: 100%;
    z-index: 999;
  }
  .footer2 .title{
    line-height: 1.06rem;
    border-bottom: 1px solid #ececec;
    margin: 0 0.3rem;
  }
  .footer2 .title .fl{
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
  }
  .footer2 .title .fr{
    font-size: 0.28rem;
    color: #ee3f44;
  }
  .footer2 .title .fr span{
    font-size: 0.28rem;
  }
  .footer2 ul{
    font-size: 0;
    padding: 0.26rem 0.3rem;
  }
  .footer2 ul li{
    line-height: 100%;
    font-size: 0.28rem;
    color: #666;
    margin:0.14rem 0;
  }
  .footer2 ul li img{
    width: 0.23rem;
    vertical-align: top;
    margin-top: 0.15rem;
    margin-right: 0.15rem;
  }
  .footer2 #navigation{
    display: block;
    text-align: center;
    line-height: 0.84rem;
    margin: 0.2rem auto 0.4rem auto;
    width: 6.9rem;
    height: 0.84rem;
    background: #ee3f44;
    color: #fff;
    font-size: 0.32rem;
  }
  /*点标记样式*/
  .marker-route{
    background: url('../../assets/images/storeMap/timg.png') no-repeat 0 0;
    background-size: 100%;
    width: 0.4rem;
    height: 0.6rem;
    line-height: 0.4rem;
    font-size: 0.26rem;
    color: #fff;
    font-family: "微软雅黑";
    text-align: center;
  }
  .finish{
    width:100%;
    font-size:0.26rem;
    text-align:center;
    padding:0.1rem 0;
  }


  .amap-demo {
    height: 450px;
  }
  .amap-page-container {
    height: 450px;
  }
  .toolbar{
    background: #ff8e2e;
  }

  .u-tel{
    color: #666;
    display: block;
  }




</style>
