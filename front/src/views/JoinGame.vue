<template>
  <div class="hello">
    <h2>Rejoindre une partie</h2>
    <div v-if="gameChosen === null">
      <div v-for="game in gameList" 
        :index="game.name"
        :key="game.gameUuid"
        class="button gameToJoin"
        @click="gameChosen = game"
        >{{ game.name }}</div>
    </div>
    <div v-if="gameChosen !== null">
      <form @submit.prevent="askToJoinGame">
        <h4>{{ gameChosen.name }}</h4>
        <div class="formElement">
          <label>Ton pseudo</label>
          <input type="text" v-model="playerPseudo" />
        </div>
        <div class="formElement" v-if="gameChosen.needPassword">
          <label>Mot de passe</label>
          <input type="password" v-model="password" />
        </div>
        <div class="button" @click="askToJoinGame">Rejoindre</div>
        <div class="button buttonSecondary" @click="abortJoinGame">Annuler</div>
      </form>
    </div>
    <ul>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'JoinGame',
  props: {
  },
  data: function () {
    return {
      gameList: [],
      playerPseudo: null,
      password: null,
      gameChosen: null
    }
  },
  created: function () {
    this.sendGameList()
  },
  methods: {
    sendGameList: function () {
      this.$socket.emit('sendGameList')
    },
    askToJoinGame: function () {
      if (this.gameChosen && this.playerPseudo && this.playerPseudo.length > 4) {
        this.$socket.emit('joinGame', {
          gameUuid: this.gameChosen.gameUuid,
          pseudo: this.playerPseudo,
          password: this.password
        })
      }
    },
    abortJoinGame: function () {
      this.gameChosen = null
      this.sendGameList()
    }
  },
  sockets: {
    gameList: function (gameList) {
      this.gameList = gameList
    }
  }
}
</script>
