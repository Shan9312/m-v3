<template>
  <div>
    <div class="top" v-html="introduction">

    </div>

  </div>
</template>
<style>
  img{
    width: 100%;
  }
</style>
<script>
  import api from '@/assets/js/api.js';
  import http from '@/http/http.js';
    export default {
        name: "hot-activity-detail",
      data(){
          return {
            introduction:'',
          }
      },
      methods:{
          loadPageData(){
            http({
              method: 'get',
              url: api.CouponActivity + '/' + this.$route.params.activityId,
            }).then((res) => {
              dooolyAPP.initTitle(res.data.data.activityName);
              this.introduction=res.data.data.introduction;

            })
          },
          HTMLDecode(text) {
            var temp = document.createElement("div");
            temp.innerHTML = text;
            var output = temp.innerText || temp.textContent;
            temp = null;
            return output;
          }
      },
      mounted(){
          this.loadPageData();

      }
    }
</script>

<style scoped>
.top{
  width:100%;
  font-size: 0;
}
</style>
