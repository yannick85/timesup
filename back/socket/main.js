const { v4: uuidv4 } = require('uuid');
const socketio = require('socket.io');
const gameObject = require('./game.js');

let allSockets = []
let allGames = []

module.exports = function (httpServer) {
  let io = socketio(httpServer)

  io.on(("connection"), function (socket) {
    console.log("Socket Connection Established with ID: " + socket.id)

    socket.on('createGame', function (data) {
      data.numberOfWords = parseInt(data.numberOfWords)
      if (data.name && data.name.length > 4 &&
          data.creatorPseudo && data.creatorPseudo.length > 4 
          && data.numberOfWords > 2) {
        data.gameUuid = uuidv4()
        allGames[data.uuid] = gameObject(data, socket)
      }
    })
  })

}