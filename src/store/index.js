import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/authStore'
import ipfs from './modules/ipfsStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    ipfs
  }
})
