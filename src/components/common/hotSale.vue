<template>
    <div class="hot-sales">
      <div class="top-title">
           <span class="title-left fl">超值热卖</span>
           <span class="title-right fr" @click="checkMore">查看更多<i class="icon iconfont">&#xe804;</i></span>
      </div>
      <div class="middle-img" @click="imgLink(hotSaleData2.articleId)">
        <img :src="hotSaleData2.imagePath" alt="主题">
      </div>
      <div class="bottom-goods">
      <div class="bottom-goods-content" v-for="(item,index) in hotSaleData2.contentData" :key="index" @click="linkToast(item.businessLogo,item.discount,item.maxUserRebate,item.dealType,item.linkUrlWechat,item.businessId,index)">
         <div class="goods-top">
           <img :src="item.imageWechat" :alt="item.name">
         </div>
        <div class="goods-name">
             <div class="name">
               {{item.name}}
             </div>
        </div>
        <div class="goods-price" v-if="!item.discount">
          &yen;{{item.marketPrice.toFixed(2)}}
        </div>
        <div class="goods-price" v-else>
          &yen;{{item.price.toFixed(2)}}
        </div>
      </div>
      </div>
      <toast v-if="toastState == 1" :toastData="toastData" :firstShow="1"></toast>
    </div>
</template>

<script>
  import toast from '@/components/common/toast';
  import point from '@/assets/js/pointTitle.js';
    export default {
        name: "hot-sale",
        props:['hotSaleData2','contentData'],
      components: {
        toast
      },
      data(){
          return{
            toastData:{},
            toastState:0,
          }
      },
        methods:{
          checkMore(){
            dooolyAPP.gotoJumpVue(this.$router,'/shoppingGuide');
          },
          imgLink(articleId)
          {
             this.$router.push({path:'/guideArticle/'+articleId});
          },
          linkToast(logo, discount, maxUserRebate, dealType, url,id,index)
         {
           this.toastState=1;
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
        },
        mounted(){
        }

    }
</script>

<style scoped>
  @font-face {
    font-family: 'iconfont'; 
    src: url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot');
    src: url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.woff') format('woff'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_402124_us4ozx4ew6nr8uxr.svg#iconfont') format('svg');
  }

  .iconfont {
    font-family:"iconfont" !important;
    font-size:0.28rem;
    color:#999;
    padding-left: 0.12rem;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }


.top-title{
    padding:0.52rem 0 0.24rem 0;
}
.middle-img{
  width:6.9rem;
  margin-bottom:0.2rem;
  font-size: 0.24rem;
  background: url(../../assets/images/shoppingGuide/mainBanner.png) no-repeat 0 0;
  background-size:100% 100%;
}
.middle-img img{
    width: 100%;
    height: 100%;
  }



.top-title{
  height: 0.44rem;
  font-size: 0.32rem;
  color: #333333;
  font-weight: bold;
}

.title-right{
  font-size: 0.28rem;
  color: #999999;
}


.bottom-goods{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
  .bottom-goods-content{
    height: 2.78rem;
    margin-right: 0.18rem;
  }
  .goods-top{
    height: 1.58rem;
    width:1.58rem;
    background: url(../../assets/images/shoppingGuide/goods.png) no-repeat 0 0;
    background-size:100% 100%;
  }

  .goods-top img{
    width:100%;
    height: 100%;
  }

.goods-name{
   width:1.58rem;
   height: 0.6rem;
   margin-top:0.16rem;
   margin-bottom:0.04rem;
}

.name{
  font-size: 0.24rem;
  color: #666666;
  line-height: 0.3rem;
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
}

.goods-price{
  font-size: 0.24rem;
  color: #CFA864;
  line-height: 0.4rem;
  font-weight: bold;
}


</style>
