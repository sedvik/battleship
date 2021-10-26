import pubSub from './pubSub'

// Renders setup of first player's board
function renderSetup (data) {
  console.log('Setup', data)
}

// Renders main battleship game, including player's board and tracker of enemy's grid
function renderMain (data) {
  console.log('Main', data)
}

// Renders end screen after a player has won
function renderEnd (data) {
  console.log('End', data)
}

function renderMessage (message) {
  console.log(message)
}

function init () {
  pubSub.subscribe('setupStart', renderSetup)
  pubSub.subscribe('shipPlaced', renderSetup)
  pubSub.subscribe('gameStart', renderMain)
  pubSub.subscribe('roundPlayed', renderMain)
  pubSub.subscribe('gameEnd', renderEnd)
  pubSub.subscribe('alert', renderMessage)
}

const displayController = {
  init
}

export default displayController
