import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'
import v3Store from 'v3/store'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})
const state = {
  cardbuy: '',
  scan: '',
  deliveryAddress: ''
};
const getters = {
  cardbuy: function (state) {
    return state.cardbuy;
  },
  scan: function (state) {
    return state.scan;
  },
  deliveryAddress: function (state) {
    return state.deliveryAddress;
  }
};
const mutations = {
  add(state, data) {
    state.cardbuy = data;
  },
  delete(state, data) {
    state.cardbuy = data;
  },
  addScan(state, data) {
    state.scan = data;
  },
  deleteScan(state) {
    state.scan = '';
  },
  addAddress(state, data) {
    state.deliveryAddress = data;
  },
  deleteAddress(state) {
    state.deliveryAddress = '';
  }
};
const actions = {
  addAction(context, data) {
    context.commit('add', data)

  },
  deleteAction(context, data) {
    context.commit('delete', data)
  },
  addScanAction(context, data) {
    context.commit('addScan', data)
  },
  deleteScanAction(context, data) {
    context.commit('deleteScan', data)
  },
  addAddressAction(context, data) {
    context.commit('addAddress', data);
  },
  deleteAddressAction(context, data) {
    context.commit('deleteAddress', data)
  },
}
const oldStore = {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
  plugins: [vuexLocal.plugin]
}
// 将v3里面的store和oldStore合并
const newStore = Object.assign({}, v3Store, oldStore)
const store = new Vuex.Store(newStore)
export default store;
