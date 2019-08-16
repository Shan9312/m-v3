<template>
  <div>
    <div v-if="dyfooterState" class="include_footer">
      <ul>
        <li class="liCommon" :data-baidu-stats="'底部通栏-' + item.tobarContent" v-for="(item,index) in footerTobarData" :key="index" :class="{liActive:tabBar.isActive===index}" @click="toLink(item.tobarLink,index,item.tobarContent)">
          <span :class="item.tobarIcon" class="liActive"></span><br><i>{{item.tobarContent}}</i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "TabBar",
  data() {
    return {
      dyfooterState: true,
      footerTobarData: [
        {
          tobarLink: '/home',
          tobarIcon: 'index',
          tobarContent: '首页'
        },
        {
          tobarLink: '/life',
          tobarIcon: 'shop',
          tobarContent: '生活'
        },
        {
          tobarLink: '/insourcing',
          tobarIcon: 'find',
          tobarContent: '内购'
        },
        {
          tobarLink: '/mine',
          tobarIcon: 'me',
          tobarContent: '我的'
        }
      ],
      statsFilter: {
        '/home': '首页',
        '/life': '生活',
        '/insourcing': '内购',
        '/mine': '我的',
      },
      showType: this.$route.query.showType
    }
  },
  computed: {
    ...mapState(['tabBar'])
  },
  methods: {
    toLink(tobarLink, index, tobarContent) {
      if (tobarLink == '/insourcing') {
        if(window.location.href.indexOf('pre_dist') > 0 || window.location.href.indexOf('pro_dist') > 0){
          dooolyAPP.gotoJumpVue(this.$router,'/openOneNnumber/121/https%3a%2f%2fdouli.xianggou.ren%2fdist%2findex.html');
        }else{
          dooolyAPP.gotoJumpVue(this.$router,'/openOneNnumber/9449/http%3A%2F%2Fdouli-test.giftgine.cn');
        }
        return;
      }
      this.$store.commit('tabBar/changeActive', index);
      this.$router.replace({
        path: '/v3' + tobarLink
      });
      // this.$baiduStats(this.statsFilter[tobarLink]);
    },
    changeFooterState() {
      if (this.$browserName == "WebKit" || this.$browserName == "Chrome WebView") {
        this.dyfooterState = false;
      } else {
        this.dyfooterState = true;
      }
    }
  },
  mounted() {
    this.changeFooterState();
  }
}
</script>

<style scoped lang="scss">
.include_footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: 1rem;
  background: #f5f5f5;
  box-shadow: 0px -2px 6px 0 rgba(0, 0, 0, 0.1);
  ul {
    display: flex;
    text-align: center;
    flex-direction: row;
    justify-content: space-around;
    .liCommon {
      flex: 1;
      font-size: 0.24rem;
      color: #7d7d7d;
      text-align: center;
      padding-top: 0.2rem;
      line-height: 100%;
    }
  }
}

.include_footer ul li span {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  margin-bottom: 0.05rem;
  img {
    height: 100%;
  }
}

.liActive {
  color: #fd5739;
  span:before {
    color: #fd5739;
  }
  i{
    color: #fd5739;
  }
}
.index {
  background: url("~@/assets/images/nav/new_nav_1.png") no-repeat 0 0;
  background-size: 100%;
}
.liActive .index {
  background-image: url("~@/assets/images/nav/new_navs_1.png");
}
.shop {
  background: url("~@/assets/images/nav/new_nav_2.png") no-repeat 0 0;
  background-size: 100% 100%;
}
.liActive .shop {
  background-image: url("~@/assets/images/nav/new_navs_2.png");
}
.find {
  background: url("~@/assets/images/nav/new_nav_3.png") no-repeat 0 0;
  background-size: 100%;
}
.liActive .find {
  background-image: url("~@/assets/images/nav/new_navs_3.png");
}
.me {
  background: url("~@/assets/images/nav/new_nav_4.png") no-repeat 0 0;
  background-size: 100%;
}
.liActive .me {
  background-image: url("~@/assets/images/nav/new_navs_4.png");
}
i {
  font-style: normal;
  font-size: 0.24rem;
  display: inline-block;
}
</style>
