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
    addPlayer: function (playerPseudo, playerSocket) {
      this.sockets.push(playerSocket)
      let uuidPlayer = uuidv4()
      playerSocket.emit('welcomeInGame', {
        gameUuid: this.gameUuid,
        name: this.name,
        creator: this.creator,
        playerUuid: uuidPlayer,
        playerPseudo: playerPseudo
      })
    },
    getLightVersion: function () {
      return {
        gameUuid: this.gameUuid,
        name: this.name,
        creator: this.creator,
        needPassword: (this.password && this.password.length > 0)
      }
    }
  }
  gameObj.addPlayer(gameDataIn.creatorPseudo, creatorSocket)
  
  return gameObj
}