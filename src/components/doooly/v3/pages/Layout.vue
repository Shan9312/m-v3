<template>
  <div>
    <router-view></router-view>
    <tab-bar v-show="tabBar.isShowBar"></tab-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TabBar from 'v3/components/tabBar.vue'
export default {
  name: 'v3Layout',
  data() {
    return {
      firstOpenPage : true
    }
  },
  components: {
    TabBar
  },
  computed: {
    ...mapState(['tabBar'])
  },
  watch: {
    $route(to, from) {
      if (to.meta && to.meta.isShowBar) {
        this.$store.commit('tabBar/changeNav', true);
        this.getActive();
      } else {
        this.$store.commit('tabBar/changeNav', false);
      }
    }
  },
  methods: {
    getActive() {
      let tabName = ['home', 'life', 'insourcing', 'mine']
      tabName.map((item, index) => {
        if (item == this.$route.name) {
          this.$store.commit('tabBar/changeActive', index);
          this.$store.commit('tabBar/changeNav', true);
          this.firstOpenPage = false;
        }else if(this.firstOpenPage){
          this.$store.commit('tabBar/changeNav', false);
        }
      })
    }
  },
  created() {
    this.getActive();
  }
};
</script>
<style scoped lang="scss">
</style>