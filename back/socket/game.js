const { v4: uuidv4 } = require('uuid');

const states = {
  lobby: 'LOBBY',
  prep: 'PREP',
  game1: 'GAME1',
  game2: 'GAME2',
  game3: 'GAME3',
}

module.exports = function (gameDataIn, creatorSocket) {
  let gameObj = {
    name: gameDataIn.name,
    gameUuid: gameDataIn.gameUuid,
    creator: gameDataIn.creatorPseudo,
    password: gameDataIn.password,
    sockets: [],
    players: [],
    state: states.lobby,

    // Inscrit le joueur à la partie et lui envoie l'invitation
    addPlayer: function (playerPseudo, playerSocket) {
      this.sockets.push(playerSocket)
      let uuidPlayer = uuidv4()
      this.players[uuidPlayer] = {
        pseudo: playerPseudo,
        uuid: uuidPlayer,
        socket: playerSocket
      }
      playerSocket.emit('welcomeInGame', {
        gameUuid: this.gameUuid,
        name: this.name,
        creator: this.creator,
        playerUuid: uuidPlayer,
        playerPseudo: playerPseudo
      })
      this.syncAll()
    },
    // Version légère pour liste des parties
    getLightGame: function () {
      return {
        gameUuid: this.gameUuid,
        name: this.name,
        creator: this.creator,
        needPassword: (this.password && this.password.length > 0)
      }
    },
    // Resynchroniser le joueur avec l'état du jeu
    syncGameForPlayer: function (pUuid) {
      for (let i in this.players) {
        if (this.players[i].uuid == pUuid) {
          this.players[i].socket.emit('syncGame', this.getActualGame())
        }
      }
    },
    // Resynchronise tous les joueurs
    syncAll: function () {
      let actGame = this.getActualGame()
      for (let i in this.players) {
        this.players[i].socket.emit('syncGame', actGame)
      }
    },
    // Génère le jeu complet pour utilisation front
    getActualGame: function () {
      return {
        gameUuid: this.gameUuid,
        name: this.name,
        playerList: this.getLightPlayerList(),
        state: this.state
      }
    },
    // Version soft de la liste des joueurs pour utilisation par tous
    getLightPlayerList: function () {
      let plList = []
      for (let i in this.players) {
        plList.push({
          pseudo: this.players[i].pseudo
        })
      }
      return plList
    },

  }
  gameObj.addPlayer(gameDataIn.creatorPseudo, creatorSocket)
  
  return gameObj
}