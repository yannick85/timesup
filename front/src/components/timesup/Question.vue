<template>
  <div class="question">
    <div>
      <h4>{{ game.state }} - Tour {{ game.stateData.turnActual }}/{{ game.stateData.turnTotal }}</h4>
      <div>Au tour de : Equipe {{ game.teams[game.stateData.turnTeamIncr].name }} - {{ game.players[game.stateData.turnPlayerId].pseudo }}</div>
      <div v-if="game.stateData.turnPlayerId == this.$store.getters['playerId']">
        C'est à vous<br/>
        Le mot est : <b>{{ game.stateData.wordAsked }}</b>
        <div @click="response = true">Trouvé :)</div>
        <div @click="response = false">Pas trouvé :(</div>
        Response : {{ response }}
        <div class="button" @click="sendResponse()" v-if="response !== null"
          >Envoyer la réponse</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Question',
  props: {
    game: Object
  },
  data: function () {
    return { 
      response: null
    }
  },
  mounted: function () {
  },
  methods: {
    sendResponse: function () {
      this.$emit('sendData', 'gameResponse', this.response)
    },
  },
  watch: {
    game: {
      immediate: true,
      handler (game) {
        if (game.stateData.turnPlayerId != this.$store.getters['playerId']) {
          this.response = null
        }
      }
      
    }
  },
  components: {
  }
}
</script>
