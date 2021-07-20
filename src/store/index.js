import { createStore } from 'vuex'
import { storageGet, storageSet } from '../modules/functions';

export default createStore({
  state: {
    localServer: "http://127.0.0.1:8182",
    queue: {
      archive: null,
      images: [],
      item: null,
    },
    logged: false,
    bussy: false,
  },
  getters: {
    remote(state) {
      return state.remote;
    },
    localServer(state) {
      return state.localServer;
    },

    queue(state) {
      return state.queue;
    },

    user(state) {
      return state.user;
    },

    logged(state) {
      return state.logged;
    },
    bussy(state) {
      return state.bussy;
    },
    category(state) {
      return state.category;
    },
    city(state) {
      return state.city;
    },
    url(state) {
      return state.url;
    },
  },
  mutations: {
    SET_LOCAL_SERVER(state, localServer) {
      state.localServer = localServer;
    },
    SET_QUEUE(state, queue) {
      state.queue = queue;
    },
    SET_BUSSY(state, bussy) {
      state.bussy = bussy;
    },
    SET_LOGGED(state, logged) {
      state.logged = logged;
    },
  },
  actions: {
    setLocalHostUrl({ commit }, localServer) {
      commit("SET_LOCAL_SERVER", localServer);
    },
    setQueue({ commit }, queue) {
      commit("SET_QUEUE", queue);
    },
    init({ commit }) {
      commit("SET_BUSSY", true);
      const logged = storageGet("logged");
      if (logged !== null) {
        commit("SET_LOGGED", logged);
      }

      commit("SET_BUSSY", false);
    },
    setLogged({ commit }, logged) {
      storageSet("logged", logged);
      commit("SET_LOGGED", logged);
    },
    setBussy({ commit }, bussy) {
      commit("SET_BUSSY", bussy);
    },
  },
});
