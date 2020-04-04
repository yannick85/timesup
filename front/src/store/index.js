import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vuexLocalStorage = new VuexPersist({
  key: 'socastore',
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameUuid: null,
    gameName: null,
    playerUuid: null,
    playerPseudo: null
  },
  mutations: {
    setGame (state, gameData) {
      state.gameUuid = gameData.gameUuid
      state.gameName = gameData.name
      state.playerUuid= gameData.playerUuid,
      state.playerPseudo= gameData.playerPseudo
    }
  },
  actions: {
  },
  getters: {
    isInGame: state => {
      return (state.gameUuid !== null && state.gameUuid.length > 0)
    },
    gameUuid: state => {
      return state.gameUuid
    },
    gameName: state => {
      return state.gameName
    },
    playerUuid: state => {
      return state.playerUuid
    },
    playerPseudo: state => {
      return state.playerPseudo
    }
  },
  modules: {
  },
  plugins: [vuexLocalStorage.plugin]
})
