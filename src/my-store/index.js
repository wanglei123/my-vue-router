import Vue from 'vue'
import Vuex from './my-vuex.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    add(state){
      state.counter++
    }
  },
  actions: {
    addAction(ctx){
      setTimeout(()=>{
        ctx.commit('add')
      }, 1000)
    }
  },
  getters: {
    doubleCounter: (state) => {
      return state.counter * 2
    }
  },
  modules: {
  }
})
