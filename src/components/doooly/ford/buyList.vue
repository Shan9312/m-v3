<template>
  <div>
    <div class="header_view">
      <div class="header">
        <div class="left">
          <span class="count">{{availIntegal}}</span>
          <span class="text">定向积分</span>
          <img @click="altAllHelp" src="../../../assets/images/ford/help.png">
        </div>
        <div class="right">
          <span class="text">通用积分：</span>
          <span class="count">{{integal}}</span>
        </div>
      </div>
      <div class="search">
        <input type="tel" v-model="minPrice" placeholder="最低价">
        <input type="tel" v-model="maxPrice" placeholder="最高价">
        <input type="button" value="搜索" @click="loadCardList">
        <div class="line"></div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item,index) in cardBuyList" :key="index" class="clearfix">
          <div class="fl view" @click="index_click(item.name,index+1);link(item.countdownTime,item.produceId,item.skuId)">
            <img class="discount" v-if="item.discount"
                 :src='"../../../assets/images/discount"+parseInt(item.discount)+".png"'>
            <img :src="item.image"/>
          </div>
          <div class="fl describe" @click="index_click(item.name,index+1);link(item.countdownTime,item.produceId,item.skuId)">
            <div class="title">
              <span v-show="item.tagName">{{item.tagName}}</span>{{item.title}}
            </div>
            <br/>
            <div class="time">
              {{item.introduction}}
            </div>
            <br/>
            <div class="price">
              <span class="red">￥</span>{{item.sellPrice || item.sellPrice === 0 ? item.sellPrice.toFixed(2) : ''}}
            </div>
            <br/>
            <div class="Sprice">
              市场价：<span>￥{{item.marketPrice || item.marketPrice === 0 ? item.marketPrice.toFixed(2) : ''}}</span>
            </div>
          </div>
          <div class="button_count" v-if="item.count > 0">
            <div @click="shoppingDelte(item)"><img src="../../../assets/images/subtract.png"></div>
            <div class="count">{{item.count}}</div>
            <div @click="shoppingAdd(item)"><img src="../../../assets/images/append.png"></div>
          </div>
          <div class="button time_return" v-else-if="item.countdownTime&&time_post(item.countdownTime).countDownState">
            即将开始
          </div>
          <div class="button" v-else @click="shoppingAdd(item)">
            选择兑换
          </div>
        </li>
      </ul>
    </div>
    <div class="No_items" v-if="noItemState">
      <img src="../../../assets/images/No_items.png"><br>
      <span>暂无商品，敬请期待</span>
    </div>
    <!-- 返回顶部 -->
    <div class="go_top" :class="{'hide':goTop == 2,'show':goTop == 1}" @click="goTopfunction">
      <img src="../../../assets/images/cardbuy/go_top.png">
    </div>
    <!-- 购物车 -->
    <div class="shopping_bg" v-show="!shopsShow" @touchmove.prevent>
    </div>
    <div class="shopping shoppingList" v-show="!shopsShow">
      <div class="title">
        <div>费用明细</div>
        <div @click="shopsShow = true"><img src="../../../assets/images/active/icon_close.png"></div>
      </div>
      <ul class="shops">
        <li v-for="(item,index) in shopsList" :key="index" v-show="item.count > 0">
          <div class="name">{{item.title}}</div>
          <div>
            <span class="pirce"><b>￥</b>{{item.sellPrice || item.sellPrice === 0 ? item.sellPrice.toFixed(2) : ''}}</span>
            <span class="number">x{{item.count}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="shopping">
      <div class="amount">
        <div class="left">
          <span class="pirceT">应付金额：</span>
          <span class="pirce"><b>￥</b>{{totalPrices || totalPrices === 0 ? totalPrices.toFixed(2) : ''}}</span>
        </div>
        <div class="show" @click="shopsShow = !shopsShow">
          明细
          <img v-show="shopsShow" src="../../../assets/images/upCCC.png">
          <img v-show="!shopsShow" src="../../../assets/images/downCCC.png">
        </div>
        <div class="button" @click="refer" :class="{cor:shopsList.length <= 0}">
          确认提交
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import http from '@/http/http.js';
  import api from '@/assets/js/api.js';
  import {isNumber} from '@/assets/js/verify.js';

  export default {
    name: "card-buy",
    data() {
      return {
        cardBuyList: [],
        noItemState: false,
        getServerDate: '',
        i:'',
        ii:'',
        goTop:0,
        shopsShow:true,
        totalPrices:0.00,
        minPrice:'',
        maxPrice:'',
        availIntegal:'***',
        integal:'***',
        shopsList:[],
      }
    },
    methods: {
      //购物车提交
      refer(){
        if(this.shopsList.length <= 0){
          return;
        }
        dooolyAPP.gotoJumpVue.call(this,'/fordBuyOrder');
      },
      //购物车添加商品
      shoppingAdd(item){
        if(item.count){
          item.count++;
        }else{
          item.count = 1;
        }
        this.shoppingRefresh(item);
      },
      //购物车删除商品
      shoppingDelte(item){
        item.count--;
        this.shoppingRefresh(item);
      },
      //刷新购物车状态
      shoppingRefresh(item){
        this.cardBuyList.push();
        http({
          method: 'post',
          url: api.shopHandle,
          data: {
            sku:item.skuId,
            businessId:item.businessId,
            num:item.count,
            price:item.sellPrice,
            specification:item.specification,
            userId:localStorage.userId,
            name:item.title,
            businessName:item.company,
            image:item.image,
            goodsId:item.produceId,
            productType:item.productTypeId,
          },
        }).then((res) => {
          if(res.data.code = 1000){
            this.shopNum(item);
          }
        })
      },
      //购物车list
      getShoppingList(item){
        http({
          method: 'post',
          url:api.shopList,
          data: {
            userId:localStorage.userId,
            businessId:'',
            sku:'',
          },
        }).then((res) => {
          this.shopsList = res.data.data;
          this.shopsList.forEach((shop,index) => {
            let remove = 0;
            this.cardBuyList.forEach((item,key) => {
              if(item.skuId == shop.sku){
                this.shopsList[index] = item;
                this.shopsList[index].count = shop.num;
                this.shoppingRefresh(this.shopsList[index]);
                remove = 1;
              }
            })
            if(remove == 0){
              this.shopsList[index] = {
                businessId: shop.businessId,
                id: '',
                count:0,
                sellPrice:shop.price,
                skuId:shop.sku,
                specification: shop.specification,
                productTypeId:shop.productType,
                company: shop.businessName,
                produceId: shop.goodsId,
                image: shop.image,
                title: shop.name,
              };
              this.shoppingRefresh(this.shopsList[index]);
            }
          })
          this.shopNum();
        })
      },
      goTopfunction(){
        clearInterval(this.timeOut);
        this.animation();
      },
      animation(){
        this.timeOut = setTimeout(() => {
          if(this.scroll > 0){
            this.scroll-=(this.scroll/8);
            scrollTo(0,this.scroll);
            this.animation();
          }
        }, 1);
      },
      menu() {
        this.scroll = document.body.scrollTop==0?document.documentElement.scrollTop:document.body.scrollTop;
        this.offsetTop = document.body.clientHeight/4;
        if(this.scroll > this.offsetTop){
          this.goTop = 1;
        }else if(this.goTop == 1){
          this.goTop = 2;
        }
      },
      // 加载卡券购买列表
     loadCardList() {
       if(this.minPrice && !isNumber(this.minPrice)){
         this.$toast('价格请输入数字');
         return;
       }
       if(this.maxPrice && !isNumber(this.maxPrice)){
         this.$toast('价格请输入数字');
         return;
       }
        http({
          method: 'post',
          url: api.fordProductIndex,
          data: {
            userId:localStorage.userId,
            minPrice:this.minPrice,
            maxPrice:this.maxPrice,
          },
        }).then((res) => {
          if(res.data.code == 1000){
            this.cardBuyList = res.data.data.selfProductPriceVOList;
            this.availIntegal = res.data.data.userIntegralVO.dirIntegral;
            this.integal = res.data.data.userIntegralVO.integral;
            this.shopNum();
            this.getShoppingList();//购物车列表
          }
        })
      },
      //加载购物车数量
      shopNum(item){
        if(item){//本地购物车添加商品
          let as = 0;
          this.shopsList.forEach((shop,key) => {
            if(item.skuId == shop.skuId){
              this.shopsList[key] = item;
              as = 1;
              if(item.count == 0){
                this.shopsList.splice(key,1);
              }
            }
          }) 
          if(as == 0){
            this.shopsList.push(item);
          }
        }
        //计算总价格
        this.totalPrices = 0;
        this.shopsList.forEach((shop,key) => {
          this.totalPrices += (shop.sellPrice * shop.count);
        })
      },
      //埋点统计
      index_click(val, index) {
        var sort = "首页中部";
        var operation = "卡券购买";
        var label = val + "(" + index + ")";
        this.$baiduStats(sort+'-'+operation+'-'+label);
      },
      //点击进入卡券详情
      link(countdownTime,id,skuId) {
        //活动开始时间未到拦截
        if (countdownTime > this.getServerDate ) {
          this.$toast('活动尚未开始');
          return;
        }
        dooolyAPP.gotoJumpVue.call(this,'/fordBuyDetail/'+ id +'/'+ skuId);

      },
      //计算当月最后一天
      daysBetween(DateOne, DateTwo) {
        var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
        var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
        var OneYear = DateOne.substring(0, DateOne.indexOf('-'));
        var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
        var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
        var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));
        var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
        return Math.abs(cha);
      },
      //时间戳转日期格式
      getLocal(nS) {
        return new Date(parseInt(nS)).toLocaleString().substr(0, 17)
      },
      //页面添加计时器setInterval("time_post(time)",1000),其实time格式为事件戳,然后自定义回调函数time_return(day,hour,minute,seconds);
      time_post(time) {
        if (time < 0 || time< this.getServerDate ) {
          return {countDownState: false};
        }
        if (this.getServerDate == NaN || this.getServerDate == "") {

          return {countDownState: false};
        }
        var data = new Date(this.getServerDate);
        //  var data = new Date();
        var strYear = data.getFullYear();//当前年
        var strMonth = data.getMonth() + 1;//当前月
        var strDate = data.getDate();//当前日
        var strHours = data.getHours();//当前小时
        var strMinute = data.getMinutes();//当前分
        var strSeconds = data.getSeconds();//当前秒
        var DateTwo = strYear + '-' + strMonth + '-' + strDate;

        var time_sjc = new Date(time * 1);//目标时间戳
        var time_data = time_sjc.getFullYear() + "-" + (time_sjc.getMonth() + 1) + "-" + time_sjc.getDate();
        var DateOne = time_data.substr(0, 10);
        var hour = time_sjc.getHours();//目标小时
        var minute = time_sjc.getMinutes();//目标分
        var seconds = time_sjc.getSeconds();//目标秒

        var nowDay = this.daysBetween(DateOne, DateTwo);//当前时间戳到目标时间天数
        var fate = nowDay * 24;//当前时间戳到目标时间小时数
        var nowHour = hour - strHours;
        var nowMinute = minute - strMinute;
        var nowSeconds = seconds - strSeconds;

        if (nowSeconds < 0) {
          nowMinute--;
          nowSeconds = nowSeconds + 60;
        }

        if (nowMinute < 0) {
          nowHour--;
          nowMinute = nowMinute + 60;
        }

        if (nowHour < 0) {
          nowDay--;
          nowHour = nowHour + 24;
        }
        return this.time_return(nowDay, nowHour, nowMinute, nowSeconds);//回调函数
      },
      //事件回调函数模板(天，小时，分，秒)
      time_return(day, hour, minute, seconds) {
        if (day > 0) {
          var htmlHour = day * 24 + hour;
        } else {
          htmlHour = hour;
        }

        if (htmlHour < 10) {
          htmlHour = "0" + htmlHour;
        }
        if (minute < 10) {
          minute = "0" + minute;
        }
        if (seconds < 10 && seconds >= 0) {
          seconds = "0" + seconds;
        }

        //var html ="倒计时："+htmlHour+":"+minute+":"+seconds;

        if (htmlHour <= 0 && minute <= 0 && seconds <= 0) {
          return {countDownState: false}
        }
        else {
          return {
            countDownState: true,
            htmlHour: htmlHour,
            minute: minute,
            seconds: seconds
          }
        }
      },
      //对当前时间加1s
      countDown() {
        this.getServerDate += 1000;
      },
      altAllHelp() {
        this.$messageBox({
          title: '积分使用说明',
          message: '此页面优先使用定向积分',
          confirmButtonText: '我知道了',
        })
      },
    },
    beforeCreate(){
      document.body.style.backgroundColor="#f5f5f5";
    },
    destroy(){
      document.body.style.backgroundColor="";
    },
    created() {
      initTitle('360礼包兑换');
      this.loadCardList();//商品列表
    },
    mounted() {
      this.ii= setInterval(this.countDown,1000);
      window.addEventListener('scroll', this.menu);
    },
    beforeDestroy(){
      clearInterval(this.ii);
    }
  }
</script>

<style scoped>
  .header_view{
    background:#fff;
    padding:0.2rem 0;
  }
  /* 用户积分明细 */
  .header{
    background: url(../../../assets/images/ford/header_bg.png) 0 0 no-repeat;
    background-size: 100%;
    width: 6.9rem;
    height: 0.8rem;
    margin: 0 auto;
    margin-bottom: 0.2rem;
    border-radius: 0.2rem;
    display: flex;
    justify-content:space-between;
  }
  .header .left{
    padding-left: 0.3rem;
    line-height: 0.9rem;
    position: relative;
    display: flex;
  }
  .header .right{
    padding-right: 0.3rem;
    line-height: 0.9rem;
    display: flex;
  }
  .header .left span{
    margin-right: 0.1rem;
  }
  .header .right span{
    margin-left: 0.1rem;
  }
  .header .left .count{
    font-size: 0.4rem;
    color: #ee3f44;
  }
  .header .left .text{
    font-size: 0.26rem;
    color: #333;
  }
  .header .left img{
    position: absolute;
    left: 102%;
    top: 40%;
    width: 0.24rem;
    height: 0.24rem;
  }
  .header .right .count{
    font-size: 0.26rem;
    color: #ee3f44;
  }
  .header .right .text{
    font-size: 0.26rem;
    color: #333;
  }
  /* 价格区间搜索 */
  .search{
    width: 6.9rem;
    margin: 0 auto;
    margin-top: 0.2rem;
    display: flex;
    position: relative;
    margin-top: 0.3rem;
  }
  .search .line{
    position: absolute;
    left: 2.38rem;
    top: 50%;
    width: 0.1rem;
    height: 1px;
    background: #d8d8d8;
  }
  .search input[type='tel']{
    width: 2.28rem;
    height: 0.54rem;
    border-radius: 0.5rem;
    border:1px solid #ccc;
    color: #333;
    font-size: 0.24rem;
    text-align: center;
    margin-right: 0.3rem;
  }
  .search input[type='button']{
    width: 1.38rem;
    height: 0.54rem;
    border-radius: 0.5rem;
    border:1px solid #ee3f44;
    background: #ee3f44 url(../../../assets/images/ford/search.png) no-repeat;
    background-size: 0.24rem;
    background-position: 0.2rem 0.13rem;
    color: #fff;
    font-size: 0.28rem;
    text-indent: 0.24rem;
    margin-left: 0.36rem;
  }

  /* 购物车 */
  .shopping_bg{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999;
  }
  .shopping{
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    width: 100%;
  }
  .shoppingList{
    bottom: 1rem;
  }
  .shopping .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0.32rem;
    border-bottom: 1px solid #ececec;
  }
  .shopping .title div{
    font-size: 0.32rem;
    color: #333;
    font-weight: bold;
  }
  .shopping .title div img{
    width: 0.28rem;
    height: 0.28rem;
  }
  .shopping .shops{
    padding: 0.34rem 0.32rem;
    max-height: 6rem;
    overflow: scroll;
  }
  .shopping .shops li{
    margin-bottom: 0.16rem;
    display: flex;
    justify-content: space-between;
    align-items:flex-end;
    font-size: 0;
  }
  .shopping .shops li:last-child{
    margin-bottom: 0;
  }
  .shopping .shops li .name{
    font-size: 0.28rem;
    color: #333;
  }
  .shopping .shops li .pirce{
    font-size: 0.32rem;
    color: #ee3f44;
    margin-right: 0.1rem;
    font-weight: bold;
  }
  .shopping .shops li b{
    font-size: 0.24rem;
  }
  .shopping .shops li .number{
    font-size: 0.28rem;
    color: #999;
  }
  .shopping .amount{
    border-top: 1px solid #ececec;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    white-space: nowrap;
  }
  .shopping .amount div{
    line-height: 1rem;
    height: 1rem;
  }
  .shopping .amount .left{
    display: flex;
  }
  .shopping .amount .pirceT{
    font-size: 0.32rem;
    color: #333;
    margin-left: 0.3rem;
  }
  .shopping .amount .pirce{
    font-size: 0.36rem;
    color: #ee3f44;
    font-weight: bold;
  }
  .shopping .amount .pirce b{
    font-size: 0.24rem;
  }
  .shopping .amount .show{
    font-size: 0.28rem;
    color: #333;
    padding-right: 0.25rem;
    position: relative;
  }
  .shopping .amount .show img{
    position: absolute;
    top: 50%;
    right: 0;
    width: 0.2rem;
    margin-top: -0.055rem;
  }
  .shopping .amount .button{
    width: 2.8rem;
    font-size: 0.32rem;
    background: #ee3f44;
    color: #fff;
    text-align: center;
  }
  .shopping .amount .cor{
    background: #ccc;
  }



  .line_bold {
    width: 100%;
    height: 0.2rem;
    background: #f5f5f5;
  }

  a {
    text-decoration: none;
    color: #333;
  }

  ul {
    padding: 0 0.3rem;
    background: #fff;
  }
  .list{
    padding-bottom: 1rem;
  }
  .list ul li {
    padding: 0.3rem 0;
    position: relative;
    border-bottom: 1px solid #ececec;
    overflow: hidden;
  }

  .list ul li:last-child {
    border: 0;
  }

  .list ul li .view {
    width: 2rem;
    height: 2rem;
    margin-right: 0.3rem;
    position: relative;
  }

  .list ul li .view img {
    width: 100%;
    height: 100%;
  }

  .list ul li .view img.discount {
    position: absolute;
    left: 0;
    top: 0;
    width: 0.48rem;
    height: 0.56rem;
  }

  .list ul li .describe {
    font-size: 0;
  }

  .list ul li .describe div {
    display: inline-block;
    line-height: 100%;
  }

  .list ul li .describe .title {
    font-size: 0.32rem;
    color: #333;
    margin-top: 0.1rem;
  }

  .list ul li .describe .title span {
    display: inline-block;
    background: linear-gradient(to bottom right, #ee3f8b, #ee3f44);
    border-radius: 0.05rem;
    color: #fff;
    font-size: 0.24rem;
    padding: 0 0.05rem;
    margin-right: 0.1rem;
    vertical-align: top;
  }

  .list ul li .describe .time {
    font-size: 0.24rem;
    color: #999;
    margin-top: 0.24rem;
    min-height: 0.24rem;
  }

  .list ul li .describe .countDown {
    font-size: 0.24rem;
    color: #ee3f44;
    margin-top: 0.2rem;
    line-height: 0.36rem;
    height: 0.36rem;
    min-width: 1.94rem;
    background: #fdebec;
    text-align: center;
    border-radius: 0.05rem;
  }

  .list ul li .describe .countDown.fff {
    background: #fff;
  }
  .list ul li .describe .Sprice{
    font-size: 0.24rem;
    color: #999;
    margin-top: 0.1rem;
  }
  .list ul li .describe .Sprice span{
    text-decoration: line-through;
  }
  .list ul li .describe .price {
    font-size: 0.4rem;
    color: #ee3f44;
    margin-top: 0.32rem;
  }

  .list ul li .describe .price span {
    display: inline-block;
    margin-left: 0.12rem;
    font-size: 0.24rem;
    color: #999;
    text-decoration: line-through;
  }

  .list ul li .describe .price span.red {
    margin: 0;
    color: #ee3f44;
    font-size: 0.28rem;
    text-decoration: none;
  }
  .list ul li .button {
    position: absolute;
    right: 0;
    top: 1.74rem;
    width: 1.36rem;
    line-height: 0.56rem;
    text-align: center;
    border: 1px solid #ee3f44;
    color: #ee3f44;
    border-radius: 0.1rem;
    font-size: 0.24rem;
  }
  .list ul li .button.time_return {
    color: #fff;
    background: #ccc;
    border-color: #ccc;
  }
  .list ul li .button_count {
    position: absolute;
    right: 0;
    top: 1.74rem;
    display: flex;
    justify-content: space-between;
  }
  .list ul li .button_count div{
    position: relative;
    width: 0.68rem;
    height: 0.6rem;
    background: #f5f5f5;
    margin-right: 1px;
  }
  .list ul li .button_count .count{
    width: 0.8rem;
    line-height: 0.6rem;
    font-size: 0.32rem;
    color: #333;
    text-align: center;
  }
  .list ul li .button_count div:last-child{
    margin-right: 0;
  }
  .list ul li .button_count div img{
    width: 0.24rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }

  .No_items {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -1.35rem;
    margin-top: -2rem;
    text-align: center;
    font-size: 0;
    width: 2.7rem;
  }

  .No_items img {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .No_items span {
    font-size: 0.28rem;
    color: #666;
  }
  /*返回顶部*/
  .go_top {
    position: fixed;
    right: 0.3rem;
    bottom: 2.5rem;
    width: 0.82rem;
    height: 0.82rem;
    border-radius: 100%;
    border: 1px solid #ccc;
    opacity: 0;
    font-size: 0;
    background: #fff;
  }
  .hide{
    opacity: 0;
    animation:hide 0.6s linear ;
  }
  .show{
    opacity: 0.7;
    animation:show 0.6s linear;
  }
  @keyframes hide{
      0%   {opacity: 0.7;}
      100% {opacity: 0;}
  }
  @keyframes show{
      0%   {opacity: 0;}
      100% {opacity: 0.7;}
  }

  .go_top img {
    width: 100%;
    height: 100%;
  }
</style>
