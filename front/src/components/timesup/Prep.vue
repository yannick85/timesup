<template>
  <div class="prep">
    <div>
      <h4>Saisie des mots</h4>
      <div v-for="(word, index) in words" 
        :key="index">
        <div class="formElement">
          <label>Mot {{ index + 1 }}</label>
          <input type="text" v-model="words[index]" />
        </div>
      </div>
    </div>
    <div class="button" @click="sendWords()" v-if="!game.stateData.playersReady[$store.getters['playerId']]"
      >Je valide et je suis prêt</div>
    <div class="button" @click="cancelReady()" v-if="game.stateData.playersReady[$store.getters['playerId']]"
      >Je ne suis pas prêt</div>
  </div>
</template>

<script>

export default {
  name: 'Prep',
  props: {
    game: Object
  },
  data: function () {
    return { 
      words: []
    }
  },
  mounted: function () {
  },
  methods: {
    sendWords: function () {
      this.$emit('sendData', 'setWords', this.words)
    },
    cancelReady: function () {
      this.$emit('sendData', 'cancelReady')
    }
  },
  watch: {
    game: {
      immediate: true,
      handler (game) {
        if (game.stateData.numberOfWordsNeededByPlayer && game.stateData.numberOfWordsNeededByPlayer[this.$store.getters['playerId']]) {
          let neededWords = game.stateData.numberOfWordsNeededByPlayer[this.$store.getters['playerId']]
          if (this.words.length > neededWords) {
            this.words.slice(0, (neededWords - 1))
          }
          while (this.words.length < neededWords) {
            this.words.push('')
          }
        }
      }
      
    }
  },
  components: {
  }
}
</script>
