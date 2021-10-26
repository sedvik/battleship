import Gameboard from './Gameboard.js'
import Player from './Player.js'
import pubSub from './pubSub.js'
import { convertGameboardToTracker } from './util.js'

/*
 * Private
 */

let gameState

function switchActivePlayer () {
  gameState.activePlayer === 0
    ? gameState.activePlayer = 1
    : gameState.activePlayer = 0
}

function switchGameboards () {
  // Swap active gameboard
  gameState.activePlayerGameboard === 0
    ? gameState.activePlayerGameboard = 1
    : gameState.activePlayerGameboard = 0

  // Swap enemy gameboard
  gameState.enemyPlayerGameboard === 1
    ? gameState.enemyPlayerGameboard = 0
    : gameState.enemyPlayerGameboard = 1
}

function extractGameData (gameState) {
  // Extract player 0's (human player) enemyGridTracker and their own grid tracker
  const gameData = {
    playerGridTracker: convertGameboardToTracker(gameState.gameboards[0]),
    placeableShips: gameState.gameboards[0].placeableShips,
    enemyGridTracker: gameState.players[0].enemyGridTracker
  }

  return gameData
}

function end () {
  pubSub.publish('gameEnd', extractGameData(gameState))
}

/*
 * Public
 */

function setup () {
  // Initialize players and gameboards.
  gameState = {
    players: [
      Player('human'),
      Player('computer')
    ],
    activePlayer: 0,
    gameboards: [
      Gameboard(),
      Gameboard()
    ],
    activePlayerGameboard: 0,
    enemyPlayerGameboard: 1
  }

  // Publish that setup has started
  pubSub.publish('setupStart', extractGameData(gameState))

  // Populate p1Gameboard gameboards with ships
  const p1Gameboard = gameState.gameboards[1]
  p1Gameboard.randomlyPlaceShips(Math.random)
}

function placeShip (coordinate, orientation, length) {
  const gameboard = gameState.gameboards[0]
  gameboard.placeShip(coordinate, orientation, length)
  pubSub.publish('shipPlaced', extractGameData(gameState))
}

function randomizeShips () {
  const gameboard = gameState.gameboards[0]
  gameboard.randomlyPlaceShips(Math.random)
  pubSub.publish('shipPlaced', extractGameData(gameState))
}

function start () {
  // Check if all ships have been placed for both gameboards
  const p0Gameboard = gameState.gameboards[0]
  const p1Gameboard = gameState.gameboards[1]

  if (p0Gameboard.allShipsPlaced() && p1Gameboard.allShipsPlaced()) {
    // publish event to render game boards so the game can start
    pubSub.publish('gameStart', extractGameData(gameState))
  }
}

// Plays a single round of battleship
function playRound (coordinate) {
  const activePlayer = gameState.players[gameState.activePlayer]
  const enemyGameboard = gameState.gameboards[gameState.enemyPlayerGameboard]

  // Attack the enemy gameboard
  if (activePlayer.isComputer) {
    activePlayer.randomAttack(enemyGameboard, Math.random)
  } else {
    activePlayer.attack(enemyGameboard, coordinate)
  }

  // Check if there is a winner after attacking
  if (enemyGameboard.allShipsSunk()) {
    return end()
  }

  // Switch active players and gameboards
  switchActivePlayer()
  switchGameboards()

  // Publish game state
  pubSub.publish('roundPlayed', extractGameData(gameState))

  // If a computer is now the active player, schedule its next play at least 1sec from now
  if (activePlayer.isComputer) {
    setTimeout(playRound, 1000)
  }
}

const game = {
  setup,
  placeShip,
  randomizeShips,
  start,
  playRound
}

export default game
