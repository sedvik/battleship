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

function assignMainEvents () {

}

function assignEndEvents () {

}

/*
 * Public
 */

// Create pubsub subscriptions
function init () {
  pubSub.subscribe('setupRendered', assignSetupEvents)
}

const events = {
  init
}

export default events
