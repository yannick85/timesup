<template>
  <div class="gameContainer">
    <div v-if="!$store.getters['isInGame']">Aucune partie active</div>
    <div v-if="$store.getters['isInGame']">{{ $store.getters['gameName'] }}</div>
  </div>
</template>

<script>

export default {
  name: 'Game',
  created: function () {

  },
  props: {
  },
  components: {
  }
}
</script>
