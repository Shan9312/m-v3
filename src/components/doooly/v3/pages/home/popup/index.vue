<template>
  <div class="custom-pop" v-if="showPopList" @touchmove.prevent>
    <div class="pop-wrap">
      <img
        :data-baidu-stats="'关闭弹窗-' + popupList[popupIndex].name"
        class="close"
        src="~v3/assets/images/home/pop-close.png"
        @click="close"
        alt
      >
      <img
        :data-baidu-stats="'弹窗-' + popupList[popupIndex].name"
        :src="popupList[popupIndex] && popupList[popupIndex].imageUrl"
        @click="goto(popupList[popupIndex].formUrl)"
      >
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
      allIds: {},
      ids: {},
      popupIndex: 0,
      popupList: []
    };
  },
  computed: {
    showPopList() {
      if (this.popupList.length <= this.popupIndex) {
        // this.$emit("changePopStatus", false);
        return false;
      }
      return true;
    }
  },
  created() {
    // if (localStorage.getItem('isPopup')) return;
    this.getDialogList();
    // localStorage.setItem('isPopup', 'pop')
  },
  mounted() {},
  methods: {
    close() {
      this.dataClose();
      this.popupIndex++;
    },
    dataClose(){
      let userId = localStorage.getItem('userId');
      let id = this.popupList[this.popupIndex].id;
      this.ids[id] = "1";
      this.allIds[userId] = this.ids;
      localStorage.setItem("popIds", JSON.stringify(this.allIds));
    },
    async getDialogList() {
      const { data } = await getDialogList(localStorage.userId,);
      if (data && data.code === 1000 && data.data.length) {
        let dataArr = data.data;
        this.handleIds(dataArr);
        // this.$emit("changePopStatus", true);
      }
    },
    handleIds(dataArr) {
      let userId = localStorage.getItem('userId');
      this.allIds = JSON.parse(localStorage.getItem("popIds") || "{}");
      this.ids = this.allIds[userId] || {};
      dataArr.forEach(item => {
        if (this.ids[item.id] === "1") return;
        this.ids[item.id] = "0";
        this.popupList.push(item);
      });
      this.allIds[userId] = this.ids;
      localStorage.setItem("popIds", JSON.stringify(this.allIds));
    },
    goto(url) {
      this.dataClose();
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
      max-height: 100%;
    }
    .close {
      width: 0.58rem;
      height: 0.58rem;
      position: absolute;
      right: 0;
      top: -0.70rem;
      z-index: 1;
    }
  }
}
</style>
