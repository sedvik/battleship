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
    enemyGridTracker: gameState.players[0].enemyGridTracker
  }

  return gameData
}

function end (winningPlayerNumber) {

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

  // Populate both gameboards with ships
  // EVENTUALLY PUT A RANDOM SHIP PLACEMENT FUNCTION INTO GAMEBOARD FACTORY

  const p0Gameboard = gameState.gameboards[0]
  const p1Gameboard = gameState.gameboards[1]

  // Place player 0's ships
  placeShip(p0Gameboard, 'B6', 'vertical', 5)
  placeShip(p0Gameboard, 'J2', 'vertical', 4)
  placeShip(p0Gameboard, 'B3', 'horizontal', 3)
  placeShip(p0Gameboard, 'E8', 'vertical', 2)
  placeShip(p0Gameboard, 'G8', 'vertical', 2)
  placeShip(p0Gameboard, 'F4', 'vertical', 1)
  placeShip(p0Gameboard, 'J10', 'vertical', 1)

  // Place Player 1's ships
  placeShip(p1Gameboard, 'B5', 'vertical', 5)
  placeShip(p1Gameboard, 'G1', 'horizontal', 4)
  placeShip(p1Gameboard, 'J4', 'vertical', 3)
  placeShip(p1Gameboard, 'E5', 'horizontal', 2)
  placeShip(p1Gameboard, 'G10', 'horizontal', 2)
  placeShip(p1Gameboard, 'A2', 'vertical', 1)
  placeShip(p1Gameboard, 'D10', 'vertical', 1)
}

function placeShip (gameboard, coordinate, orientation, length) {
  gameboard.placeShip(coordinate, orientation, length)
  pubSub.publish('shipPlaced', extractGameData(gameState))
}

function start () {
  // publish event to render game boards so the game can start
  const gameData = extractGameData(gameState)
  pubSub.publish('data', gameData)
}

// Plays a single round of battleship
function playRound (coordinate) {
  const activePlayer = gameState.players[gameState.activePlayer]
  const enemyGameboard = gameState.gameboards[gameState.enemyPlayerGameboard]

  if (activePlayer.isComputer) {
    activePlayer.randomAttack(enemyGameboard, Math.random)
  } else {
    activePlayer.attack(enemyGameboard, coordinate)
  }

  // Check if there is a winner after attacking
  if (enemyGameboard.allShipsSunk()) {
    // publish game state
    // PUBLISH HERE
    return end(gameState.activePlayer)
  }

  // Switch active players and gameboards
  switchActivePlayer()
  switchGameboards()

  // Publish game state
  // PUBLISH HERE

  // If the computer is now the active player, schedule its next attack
  if (activePlayer.isComputer) {
    setTimeout(playRound, 1000)
  }
}

const game = {
  setup,
  placeShip,
  start,
  playRound
}

export default game
