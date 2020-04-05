<template>
  <div class="gameContainer">
    <div v-if="!$store.getters['isInGame']">Aucune partie active</div>
    <div v-if="$store.getters['isInGame']">
      <h2>{{ $store.getters['gameName'] }}</h2>
      <div v-if="game === null">Chargement ...</div>
      <div v-if="game">
        Joueurs :
        <ul class="playerList" v-if="game.players">
          <li v-for="player in game.players" 
            :index="player.pseudo"
            :key="player.pseudo"
            class="player"
            >{{ player.pseudo }}</li>
        </ul>
        {{ game }}
        <Lobby v-if="game.state == 'LOBBY'" :game="game" @sendData="sendData"></Lobby>
        <Prep v-if="game.state == 'PREP'" :game="game" @sendData="sendData"></Prep>
      </div>
    </div>
  </div>
</template>

<script>
import Lobby from '@/components/timesup/Lobby.vue'
import Prep from '@/components/timesup/Prep.vue'

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
  sockets: {
    syncGame: function (game) {
      if (game.gameUuid == this.$store.getters['gameUuid']) {
        this.game = game
      }
    }
  },
  components: {
    Lobby, Prep
  }
}
</script>
