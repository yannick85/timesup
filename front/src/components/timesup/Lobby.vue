<template>
  <div class="lobby">
    <div class="grid-x grid-margin-x">
      <div v-for="team in game.teams" 
        :index="team.id"
        :key="team.id"
        :class="`${ 'cell small-6 team team-'+team.id }`">
        <h4>Equipe {{ team.name }}</h4>
        <div v-for="(teamChosenId, index) in game.stateData.playerTeamChosen" 
          :key="index">
          <div v-if="teamChosenId == team.id">{{ game.players[index].pseudo }} <span v-if="game.stateData.playersReady[index]"> (prêt)</span></div>
        </div>
        <div @click="chooseTeam(team.id)">Choisir {{ team.name }}</div>
      </div>
    </div>
    <div class="button" @click="setReady(true)" v-if="!game.stateData.playersReady[$store.getters['playerId']]"
      >Je suis prêt</div>
    <div class="button" @click="setReady(false)" v-if="game.stateData.playersReady[$store.getters['playerId']]"
      >Je ne suis pas prêt</div>
  </div>
</template>

<script>

export default {
  name: 'Lobby',
  props: {
    game: Object
  },
  mounted: function () {
  },
  methods: {
    chooseTeam: function (teamId) {
      this.$emit('sendData', 'chooseTeam', teamId)
    },
    setReady: function (readyStatus) {
      this.$emit('sendData', 'playerReady', readyStatus)
    }
  },
  components: {
  }
}
</script>
