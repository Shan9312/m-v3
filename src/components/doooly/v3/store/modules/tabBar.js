export default {
  namespaced: true,
  state: {
    isShowBar: false,
    isActive: 0 // tabBar显示哪个icon，写入store，解决刷新页面icon重置为第一个
  },
  getters: {
    isShowBar(state) {
      return state.isShowBar
    },
    isActive(state) {
      return state.isActive
    }
  },
  mutations: {
    changeNav(state, data) {
      state.isShowBar = data;
    },
    changeActive(state, data) {
      state.isActive = data;
    }
  }
}
