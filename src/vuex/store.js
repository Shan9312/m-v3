import Vue, {
  jsonp
} from 'vue';
import Vuex from 'vuex';
import v3Store from 'v3/store'

Vue.use(Vuex);

const state = {
  cardbuy: localStorage.getItem('store_cardbuy') ? JSON.parse(localStorage.getItem('store_cardbuy')) : '',
  scan: localStorage.getItem('store_scan') ? localStorage.getItem('scan') : '',
  deliveryAddress: localStorage.getItem('store_deliveryAddress') ? localStorage.getItem('store_deliveryAddress') : ''
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
    localStorage.setItem('store_cardbuy', JSON.stringify(data));
  },
  delete(state, data) {
    state.cardbuy = '';
    localStorage.removeItem('store_cardbuy');
  },
  addScan(state, data) {
    state.scan = data;
    localStorage.setItem('store_scan', data);
  },
  deleteScan(state) {
    state.scan = '';
    localStorage.removeItem('store_scan');
  },
  addAddress(state, data) {
    state.deliveryAddress = data;
    localStorage.setItem('store_deliveryAddress', data);
  },
  deleteAddress(state) {
    state.deliveryAddress = '';
    localStorage.removeItem('store_deliveryAddress');
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
  actions: actions
}
// 将v3里面的store和oldStore合并
const newStore = Object.assign({}, v3Store, oldStore)
const store = new Vuex.Store(newStore)
export default store;