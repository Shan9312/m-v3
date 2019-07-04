import Vue, {
  jsonp
} from 'vue';
import Vuex from 'vuex';
import v3Store from 'v3/store'

Vue.use(Vuex);

const state = {
  cardbuy: localStorage.getItem('cardbuy') ? JSON.parse(localStorage.getItem('cardbuy')) : '',
  scan: localStorage.getItem('scan') ? localStorage.getItem('scan') : '',
  deliveryAddress: localStorage.getItem('deliveryAddress') ? localStorage.getItem('deliveryAddress') : ''
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
    localStorage.setItem('cardbuy', JSON.stringify(data));
  },
  delete(state, data) {
    state.cardbuy = data;
    localStorage.removeItem('cardbuy');
  },
  addScan(state, data) {
    state.scan = data;
    localStorage.setItem('scan', data);
  },
  deleteScan(state) {
    state.scan = '';
    localStorage.removeItem('scan');
  },
  addAddress(state, data) {
    state.deliveryAddress = data;
    localStorage.setItem('deliveryAddress', data);
  },
  deleteAddress(state) {
    state.deliveryAddress = '';
    localStorage.removeItem('deliveryAddress');
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