<template>
  <div class="view" v-if="htmlShow">
    <ul class="text_title">
      <li v-for="(item,index) in tabList" :key="index" :class="{check:checkedLi==index}" @click="choiceTab(index,item.guideCategoryId,item.categoryName)">{{item.categoryName}}</li>
    </ul>
    <div class="text_title_bg"></div>
    <div class="middle" v-infinite-scroll="loadMore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
      <ul id="activityList" class="text_list">
        <li v-for="(item,index) in activityData" :key="index" @click="linkToast(item.businessLogo,item.discount,item.maxUserRebate,item.dealType,item.linkUrlWechat,item.businessId,item.id,item.isStar)">
          <div  class="banner"><img :src="item.imageWechat" :onerror="defaultImg"></div>
          <div class="content">
            <p>{{item.name}}</p>
            <div class="pirce"><span>￥</span>{{item.isStar == 1 ? item.dooolyPrice : item.price}}</div>
            <div class="cpirce">市场价：<span>{{item.marketPrice}}</span></div>
            <div class="bpirce" v-show="parseFloat(item.userRebate) > 0">返{{item.userRebate}}%</div>
            <div class="get" v-if="item.shippingMethod">{{item.shippingMethod}}</div>
          </div>
        </li>
      </ul>
      <div v-show="moreLoading||allLoaded">
        <div class="loadContainer" v-if="allLoaded">
          <div class="loadText"></div>
          已经全部加载完毕
          <div class="loadLine"></div>
        </div>
        <div v-show="moreLoading&&!allLoaded" class="mint-loadmore-bottom">
          <span class="loading_gif"></span>
        </div>
      </div>
 
  </div>
    <toast v-if="toastState == 1" :toastData="toastData" :firstShow="1"></toast>
    <div class="isSuccess_bg" v-show="alr_show" @touchmove.prevent>
      <div class="isSuccess clearfix">
        <p>兜礼积分返利提示</p>
        <div class="content">
        <span class="left-content">1、</span><span class="right-content">购买兜礼特选商品可获得兜礼积分。</span>
        </div>
        <div class="content">
        <span class="left-content">2、</span><span class="right-content">完成消费之日起的45日后积分到账。</span>
        </div>
        <div class="content">
        <span class="left-content">3、</span><span class="right-content">积分根据实际支付部分按比例返还。</span>
        </div>
        <div class="content">
        <span class="left-content">4、</span><span class="right-content">非认证会员无法享受兜礼积分返利。</span>
      </div>
        <div class="input" @click="alr_show=false">我知道了</div>
      </div>
    </div>
  </div>
</template>
 
<script>
  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import toast from '@/components/common/toast';
  export default {
    name: "hot-activity",
    data()
    {return{
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
        logo:''
      },
      tabList:[],
      checkedLi:0,
      id:0,
      toastState:0,
      toastData:{},
      resCountPage:0,
      moreLoading: false,
      allLoaded: false,
      checkedTabName:'推荐',//当前选中的tab
      alr_show:false,
      defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"',
      activityId:this.$route.params.activityId || '',
      htmlShow:false,
    }},
    components: {
      toast:toast
    },
    activated(){
      initTitle('发现');
    },
    mounted(){
      this.loadtabList();
      initTitle('发现');
    },
    methods: {
      loadFirstPage() {
        this.pageNumber = 1;
        http({
          method: 'post',
          url: (this.activityId ? api.findlist : api.getGuideProductListV3),
          data:{
            userId:localStorage.userId,
            guideCategoryId:this.id,
            currentPage:this.pageNumber,
            pageSize:this.pageSize,
            activityId:this.activityId,
          }
        }).then((res) => {
          if(res.data.code==1000) {
            if(res.data.isNew == 0){
              this.alr_show = true;
            }
            this.resCountPage=parseInt(res.data.data.countPage);
            this.activityData = [...res.data.data.adProducts];
            if(this.pageNumber>=res.data.data.countPage){
              this.allLoaded=true;
            }
          }
          if(res.data.data.status && res.data.data.status == 1){
            this.htmlShow = false;
          }else{
            this.htmlShow = true;
          }
          if(res.data.data.actName){
            initTitle(res.data.data.actName);
          }
        });
      },
      more() {
        this.pageNumber = this.pageNumber + 1;
        this.moreLoading=true;
        http({
          method: 'post',
          url: (this.activityId ? api.findlist : api.getGuideProductListV3),
          data:{
            userId:localStorage.userId,
            guideCategoryId:this.id,
            recommendHomepage:0,
            currentPage:this.pageNumber,
            pageSize:this.pageSize,
            activityId:this.activityId,
          }
        }).then((res) => {
          if (this.pageNumber >= res.data.data.countPage) {
          }
          this.activityData = this.activityData.concat([...res.data.data.adProducts]);
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
          url: api.getGuideCategaryList,
          headers: {
            'Content-Type': 'application/json'
          },
          data:{
            userId:localStorage.userId
          }
        }).then((res) => {
          if(res.data.code == 1000){
            this.tabList.push(...res.data.data.adGuideCategoryList);
            this.id = this.tabList[0].guideCategoryId;
            this.loadFirstPage();
          }
        })
      },
      choiceTab(index, id,name) {
        this.$baiduStats('发现-' + name);
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
      linkToast(logo, discount, maxUserRebate, dealType, url,id,activityId,isStar) {
        if(isStar == 1){
          dooolyAPP.gotoJumpJq.call(this,url);
          return;
        }
        this.$baiduStats('兜礼导购-' + this.checkedTabName + '-商品' + id);
          this.toastState = 1; 
          this.timeOut=setTimeout(() => {
            this.toastState=0;
          }, 950);  
          this.toastData.miniLogo = logo;
          if (discount == '' || discount == '0') {
            this.toastData.discount = '';
          } else {
            this.toastData.discount = '购物享' + discount + '折';
          }
          if (maxUserRebate == '' || maxUserRebate == '0') {
            this.toastData.maxUserRebate = '';
          } else {
            this.toastData.maxUserRebate = '最高返' + maxUserRebate + '%';
          }
          this.toastData.dealType = dealType;
          this.toastData.url = url;
          this.toastData.id = id;
      },
    },
  }
</script>
 
<style scoped>
  .text_title{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 0.78rem;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    font-size: 0;
    background: #fff;
    padding: 0 0.15rem;
    z-index: 1;
    box-shadow: 0px 5px 7px 0px #ECECEC;
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
    height: 0.78rem;
    padding-bottom: 0.4rem;
  }
  .text_title li{
    display: inline-block;
    line-height: 0.74rem;
    font-size: 0.28rem;
    margin: 0 0.25rem;
    color: #333;
  }
  .text_title li.check{
    color: #ee3f44;
    border-bottom: 0.06rem solid #ee3f44;
  }
  .text_list li{
    background: #fff;
    font-size: 0;
    margin: 0 auto;
    margin-bottom: 0.3rem;
    color: #999;
    width: 6.7rem;
    overflow: hidden;
    display: flex;
  }
  .text_list li .banner{
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.1rem;
    overflow: hidden;
  }
  .text_list li .banner img{
    width: 100%;
    height: 100%;
  }
  .text_list li .content{
    width: 4.4rem;
    height: 2.4rem;
    margin-left: 0.1rem;
    position: relative;
  }
  .text_list li .content::after{
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #e9e9e9;
    height: 1px;
    transform: translateY(50%);
  }
  .content p{
    color: #333;
    font-size: 0.28rem;
    margin-top: 0.2rem;
    padding-left: 0.1rem;
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
  }
  .content .pirce{
    position: absolute;
    left: 0.1rem;
    bottom: 0.66rem;
    font-size: 0.4rem;
    color: #ee3f44;
    line-height: 110%;
  }
  .content .pirce span{
    font-size: 0.22rem;
  }
  .content .cpirce{
    position: absolute;
    left: 0.1rem;
    bottom: 0.36rem;
    font-size: 0.2rem;
    color: #a0a0a0;
    line-height: 110%;
  }
  .content .cpirce span{
    text-decoration: line-through;
  }
  .content .bpirce{
    position: absolute;
    right: 0;
    bottom: 0.82rem;
    font-size: 0.22rem;
    color: #a0a0a0;
    line-height: 110%;
  }
  .content .get{
    position: absolute;
    right: 0;
    bottom: 0.3rem;
    padding: 0.08rem 0.1rem;
    font-size: 0.2rem;
    border-radius: 0.5rem;
    background: #ee3f44;
    color: #fff;
    line-height: 110%;
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
    width: 2.1rem;
    height: 1px;
    background: #ececec;
    position: absolute;
    left: 0.3rem;
    top: 50%;
  }
 
  .loadLine {
    width: 2.1rem;
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
  .isSuccess_bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(51,51,51,0.8);
    text-align: right;
    z-index: 9999;
  }
  .isSuccess{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5.4rem;
    background: #fff;
    margin-left: -2.75rem;
    margin-top: -2.93rem;
    border-radius: 0.2rem;
    font-size: 0;
  }
  .isSuccess p{
    font-size: 0.36rem;
    text-align: center;
    margin: 0.62rem 0 0.2rem 0;
    padding: 0 0.2rem;
    color:#333;
    font-weight: bold;
  }
  .isSuccess .content{
    display: flex;
    justify-content:center;
  }
  .isSuccess span{
    font-size: 0.28rem;
    display: inline-block;
    margin-top: 0.1rem;
    color: #999;
  }
  .isSuccess .input{
    left: 0;
    bottom: 0;
    line-height: 1rem;
    width: 100%;
    border-top: 1px solid #ececec;
    font-size: 0.36rem;
    color: #ee3f44;
    text-align: center;
    margin-top: 0.32rem;
  }
</style>