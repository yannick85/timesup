<template>
  <div class="hello">
    <form @submit.prevent="createGame">
      <h2>Création de partie</h2>
      <div class="formElement">
        <label>Nom</label>
        <input type="text" v-model="game.name" />
      </div>
      <div class="formElement">
        <label>Mot de passe</label>
        <input type="password" v-model="game.password" />
      </div>
      <div class="formElement">
        <label>Nombre de mots</label>
        <input type="number" v-model="game.numberOfWords" />
      </div>
      <div class="formElement">
        <label>Votre pseudo</label>
        <input type="text" v-model="game.creatorPseudo" />
      </div>
      <div class="button" @click="createGame">Créer</div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateGame',
  data: function () {
    return { 
      game: {
        name: null,
        password: null,
        numberOfWords: 20,
        creatorPseudo: null
      }
    }
  },
  props: {
  },
  methods: {
    createGame () {
      if (this.game.name && this.game.name.length > 2 &&
          this.game.creatorPseudo && this.game.creatorPseudo.length > 2
          && this.game.numberOfWords > 2) {
        this.$socket.emit('createGame', this.game)
      } else {
        alert('Formulaire incomplet')
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
