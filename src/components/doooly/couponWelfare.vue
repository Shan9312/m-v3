<template>
  <div class="view">
    <ul class="text_title first_title">
      <li v-for="(item,index) in firsttabList" :key="index" :class="{check:firstcheckedLi==index}" @click="choicefirstTab(index,item.title)">
        {{item.title}}
      </li>
    </ul>
    <ul class="text_title">
      <li v-for="(item,index) in tabList" :key="index" :class="{check:checkedLi==index}" @click="choiceTab(index,item.id,item.company)">
        <img :src="item.logo"><br>
        {{item.company}}
      </li>
    </ul>
    <div class="text_title_bg"></div>
    <div class="middle" v-infinite-scroll="loadMore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
        <ul id="activityList" class="text_list">
          <li v-for="(item,index) in activityData" :key="index">
            <div  class="banner"><img :src="item.wechatDetailImage"></div>
            <div class="content">
              <p>{{item.productName}}</p>
              <div class="des">{{item.description}}</div>
              <div class="data">有效期：{{fmtDate(item.beginDate)}}-{{fmtDate(item.endDate)}}</div>
            </div>
            <div class="check">
              <div class="pirce"><span>￥</span>{{item.couponValue}}</div><br>
              <div class="button" @click="linkToast(item.businessOnlineUrl,item.productName)">立即领取</div>  
            </div>
          </li>
        </ul>
        <div v-show="moreLoading||allLoaded">
          <div class="loadContainer" v-if="allLoaded">
            <div class="loadText">小兜正在挖掘优惠中，尽请期待哦！</div>
            <div class="loadLine"></div>
          </div>
          <div v-show="moreLoading&&!allLoaded" class="mint-loadmore-bottom">
            <span class="loading_gif"></span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  export default {
    name: "hot-activity",
    data(){
      return{
        bottomDistanceValue: 70,
        activityData:[],
        pageNumber:1,
        pageSize:10,
        loadContainerState: false,
        scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        loadFinish: false,
        dialogState:false,
        dialogBoxData:{
          detailUrl:'',
          company:'',
          logo:'',
        },
        tabList:[
          {
            company:'全部',
            id:'',
            logo:require('../../assets/images/coupon/all_list.png'),
          },
        ],
        firsttabList:[
          {
            title:"全部",
            type:""
          },
          {
            title:"餐饮券",
            type:1
          },
          {
            title:"网购券",
            type:2
          },
          {
            title:"出行券",
            type:3
          },
          {
            title:"其他券",
            type:4
          },
        ],
        checkedLi:0,
        firstcheckedLi:"",
        id:0,
        resCountPage:0,
        moreLoading: false,
        allLoaded: false,
        checkedTabName:'全部',//当前选中的tab
        checkedfirstTabName:'全部',//当前选中的tab
      }
    },
    mounted(){
      document.body.style.backgroundColor="#f5f5f5";
      this.loadtabList();
      dooolyAPP.initTitle('优惠券');
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    methods: {
      loadFirstPage() {
        http({
          method: 'post',
          url: api.couponList,
          data:{
            businessId:this.id,
            categoryType:this.firstcheckedLi,
            currentPage:this.pageNumber,
            pageSize:this.pageSize,
          }
        }).then((res) => {
          if(res.data.code==1000) {
            this.resCountPage=parseInt(res.data.data.countPage);
            this.activityData = [...res.data.data.couponList];
            if(this.pageNumber>=res.data.data.countPage){
              this.allLoaded=true;
            }
          }
        }).catch(err => {
        });
      },
      fmtDate(obj){
          var date =  new Date(obj);
          var y = 1900+date.getYear();
          var m = "0"+(date.getMonth()+1);
          var d = "0"+date.getDate();
          return m.substring(m.length-2,m.length)+"."+d.substring(d.length-2,d.length);
      },
      more() {
        this.pageNumber = this.pageNumber + 1;
        this.moreLoading=true;
        http({
          method: 'post',
          url: api.couponList,
          data:{
            businessId:this.id,
            categoryType:'',
            currentPage:this.pageNumber,
            pageSize:this.pageSize,
          }
        }).then((res) => {
          if (this.pageNumber >= res.data.data.countPage) {
          }
          this.activityData = this.activityData.concat([...res.data.data.list]);
        });
      },
      // 上拉加载
      loadMore() {
        if(this.pageNumber < this.resCountPage){
          this.more();
          this.moreLoading=false;
        }else{
          this.allLoaded=true;
        }
      },
      loadtabList() {
        http({
          method: 'post',
          url: api.businessList,
          headers: {
            'Content-Type': 'application/json'
          },
          data:{
            categoryType:this.firstcheckedLi
          }
        }).then((res) => {
          if(res.data.code == 1000){
            this.tabList.push(...res.data.data.businessList);
            this.id = this.tabList[0].id;
            this.loadFirstPage();
          }
        })
      },
      choiceTab(index, id,name) {
        this.$baiduStats('优惠券-顶部bt-' + this.checkedTabName);
        if(this.checkedTabName==name){
          return;
        }
        this.checkedTabName=name;
        //新增
        this.activityData=[];
        this.id = id;
        this.checkedLi = index;
        this.moreLoading=false;
        this.allLoaded=false;
        this.loadFirstPage();
        this.pageNumber=1;
      },
      choicefirstTab(index,name) {
        this.$baiduStats('优惠券-顶部bt-' + this.checkedfirstTabName);
        if(this.checkedfirstTabName==name){
          return;
        }
        this.checkedfirstTabName=name;
        this.checkedTabName="全部";
        this.firstcheckedLi = index;
        this.checkedLi = 0;
        this.activityData=[];
        this.tabList=[
          {
            company:'全部',
            id:'',
            logo:require('../../assets/images/coupon/all_list.png'),
          },
        ],
        this.loadtabList();
      },
      linkToast(businessOnlineUrl,productName) {
        window.location.href = businessOnlineUrl;
        this.$baiduStats('优惠券-' + this.checkedTabName + '-' + productName);
      },
    },
  }
</script>

<style scoped>
  
  .text_title{
    position: fixed;
    left: 0;
    top: 0.8rem;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 1.6rem;
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    white-space: nowrap;
    font-size: 0;
    background: #fff;
    z-index: 1;
    /* box-shadow: 0px 5px 7px 0px #ECECEC; */
    border-bottom: 1px solid #ececec;
  }
  .first_title{
    top: 0;
    height: 0.78rem;
  }
  .text_title::-webkit-scrollbar {
   display: none;
   opacity: 0;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  .text_title::-webkit-scrollbar-track
  {
    opacity: 0;
  }

  /*定义滑块 内阴影+圆角*/
  .text_title::-webkit-scrollbar-thumb{
    opacity: 0;
  }

  .text_title_bg{
    width: 100%;
    height: 2.4rem;
    padding-bottom: 0.3rem;
  }
  .text_title li{
    display: inline-block;
    font-size: 0.28rem;
    height: 1.6rem;
    margin: 0 0.26rem;
    line-height: 100%;
    text-align: center;
    color: #333;
    position: relative;
  }
  .text_title li img{
    border-radius: 100%;
  }
  .text_title li.check{
    color: #ee3f44;
  }
  .text_title li.check::after{
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%,0);
    border-width: 0 0.1rem 0.1rem; 
    border-style: solid;
    border-color: transparent transparent #ececec;
  }
  .first_title li{
    height: 0.74rem;
    line-height: 0.74rem;
    margin: 0;
    width: 20%;
  }
  .first_title li.check{
    color: #ee3f44;
    border-bottom: 0.06rem solid #ee3f44;
  }
  .first_title li.check::after{
    border:0;
  }
  .text_title li img{
    width: 0.8rem;
    height: 0.8rem;
    margin: 0.2rem 0 0.16rem 0;
  }
  .text_list li{
    font-size: 0;
    margin: 0 auto;
    margin-bottom: 0.3rem;
    color: #999;
    width: 7.1rem;
    height: 2rem;
    background: url(../../assets/images/coupon/conpon_bg3.png) no-repeat 0 0;
    background-size: 100%;
    overflow: hidden;
    display: flex;
  }
  .text_list li .banner{
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.4rem 0.2rem;
    border-radius: 1rem;
    overflow: hidden;
  }
  .text_list li .banner img{
    width: 100%;
    height: 100%;
  }
  .text_list li .content{
    width: 3.6rem;
    height: 2rem;
    position: relative;
  }
  .content p{
    color: #333;
    font-size: 0.32rem;
    margin-top: 0.4rem;
    line-height: 110%;
    overflow:hidden; 
    white-space: nowrap;
  }
  .content .des{
    color: #999;
    font-size: 0.24rem;
    margin-top: 0.12rem;
    line-height: 120%;
    overflow:hidden; 
    white-space: nowrap;
  }
  .content .data{
    position: absolute;
    left: 0;
    bottom: 0.4rem;
    font-size: 0.24rem;
    width: 100%;
    line-height: 110%;
    color: #666;
    overflow:hidden; 
    white-space: nowrap;
  }
  .text_list li .check{
    width: 2rem;
    height: 2rem;
    text-align: center;
  }
  .text_list li .check div{
    display: inline-block;
  }
  .text_list li .check .pirce{
    margin-top: 0.4rem;
    font-size: 0.5rem;
    color: #ee3f44;
  }
  .text_list li .check .pirce span{
    font-size: 0.24rem;
  }
  .text_list li .check .button{
    width: 1.36rem;
    line-height: 0.56rem;
    border:1px solid #ee3f44;
    color: #ee3f44;
    font-size: 0.26rem;
    border-radius: 0.1rem;
    margin-top: 0.15rem;
  }
  .loadContainer {
    width: 100%;
    font-size: 0.24rem;
    text-align: center;
    padding: 0.5rem 0;
    background: #f5f5f5;
    color: #999;
    position: relative;
  }

  .loadText {
    background: #f5f5f5;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    white-space: nowrap;
    z-index: 2;
    padding: 0 0.1rem;
  }

  .loadLine {
    width: 6.9rem;
    height: 1px;
    background: #ececec;
    position: absolute;
    right: 0.3rem;
    top: 50%;
  }

  .mint-loadmore-bottom {
    width: 100%;
    font-size: 0.26rem;
    text-align: center;
    padding: 0.1rem 0;
  }

  .mint-loadmore-bottom-img {
    width: 1rem;
  }
  .mint-loadmore-bottom{
    display: none!important;
  }
</style>
