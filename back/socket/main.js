const { v4: uuidv4 } = require('uuid');
const socketio = require('socket.io');
const gameObject = require('./game.js');

let allSockets = []
let allGames = []

module.exports = function (httpServer) {
  let io = socketio(httpServer)

  io.on(("connection"), function (socket) {
    console.log("Socket Connection Established with ID: " + socket.id)

    /**
     * in format : {name, creatorPseudo, numberOfWords, password}
    */
    socket.on('createGame', function (data) {
      data.numberOfWords = parseInt(data.numberOfWords)
      if (data.name && data.name.length > 4 &&
          data.creatorPseudo && data.creatorPseudo.length > 4 
          && data.numberOfWords > 2) {
        data.gameUuid = uuidv4()
        allGames[data.gameUuid] = gameObject(data, socket)
      }
    })

    socket.on('sendGameList', function () {
      let gameList = []
      for (let i in allGames) {
        gameList.push(allGames[i].getLightVersion())
      }
      socket.emit('gameList', gameList)
    })

    /**
     * in format : {gameUuid, pseudo}
    */
    socket.on('joinGame', function (data) {
      for (let i in allGames) {
        if (allGames[i].gameUuid == gameUuid) {
          allGames[i].addPlayer(data.pseudo, socket)
        }
      }
    })
  })

}