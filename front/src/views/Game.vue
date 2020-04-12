<template>
  <div class="gameContainer">
    <div v-if="!$store.getters['isInGame']">Aucune partie active...</div>
    <div v-if="$store.getters['isInGame']">
      <div v-if="game === null">{{ $store.getters['gameName'] }} - Chargement ...</div>
      <div @click="syncGame" class="syncButton"><faicon icon="sync" /></div>
      <div v-if="game">
        <div class="gameHeader">
          <h1 class="gameName">{{ game.name }}</h1>
          <div class="gameState">{{ gameStateLbl }}</div>
        </div>
        <div class="gameTeams" v-if="game.state != 'LOBBY'">

        </div>
        <Lobby v-if="game.state == 'LOBBY'" :game="game" @sendData="sendData"></Lobby>
        <Prep v-if="game.state == 'PREP'" :game="game" @sendData="sendData"></Prep>
        <Question v-if="['GAME1', 'GAME2', 'GAME3'].includes(game.state)" :game="game" @sendData="sendData"></Question>
      </div>
    </div>
  </div>
</template>

<script>
import Lobby from '@/components/timesup/Lobby.vue'
import Prep from '@/components/timesup/Prep.vue'
import Question from '@/components/timesup/Question.vue'

export default {
  name: 'Game',
  data: function () {
    return { 
      game: null // fetched from back
    }
  },
  mounted: function () {
    if (this.$store.getters['isInGame']) {
      this.syncGame()
    }
  },
  methods: {
    syncGame: function () {
      this.$socket.emit('syncGame', {
        gameUuid: this.$store.getters['gameUuid'],
        playerUuid: this.$store.getters['playerUuid']
      })
    },
    sendData: function(action, actionData = null) {
      this.$socket.emit('sendDataToGame', {
        gameUuid: this.$store.getters['gameUuid'],
        playerUuid: this.$store.getters['playerUuid'],
        playerData: {
          action: action,
          actionData: actionData
        }
      })
    }
  },
  computed: {
    gameStateLbl: function () {
      if (this.game && this.game.state) {
        switch (this.game.state) {
          case 'LOBBY' :
            return 'Sélection des équipes'
          case 'PREP' :
            return 'Choix des mots'
          case 'GAME1' :
            return 'Devinettes !'
          case 'GAME2' :
            return 'En un mot !'
          case 'GAME3' :
            return 'Mimes !'
          case 'END' :
            return 'Partie terminée'
          default :
            return ''
        }
      }
      return null
    }
  },
  sockets: {
    syncGame: function (game) {
      if (game.gameUuid == this.$store.getters['gameUuid']) {
        this.game = game
      }
    }
  },
  components: {
    Lobby, Prep, Question
  }
}
</script>
