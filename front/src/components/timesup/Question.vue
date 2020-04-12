<template>
  <div class="question">
    <div>
      <div class="turnTitle">Mot {{ game.stateData.turnActual }}/{{ game.stateData.turnTotal }}</div>
      <div :class="`${ 'turnTeamAndPlayer team-'+game.teams[game.stateData.turnTeamIncr].id }`">
        <span>Au tour de : </span>
        <span class="teamName">{{ game.players[game.stateData.turnPlayerId].pseudo }}</span>
      </div>
      <div class="wordContainer" v-if="game.stateData.turnPlayerId == this.$store.getters['playerId']">
        <div class="wordIntro">C'est à vous ! Le mot à faire deviner est :</div>
        <div class="wordBlock">
          <div class="showWord" @click="showWord = true" v-if="showWord === false">Montrer le mot</div>
          <div class="hideWord" @click="showWord = false" v-if="showWord === true">Cacher le mot</div>
          <div class="wordAsked" v-if="showWord === true">{{ game.stateData.wordAsked }}</div>
        </div>
        <div class="responseBlock">
          <div :class="{ responseActive : response == true }" @click="response = true">Trouvé&nbsp;&nbsp;<faicon icon="thumbs-up" /></div>
          <div :class="{ responseActive : response == false }" @click="response = false">Pas trouvé&nbsp;&nbsp;<faicon icon="thumbs-down" /></div>
        </div>
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
      response: null,
      showWord: false
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
          this.showWord = false
        }
      }
      
    }
  },
  components: {
  }
}
</script>
