
import { createStore } from 'vuex'

export default createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  getters: {

    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user
  },
  mutations: {
    SET_AUTH(state, status) {
      state.isAuthenticated = status
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    // Login action to be called from Login.vue
    login({ commit }, userData) {
      commit('SET_USER', userData)
      commit('SET_AUTH', true)
    },
    
    // Logout action to be called from App.vue
    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_AUTH', false)
    }
  }
})