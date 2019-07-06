<template>
  <div class="view">

    <ul class="text_title">
      <li v-for="(item,index) in tabList" :key="index" :class="{check:checkedLi==index}" @click="choiceTab(index,item.id,item.categoryName)">{{item.categoryName}}</li>
    </ul>
    <div class="text_title_bg"></div>
    <div class="middle" v-infinite-scroll="loadMore" infinite-scroll-disabled="moreLoading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
      <ul id="activityList" class="text_list">
        <li v-for="(item,index) in activityData" :key="index" @click="linkToast(item.logo,item.discount,item.maxUserRebate,item.dealType,item.activityLinkUrl,item.businessId,item.activityType,item.id)">
          <img :src="item.listImageUrl" alt="item.company" class="banner">
          <p>{{item.name}}</p>
          <div class="clearfix">
            <img class="logo fl" :src="item.logo">
            <div class="fl">{{item.company}}</div>
            <div class="fr">{{"还剩"+timeToTime(item.endDate-Date.parse(new Date()))}}</div>
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
    <!--</div>-->
    <toast v-if="toastState == 1" :toastData="toastData" :firstShow="1"></toast>
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
      tabList:[{'categoryName':'推荐'}],
      checkedLi:0,
      isRecommendation:1,
      id:0,
      toastState:0,
      toastData:{},
      resCountPage:0,
      moreLoading: false,
      allLoaded: false,
      checkedTabName:'推荐'//当前选中的tab
    }},
    components: {
      toast:toast
    },
    beforeCreate(){
      document.body.style.backgroundColor="#fff";
    },
    beforeDestroy(){
      document.body.style.backgroundColor="";
    },
    activated(){
      initTitle('活动',5);
    },
    methods: {

      timeToTime(time){

        var second_time=time/1000
        var time1 = parseInt(second_time) + "秒";
        var day;
        var hour;
        var min;
        var second;
        if(parseInt(second_time )> 0){
          second = parseInt(second_time);
        }
        if( parseInt(second_time )> 60){
           min = parseInt(second_time / 60);
          if( min > 60 ){
            min = parseInt(second_time / 60) % 60;
            hour = parseInt( parseInt(second_time / 60) /60 );
            if( hour > 24 ){
              hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
              day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
            }
          }
        }
        if(day>0){
          return day+'天';
        }
         else if(hour>0)
         {
           return hour+'小时';

         }
         else if(min>0){
           return min+'分钟';
         }
         else{
          if(second){
            return second+'秒';
          }
          else{
            return '';
          }
        }


      },

      joinActivityUrl(token, pageNumber, pageSize, isRecommendation, id) {
        return api.getHotActivityList + '?token=' + token + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&isRecommendation=' + this.isRecommendation + '&id=' + this.id
      },
      loadFirstPage() {
        http({
          method: 'post',
          url: this.joinActivityUrl(localStorage.token, this.pageNumber, this.pageSize),
        }).then((res) => {
          this.resCountPage=parseInt(res.data.data.countPage);
          this.activityData = [...res.data.data.list];
          if(this.pageNumber>=res.data.data.countPage){
            this.allLoaded=true;
          }
        });

      },
      more() {
        this.pageNumber = this.pageNumber + 1;
        this.moreLoading=true;
        http({
          method: 'post',
          url: this.joinActivityUrl(localStorage.token, this.pageNumber, this.pageSize),
        }).then((res) => {
          if (this.pageNumber >= res.data.data.countPage) {
          }
          this.activityData = this.activityData.concat([...res.data.data.list]);
        });
      },
      // 上拉加载
      loadMore() {
        if(this.pageNumber < this.resCountPage)
        {
          this.more();
          this.moreLoading=false;
        }
        else{
          this.allLoaded=true;
        }
      },
      changedialogBoxData(detailUrl, company, logo, activityType) {

        if (activityType == 10 || activityType == 12) {
          this.dialogState = !this.dialogState;
          this.dialogBoxData = {
            detailUrl: '',
            company: '',
            logo: '',
          };
          this.dialogBoxData.detailUrl = detailUrl;
          this.dialogBoxData.company = company;
          this.dialogBoxData.logo = logo;
        }else{
          dooolyAPP.gotoJumpJq.call(this,detailUrl);
        }
      },
      chaildDialogState(data) {
        this.dialogState = false;
      },
      loadtabList() {
        http({
          method: 'post',
          url: api.getActivityCategoryList,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          data: {
            'token': localStorage.token
          }

        }).then((res) => {
          this.tabList.push(...res.data.data.adBasicTypeList);
        })
      },
      choiceTab(index, id,name) {
        this.$baiduStats('活动-赚钱-' + index);
        if(this.checkedTabName==name){
          return;
        }
        this.checkedTabName=name;

        //新增
        this.activityData=[];
        if (index == 0) {
          this.isRecommendation = 1;
          this.id = 0;
          this.checkedLi = 0;
          this.moreLoading=false;
          this.allLoaded=false;
          this.loadFirstPage();
          this.pageNumber=1;
        }
        else {
          this.isRecommendation = 0;
          this.id = id;
          this.checkedLi = index;
          this.moreLoading=false;
          this.allLoaded=false;
          this.loadFirstPage();
          this.pageNumber=1;
        }
      },
      linkToast(logo, discount, maxUserRebate, dealType, url,id,activityType,activityId) {
        this.$baiduStats('活动-赚钱-' + this.checkedTabName + '-活动' + id);
         if(activityType==12){
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
         }
         else if(activityType==13){
           dooolyAPP.gotoJumpVue.call(this,'/hotActivityDetail/'+activityId)
         }

      },
      // 定义一个函数，用来读取特定的cookie值。
      getCookie(cookie_name) {
        var allcookies = document.cookie;
        var cookie_start = allcookies.indexOf(cookie_name); //寻找名第一次出现的位置
        // 如果找到了就代表cookie存在
        // 反之，就说明不存在。
        if (cookie_start != -1) {
          // 把cookie_start放在值的开始，只要给值加1即可。
          cookie_start += cookie_name.length + 1;
          var cookie_end = allcookies.indexOf(';', cookie_start);
          if (cookie_end == -1) {
            cookie_end = allcookies.length;
          }
        }
      }
    },
    mounted(){
      this.loadFirstPage();
      this.loadtabList();
    },
    beforeCreated(){
      if(browserName == "otherAPPAndroid"){
        RHNativeJS.visablePtrFrame(true);
      };
    },
    created(){
      if(browserName == "otherAPPAndroid"){
        RHNativeJS.visablePtrFrame(false);
      };
      initTitle('活动',5);
    }
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
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    white-space: nowrap;
    font-size: 0;
    background: #f7f7f7;
    z-index: 1;
    box-shadow: 0px 1px 0px 0px #ECECEC;
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
  .text_title::-webkit-scrollbar-thumb
  {
    opacity: 0;
  }

  .text_title_bg{
    width: 100%;
    height: 0.78rem;
    padding-bottom: 0.3rem;
  }
  .text_title li{
    display: inline-block;
    line-height: 0.78rem;
    font-size: 0.32rem;
    margin: 0 0.26rem;
    color: #999;
  }
  .text_title li.check{
    color: #ee3f44;
  }
  .text_list li{
    background: #fff;
    padding-bottom: 0.24rem;
    font-size: 0;
    margin: 0 auto;
    margin-bottom: 0.3rem;
    color: #999;
    width: 6.9rem;
    border-radius: 0.05rem;
    overflow: hidden;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.10);
  }
  .text_list li .banner{
    width: 100%;
    height: 2.6rem;
  }
  .text_list li p{
    color: #333;
    font-size: 0.32rem;
    margin-top: 0.24rem;
    text-indent: 0.3rem;
  }
  .text_list li .clearfix{

    margin-top: 0.18rem;
  }

  .text_list li .clearfix .fl{
    font-size: 0.28rem;
    color: #999;
    margin-left: 0.08rem;
  }
  .text_list li .clearfix .logo{
    width: 0.4rem;
    height: 0.4rem;
    margin-left: 0.3rem;
    border-radius: 50%;
  }
  .text_list li .clearfix .fr{
    font-size: 0.28rem;
    color: #EE3F44;
    margin-right: 0.3rem;
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
</style>
