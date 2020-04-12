const { v4: uuidv4 } = require('uuid');

const GAME_STATES = {
  LOBBY: 'LOBBY',
  PREP: 'PREP',
  GAME1: 'GAME1',
  GAME2: 'GAME2',
  GAME3: 'GAME3',
  END: 'END'
}

module.exports = function (gameDataIn, creatorSocket) {
  let gameObj = {
    name: gameDataIn.name,
    gameUuid: gameDataIn.gameUuid,
    creator: gameDataIn.creatorPseudo,
    password: gameDataIn.password,
    numberOfWords: gameDataIn.numberOfWords,
    sockets: [],
    players: [],
    playerIdIncr: 0,
    state: GAME_STATES.LOBBY,

    // Inscrit le joueur à la partie et lui envoie l'invitation
    addPlayer: function (playerPseudo, playerSocket) {
      if (this.state == GAME_STATES.LOBBY) {//can only join if lobby
        this.sockets.push(playerSocket)
        let uuidPlayer = uuidv4()
        this.players[this.playerIdIncr] = {
          id: this.playerIdIncr,
          pseudo: playerPseudo,
          uuid: uuidPlayer,
          socket: playerSocket
        }
        
        playerSocket.emit('welcomeInGame', {
          gameUuid: this.gameUuid,
          name: this.name,
          creator: this.creator,
          playerUuid: uuidPlayer,
          playerId: this.playerIdIncr,
          playerPseudo: playerPseudo
        })
        
        this.syncAll()
        this.playerIdIncr++
      }
    },
    getPlayerWithUuid : function (pUuid) {
      for (let i in this.players) {
        if (this.players[i].uuid == pUuid) {
          return this.players[i]
        }
      }
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
      let player = this.getPlayerWithUuid(pUuid)
      if (player) {
        player.socket.emit('syncGame', this.getActualGame(player))
      }
    },
    // Resynchronise tous les joueurs
    syncAll: function () {
      for (let i in this.players) {
        this.players[i].socket.emit('syncGame', this.getActualGame(this.players[i]))
      }
    },
    // Génère le jeu complet pour utilisation front
    getActualGame: function (player) {
      return {
        gameUuid: this.gameUuid,
        name: this.name,
        players: this.getLightPlayerList(),
        teams: this.teams,
        state: this.state,
        stateData: this.getStateData(player),
      }
    },
    // Version soft de la liste des joueurs pour utilisation par tous
    getLightPlayerList: function () {
      let plList = []
      for (let i in this.players) {
        plList[i] = {
          id: this.players[i].id,
          pseudo: this.players[i].pseudo
        }
      }
      return plList
    },

    //donnes timesup
    teams: [],//{ id: 'code', name: 'label', score: 0, players : [] }
    teamsNumber: 0,
    getTeamById : function (teamId) {
      for (let i in this.teams) {
        if (this.teams[i].id == teamId) {
          return this.teams[i]
        }
      }
    },

    //specific state LOBBY
    playerTeamChosen: null,//[playerId : idTeam]
    playersReady: null,//[playerId : Boolean]

    //specific state PREP
    numberOfWordsNeededByPlayer: null,//[playerId : numberOfWordsNeeded]
    wordsByPlayer: null,//[playerId : [words]]

    //specific state Game
    allWords: [],
    stateWords: null,//words tu use in state
    stateWordAsked: null,//word currently asked
    turnTeamIncr: null,//Indicate which team turn it is
    turnTeamPlayerIncr: null,//Indicate which teamplayer turn it is => [teamId => [playerIncr], ...]

    //prepare les données pour un nouveau state
    initGameState : function () {
      switch (this.state) {
        case GAME_STATES.LOBBY :
          this.teams.push({ id: 'red', name: 'Rouge', score: 0, players : [] })
          this.teams.push({ id: 'blue', name: 'Bleu', score: 0, players : [] })
          this.playerTeamChosen = []
          this.playersReady = []
          break
        case GAME_STATES.PREP :
          //set player in teams
          for (let i in this.teams) {
            for (let idPlayer in this.playerTeamChosen) {
              if (this.teams[i].id == this.playerTeamChosen[idPlayer]) {
                this.teams[i].players.push({
                  id: this.players[idPlayer].id,
                  pseudo: this.players[idPlayer].pseudo
                })
              }
            }
          }

          this.playersReady = []
          //calculate number of words needed by players
          this.numberOfWordsNeededByPlayer = []
          let wordsByTeam = Math.ceil(this.numberOfWords / this.teams.length)
          for (let i in this.teams) {
            let curTeam = this.teams[i]
            let wordGiven = 0
            let numToGiveByPlayer = Math.floor(wordsByTeam / curTeam.players.length)
            for (let iPlayer in curTeam.players) {
              this.numberOfWordsNeededByPlayer[curTeam.players[iPlayer].id] = numToGiveByPlayer
              wordGiven += numToGiveByPlayer
            }
            //second tour si nombre incomplet
            for (let iPlayer in curTeam.players) {
              if (wordGiven < wordsByTeam) {
                this.numberOfWordsNeededByPlayer[curTeam.players[iPlayer].id]++
                wordGiven++
              }
            }
          }
          
          this.wordsByPlayer = []

          break;
        case GAME_STATES.GAME1 :
        case GAME_STATES.GAME2 :
        case GAME_STATES.GAME3 :

          if (this.state == GAME_STATES.GAME1) {
            for (let i in this.wordsByPlayer) {
              this.allWords = [...this.allWords, ...this.wordsByPlayer[i]]
            }
          }

          this.stateWords = [...this.allWords] //state copy
          this.turnTeamIncr = 0
          this.turnTeamPlayerIncr = []
          for(let i in this.teams) {
            this.turnTeamPlayerIncr[i] = 0
          }
          let randomWordId = Math.floor(Math.random() * this.stateWords.length)
          this.stateWordAsked = this.stateWords[randomWordId]
          this.stateWords.splice(randomWordId, 1)
          
          break;
      }
    },
    //formate les données pour les utilisateurs selon le state
    getStateData : function (player) {
      let stateData = {}
      switch (this.state) {
        case GAME_STATES.LOBBY :
          stateData.playerTeamChosen = this.playerTeamChosen
          stateData.playersReady = this.playersReady
          break
        case GAME_STATES.PREP :
          stateData.numberOfWordsNeededByPlayer = this.numberOfWordsNeededByPlayer
          stateData.playersReady = this.playersReady
          break;
        case GAME_STATES.GAME1 :
        case GAME_STATES.GAME2 :
        case GAME_STATES.GAME3 :
          stateData.turnTotal = this.allWords.length
          stateData.turnActual = (this.allWords.length - this.stateWords.length)
          stateData.turnTeamIncr = this.turnTeamIncr
          stateData.turnPlayerId = this.teams[this.turnTeamIncr].players[this.turnTeamPlayerIncr[this.turnTeamIncr]].id
          if (stateData.turnPlayerId == player.id) {//= current player
            stateData.wordAsked = this.stateWordAsked
          }
          break;
      }
      return stateData
    },
    //récuperation data joueur (data.playerUuid et data.playerData)
    //playerData : {action: '', actionData: ..., ...}
    sendDataToGame: function (data) {
      let player = this.getPlayerWithUuid(data.playerUuid)
      if (player && data.playerData && data.playerData.action) {
        switch (this.state) {
          case GAME_STATES.LOBBY :
            if (data.playerData.action == 'chooseTeam') {
              if (this.getTeamById(data.playerData.actionData) != null) {
                this.playerTeamChosen[player.id] = data.playerData.actionData
                this.playersReady[player.id] = false
                this.syncAll()
              }
            } else if (data.playerData.action == 'playerReady') {
              if (this.playerTeamChosen[player.id] != undefined) {//team was chosen
                this.playersReady[player.id] = data.playerData.actionData ? true : false
                this.syncAll()
              }
              //check if ready to next state
              let allTeamAtLeastOnePlayer = true
              for (let i in this.teams) {
                if (this.playerTeamChosen.indexOf(this.teams[i].id) < 0) {
                  allTeamAtLeastOnePlayer = false
                }
              }
              if (allTeamAtLeastOnePlayer && this.playersReady.length === this.players.length) {
                let allReady = true
                for (let i in this.players) {
                  if (this.playersReady[this.players[i].id] !== true) {
                    allReady = false
                  }
                }
                if (allReady) {//Goto prep state
                  this.state = GAME_STATES.PREP
                  this.initGameState()
                  this.syncAll()
                }
              }
            }
            break;
          case GAME_STATES.PREP :
            if (data.playerData.action == 'setWords') {//todo check if array of not empty strings
              this.wordsByPlayer[player.id] = data.playerData.actionData
              //compte aussi comme ready
              if (this.wordsByPlayer[player.id].length == this.numberOfWordsNeededByPlayer[player.id]) {
                this.playersReady[player.id] = true
              } else {
                this.playersReady[player.id] = false
              }
              if (this.playersReady.length === this.players.length) {//check if all ready
                let allReady = true
                for (let i in this.players) {
                  if (this.playersReady[this.players[i].id] !== true) {
                    allReady = false
                  }
                }
                if (allReady) {//Goto game1 state
                  this.state = GAME_STATES.GAME1
                  this.initGameState()
                }
              }
              
              this.syncAll()
            } else if (data.playerData.action == 'cancelReady') {
              this.playersReady[player.id] = false
              this.syncAll()
            }
            break;
          case GAME_STATES.GAME1 :
          case GAME_STATES.GAME2 :
          case GAME_STATES.GAME3 :
            if (data.playerData.action == 'gameResponse') {
              let turnPlayerId = this.teams[this.turnTeamIncr].players[this.turnTeamPlayerIncr[this.turnTeamIncr]].id
              if (player.id === turnPlayerId) {//player is the good one, his turn to play
                if (data.playerData.actionData === true) {
                  this.teams[this.turnTeamIncr].score++
                }

                //Next player
                if (this.stateWords.length > 0) {//others words to go
                  this.turnTeamIncr++
                  if (this.turnTeamIncr >= this.teams.length) {
                    this.turnTeamIncr = 0
                  }
                  this.turnTeamPlayerIncr[this.turnTeamIncr]++
                  if (this.turnTeamPlayerIncr[this.turnTeamIncr] >= this.teams[this.turnTeamIncr].players.length) {
                    this.turnTeamPlayerIncr[this.turnTeamIncr] = 0
                  }
                  let randomWordId = Math.floor(Math.random() * this.stateWords.length)
                  this.stateWordAsked = this.stateWords[randomWordId]
                  this.stateWords.splice(randomWordId, 1)
                } else {//state ended
                  switch (this.state) {
                    case GAME_STATES.GAME1 :
                      this.state = GAME_STATES.GAME2
                      this.initGameState()
                      break;
                    case GAME_STATES.GAME2 :
                      this.state = GAME_STATES.GAME3
                      this.initGameState()
                      break;
                    case GAME_STATES.GAME3 :
                      this.state = GAME_STATES.END
                      this.initGameState()
                      break;
                  }
                }

                this.syncAll()
              }
            }
            break;
        }
        data.playerData
      }
    }
  }
  gameObj.initGameState();
  gameObj.addPlayer(gameDataIn.creatorPseudo, creatorSocket)
  
  return gameObj
}