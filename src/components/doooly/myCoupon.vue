<template>
  <div>
    <header>
      <ul>
        <li v-for="(item,index) in tabs" :key="index" v-bind:class='{l1:item.ifAdd==tab}'  @click="link(item.ifAdd)">
          <a href="javascript:void(0);">{{item.value}}</a>
        </li>
      </ul>
    </header>
    <section>
      <img v-if="emptyList" src="../../../static/images/accessCatagory/empty_bg.png" class="empty_bg">
      <ul class="to_used">
        <li v-for="(item,index) in listData" :key="index">
          <div class="clearfix" @click="businessDetail(item.id)">
            <div class="fl">
              <span class="title">{{item.productName}}</span><br>
              <span class="company">商家：{{item.businessName}}</span><br>
              <span class="time">有效期：<span style="text-indent:0;" class="beginDate">{{item.beginDate}}</span>
                -
                <span style="text-indent:0;" class="endDate">{{item.endDate}}</span>
              </span>
            </div>
            <div class="fr">
              <div v-if="item.kind==0"><span>{{item.couponValue}}</span>元</div>
              <div v-else-if="item.kind==1"><span>{{item.couponValue}}</span>折</div>
            </div>
          </div>
          <!-- 遮盖 -->
          <div v-if="usedBg" class="used_bg">
            <img src="../../../static/images/accessCatagory/used_bg.png">
          </div>
          <div  v-if="expiredBg" class="expired_bg">
            <img src="../../../static/images/accessCatagory/expired_bg.png">
          </div>
          <!-- 遮盖 -->
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
    export default {
        name: "myCoupon",
      data(){
          return{
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
              {
                id:'1',
                productName:'test1',
                businessName:'唯品会1',
                beginDate:'2018.1.1',
                endDate:'2018.1.10',
                kind:"0",
                couponValue:"100"
              },
              {
                id:'2',
                productName:'test2',
                businessName:'唯品会2',
                beginDate:'2018.1.10',
                endDate:'2018.1.15',
                kind:"1",
                couponValue:"9"
              },
              {
                id:'3',
                productName:'test3',
                businessName:'唯品会3',
                beginDate:'2018.2.1',
                endDate:'2018.2.10',
                kind:"1",
                couponValue:"8.5"
              },
              {
                id:'4',
                productName:'test4',
                businessName:'唯品会4',
                beginDate:'2018.1.22',
                endDate:'2018.1.24',
                kind:"0",
                couponValue:"500"
              },
              {
                id:'5',
                productName:'test5',
                businessName:'唯品会5',
                beginDate:'2017.2.16',
                endDate:'2017.2.28',
                kind:"0",
                couponValue:"200"
              }
            ],
            usedBg:false,
            expiredBg:false
          }
      },
      mounted:function(){
          if(this.listData.length==0){
            this.emptyList=true;
          }
      },
      methods:{
        link:function (index) {
          this.tab = index;
          if(index==1){
            this.usedBg=true;
            this.expiredBg=false;
          }
          else if(index==2){
            this.usedBg=false;
            this.expiredBg=true;
          }
          else {
            this.usedBg=false;
            this.expiredBg=false;
          }
        },
        businessDetail:function (id) {
          this.$router.push({
            path: '/couponExchange/'+localStorage.token
          });
        }
      }
    }
</script>

<style scoped>
  body{background: #f7f7f8;}
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
    background: url(../../../static/images/accessCatagory/li_bg.png);
    background-size: 100%;
    position: relative;
    overflow: hidden;
  }
  section ul li .fl{
    padding: 0.32rem 0 0 0.3rem;
    font-size: 0;
  }
  section ul li .fl span{
    display: inline-block;
  }
  section ul li .fl .title{
    font-size: 0.34rem;
    line-height: 0.34rem;
    color: #ef474b;
    margin-bottom: 0.2rem;
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
