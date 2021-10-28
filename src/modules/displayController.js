import pubSub from './pubSub'
import createSetupView from '../views/setupView.js'
import createMainView from '../views/mainView.js'

/*
 * Private
 */

// Renders setup of first player's board
function renderSetup ({ placeableShips, playerGridTracker }) {
  const setupView = createSetupView(placeableShips, playerGridTracker)
  render(setupView)
  pubSub.publish('setupRendered')
}

// Renders main battleship game, including player's board and tracker of enemy's grid
function renderMain ({ playerGridTracker, enemyGridTracker, activePlayer }) {
  const mainView = createMainView(playerGridTracker, enemyGridTracker)
  render(mainView)
  pubSub.publish('mainRendered', activePlayer)
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

/*
 * Public
 */

function init () {
  pubSub.subscribe('setupStart', renderSetup)
  pubSub.subscribe('shipPlaced', renderSetup)
  pubSub.subscribe('gameStart', renderMain)
  pubSub.subscribe('roundPlayed', renderMain)
  pubSub.subscribe('alert', renderMessage)
}

const displayController = {
  init
}

export default displayController
