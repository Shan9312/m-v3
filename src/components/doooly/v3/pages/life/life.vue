<template>
  <div id='life'>
    <section v-if="recentList.length > 0" class="frequent">
      <h2 class="frequent-title">最近常用</h2>
      <ul class="frequent-con">
        <li data-route-name="life" :data-baidu-stats="'最近常用-' + item.mainTitle" v-for="(item,index) in recentList.slice(0,4)" :key="index" @click="goDetail(item.linkUrl,'最近常用',item.mainTitle)">
          <div class="img-view">
            <img :src="item.iconUrl" :onerror="errorIcon">
          </div>
          <div class="tag">
            {{item.subTitle}} <span>{{item.cornerMarkText}}</span>
          </div>
        </li>
        
      </ul>
    </section>
    <section v-if="bannerList.length >0" class="banner">
      <div class="banner-con">
        <mt-swipe :auto="0" :showIndicators="bannerList.length > 1">
          <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
            <img class="con-img" data-route-name="life" :data-baidu-stats="'广告位-' + item.title" :src="item.iconUrl" alt="" @click="goDetail(item.linkUrl,'生活广告',index)" :onerror="errorBig">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </section>
    <section class="life" ref='life' v-if="lifeEnd">
      <div class="life-navbar">
        <mt-navbar v-model="selected">
          <div class="view" :class="{'is-selected':lifeActiveIndex == index}" data-route-name="life" :data-baidu-stats="'生活场景名-' + item.subTitle" v-for="(item,index) in lifeList" :key="index" @click="lifeActiveIndex = index">
            <div class="img-view">
              <img slot="icon" :src="lifeActiveIndex==index?item.iconUrlActive:item.iconUrl" :onerror="errorIcon">
            </div>
            <div class="text">{{item.subTitle}}</div>
            <!-- <mt-tab-item :id="'tab'+index">
              
              
            </mt-tab-item> -->
          </div>
        </mt-navbar>
      </div>

      <mt-tab-container v-model="selected">
        <div v-for="(item,index) in lifeList" :key="index" v-show="index == lifeActiveIndex">
          <ul v-if="item.subList.length > 0" class="subLife-con" :class="{'openList':open,'hidden':item.subList.length > maxCount,'onHidden':item.subList.length <= maxCount}">
            <li v-for="(subItem,subIndex) in item.subList" :key="subIndex"
              data-route-name="life" :data-baidu-stats="'生活场景-' + item.subTitle + '-' + subItem.mainTitle"
              @click="goDetail(subItem.linkUrl,'生活场景',subItem.mainTitle);">
              <div class="img-view">
                <img :src="subItem.iconUrl" :onerror="errorIcon">
              </div>
              <div class="tag">
                {{subItem.subTitle}} <span>{{subItem.cornerMarkText}}</span>
              </div>
            </li>
          </ul>
          <div v-else class="no-content">
            暂无内容
          </div>
        </div>
      </mt-tab-container>
      <div v-for="(item,index) in lifeItemList" :key="index">
        <div v-if="(item.length > maxCount) && (lifeActiveIndex === index)" class="arrow" @click="open=!open">
          <div class="line"></div>
          <div class="arrow-img" :class="{'up':open}">
            <img src="~@/assets/images/DBdown.png" alt="">
          </div>
        </div>
      </div>

    </section>
    <section class="shop" ref='shop'>
      <div class="nav" :class="{'fixedBar':isFixed}">
        <ul class="shop-nav">
          <li data-route-name="life" :data-baidu-stats="'导购（频道）-' + item.subTitle" v-for="(item,index) in shopNavList" :key="index" :class="{'active':shopActiveIndex === index}" @click="shopNavClick(item.id,index)">
            {{item.subTitle}}
          </li>
        </ul>
      </div>

      <div class="shop-con" :class="{'shop-con-fixed':isFixed}" ref="shopConFixed">
        <ul v-if="shopList.length > 0" class="shop-detail" :class="{'fixedPadTop':isFixed}" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
          <li data-route-name="life" :data-baidu-stats="'导购（商品）-' + subItem.name" v-for="(subItem,subIndex) in shopList" :key="subIndex" @click="goDetail(subItem.linkUrlWechat,'导购管理',subItem.name)">
            <img :src="subItem.image" class="img" alt="" :onerror="errorShop">
            <p class="detail-name">{{subItem.name}}</p>
            <p class="sellPrice"><label>¥</label>{{subItem.isStar==='1'?subItem.dooolyPrice:subItem.sellPrice | keepDecimal(2)}}</p>
            <div class="marketPrice nowarp"><span class="price">市场价：¥{{subItem.marketPrice | keepDecimal(2)}}</span><span class="rebate" v-if="subItem.userRebate >0">返{{subItem.userRebate | keepDecimal(2)}}%</span></div>
            <div class="tag">
              <span v-if="subItem.businessName" class="tag-item fisrt-red">{{subItem.businessName}}</span>
              <label v-if="typeof subItem.guideTag === 'string'">
                <span v-for="(key,i) in handleGuideTag(subItem.guideTag)" :key="i" class="tag-item">
                  {{key | cutStr(4)}}
                </span>
              </label>
            </div>
          </li>
        </ul>
        <div v-if="shopList.length === 0 && shopEnd" class="no-content">
          暂无内容
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import { getUserRecentView, getLifeFloors, getGuideCategory, getGuideCategoryBusi } from 'v3/services'
import { setTimeout } from 'timers';
export default {
  name: 'life',
  props: {

  },
  data() {
    return {
      type: this.$route.query.type || '', // 获取地址后面的type让页面滚动到指定位置
      maxCount: 8,
      open: false,
      selected: "tab0",
      recentList: [],
      bannerList: [],
      lifeList: [],
      lifeItemList: [],
      shopNavList: [],
      shopList: [],
      shopActiveIndex: 0,
      lifeActiveIndex: 0,
      isFixed: false,
      errorIcon: 'this.src = "' + require('@/assets/images/shoppingGuide/goods.png') + '"',
      errorBig: 'this.src = "' + require('@/assets/images/shoppingGuide/mainBanner.png') + '"',
      errorShop: 'this.src = "' + require('v3/assets/images/common/shop_default.png') + '"',
      loading: false,
      shopEnd: false,
      lifeEnd: false,
      pageNum: 1,
      pageSize: 10,
      maxPageNum: 0,
      shopId: '',
      shopTop: 0
    };
  },
  computed: {
  },
  filters: {
    cutStr(val, num) {
      return val.substring(0, num)
    },
    keepDecimal(val, num) {
      return val.toFixed(num)
    }
  },
  created() {
    initTitle('生活');
    this.recentView();
    this.getLifeFloors();
    this.getGuideCategory();
  },
  mounted() {
    window.addEventListener('scroll', this.watchShop)
  },
  destroyed() {
    window.removeEventListener('scroll', this.watchShop);
  },
  methods: {
    async recentView() {
      let { data } = await getUserRecentView(localStorage.userId);
      if (!(data && data.data)) return
      if (data.code === 1000) {
        this.recentList = data.data.list;
      }
    },
    async getLifeFloors() {
      let { data } = await getLifeFloors(localStorage.userId);
      if (!(data && data.data)) return
      if (data.code === 1000) {
        const floors = data.data.floors
        if (floors.length > 0) {
          floors.map((item) => {
            switch (item.type) {
              case 1: this.bannerList = item.list;
                break;
              case 2: this.lifeList = item.list;
                break;
            }
          })
        }
        if (this.lifeList) {
          this.lifeItemList = this.lifeList.map(item => item.subList)
        }
        this.lifeEnd = true
        this.$nextTick(function () {
          if (this.type == 2) {
            scrollTo(0, this.$refs.life.offsetTop);
          }
        })
      }
    },
    async getGuideCategory() {
      let { data } = await getGuideCategory();
      if (data && data.data) {
        this.shopNavList = data.data;
        if (this.shopNavList.length <= 0) return
        let itemData = this.shopNavList[0] // 默认显示第一条数据
        this.shopId = itemData.id
        this.getGuideCategoryBusi(this.shopId)
      }
    },
    async getGuideCategoryBusi(id) {
      if (id == undefined) return
      let { data } = await getGuideCategoryBusi(id, this.pageNum, this.pageSize);
      this.loading = false;
      if (data && data.data) {
        let list = data.data
        if (list.length < this.pageSize) {
          this.maxPageNum = this.pageNum
        }
        this.shopList = this.shopList.concat(list)
        this.shopEnd = true
        // tabbar置顶的话,内容就不需要保持上次的滚动高度,让内容也置顶
        if (this.isFixed) {
          scrollTo(0, this.$refs.shopConFixed.offsetTop)
          return
        }
        // 没吸顶，滚动到上次的位置
        this.$nextTick(() => {
          scrollTo(0, this.shopTop)
        })
      }
    },
    loadMore() {
      if (this.pageNum === this.maxPageNum) return // 当前页码大于最大页数，禁止加载更多
      this.loading = true;
      this.pageNum++;
      this.getGuideCategoryBusi(this.shopId)
    },
    goDetail(url, moduleName, name) {
      // this.$baiduStats('生活-' + moduleName + name);
      dooolyAPP.gotoJumpJq.call(this, url);
    },
    handleGuideTag(arr) {
      let list = arr.split(',')
      return list.slice(0, 2).filter((val) => !!val)
    },
    watchShop() {
      let el = this.$refs.shop
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let distance = el.offsetTop - scrollTop
      if (distance <= -5) { // nav距离顶部5像素的时候，吸顶
        this.isFixed = true
      } else {// 向上
        this.isFixed = false
      }
    },
    shopNavClick(id, index) {
      // 点击tab重置当前数据
      this.shopTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      this.pageNum = 1
      this.shopId = id
      this.shopList = []
      this.maxPageNum = 0
      this.shopActiveIndex = index
      this.shopEnd = false
      this.getGuideCategoryBusi(this.shopId)
    }
  },
  watch: {
  },
  components: {

  }
};
</script>

<style lang="scss">
@import "./life.scss";
</style>
