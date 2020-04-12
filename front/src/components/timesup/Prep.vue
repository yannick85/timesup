<template>
  <div class="prep">
    <div>
      <p>Entre 3 et 40 lettres, sans espace</p>
      <div v-for="(word, index) in words" 
        :key="index">
        <div class="formElement">
          <label>Mot {{ index + 1 }}</label>
          <input type="text" v-model="words[index]" />
        </div>
      </div>
      <p class="error" v-if="error">{{error}}</p>
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
      words: [],
      error: null
    }
  },
  mounted: function () {
  },
  methods: {
    sendWords: function () {
      let allWordOk = true
      this.error = ''
      for (let i in this.words) {
        if (!this.words[i].match('^[a-zA-Zàâçéèêëîïôûùüÿñæœ]{3,40}$')) {
          allWordOk = false
          this.error += 'Mot non conforme : ' + this.words[i] + ' -> entre 3 et 40 lettres, sans espace.  \r\n'
        }
      }
      if (allWordOk) {
        this.$emit('sendData', 'setWords', this.words)
      }
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
