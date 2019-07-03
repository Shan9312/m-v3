 <template>
   <div v-if="IndicatorState">
     <!--<div v-html="pageList[0].content"></div>-->

     <div class="content" v-html="content"></div>
     <div class="title_div">推荐商品</div>
     <guideGoods :pageList="pageList"></guideGoods>
   </div>
 </template>

 <script>
   import guideGoods from '@/components/common/guideGoods';
   import http from '@/http/http.js';
   import api from '@/assets/js/api.js';
   import {
     shareWithFriendsWX,
     shareWithFriendsAPP
   } from '@/assets/js/wechatShare2.js';


   export default {
     name: "guide-article",
     components: {
       guideGoods
     },
     data() {
       return {
         pageList: [],
         content: '',
         shareParams: {},
         a: 8,
         IndicatorState: false,

       }
     },
     methods: {
       loadPageData() {
         http({
           method: 'post',
           url: api.getArticleProductList,
           headers: {
             'Content-Type': 'application/json;charset=UTF-8'
           },
           data: {
             "articleId": this.$route.params.articleId
           }
         }).then((res) => {
           if (res.data.code = 1000) {
             this.pageList = res.data.data.adProducts;
             this.content = res.data.data.adProducts[0].content;
             initTitle(res.data.data.adProducts[0].title, 4);
             this.shareParams.digest = this.pageList[0].digest;
             localStorage.articledigest = this.shareParams.digest;
             this.shareParams.imgUrl = this.pageList[0].imgUrl;
             localStorage.articleimgUrl = this.shareParams.imgUrl;
             this.shareParams.title = this.pageList[0].title;
             localStorage.articletitle = this.shareParams.title;
             this.IndicatorState = true;
             if (browserName != "WebKit" && browserName != "Chrome WebView" && browserName != "otherAPPAndroid" &&
               browserName != "otherAPPIos") {
               this.shareShopping2();
             }
           } else {
             this.$toast(res.data.msg);
           }
         })
       },
       shareShopping2() {
         let shareParams = this.shareParams;
         this.Wechatshare('article', shareParams);

       },
       Wechatshare(prefix, params) {
         var client = 'doooly';
         var ua = window.navigator.userAgent.toLowerCase();
         if (ua.match(/MicroMessenger/i) == 'micromessenger') {
           client = 'wechat'; //是微信
           this.$jsonp(api.commonShareJSONPConfig + "?client=" + client + "&prefix=" + prefix + "&params=" + encodeURI(
               encodeURI(params.title)) + "&params=" + encodeURI(encodeURI(params.digest)) + "&params=" +
             encodeURIComponent(window.location.href) + "&params=" + encodeURI(encodeURI(params.imgUrl)) + "&url=" +
             encodeURIComponent(window.location.href), { //请求参数
               callbackName: 'jsonpCallback',

             }).then((res) => {
             if (res.code == 4001) {
               //40001微信配置
               shareWithFriendsWX(res.data);
             } else if (res.code == 4002) {
               //40002兜里配置
               shareWithFriendsAPP(res);
             } else {
               //获取配置错误10001
             }
           });
         } else {
           client = 'doooly'; //不是微信
           this.$jsonp(api.commonShareJSONPConfig + "?client=" + client + "&prefix=" + prefix + "&params=" + encodeURI(
               encodeURI(localStorage.articletitle)) + "&params=" + encodeURI(encodeURI(localStorage.articledigest)) +
             "&params=" + encodeURIComponent(window.location.href) + "&params=" + encodeURI(encodeURI(localStorage
               .articleimgUrl)) + "&url=" + encodeURIComponent(window.location.href), { //请求参数
               callbackName: 'jsonpCallback',

             }).then((res) => {
             if (res.code == 4001) {
               //40001微信配置
               shareWithFriendsWX(res.data);
             } else if (res.code == 4002) {
               //40002兜里配置
               shareWithFriendsAPP(res);
             } else {
               //获取配置错误10001
             }
           });
         }



       }
     },
     beforeCreate() {
       window.artile = this;
       window.shareShopping = function () {
         let shareParams = [artile.shareParams];
         artile.Wechatshare('article', shareParams);
       }
     },
     mounted() {
       sessionStorage['guideArticleUrl'] = window.location.href;
       this.loadPageData();
     }

   }
 </script>
 <style>
   img {
     width: 100%;
   }
 </style>
 <style scoped>
   .content {
     width: 100%;
     height: auto;
   }

   .content img {
     width: 100% !important;
   }

   .title_div {
     color: #000;
     padding-left: 0.2rem;
     font-size: 0.36rem;
     font-weight: 700;
   }
 </style>