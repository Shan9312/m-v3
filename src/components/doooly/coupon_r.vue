<template>
  <div v-if="IndicatorState">
    <header>
    <ul>
      <li v-for="(item,index) in tabs" :key="index" v-bind:class='{l1:item.ifAdd==tab}'  @click="link(item.ifAdd)">
        <a href="javascript:void(0);">{{item.value}}</a>
      </li>
    </ul>
  </header>
    <section>
      <img v-if="listData2" src="../../assets/images/coupon/empty_bg.png" class="empty_bg">
      <ul class="to_used">
        <li v-for="(item,index) in listData" :key="index" @click="businessDetail(item.couponCodeId,item.couponValue)">
          <div class="clearfix">
            <div class="fl">
              <span class="title">{{item.productName}}</span><br>
              <span class="company">商家：{{item.businessName}}</span><br>
              <span class="time">有效期：<span style="text-indent:0;" class="beginDate">{{timestampToTime(item.beginDate)}}</span>
               -
              <span style="text-indent:0;" class="endDate">{{timestampToTime(item.endDate)}}</span></span>
            </div>
            <div class="fr">
              <div v-if="item.kind==0"><span>{{item.couponValue}}</span>元</div>
              <div v-else-if="item.kind==1"><span>{{item.couponValue}}</span>折</div>
            </div>
          </div>
          <!-- 遮盖 -->
          <div v-if="usedBg" class="used_bg">
            <img src="../../assets/images/coupon/used_bg.png">
          </div>
          <div  v-if="expiredBg" class="expired_bg">
            <img src="../../assets/images/coupon/expired_bg.png">
          </div>
          <!-- 遮盖 -->
        </li>
      </ul>
    </section>
  </div>
</template>

<script>

  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
    export default {
        name: "coupon_r",
      data(){
          return{
            couponType:'unuse',
            cardBuyOrdersellPrice:localStorage.cardBuyOrdersellPrice,
            emptyList:false,
            tabs: [
              {
                value: "可使用",
                ifAdd: 0
              },
              {
                value: "已使用",
                ifAdd: 1
              },
              {
                value: "已过期",
                ifAdd: 2
              }
            ],
            tab:"0",
            listData:[
            ],
            usedBg:false,
            expiredBg:false,
            IndicatorState:false,
            listData2:false,
          }
      },
      computed:{
        conponState(pGoods,pCoupon){
          
        }
      },
      methods:{
        link:function (index) {
          if(this.tab == index){
            return;
          }
          this.tab = index;
          this.listData=[];
          if(index==1){
            this.usedBg=true;
            this.expiredBg=false;
            this.couponType="used";
            this.loadPageData();
        }
          else if(index==2){
            this.usedBg=false;
            this.expiredBg=true;
            this.couponType="expired";
            this.loadPageData();

          }
          else {
            this.usedBg=false;
            this.expiredBg=false;
            this.couponType="unuse";
            this.loadPageData();
           
          }
        },
        businessDetail (couponCodeId,couponValue) {
           this.$router.push({
              path: '/recharge/0/0?couponCodeId=' + couponCodeId + "&couponValue="+couponValue
            });
        },
   timestampToTime(timestamp) {
     var date=new Date(timestamp);
     let Y = date.getFullYear() + '-';
     let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
     let D = date.getDate() + ' ';
     let h = date.getHours() + ':';
     let m = date.getMinutes() + ':';
     let s = date.getSeconds();
    return Y+M+D;
  },
        loadPageData(){

          this.IndicatorState=true;
          http({
            method: 'get',
             url: api.listRestful+"?couponType="+this.couponType+'&couponCategory=19'
          }).then((res) => {
            this.couponNum=res.data.couponNum;
            for (let [index, elem] of res.data.actConnList.entries()) {
                this.listData.push({couponCodeId:elem.couponCodeId,
                  productName:elem.coupon.productName,
                  businessName:elem.coupon.businessName,
                  beginDate:elem.coupon.beginDate,
                  endDate:elem.coupon.endDate,
                  kind:elem.coupon.kind,
                  couponValue:elem.coupon.couponValue,
                  actConnId:elem.id,
                  couponId:elem.coupon.id,
                });
            }
            if(this.listData.length> 0){
              this.listData2 = false;
            }else{
              this.listData2 = true;
            }

          }).catch(err => {
            this.IndicatorState=true;
            this.listData2 = true;
          })
        }
      },
      mounted:function(){
        this.loadPageData();
        dooolyAPP.initTitle('我的福利');

      },
      beforeDestroy(){
        localStorage.removeItem('cardBuyOrdersellPrice');
      }

    }
</script>

<style scoped>
  body{background: #f7f7f8;}
  img{pointer-events: none;}
  /*主体部分*/
  header ul{font-size: 0;margin: 0 auto;background: #fff;padding: 0 0.25rem;    text-align: center;}
  header ul li{display: inline-block;width: 33.33%; text-align: center;font-size: 0.3rem;line-height: 0.98rem;color: #362e2b;}
  header ul li a{display: inline-block;width: auto; height: 100%;text-decoration: none;color: #362e2b;}
  header ul .l1 a{color: #ee3f43;border-bottom: solid 2px #ee3f43;}
  /*卡券展示部分*/
  section ul{
    font-size: 0;
  }
  section ul li{
    width: 7rem;
    height: 2rem;
    margin: 0 auto;
    margin-top: 0.2rem;
    background: url(../../assets/images/coupon/li_bg.png);
    background-size: 100%;
    position: relative;
    overflow: hidden;
  }
  section ul li .fl{
    padding: 0.32rem 0 0 0.3rem;
    font-size: 0;
    max-width: 60%;
  }
  section ul li .fl span{
    display: inline-block;
  }
  section ul li .fl .title{
    font-size: 0.34rem;
    line-height: 0.34rem;
    color: #ef474b;
    margin-bottom: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
  section ul li .fl .company{
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: #959595;
  }
  section ul li .fl .time{
    font-size: 0.2rem;
    line-height: 0.2rem;
    color: #959595;
    margin-top: 0.42rem;
  }
  section ul li .fr{
    width: 2.36rem;
    text-align: center;
    line-height: 2rem;
    font-size: 0.3rem;
    color: #fff;
  }
  section ul li .fr span{
    font-size: 0.8rem;
  }

  section ul li .used_bg,section ul li .expired_bg{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
  }
  section ul li .used_bg img,section ul li .expired_bg img{
    width: 100%;
  }

  section .empty_bg{
    display: block;
    width: 2.2rem;
    margin: 2.2rem auto 0;
  }
  section .empty_bg.show{
    display: block;
  }

</style>
