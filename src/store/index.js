import Vue from "vue";
import Vuex from "vuex";
import loginModule from "./login";
import busStopModule from "./bus-stop";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { loginModule, busStopModule },
});
