import pubSub from './pubSub'
import createSetupView from '../views/setupView.js'

// Renders setup of first player's board
function renderSetup ({ placeableShips, playerGridTracker }) {
  console.log({ placeableShips, playerGridTracker })
  const setupView = createSetupView(placeableShips, playerGridTracker)
  render(setupView)
  pubSub.publish('setupRendered')
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
  const instructionsP = document.querySelector('#instructions p')
  instructionsP.textContent = message
}

function render (view) {
  const main = document.querySelector('main')
  main.textContent = ''
  main.appendChild(view)
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
