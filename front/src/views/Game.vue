<template>
  <div class="gameContainer">
    <div v-if="!$store.getters['isInGame']">Aucune partie active</div>
    <div v-if="$store.getters['isInGame']">
      <h2>{{ $store.getters['gameName'] }}</h2>
      <div v-if="game === null">Chargement ...</div>
      <div v-if="game">
        Joueurs :
        <ul class="playerList" v-if="game.playerList">
          <li v-for="player in game.playerList" 
            :index="player.pseudo"
            :key="player.pseudo"
            class="player"
            >{{ player.pseudo }}</li>
        </ul>
        {{ game }}
      </div>
    </div>
  </div>
</template>

<script>

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
  }
}
</script>
