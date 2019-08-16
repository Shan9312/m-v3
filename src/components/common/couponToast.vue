<template>
    <div class="coupon" v-if="introduction">
        <div class="bg" @touchmove.prevent v-show="conponShow">
            <div class="conpon_view fixde" v-show="!ruleShow">
                <div class="close" @click="changeShow">
                    <img src="../../assets/images/coupon/close.png">
                </div>
                <div class="check" @click="ruleShow = true">
                    查看规则
                </div>
                <div class="titleBg">
                    <img src="../../assets/images/coupon/fiexd_bg.png">
                </div>
                <div class="list_view">
                    <div class="conpon" v-for="(item,index) in todayAdCoupons" :key="index" :class="{org:item.couponStatus == 2 || item.couponStatus == 4}" v-show="today == getDay(item.beginDate) && index < todayCounts">
                        <div class="pirce">
                            <div class="count">
                                <img v-if="CheckImgExists(item.bussinessLogo)" :src="item.bussinessLogo">
                                <img v-else src="../../assets/images/logo.png">
                            </div>
                            <div class="text">{{item.businessName}}</div>
                        </div>
                        <div class="content">
                            <div>{{item.productName}}</div>
                            <div>{{item.description}}</div>
                            <!-- <div>{{fmtDate(item.beginDate)}}-{{fmtDate(item.endDate)}}有效</div> -->
                        </div>
                        <div class="button" v-if="item.couponStatus == 1" @click="getConpon(item.activityId,item.couponId,index,item.receiveChannel,item.businessOnlineUrl)">
                            领取
                        </div>
                        <div class="button" data-baidu-stats="首页-卡券活动-下午茶-点击去使用" v-else-if="item.couponStatus == 2" @click="goConpon(item.id)">
                            去使用
                        </div>
                        <div class="button over" v-else-if="item.couponStatus == 4">
                            已领完
                        </div>
                    </div>
                    <div class="title" v-if="tomorrowAdCoupons.length > 0">
                        <span>明日预告</span>
                    </div>
                    <div class="conpon tomorrow" v-for="(item,index) in tomorrowAdCoupons" :key="index" v-show="today+1 == getDay(item.beginDate) && index < tomorrowCounts">
                        <!-- <div class="tag">
                            <img src="../../assets/images/coupon/tag.png">
                        </div> -->
                        <div class="pirce">
                            <div class="count">
                                <img v-if="CheckImgExists(item.bussinessLogo)" :src="item.bussinessLogo">
                                <img v-else src="../../assets/images/logo.png">
                            </div>
                            <div class="text">{{item.businessName}}</div>
                        </div>
                        <div class="content">
                            <div>{{item.productName}}</div>
                            <div>{{item.description}}</div>
                            <!-- <div>{{fmtDate(item.beginDate)}}-{{fmtDate(item.endDate)}}有效</div> -->
                        </div>
                        <div class="button">
                            敬请期待
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixde rule_view" v-show="ruleShow">
               <div class="close" @click="changeShow">
                    <img src="../../assets/images/coupon/close.png">
                </div>
                <div class="check" @click="ruleShow =false">
                    查看优惠
                </div>
                <div class="titleBg">
                    <img src="../../assets/images/coupon/fiexd_bg.png">
                </div>
                <div class="title">
                    <span>活动规则</span>
                </div>
                <div class="rule" v-html="introduction">
                    <!-- 1、新老用户都可以参与<br>
                    2、每人每天只可领取一次，领完即止<br>
                    3、每日预告明日可领优惠券<br>
                    4、如有疑问请拨打：400-158-2212<br> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
    name: "couponToast",
    props:['conponShow','isGift'],
    data(){
        return{
            introduction:'',
            todayAdCoupons:[],
            tomorrowAdCoupons:[],
            ruleShow:false,
            today:new Date().getDate(),
            todayCounts:3,
            tomorrowCounts:0,
        }
    },
    methods:{
        getCouponList(){
            http({
            method: 'post',
            url: api.dailyQuery,
            data: {
                userId: localStorage.userId,
                idFlag: 'XWC',
            }
            }).then((res) => {
                if(res.data.code == 1000 && (res.data.data.todayAdCoupons.length + res.data.data.tomorrowAdCoupons.length) > 0){
                    this.introduction = res.data.data.introduction;
                    if(res.data.data.todayAdCoupons){
                        this.todayAdCoupons = res.data.data.todayAdCoupons;
                    };
                    if(res.data.data.tomorrowAdCoupons){
                        this.tomorrowAdCoupons = res.data.data.tomorrowAdCoupons;
                    };
                    if(this.tomorrowAdCoupons.length > 0){
                        if(this.todayAdCoupons.length == 1){
                            this.todayCounts = 1;
                            this.tomorrowCounts = 2;
                        }else{
                            this.todayCounts = 2;
                            this.tomorrowCounts = 1;
                        }
                    };
                    if(this.$cookies.get("first_conponShow") != "3" && !this.isGift && localStorage.token){
                        this.$parent.conponShow = true;
                        this.$cookies.set("first_conponShow","3",24 - new Date().getHours() + "h");
                        this.$baiduStats('首页-卡券活动-下午茶-自动弹出');
                    };
                }
            })
        },
        fmtDate(obj){
            var date =  new Date(obj);
            var y = 1900+date.getYear();
            var m = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return m.substring(m.length-2,m.length)+"."+d.substring(d.length-2,d.length);
        },
        getDay(obj){
            var date =  new Date(obj);
            var y = 1900+date.getYear();
            var m = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return date.getDate();
        },
        getConpon(activityId,couponId,index,receiveChannel,businessOnlineUrl){
            if(receiveChannel == 1){
                window.location.href = businessOnlineUrl;
            }else{
                http({
                    method: 'post',
                    url: api.daily,
                    data: {
                        userId: localStorage.userId,
                        activityId: activityId,
                        couponId:couponId,
                    }
                }).then((res) => {
                    if(res.data.code == 1000){
                        this.todayAdCoupons[index].couponStatus = 2;
                        this.$toast("领取成功");
                    }else if(res.data.code == 1015){
                        this.todayAdCoupons[index].couponStatus = 4;
                        this.$toast(res.data.msg);
                    }else{
                        this.$toast(res.data.msg);
                    }
                })
            }
            this.$baiduStats('首页-卡券活动-下午茶-点击领取' + couponId);
        },
        changeShow(){
            this.$parent.conponShow = false;
            this.ruleShow = false;
            this.$baiduStats('首页-卡券活动-下午茶-点击关闭按钮');
        },
        goConpon(id){
            dooolyAPP.gotoJumpVue(this.$router,'/couponExchange/'+id);
        },
        CheckImgExists(imgurl) {  
            let ImgObj = new Image(); //判断图片是否存在  
            ImgObj.src = imgurl;  
            //没有图片，则返回-1  
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                return true;  
            } else {  
                return false;
            }  
        } 
    },
    mounted(){
        this.getCouponList();
    },
}
</script>

<style scoped>
.bg{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 9999;
  }
  .fixde{
    position: fixed;
    width: 6.3rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
    font-size: 0;
    border-radius: 0 0 0.2rem 0.2rem;
  }
  .titleBg{
    padding-top: 0.28rem;
    font-size: 0;
  }
  .list_view{
      padding-top: 0.73rem;
      padding-bottom: 0.6rem;
      background: #fff;
  }
  .close{
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    right: 0;
    top: 0;
  }
  .check{
    width: 1.26rem;
    line-height: 0.4rem;
    position: absolute;
    font-size: 0.24rem;
    color: #fff;
    text-align: center;
    border:1px solid #fff;
    border-radius: 1rem;
    right: 0.2rem;
    top: 1.68rem;
  }
  .title{
    text-align: center;
    position: relative;
    padding: 0.2rem 0;
    background: #fff;
  }
  .title::after{
    content: '';
    position:absolute;
    left: 50%;
    top: 50%;
    width: 2.66rem;
    height: 1px;
    margin-left: -1.33rem;
    background: #ddd;
    z-index: 9;
  }
  .title span{
    display: inline-block;
    width: 1.8rem;
    font-size: 0.3rem;
    color:#333;
    background: #fff;
    z-index: 10;
    position: relative;
  }
  .rule{
    font-size: 0.26rem;
    color: #6a6a6a;
    line-height: 0.4rem;
    padding: 0.5rem 0 1.5rem 0.56rem;
    background: #fff;
  }
  .conpon{
    width: 5.7rem;
    height: 1.7rem;
    display: flex;
    background: url(../../assets/images/coupon/conpon_bg1.png) no-repeat 0 0;
    background-size: 100%;
    margin: 0 auto;
    position: relative;
    margin-bottom: 0.2rem;
  }
  .tomorrow{
    filter: gray;
    filter: grayscale(100%);
  }
  .org{
    background-image: url(../../assets/images/coupon/conpon_bg2.png);
  }
  .tag{
    width: 0.94rem;
    height: 0.84rem;
    position: absolute;
    left: -0.06rem;
    top: -0.06rem;
  }
  .pirce{
    width: 1.1rem;
    text-align: center;
    padding: 0 0.05rem;
  }
  .count{
    display: inline-block;
    color: #fff;
    margin-top: 0.3rem;
    font-size: 0;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 100%;
    overflow: hidden;
  }
  .count img{
      height: 100%;
  }
  .pirce .text{
    font-size: 0.24rem;
    color: #fff;
    text-align: center;
  }
  .over{
    padding-top: 0.2rem;
  }
  .org .button div{
    text-indent: -0.1rem;
  }
  .org .button div::after{
    content: '';
    position: absolute;
    left: 85%;
    top: 50%;
    width: 0.1rem;
    height: 0.12rem;
    margin-top: -0.06rem;
    background: url(../../assets/images/coupon/right.png) no-repeat 0 0;
    background-size: 100%;
  }
  .content{
    width: 4.1rem;
    padding: 0 0.2rem;
  }
  .content div{
    line-height: 100%;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
  }
  .content div:nth-child(1){
    font-size: 0.3rem;
    padding-top: 0.35rem;
  }
  .content div:nth-child(2){
    font-size: 0.26rem;
    padding-top: 0.12rem;
    min-height: 0.26rem;
  }
  .button{
    position: absolute;
    right: 0.2rem;
    bottom: 0.18rem;
    display: inline-block;
    padding: 0.09rem 0.26rem;
    line-height: 100%;
    font-size: 0.24rem;
    color: #ff6900;
    text-align: center;
    background: #fff;
    border-radius: 0.5rem;
  }
</style>

