<template>
  <div class="custom-pop" v-show="showPopList" @touchmove.prevent>
    <div class="pop-wrap">
      <div class="close" @click="popupIndex ++"></div>
      <img :src="popupList[popupIndex] && popupList[popupIndex].imageUrl" @click="goto(popupList[popupIndex].formUrl)">
    </div>
  </div>
</template>

<script>
import { getDialogList } from "v3/services";
export default {
  name: "home-popup",
  props: {},
  data() {
    return {
      popupIndex: 0,
      popupList: []
    };
  },
  computed: {
    showPopList(){
      if (this.popupList.length <= this.popupIndex) {
        this.$emit('changePopStatus', false);
        return false;
      }
      return true;
    }
  },
  created() {
    if (localStorage.getItem('isPopup')) return;
    this.getDialogList();
    localStorage.setItem('isPopup', 'pop')
  },
  mounted() {},
  methods: {
    async getDialogList() {
      const { data } = await getDialogList();
      if (data && data.code === 1000 && data.data.length) {
        this.popupList = data.data;
        this.$emit('changePopStatus', true);
      }
    },
    goto(url){
      if (!url) return false;
      location.href = url;
    }
  },
  watch: {},
  components: {}
};
</script>

<style scoped lang="scss">
.custom-pop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  .pop-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 6rem;
    height: 6rem;
    img {
      width: 100%;
    }
    .close {
      width: 0.8rem;
      height: 0.8rem;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
    }
  }
}
</style>
