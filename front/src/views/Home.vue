<template>
  <div class="home">
    <h1>Bienvenue sur le Time's Up !</h1>
    <router-link v-if="$store.getters['isInGame']" to="/game" class="button">Retourner dans {{ $store.getters['gameName'] }} <faicon icon="arrow-right" /></router-link>
    <router-link to="/join" class="button">Rejoindre une partie <faicon icon="arrow-right" /></router-link>
    <router-link to="/create" class="button">Créer une partie <faicon icon="plus" /></router-link>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  }
}
</script>
