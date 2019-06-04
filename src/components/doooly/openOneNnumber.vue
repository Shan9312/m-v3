<template>
  <div>
  </div>
</template>

<script>
import http from '@/http/http.js';
import api from '@/assets/js/api.js';
export default {
  name: "openOneNnumber",
  data() {
    return {
    }
  },
  methods: {
    gobank() {
      window.location.reload();
    },
  },
  mounted() {

  },
  beforeRouteEnter(to, from, next) {
    // if (!from.name && sessionStorage.getItem('isJump')) {
    //   dooolyAPP.goBackPageIndex("1");
    //   next();
    // } else {
    next(vm => {
      let urlStr = vm.$route.params.url;
      http({
        method: 'get',
        url: api.getTargetUrl + "?businessId=" + vm.$route.params.id + "&targetUrl=" + (urlStr == '1' ? '' : urlStr),
      }).then((result) => {
        if (result.data.code == 1000) {
          // sessionStorage写入isJump，用来解决从前端router跳转第三方，然后点击返回上一页问题
          // sessionStorage.setItem('isJump',true)
          // window.location.href = result.data.resultUrl;
          location.replace(result.data.resultUrl)
        } else if (result.data.code == 1001) {
          vm.$toast("小兜兜正忙,请稍候重试!");
          dooolyAPP.gotoJumpVue.call(vm, '/nav/newHome');
        }
      })
    });
    // }
  }
}
</script>

<style scoped>
/* test */
#mainContent-one {
  position: absolute;
  top: 0;
  left: 0;
}
#close-one {
  height: 0.5rem;
  width: 1rem;
  position: fixed;
  z-index: 10;
  top: 0.14rem;
  font-size: 0.3rem;
  text-align: center;
  line-height: 0.5rem;
  right: 0.14rem;
}
#close-one img {
  width: 0.5rem;
}
</style>
