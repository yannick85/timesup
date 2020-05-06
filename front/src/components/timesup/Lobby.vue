<template>
  <div class="lobby">
    <div class="gameTeams grid-x grid-margin-x">
      <div v-for="team in game.teams" 
        :index="team.id"
        :key="team.id"
        :class="`${ 'cell small-6 team team-'+team.id }`">
        <h4 class="teamName" @click="chooseTeam(team.id)"><div class="joinTeam"><faicon icon="sign-in-alt" /></div>Equipe {{ team.name }}</h4>
        <div v-for="(teamChosenId, index) in game.stateData.playerTeamChosen" 
          :key="index">
          <div v-if="teamChosenId == team.id" class="teamPlayer teamPlayerDrafted">{{ game.players[index].pseudo }} <span v-if="game.stateData.playersReady[index]" class="readyIndicator"> <faicon icon="check" /></span></div>
        </div>
      </div>
    </div>
    <div v-if="game.stateData.playerTeamChosen.length < game.players.length" class="waitingList">
      <div class="waitingListTitle">En attente  :</div>
      <div class="waitingListPlayers" v-if="game.players">
        <div v-for="player in game.players" 
          :index="player.id"
          :key="player.pseudo"
          class="player"
          ><span v-if="game.stateData.playerTeamChosen[player.id] == undefined || game.stateData.playerTeamChosen[player.id] == null">{{ player.pseudo }}</span></div>
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
