import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
  cardbuy:''
};
const getters = {
  cardbuy:function(state){
    return state.cardbuy;
  }
};
const mutations={
  add(state,data){
    state.cardbuy=data;
  },
  delete(state,data){
    state.cardbuy=data;
  },
};
const actions ={
  addAction(context,data){
    context.commit('add',data)
  },
  deleteAction(context,data){
    context.commit('delete',data)
  },
}

const store = new Vuex.Store({
  state: state,
  getters: getters,
  mutations:mutations,
  actions:actions
})
export default store;
