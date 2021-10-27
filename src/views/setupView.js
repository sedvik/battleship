import domUtil from './domUtil.js'
import { createPlayerGrid } from './grid.js'

/*
 * Private
 */

function createInstructionsDiv () {
  const instructionsDiv = domUtil.create('div', '', {
    id: 'instructions'
  })

  const instructionsP = domUtil.create(
    'p',
    'Place all ships and then press Start'
  )

  instructionsDiv.appendChild(instructionsP)

  return instructionsDiv
}

function createSetupBtns () {

}

function createShipPlacementDiv () {

}

function createStartBtnDiv () {

}

/*
 * Public
 */

function createSetupView (placeableShips, playerGridTracker) {
  // Parent
  const contentDiv = domUtil.create('div', '', {
    id: 'content'
  })

  // Children
  const instructionsDiv = createInstructionsDiv()
  const playerGrid = createPlayerGrid(playerGridTracker)
  const setupBtns = createSetupBtns()
  const shipPlacementDiv = createShipPlacementDiv()
  const startBtnDiv = createStartBtnDiv()

  const children = [
    instructionsDiv,
    playerGrid,
    setupBtns,
    shipPlacementDiv,
    startBtnDiv
  ]

  // Append children to parent
  domUtil.appendChildren(contentDiv, children)

  return contentDiv
}

export default createSetupView
