<template>
  <div>
    <div class="title" v-if="name && type != 3 && type != 4 && type != 5 && type != 6 && type != 7"
      :class="{center_view:type == 9 || type == 2 || type == 13}">
      <span>{{(type == 12 ? groupShortName+name : name)}}</span><br>
      <span class="subTitle" v-if="subTitle">{{subTitle}}</span>
    </div>
    <div v-if="type == 8" class="selects center_view">
      <ul class="list" :class="{'listdown':listsect,'small':list.length < 8}">
        <li v-for="(item,index) in list" @click="link(item.subUrl,item.linkUrl,item.mainTitle)" :key="index">
          <!-- <div v-if="item.isSupportIntegral === '0'" class="corner"></div> -->
          <div class="corner_mark" v-if="item.cornerMark">{{item.cornerMark}}</div>
          <img class="logo" :src="item.iconUrl" :onerror="defaultImg">
          <div class="btitle">
            {{item.mainTitle}}
          </div>
          <div v-show="item.subTitle">{{item.subTitle}}</div>
        </li>
      </ul>
      <div class="down" @click="listsect=!listsect" :class="{'up':listsect}" v-if="list.length > 8">
        <div class="img_view">
          <img src="../../../src/assets/images/DBdown.png">
        </div>
        <div class="line"></div>
      </div>
    </div>
    <div v-if="type == 2" class="selects">
      <v-touch class="swipeveiw" v-on:swipeleft="swipeLeft()" v-on:swiperight="swipeRight()">
        <ul class="swipe" v-for="(data,key) in nweListlength" :key="key">
          <li v-for="(item,index) in nweList['list'+key]" @click="link(item.subUrl,item.linkUrl,item.mainTitle)"
            :key="index" :class="{'color1':name == '特惠折扣专区','color2':name == '充值缴费','color3':name == '消费卡券'}">
            <img :src="item.iconUrl" :onerror="defaultImg">
            <div class="contitle">
              {{item.mainTitle}}
            </div>
            <div class="con">
              {{item.subTitle}}
            </div>
          </li>
        </ul>
      </v-touch>
      <div class="point" v-if="nweListlength.length > 1">
        <div v-for="(data,key) in nweListlength" :class="{'check':key == checkpoint}" :key="key"></div>
      </div>
    </div>
    <div v-if="type == 13" class="selects">
      <v-touch class="swipeveiw" v-on:swipeleft="swipeLeft()" v-on:swiperight="swipeRight()">
        <ul class="swipe" v-for="(data,key) in nweListlength" :key="key">
          <li v-for="(item,index) in nweList['list'+key]" @click="link(item.subUrl,item.linkUrl,item.mainTitle)"
            :key="index" :class="{'color1':name == '特惠折扣专区','color2':name == '充值缴费','color3':name == '消费卡券'}">
            <img :src="item.iconUrl" :onerror="defaultImg">
            <div class="contitle">
              {{item.mainTitle}}
            </div>
            <div class="con color">
              {{item.subTitle}}
            </div>
          </li>
        </ul>
      </v-touch>
      <div class="point" v-if="nweListlength.length > 1">
        <div v-for="(data,key) in nweListlength" :class="{'check':key == checkpoint}" :key="key"></div>
      </div>
    </div>
    <div v-if="type == 7 || type == 3" class="active">
      <img :src="list[0].iconUrl" @click="conponShowButton" :onerror="defaultImg">
    </div>
    <div v-if="type == 6 || type == 4" class="active">
      <img :src="list[0].iconUrl" @click="conponShowButton" :onerror="defaultImg">
    </div>
    <div v-if="type == 10" class="preference_view">
      <ul class="preference" :class="{'listdown':listsect,'small':list.length < 8}">
        <li v-for="(item,index) in list" @click="link(item.subUrl,item.linkUrl,item.mainTitle)" :key="index">
          <img class="backgroundImg" :src="item.iconUrl" :onerror="defaultImg">
          <div class="contitle">
            {{item.mainTitle.substring(0,item.mainTitle.indexOf('<'))}}<span
              class="redfont">{{item.mainTitle.substring(item.mainTitle.indexOf('<')+1,item.mainTitle.indexOf('>'))}}</span>{{item.mainTitle.substring(item.mainTitle.indexOf('>')+1)}}
          </div>
          <div class="con">
            {{item.subTitle.substring(0,item.subTitle.indexOf('<'))}}<span
              class="redfont">{{item.subTitle.substring(item.subTitle.indexOf('<')+1,item.subTitle.indexOf('>'))}}</span>{{item.subTitle.substring(item.subTitle.indexOf('>')+1)}}
          </div>
        </li>
      </ul>
      <div class="down" @click="listsect=!listsect" :class="{'up':listsect}" v-if="list.length > 6">
        <div class="img_view">
          <img src="../../../src/assets/images/DBdown.png">
        </div>
        <div class="line"></div>
      </div>
    </div>
    <div v-if="type == 11" class="hot_view">
      <ul class="hot">
        <li v-for="(item,index) in list" :key="index" @click="link(item.subUrl,item.linkUrl,item.mainTitle)">
          <img :src="item.guideIconUrl" v-if="index == 0" :onerror="defaultImg">
          <div v-else>
            <div class="logo">
              <img :src="item.iconUrl" :onerror="defaultImg">
            </div>
            <div class="contitle">
              {{item.mainTitle.substring(0,item.mainTitle.indexOf('<'))}}<span
                class="redfont">{{item.mainTitle.substring(item.mainTitle.indexOf('<')+1,item.mainTitle.indexOf('>'))}}</span>{{item.mainTitle.substring(item.mainTitle.indexOf('>')+1)}}
            </div>
            <div class="con">
              {{item.subTitle.substring(0,item.subTitle.indexOf('<'))}}<span
                class="redfont">{{item.subTitle.substring(item.subTitle.indexOf('<')+1,item.subTitle.indexOf('>'))}}</span>{{item.subTitle.substring(item.subTitle.indexOf('>')+1)}}
            </div>
            <img class="baner" :src="item.guideIconUrl" :onerror="defaultImg">
          </div>
        </li>
      </ul>
    </div>
    <div v-if="type == 12" class="type7_view">
      <ul class="type7">
        <!-- fix bug zhaoyang 11-25 添加点击事件 -->
        <li v-for="(item,index) in list" :key="index" @click="link(item.subUrl,item.linkUrl,item.mainTitle)">
          <div class="img"><img :src="item.iconUrl" :onerror="defaultImg"></div>
          <div class="contitle">
            {{item.title.substring(0,item.title.indexOf('<'))}}<span
              class="redfont">{{item.title.substring(item.title.indexOf('<')+1,item.title.indexOf('>'))}}</span>{{item.title.substring(item.title.indexOf('>')+1)}}
          </div>
          <div class="price">
            <span>￥</span>{{item.isStar == 1 ? item.dooolyPrice : item.price}}
          </div>
          <div class="piont" v-show="parseFloat(item.userRebate) > 0">
            返{{item.userRebate}}%
          </div>
          <div class="Aprice">市场价:￥{{item.marketPrice}}</div>
          <div class="tag red">
            {{item.shippingMethod}}
          </div>
        </li>
      </ul>
    </div>
    <div v-if="type == 5" class="type8_view">
      <ul class="type8" :class="{center:list.length < 3,left:list.length > 5}">
        <li v-for="(item,index) in list" :key="index" :class="{list4:list.length == 4,list3:list.length < 4}"
          @click="link(item.subUrl,item.linkUrl,item.mainTitle)">
          <img :src="item.iconUrl" :onerror="defaultImg">
          <div class="contitle">
            {{item.mainTitle.substring(0,item.mainTitle.indexOf('<'))}}<span
              class="redfont">{{item.mainTitle.substring(item.mainTitle.indexOf('<')+1,item.mainTitle.indexOf('>'))}}</span>{{item.mainTitle.substring(item.mainTitle.indexOf('>')+1)}}
          </div>
          <div class="con">
            {{item.subTitle.substring(0,item.subTitle.indexOf('<'))}}<span
              class="redfont">{{item.subTitle.substring(item.subTitle.indexOf('<')+1,item.subTitle.indexOf('>'))}}</span>{{item.subTitle.substring(item.subTitle.indexOf('>')+1)}}
          </div>
          <div class="tag">
            {{item.cornerMark}}
          </div>
        </li>
      </ul>
    </div>
    <div v-if="type == 9" class="selects">
      <ul class="type9" :class="{'listdown':listsect,'small':list.length < 8}">
        <li v-for="(item,index) in list" @click="link(item.subUrl,item.linkUrl,item.mainTitle)" :key="index">
          <div class="img-view">
            <img :src="item.businessLogo" :onerror="defaultImg">
          </div>
          <div class="tag">
            {{item.subTitle}} <span>{{item.cornerMarkText}}</span>
          </div>
        </li>
      </ul>
      <div class="down type9Down" @click="listsect=!listsect" :class="{'up':listsect}" v-if="list.length > 8">
        <div class="img_view">
          <img src="../../../src/assets/images/DBdown.png">
        </div>
        <div class="line"></div>
      </div>
    </div>

    <!-- 新首页楼层 -->
    <div v-if="newListV3 && newListV3.type == 1" class="type8_view new-type8">
      <ul class="type8 left">
        <li v-for="(item,index) in newListV3.items" :key="index"
          data-route-name="home" :data-baidu-stats="'导航栏-' + item.title"
          @click="goJumpPage(1,item.subUrl,item.linkUrl,item.title)" v-show="index < 10">
          <img :src="item.iconUrl" :onerror="defaultImg">
          <div class="contitle">
            {{item.title.substring(0,item.title.indexOf('<'))}}<span
              class="redfont">{{item.title.substring(item.title.indexOf('<')+1,item.title.indexOf('>'))}}</span>{{item.title.substring(item.title.indexOf('>')+1)}}
          </div>
          <div class="tag">
            {{item.cornerMarkText}}
          </div>
        </li>
      </ul>
    </div>

    <div v-if="newListV3 && newListV3.type == 2" class="gift">
      <div class="new-title">{{newListV3.title}}</div>
      <ul>
        <li v-for="(item,index) in newListV3.items" :key="index" v-show="index < 6"
          data-route-name="home" :data-baidu-stats="'礼包-' + item.title"
          @click="goJumpPage(21,'',item.id,item.title)">
          <div class="img-view">
            <img :src="item.iconUrl" :onerror="defaultImg">
          </div>
          <div class="tag">
            {{item.title}}
          </div>
        </li>
        <li data-route-name="home" :data-baidu-stats="'礼包-更多'" v-if="newListV3.hasMore" @click="goJumpPage(22)">
          <div class="img-view">
            <img src="../../../src/assets/images/home/home_v3_more.png">
          </div>
          <div class="tag">
          </div>
        </li>
      </ul>
    </div>

    <div v-if="newListV3 && newListV3.type == 3" class="advertising">
      <mt-swipe :auto="0" :showIndicators="newListV3.items.length > 1">
        <mt-swipe-item v-for="(item,index) in newListV3.items" :key="index"><img
            data-route-name="home" :data-baidu-stats="'中部通栏-广告位-' + item.title"
            @click="goJumpPage(3,item.subUrl,item.linkUrl,item.title,item.linkType);" :src="item.imageUrl"
            :onerror="defaultImg"></mt-swipe-item>
      </mt-swipe>
    </div>

    <div v-if="newListV3 && newListV3.type == 4" class="merchant">
      <div class="new-title">{{newListV3.title}}</div>
      <ul :class="{merchantUp:listsect,merchantDown:newListV3.items.length > 8 && !listsect}">
        <li v-for="(item,index) in newListV3.items" :key="index"
          data-route-name="home" :data-baidu-stats="newListV3.title + '-' + item.subUrl"
          @click="goJumpPage(40,item.subUrl,item.linkUrl,item.title);">
          <div class="img-view">
            <img :src="item.iconUrl" :onerror="defaultImg">
          </div>
          <div class="tag">
            {{item.subTitle}} <span>{{item.cornerMarkText}}</span>
          </div>
        </li>
      </ul>
      <!-- <div class="all" @click="goJumpPage(41)"> -->
      <div class="all" data-route-name="home" @click="listsect = !listsect; $baiduStats(newListV3.title + '-' + (listsect ? '更多' : '收起'))" :class="{up:listsect}" v-if="newListV3.items.length > 8">
        <div class="line"></div>
        <div class="arrow-img">
          <img src="~@/assets/images/DBdown.png">
        </div>
      </div>
    </div>

    <div v-if="newListV3 && newListV3.type == 5" class="card">
      <div class="new-title">
        <div>
          {{newListV3.title}}
        </div>
        <div class="cardnum" data-route-name="home" :data-baidu-stats="newListV3.title + '-' + newListV3.couponCount + '张礼券'" @click="goJumpPage(50);" v-if="newListV3.couponCount > 0">
          <!-- 我有<span class="color" :class="{'suspend':newListV3.couponCount >= 10}">{{newListV3.couponCount < 10 ? newListV3.couponCount : '9'}}</span>张礼券<span class="iocn"></span> -->
          我有<span class="color">{{newListV3.couponCount}}</span>张礼券<span class="iocn"></span>
        </div>
      </div>
      <ul>
        <li v-for="(item,index) in newListV3.items" :key="index" v-show="index < 3"
          data-route-name="home" :data-baidu-stats="newListV3.title + '-' + item.title"
          @click="goJumpPage(52,item.subUrl,item.linkUrl,item.title);">
          <div class="img-view">
            <img :src="item.iconUrl" :onerror="defaultImg">
          </div>
          <div class="name">
            {{item.title}}
          </div>
          <div class="dooly-pirce">
            <div class="left"><span>¥</span>{{item.price[0]}}<span v-show='item.price[1]'>.{{item.price[1]}}</span>
            </div>
            <div class="right">抢购价</div>
          </div>
          <div class="pirce">
            <div class="left">¥{{item.originalPrice}}</div>
            <div class="right"></div>
            <!-- <div class="right">已售{{item.sort}}<span v-show = 'item.sortUnit'>万</span>件</div> -->
          </div>
        </li>
      </ul>
      <div class="all" data-route-name="home" :data-baidu-stats="newListV3.title + '-更多'" @click="goJumpPage(51);">
        <img src="../../../src/assets/images/home/home_v3_all.png">
      </div>
    </div>

    <div v-if="newListV3 && newListV3.type == 6" class="activity">
      <div class="new-title">{{newListV3.title}}</div>
      <ul>
        <li v-for="(item,index) in newListV3.items" :key="index"
          data-route-name="home" :data-baidu-stats="newListV3.title + '-' + item.title"
          @click="goJumpPage(6,item.subUrl,item.linkUrl,item.title);">
          <div class="img-view">
            <img :src="item.iconUrl" :onerror="defaultImg">
          </div>
          <div class="tag">
            {{item.title}}
          </div>
          <div class="state">
            {{item.subTitle}}
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import api from '@/assets/js/api.js'
  export default {
    name: 'new-home-modules',
    props: ['type', 'list', 'name', 'index', 'online', 'subTitle', 'origin', 'newListV3'],
    data() {
      return {
        listsect: false,
        checkpoint: '0',
        nweList: {},
        nweListlength: [],
        groupShortName: localStorage.groupShortName,
        defaultImg: 'this.src="' + require('../../assets/images/shoppingGuide/goods.png') + '"'
      }
    },
    watch: {
      checkpoint(curVal, oldVal) {
        var cur = window.innerWidth * curVal
        var old = window.innerWidth * oldVal
        this.animation(cur, old)
      }
    },
    created() {
      if (this.newListV3 && this.newListV3.type == 5) {
        this.newListV3.items.forEach(item => {
          if (item.price > 9999) {
            item.price = (item.price / 10000).toFixed(2)
            item.price = item.price.split('.')
            item.price[1] += '万'
          } else {
            item.price = item.price.split('.')
          }
          if (item.sort > 9999) {
            item.sort = (item.sort / 10000).toFixed(2)
            item.sortUnit = true
          }
        })
      }
    },
    methods: {
      async goJumpPage(type, subUrl, linkUrl, title, conponType) {
        if (conponType == 0) { // 下午茶弹框
          this.$parent.conponShow = true
          this.$parent.couponisShow = true
          return
        }
        if (type == 1 || type == 3 || type == 40 || type == 52 || type == 6) {
          // this.$baiduStats('首页-楼层' + this.newListV3.type + '-' + title)
          dooolyAPP.gotoJumpJq.call(this, linkUrl);
        } else if (type == 21) {
          // this.$baiduStats('首页-礼包-' + title)
          dooolyAPP.redirectActivity('giftGoodsList/' + linkUrl + '?name=' + title)
        } else if (type == 22) {
          // this.$baiduStats('首页-礼包-查看更多')
          dooolyAPP.redirectActivity('giftList?type=1')
        } else if (type == 41) {
          // this.$baiduStats('首页-热门商户-查看更多')
          this.$router.push('/v3/life?type=2')
        } else if (type == 51) {
          // this.$baiduStats('首页-楼层' + this.newListV3.type + '-全部卡券')
          dooolyAPP.gotoJumpVue.call(this, '/cardBuy')
        } else if (type == 50) {
          // this.$baiduStats('首页-楼层' + this.newListV3.type + '-我的卡券')
          dooolyAPP.gotoJumpVue.call(this, '/coupon/0')
        }
      },
      link(subUrl, linkUrl, title) {
        // this.$baiduStats(this.origin + '-' + this.name + '-' + title)
        if (subUrl) {
          dooolyAPP.gotoJumpVue.call(this, subUrl)
        } else {
          dooolyAPP.gotoJumpJq.call(this, linkUrl)
        }
      },
      animation(cur, old) {
        this.timeOut = setTimeout(() => {
          if (old < cur) {
            if (cur - old > 8) {
              old += 8
            } else {
              old++
            }
            document.getElementsByClassName('swipeveiw')[this.index].getElementsByClassName('swipe')[0].style
              .marginLeft = -old + 'px'
            this.animation(cur, old)
          } else if (old > cur) {
            if (old - cur > 8) {
              old -= 8
            } else {
              old--
            }
            document.getElementsByClassName('swipeveiw')[this.index].getElementsByClassName('swipe')[0].style
              .marginLeft = -old + 'px'
            this.animation(cur, old)
          }
        }, 1)
      },
      swipeLeft() {
        if (this.checkpoint < this.nweListlength.length - 1) {
          this.checkpoint++
        }
      },
      swipeRight() {
        if (this.checkpoint > 0) {
          this.checkpoint--
        }
      },
      conponShowButton() {
        if (this.type == 3 || this.type == 7) {
          this.$parent.conponShow = true
        } else if (this.type == 4 || this.type == 6) {
          const baseURL = api.baseURL + 'dist'
          if (this.list[0].linkUrl.indexOf(baseURL) > -1) {
            const subUrl = this.list[0].linkUrl.substring(this.list[0].linkUrl.indexOf('#') + 1)
            dooolyAPP.gotoJumpVue.call(this, subUrl)
          } else {
            window.location.href = this.list[0].linkUrl
          }
        }
        let btnName = (this.list && this.list[0] && this.list[0].mainTitle) || '活动banner'
        // this.$baiduStats(this.origin + '-每日特惠banner-' + btnName)
      }
    },
    mounted() {
      if (this.type == 2 || this.type == 13) {
        for (var i = 0; i < this.list.length; i++) {
          var index = parseInt(i / 4)
          if (i % 4 == 0) {
            this.nweList['list' + index] = []
            this.nweListlength.push(1)
          }
          this.nweList['list' + index].push(this.list[i])
        }
      }
    }
  }

</script>

<style scoped lang="scss">
  .title {
    font-size: 0;
    color: #333;
    margin-left: 0.4rem;
    margin-top: 0.6rem;
    margin-bottom: 0.4rem;
    font-weight: bold;
  }

  .title span {
    display: inline-block;
    line-height: 110%;
    font-size: 0.4rem;
  }

  .title .subTitle {
    font-size: 0.22rem;
    color: #a0a0a0;
    font-weight: normal;
    margin-top: 0.1rem;
  }

  .selects {
    position: relative;
    overflow: hidden;
    margin-bottom: 0.4rem;
  }

  .center_view {
    text-align: center;
  }

  /*下拉样式*/
  .list {
    padding: 0 0.35rem;
    font-size: 0;
    overflow: hidden;
    height: 3.68rem;
    text-align: left;
    padding-top: 0.32rem;
  }

  .small {
    height: auto !important;
  }

  .listdown {
    height: auto !important;
  }

  .list li {
    position: relative;
    display: inline-block;
    width: 23.6%;
    height: 1.7rem;
    margin: 0 0.7%;
    background: #fafafa;
    text-align: center;
    font-size: 0;
    vertical-align: middle;
    border-radius: 0.05rem;
    border-radius: 0.05rem;
    margin-bottom: 0.32rem;
  }

  .list li .logo {
    width: 1.2rem;
    height: 0.75rem;
    margin-top: 0.16rem;
    margin-bottom: 0.1rem;
  }

  .list li .corner_mark {
    position: absolute;
    left: 50%;
    top: 0;
    font-size: 0.2rem;
    padding: 0 0.08rem;
    line-height: 170%;
    z-index: 1;
    border: 0;
    color: #fff;
    background: #ee3f44;
    border-radius: 0.5rem;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .list li .integral {
    width: 0.3rem;
    height: 0.3rem;
  }

  .list li .new {
    width: 0.3rem;
    height: 0.3rem;
    margin-right: 0.1rem;
  }

  .list li span {
    font-size: 0.28rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 0.32rem;
  }

  .list li div {
    width: 100%;
    line-height: 110%;
    height: 0.24rem;
    text-align: center;
    font-size: 0.24rem;
    color: #333333;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .list li .btitle {
    color: #a0a0a0;
    margin-bottom: 0.08rem;
  }

  .down {
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    margin: 0.3rem 0.4rem 0.16rem 0.4rem;
    position: relative;
  }
  .type9Down{
    margin: 0.57rem 0.4rem 0.16rem 0.4rem;
  }
  .down img {
    width: 0.3rem;
  }

  .down .line {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    z-index: -1;
    margin-top: -1px;
    overflow: hidden;
  }

  .down .line::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #e5e5e5;
    height: 1px;
    transform: translateY(-50%);
  }

  .down .img_view {
    display: inline-block;
    background: #fff;
    width: 0.7rem;
    font-size: 0;
  }

  .up img {
    transform: rotate(180deg);
  }

  /*滑动样式、*/
  .swipeveiw {
    width: 999999px;
    overflow: hidden;
    position: relative;
    padding-bottom: 0.3rem;
    font-size: 0;
  }

  .swipe {
    display: inline-block;
    width: 6.9rem;
    padding: 0 0.3rem;
    font-size: 0;
    overflow: hidden;
    vertical-align: top;
  }

  .backgroundImg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .point {
    position: absolute;
    left: 50%;
    bottom: 0;
    font-size: 0;
    -webkit-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
  }

  .point div {
    display: inline-block;
    width: 0.06rem;
    height: 0.06rem;
    border-radius: 1rem;
    background: #ddd;
    margin: 0 0.03rem;
  }

  .point div.check {
    background: #A2A2A2;
  }

  .swipe li {
    display: inline-block;
    width: 3.25rem;
    height: 1.8rem;
    margin: 0.1rem;
    position: relative;
    border-radius: 0.05rem;
    overflow: hidden;
    background-size: 100% 100%;
  }

  .swipe li img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .swipe li .contitle {
    padding-top: 0.15rem;
    padding-left: 0.2rem;
    font-size: 0.28rem;
    color: #333;
  }

  .swipe li .con.color {
    color: #fff;
    background: linear-gradient(130deg, rgb(217, 177, 90) 0%, rgb(231, 206, 139) 100%);
    display: inline-block;
    padding: 0 0.1rem;
    border-radius: 0.5rem;
  }

  .swipe li .con {
    margin-left: 0.2rem;
    font-size: 0.24rem;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .active {
    font-size: 0;
    padding: 0 0.4rem;
    height: 2rem;
    overflow: hidden;
  }

  .active img {
    height: 100%;
  }

  /* typr5 */
  .preference_view {
    overflow: hidden;
    position: relative;
    padding-bottom: 0.3rem;
    font-size: 0;
  }

  .preference {
    display: inline-block;
    padding: 0 0.3rem;
    font-size: 0;
    overflow: hidden;
    vertical-align: top;
    height: 4.5rem;
  }

  .preference li {
    display: inline-block;
    width: 2.15rem;
    height: 1.9rem;
    margin: 0.2rem 0.05rem;
    position: relative;
    border-radius: 0.05rem;
    overflow: hidden;
    background-size: 100% 100%;
  }

  .preference li div {
    text-align: center;
    line-height: 110%;
  }

  .preference li .contitle {
    padding-top: 1.28rem;
    font-size: 0.26rem;
    color: #fff;
  }

  .preference li .con {
    font-size: 0.2rem;
    color: #fff;
    margin-top: 0.08rem;
  }

  /* typr6 */
  .hot_view {
    overflow: hidden;
    padding-bottom: 0.3rem;
    font-size: 0;
  }

  .hot {
    display: inline-block;
    width: 6.8rem;
    padding: 0 0.3rem;
    font-size: 0;
    overflow: hidden;
    vertical-align: top;
  }

  .hot .baner {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.05rem;
  }

  .hot li {
    display: inline-block;
    width: 2.15rem;
    height: 2.6rem;
    margin: 0 0.05rem;
    position: relative;
    border-radius: 0.1rem;
    background: #fafafa;
  }

  .hot li:nth-child(1) {
    width: 100%;
    height: auto;
    margin: 0 0 0.6rem 0;
    overflow: hidden;
  }

  .hot li:nth-child(1) img {
    width: 100%;
    height: 2rem;
    border-radius: 0.1rem;
  }

  .hot li div {
    text-align: center;
    line-height: 110%;
  }

  .hot li .logo {
    position: absolute;
    left: 50%;
    top: 0;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 100%;
    overflow: hidden;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .hot li .contitle {
    padding-top: 0.48rem;
    font-size: 0.26rem;
    color: #333;
  }

  .hot li .con {
    font-size: 0.2rem;
    color: #a0a0a0;
    margin-top: 0.05rem;
  }

  .hot li .logo img {
    height: auto;
  }

  /* typr7 */
  .type7_view {
    overflow: hidden;
    position: relative;
    padding-bottom: 0.3rem;
    font-size: 0;
  }

  .type7 {
    display: inline-block;
    padding: 0 0.25rem;
    font-size: 0;
    overflow: hidden;
    vertical-align: top;
  }

  .type7 li {
    display: inline-block;
    width: 3.18rem;
    height: 4.5rem;
    margin: 0.15rem;
    position: relative;
    border-radius: 0.05rem;
    overflow: hidden;
  }

  .type7 li div {
    text-align: left;
    line-height: 110%;
  }

  .type7 li .img {
    width: 3.2rem;
    height: 3.2rem;
    font-size: 0;
    border-radius: 0.1rem;
    overflow: hidden;
  }

  .type7 li .img img {
    height: 100%;
  }

  .type7 li .contitle {
    padding-top: 0.1rem;
    font-size: 0.28rem;
    color: #333333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .type7 li .con {
    font-size: 0.2rem;
    color: #fff;
    margin-top: 0.1rem;
  }

  .type7 li .price {
    position: absolute;
    left: 0;
    bottom: 0.4rem;
    line-height: 110%;
    font-size: 0.36rem;
    color: #ee3f44;
  }

  .type7 li .price span {
    font-size: 0.24rem;
  }

  .type7 li .piont {
    position: absolute;
    right: 0;
    bottom: 0.45rem;
    line-height: 110%;
    font-size: 0.24rem;
    color: #a0a0a0;
  }

  .type7 li .Aprice {
    position: absolute;
    left: 0;
    bottom: 0;
    line-height: 160%;
    font-size: 0.2rem;
    color: #a0a0a0;
  }

  .type7 li .tag {
    position: absolute;
    right: 0;
    bottom: 0;
    line-height: 160%;
    padding: 0 0.1rem;
    font-size: 0.2rem;
    color: #fff;
    border-radius: 0.5rem;
    background: #b5a481;
  }

  .type7 li .red {
    background: #e31d1a;
  }

  .type7 li .block {
    background: #333;
  }

  /* typr8 */
  .type8_view {
    overflow: hidden;
    position: relative;
    padding-bottom: 0.3rem;
    font-size: 0;
  }

  .type8 {
    display: inline-block;
    padding: 0 0.3rem;
    font-size: 0;
    overflow: hidden;
    vertical-align: top;
    display: flex;
    justify-content: space-between;
    text-align: center;
    flex-wrap: wrap;
  }

  .type8.center {
    justify-content: center;
  }

  .type8.left {
    justify-content: flex-start;
  }

  .type8 li {
    width: 20%;
    padding-top: 0.22rem;
    margin-bottom: 0.2rem;
    position: relative;
    border-radius: 0.05rem;
    overflow: hidden;
    background-size: 100% 100%;
    white-space: nowrap;
  }

  .type8 li.list4 {
    width: 25%;
  }

  .type8 li.list3 {
    width: 33%;
  }

  .type8 li img {
    width: 1.42rem;
    height: 0.9rem;
  }

  .type8 li div {
    text-align: center;
    line-height: 110%;
  }

  .redfont {
    color: #ee3f44;
  }

  .type8 li .contitle {
    padding-top: 0.1rem;
    font-size: 0.24rem;
    color: #333;
  }

  .type8 li .con {
    font-size: 0.24rem;
    color: #333;
    margin-top: 0.1rem;
  }

  .type8 .tag {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 0.2rem;
    line-height: 160%;
    padding: 0 0.04rem;
    background: #ba9e3a;
    color: #fff;
    border-radius: 0.1rem 0.1rem 0.1rem 0;
  }

  /* typr8 */
  .type9 {
    padding: 0 0.35rem;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    height: 3rem;
    li {
      background: url(../../../src/assets/images/home/home_v3_merchant_bg.png) no-repeat 0 0;
      background-size: 100% 100%;
      width: 1.6rem;
      height: 1.4rem;
      margin: 0.05rem;
      text-align: center;
      font-size: 0;

      .img-view {
        width: 100%;
        height: 0.68rem;
        padding: 0.15rem 0 0.15rem 0;
        overflow: hidden;

        img {
          width: 1.2rem;
          height: 0.75rem;
        }
      }

      .tag {
        font-size: 0.2rem;
        line-height: 0.42rem;
        color: #333;
        // transform: scale(0.83);
        white-space: nowrap;

        span {
          color: #ee3f44;
        }
      }
    }
  }
  .color1 {
    background-color: #eee;
  }

  .color2 {
    background-color: #f2f8ff;
  }

  .color3 {
    background-color: #fff5f4;
  }

  //v3首页楼层
  .new-title {
    color: #333;
    padding: 0 0.2rem;
    margin-bottom: 0.3rem;
    font-weight: bold;
    line-height: 110%;
    font-size: 0.4rem;
  }

  .new-type8 {
    margin-bottom: 0.3rem;

    ul {
      padding: 0 0.2rem;
    }
  }

  .gift {
    // overflow: scroll; // todo
    margin-bottom: 0.8rem;

    ul {
      // width: 999999px; // todo
      padding: 0 0.1rem;
      display: flex; // todo
      overflow: scroll;

      li {
        // float: left; // todo
        padding: 0 0.1rem;
        text-align: center;

        .img-view {
          width: 2rem;
          height: 1.6rem;
          margin-bottom: 0.2rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 0.1rem;
            box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
          }
        }

        .tag {
          font-size: 0.26rem;
          color: #333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: 2rem;
        }
      }
    }
  }

  .merchant {
    margin-bottom: 0.8rem;

    ul {
      padding: 0 0.15rem;
      display: flex;
      overflow: hidden;
      flex-wrap: wrap;
      &.merchantDown{
        height: 3rem;
      }
      &.merchantUp{
        height: auto;
      }
      li {
        background: url(../../../src/assets/images/home/home_v3_merchant_bg.png) no-repeat 0 0;
        background-size: 100%;
        width: 1.7rem;
        height: 1.4rem;
        margin: 0.05rem;
        text-align: center;
        font-size: 0;

        .img-view {
          width: 100%;
          height: 0.68rem;
          padding: 0.15rem 0 0.15rem 0;
          overflow: hidden;

          img {
            width: 1.2rem;
            height: 0.75rem;
          }
        }

        .tag {
          font-size: 0.24rem;
          line-height: 0.42rem;
          color: #333;
          transform: scale(0.83);
          white-space: nowrap;

          span {
            color: #ee3f44;
          }
        }
      }
    }

    .all {
      position: relative;
      padding-top: 0.4rem;
      margin: 0 0.2rem;
      height: 0.3rem;
      font-size: 0.24rem;
      text-align: center;

      .arrow-img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0.3rem;
        height: 0.3rem;
        padding: 0 0.2rem;
        background-color: #fff;

        &.up {
          transform: rotateX(180deg) translate(-50%, 50%);
        }
      }

      .line {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 1px;
        border-top: 1px solid #e5e5e5;
      }
    }
  }

  .card {
    margin-bottom: 0.8rem;

    .new-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .cardnum {
        font-size: 0.26rem;
        font-weight: normal;
        display: flex;

        .color {
          color: #ee3f44;

          &.suspend {
            position: relative;
            padding-right: 0.14rem;

            &::after {
              content: '+';
              position: absolute;
              right: 0;
              top: 0;
              line-height: 110%;
              transform: scale(0.8);
            }
          }
        }

        .iocn {
          width: 0;
          height: 0;
          margin: 0.12rem 0 0 0.1rem;
          border-width: 0.08rem 0 0.08rem 0.1rem;
          border-style: solid;
          border-color: transparent transparent transparent #585858;
        }
      }
    }

    ul {
      padding: 0 0.1rem;
      display: flex;
      flex-wrap: wrap;

      li {
        margin: 0 1.3%;
        text-align: center;
        box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
        width: 30.7%;
        height: 3.6rem;
        border-radius: 0.1rem;
        text-indent: 0.1rem;

        .img-view {
          width: 2.23rem;
          height: 2.23rem;
          border-radius: 0.1rem 0.1rem 0 0;
          overflow: hidden;
          text-indent: 0;
          margin-bottom: 0.12rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          font-size: 0.24rem;
          color: #333;
          line-height: 110%;
          white-space: nowrap;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.16rem;
          text-align: left;
        }

        .dooly-pirce {
          display: flex;
          align-items: flex-end;
          text-align: left;
          justify-content: space-between;
          margin-bottom: 0.06rem;
          white-space: nowrap;

          .left {
            font-size: 0.3rem;
            width: 1.4rem;
            line-height: 0.4rem;
            height: 0.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            background: #ee3f44;
            color: #fff;
            border-radius: 0 0.5rem 0.5rem 0;

            span {
              font-size: 0.24rem;
            }
          }

          .right {
            font-size: 0.24rem;
            color: #333;
            padding-right: 0.1rem;
            font-weight: bold;
          }
        }

        .pirce {
          display: flex;
          align-items: flex-end;
          text-align: left;
          justify-content: space-between;
          white-space: nowrap;
          color: #a0a0a0;

          .left {
            font-size: 0.24rem;
            text-decoration: line-through;
            transform: scale(0.83);
            transform-origin: left center;
          }

          .right {
            font-size: 0.24rem;
            padding-right: 0.1rem;
            transform: scale(0.83);
            transform-origin: right center;
          }
        }
      }
    }

    .all {
      margin-top: 0.4rem;
      text-align: center;
      font-size: 0;

      img {
        width: 1.83rem;
      }
    }
  }

  .activity {
    margin-bottom: 0.8rem;
    overflow: hidden;

    ul {
      padding: 0 0.1rem;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 46.7%;
        height: 1.8rem;
        margin: 0.1rem 1.3%;
        font-size: 0;
        position: relative;
        box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
        border-radius: 0.1rem;
        color: #fff;
        white-space: nowrap;

        .img-view {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          border-radius: 0.1rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .tag {
          font-size: 0.3rem;
          padding: 0.4rem 0 0 0.2rem;
          line-height: 110%;
        }

        .state {
          font-size: 0.24rem;
          padding: 0.1rem 0 0 0.2rem;
          line-height: 110%;
        }
      }
    }
  }

</style>
<style>
  .advertising {
    height: 2.1rem;
    margin: 0 0.2rem 0.75rem 0.2rem;
  }

  .advertising .mint-swipe {
    height: 100%;
    overflow: initial;
  }

  .advertising .mint-swipe-item {
    border-radius: 0.1rem;
    overflow: hidden;
  }

  .advertising img {
    width: 100%;
    height: 100%;
  }

  .advertising .mint-swipe-indicators {
    bottom: -0.35rem;
    font-size: 0;
  }

  .advertising .mint-swipe-indicator {
    background: #d7d7d7;
    opacity: 1;
  }

  .advertising .is-active {
    background: #ee3f44 !important;
  }

</style>
