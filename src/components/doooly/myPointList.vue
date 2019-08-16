<template>
  <div class="container">
    <section class="topSection">
      <div class="div_header clearfix">
        <div class="fl left">
          <div class="usable_point" @click="usable_link(1,1);isbig_small=true">
            <span>可用积分</span>
            <p :class="{'big_p':isbig_small,'small_p':!isbig_small}">{{availablePoint}}</p>
          </div>
          <div class="to_point" @click="usable_link(2, 0);isbig_small=false">
            <span>即将可用</span>
            <p :class="{'big_p':!isbig_small,'small_p':isbig_small}">{{returnPoint}}</p>
          </div>
        </div>
        <div class="fr right"><span>1积分可抵1元</span></div>
      </div>
      <div v-show="isShow">
      <ul class="usable_ul">
        <li v-for="(item,index) in tabs" :key="index" v-bind:class='{l1:item.ifAdd==tab}'  @click="link(item.ifAdd, item.content)">
          <div class="div_bot">{{item.value}}</div>
        </li>
      </ul>
      </div>
    </section>
    <section>
      <div v-if="mainPointList" class="main-body" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore"
                    :bottomDistance="bottomDistanceValue" bottomDropText="" bottomPullText=""> -->
          <ul class="tabs1_usableUl mui-table-view list" :class='{loadBottom:browserName != "WebKit"&&browserName != "Chrome WebView"}'  v-infinite-scroll="loadBottom" infinite-scroll-disabled="false" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
            <li class='clearfix div_con' v-for="(item,index) in listData" :key="index"
                @click='businessDetail(item.id, pointType)'>
              <div class='fl icon_div'>
                <div v-if="item.type==7 || item.type==11">
                  <div><img src='../../assets/images/logo.png'/></div>
                </div>
                <div v-else-if="item.logo==undefined">
                  <div v-if="item.groupLogo == undefined"><img src=''/></div>
                  <div v-else><img :src='item.groupLogo' :onerror="defaultImg"/></div>
                </div>
                <div v-else >
                  <img :src='item.logo' :onerror="defaultImg"/>
                </div>
              </div>
              <div class='fl con'>
                <div v-if="item.orderId == undefined">
                  <div v-if="item.rechargeId==undefined">
                    <div v-if="item.type==10">
                      <p class='shop_name'>{{item.integralName}}-奖品</p>
                    </div>
                    <div v-if="item.type==7">
                      <p class='shop_name'>积分绑定-福利</p>
                    </div>
                    <div v-if="item.type==11">
                      <p class='shop_name'>兜礼签到领积分</p>
                    </div>
                  </div>
                  <div v-else-if="item.rechargeId!=undefined">
                    <p class='shop_name'>{{item.groupShortName}}-福利</p>
                  </div>
                </div>
                <div v-else>
                  <div v-if="item.storeName == undefined">
                    <p class='shop_name'>{{item.company}}</p>
                  </div>
                  <div v-else>
                    <p class='shop_name'>{{item.company}}-{{item.storeName}}</p>
                  </div>
                </div>
                <p class='con_date'>{{String(item.createDateStr).substring(5,17)}}</p >
              </div>
              <div class='fr con_money' v-if="tab==0&&item.businessRebateAmount>=0">
                +{{item.businessRebateAmount.toFixed(2)}}
              </div>
              <div class='fr con_money' v-else-if="tab==1&&item.businessRebateAmount>0">
                -{{item.businessRebateAmount.toFixed(2)}}
              </div>
              <div class='fr con_money' v-else-if="tab==1&&item.businessRebateAmount<0">
                {{item.businessRebateAmount.toFixed(2)}}
              </div>
              <div class='fr con_money' v-else>
                <div class="type_div_red" v-if="item.type==1 && item.amount"><span>+{{item.amount.toFixed(2)}}</span><span>返利中</span></div>
                <div class="type_div_red" v-if="item.type!=1 && item.amount"><span>-{{item.amount.toFixed(2)}}</span><span>退款中</span></div>
              </div>
            </li>
            <div class="loadContainer" v-if="loadContainerState">
              <div class="loadText">
                 <span class="loadLine"></span><span>已经全部加载完毕</span><span class="loadLine"></span>
              </div>
            </div>
          </ul>
          <div class="mint-loadmore-bottom" v-if="isLoading">
            <span class="loading_gif"></span>
          </div>
        <!-- </mt-loadmore> -->
      </div>
      <div v-if="noRecords" class="noRecord" style='text-align: center;'>
        <img style='width: 2.4rem;margin-top:1rem;' src='../../../src/assets/images/personalCenter/myPoint/no_point.png'/>
        <p style='color:#666;font-size:0.28rem;'>您还没有{{remindingText}}记录呢</p>
      </div>
    </section>
    <footer>
      <button class="btn btn-primary btn-block" data-baidu-stats="我的积分-可用积分服务" @click="appeal()"><span>可用积分服务</span></button>
    </footer>
  </div>
</template>

<script>
  import http from '@/http/http.js'
  import api from '@/assets/js/api.js';
  import { cannelUserFlag } from 'v3/services';
    export default {
      name: "myPointList",
      data(){
          return{
            availablePoint:"",
            returnPoint:"",
            isShow:true,
            isPointfrist:false,
            tabs: [
              {
                value: "收入记录",
                ifAdd: 0,
                content:"收入"
              },
              {
                value: "支出记录",
                ifAdd: 1,
                content:"支出"
              }
            ],
            browserName:this.$browserName,
            tab:"0",
            mainPointList:true,
            noRecords:false,
            pageNumber:1,
            pageSize:10,
            pointType:this.$route.params.pointType,
            allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
            loadContainerState: false,
            scrollMode: "auto", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
            loadFinish: false,
            bottomDistanceValue: 70,
            listData:[],
            remindingText:"",
            income:1,
            isLoading:true,
            isbig_small:true,
            defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"'
          }
      },
      created(){
      dooolyAPP.initTitle('我的积分','')
      },
      mounted(){
        this.vmCannelUserFlag();
        http({
          method: 'get',
          url: api.myPoint+"?token="+localStorage.token
        }).then((res) => {
          this.availablePoint=res.data.availablePoint;
          this.returnPoint=res.data.returnPoint;
        });
      if(this.pointType==1){//可用积分
        this.isShow = true;
        this.isbig_small=true;
        this.income=1;
        this.remindingText='收入';
      } else if (this.pointType == 3){
        this.isShow = false;
        this.remindingText='即将过期';
      }else{//即将可用
        this.pointType=2;
        this.isShow = false;
        this.isbig_small=false;
        this.income=0;
        this.remindingText='待返';
      }
        this.loadFirstPage();
      },
      methods:{
        vmCannelUserFlag(){
          let userFlag = '';
          userFlag = (this.pointType == 1 ? '2' : '3');
          cannelUserFlag(userFlag);
        },
        pointUrl:function (token,pageNumber,pageSize,pointType,income) {
          return api.myPointList+"?token="+token+"&pageNumber="+pageNumber+"&pageSize="+pageSize+"&pointType="+pointType+"&income="+income;
        },
        loadFirstPage(){
          http({
            method: 'get',
            url: this.pointUrl(localStorage.token,this.pageNumber,this.pageSize,this.pointType,this.income),
          }).then((res) => {
            this.listData=res.data.adAvailablePoints;
            if(this.listData!= undefined){
                this.mainPointList=true;
                this.noRecords=false;
                this.isLoading=true;
                if (this.pageNumber >= res.data.countPage) {
                  this.allLoaded = true;
                  this.loadContainerState = true;
                  this.isLoading=false;
                }
            }else{
              this.mainPointList=false;
              this.noRecords=true;
              this.isLoading=false;
            }
          });
          this.$nextTick(function () {
            this.scrollMode = "touch";
          });
        },
        more(){
          this.pageNumber = this.pageNumber + 1;
          http({
            method: 'get',
            url: this.pointUrl(localStorage.token,this.pageNumber,this.pageSize,this.pointType,this.income),
          }).then((res) => {
            this.isLoading=true;
            if (this.pageNumber >= res.data.countPage) {
              this.allLoaded = true;
              this.loadContainerState = true;
              this.isLoading=false;
            }
            this.listData = this.listData.concat(res.data.adAvailablePoints);
          });
        },
        usable_link:function (pointType,income) {
          this.listData=[];
          this.tab=0;
          if(pointType==1){//可用积分
            this.isShow = true;
            this.remindingText='收入';
            this.$baiduStats('我的积分-收入记录');
          }else{//即将可用
            this.isShow = false;
            this.remindingText='待返';
            this.$baiduStats('我的积分-即将可用');
          }
          this.pointType=pointType;
          this.income=income;
          this.loadFirstPage();
        },
        // 上拉加载
        loadBottom() {
          if(!this.isLoading){
            return;
          }
          this.more();// 上拉触发的分页查询
        },
        link:function (index, content) {
          this.listData=[];
          this.allLoaded = false;
          this.loadContainerState = false;
          this.pageNumber=1;
          this.income=index+1;
          this.tab = index;
          this.remindingText=content;
          this.isLoading=true;
          this.loadFirstPage();
          if(index==0){
            this.$baiduStats('我的积分-收入记录');
          }else{
            this.$baiduStats('我的积分-支出记录');
          }
        },
        businessDetail:function (itemId,itemPointType) {
          //关闭新手引导
          dooolyAPP.showNavgationBar();
          let jumpUrl="/myPointDetail/"+itemId+"/"+itemPointType;
          dooolyAPP.gotoJumpVue(this.$router,jumpUrl);
        },
        //判断是否是第一次进入
        beforeCreate(){
          document.body.style.backgroundColor="#f5f5f5";
        },
        beforeDestroy(){
          document.body.style.backgroundColor="";
        },
        appeal:function () {
          let jumpUrl="/pointsService";
          dooolyAPP.gotoJumpVue(this.$router,jumpUrl);
        }
      }
    }
</script>

<style scoped>
  /*主体部分*/
  .topSection{background-color: #fff;padding-top: 0.2rem;}
  .div_header{
    width: 6.9rem;
    margin: auto;
    background:url(../../assets/images/personalCenter/myPoint/point_bg.png) no-repeat;
    background-size: 100% 100%;
  }
  .left{margin: 0.54rem 0 0.36rem 0.36rem;width: 60%;overflow: hidden;text-overflow: ellipsis;}
  .usable_point{font-size: 0}
  .left span{font-size: 0.24rem; color: #f9cdc6}
  .big_p{font-size: 0.56rem; color: #fff;font-weight: bold;width: 100%; overflow: hidden;text-overflow: ellipsis;}
  .to_point{font-size: 0; margin-top: 0.6rem}
  .small_p{font-size: 0.28rem; color: #fff;font-weight: bold;}
  .right{
    padding: 0 0.2rem;
    height: 0.4rem;
    margin: 0.48rem 0.4rem 0 0;
    background-color:rgba(255,255,255,0.2);
    border-radius: 0.5rem;
    text-align: center;
    font-size: 0;
  }
  .right span{line-height:0.4rem; vertical-align:middle;font-size: 0.24rem;color: #fff;}
  .usable_ul{font-size: 0;border-bottom: 1px solid #ececec;margin-bottom: 0.2rem;}
  .usable_ul li{display: inline-block;line-height: 0.98rem;font-size: 0.28rem;width: 49.8%;text-align: center;}
  .usable_ul li.l1{color: #ee3f43;}
  .usable_ul li.l1 .div_bot{color: #ee3f43;text-decoration: none;border-bottom: 2px solid #ee3f44;
  display: inline-block;height: 0.95rem;}

  .div_con{background: #fff; padding: 0 0.3rem;border-bottom:1px solid #ececec;height: 1.5rem; clear: both;}
  .div_con a{height: 1.5rem;display: block;}
  .div_con .icon_div{height: 1.1rem;font-size: 0;margin-right: 0.3rem;}
  .div_con .icon_div img{width:0.9rem; height:0.9rem;display: inline-block;margin-top:0.3rem;border-radius:50%;}
  .div_con .icon_div i{font-size: 0.6rem;color: #a0a0a0;padding: 0.2rem 0.2rem 0.2rem 0;}
  .div_con .con{width:40%;}
  .div_con .con .shop_name{color: #333;font-size: 0.28rem;margin-top: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  .div_con .con .con_date{color: #999;font-size: 0.24rem;margin-top: 0.06rem;}
  .div_con .con_money{line-height: 1.5rem;color: #333;font-size: 0.36rem;}
  /* footer */
  footer{position: fixed;left: 0;bottom: 0;width: 100%;z-index: 1010;background: #fdfdfd; }
  /* btn */
  .btn{height:1rem;line-height:1rem;padding: 0;font-size:0.32rem;color: #fff;}
  .btn-primary {border: none;background-color: #ee3f44;}
  .btn-block {display: block;width: 100%;}

  .main-body {
  }

  .loadContainer {
    width: 100%;
    font-size: 0.24rem;
    text-align: center;
    padding: 0.3rem 0 1.5rem 0;
    background: #fff;
    color: #999;
  }

  .loadText {
    height: 0.5rem;
    line-height: 0.5rem;
  }
  .loadText span{
    margin: 0 0.2rem;
    vertical-align: middle;
  }

  .loadLine {
    display: inline-block;
    width: 2.1rem;
    height: 1px;
    background: #ececec;
    vertical-align: middle;
  }

  .mint-loadmore-bottom {
    width: 100%;
    font-size: 0.26rem;
    text-align: center;
    padding: 0.1rem 0 1rem 0;
  }

  .mint-loadmore-bottom-img {
    width: 1rem;
  }
/*新手指引*/
.novice_guide{position:fixed;left:0;top:0;width:100%;height:100%;z-index: 20;background: rgba(0,0,0,0.7); }
.novice_guide img{width: 80%;position: absolute;bottom: 1.2rem;left: 50%;margin-left: -40%;}
@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3) {
    .novice_guide img{
        margin-bottom: 34px;
    }
}
.type_div_red{
  font-size: 0.28rem;
  color: #ee3f44;
  line-height: normal;
  height: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.type_div_red span:first-child{
  font-size: 0.32rem;
  color:#333;
}

.btn_after span{
    content: '';
    width: 100%;
    height: 100%;
    color: #fff;
    z-index: 2;
    left: 0;
    top: 0;
    opacity: 0;
    animation:twinkling 1s infinite 0.9s ease-in-out alternate;
}
@keyframes twinkling{
    0%{opacity: 0;}
    100%{opacity: 1;}
}
</style>
