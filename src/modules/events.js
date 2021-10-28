import game from './game.js'
import pubSub from './pubSub.js'

/*
 * Private
 */

function resetBoard () {
  game.setup()
}

function randomlyPlaceShips () {
  game.randomizeShips()
}

function placeShip (e) {
  // Get button's form parent and ship card grandparent
  const form = e.target.parentElement
  const shipCard = form.parentElement

  // Extract ship coordinate, orientation, and length
  const coordinate = form.querySelector('input[type="text"]').value
  const orientation = form.querySelector('input[type="radio"]:checked').value
  const length = parseInt(shipCard.getAttribute('data-length'))

  game.placeShip(coordinate.toUpperCase(), orientation, length)
}

function start () {
  game.start()
}

function playGameRound (e) {
  const coordinate = e.target.getAttribute('data-coordinate')
  game.playRound(coordinate)
}

function reset () {
  game.setup()
}

function assignSetupEvents () {
  const resetBtn = document.querySelector('#reset-board')
  resetBtn.addEventListener('click', resetBoard)

  const randomizeBtn = document.querySelector('#randomize')
  randomizeBtn.addEventListener('click', randomlyPlaceShips)

  const placeShipBtns = document.querySelectorAll('.place-ship')
  placeShipBtns.forEach(btn => btn.addEventListener('click', placeShip))

  const startBtn = document.querySelector('#start-btn')
  if (startBtn !== null) {
    startBtn.addEventListener('click', start)
  }
}

function assignMainEvents (activePlayer) {
  // If the active player is the human player and not a computer, assign click events to empty enemy grid spaces
  if (activePlayer === 0) {
    const gridSpaces = document.querySelectorAll('.enemy .empty')
    gridSpaces.forEach(space => space.addEventListener('click', playGameRound))
  }

  const resetBtn = document.querySelector('#reset-game')
  resetBtn.addEventListener('click', reset)
}

function assignEndEvents () {
  // Make it so that click events on grid spaces cannot be clicked after the game ends
  const gridSpaces = document.querySelectorAll('.enemy .empty')
  gridSpaces.forEach(space => {
    space.style.pointerEvents = 'none'
  })
}

/*
 * Public
 */

// Create pubsub subscriptions
function init () {
  pubSub.subscribe('setupRendered', assignSetupEvents)
  pubSub.subscribe('mainRendered', assignMainEvents)
  pubSub.subscribe('gameEnd', assignEndEvents)
}

const events = {
  init
}

export default events
