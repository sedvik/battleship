import domUtil from './domUtil'
import { createPlayerGrid } from './grid.js'

/*
 * Private
 */

function createGridContainer (gridTracker, title, gridType) {
  // Parent
  const gridContainer = domUtil.create('div', '', {
    class: 'grid-container'
  })

  // Children
  const gridTitle = domUtil.create('h2', title)
  const grid = createPlayerGrid(gridTracker, gridType)
  const children = [gridTitle, grid]

  // Append children to parent
  domUtil.appendChildren(gridContainer, children)

  return gridContainer
}

function createInstructionsDiv () {
  const instructionsDiv = domUtil.create('div', '', {
    id: 'instructions'
  })

  const instructionsP = domUtil.create(
    'p',
    'Click a space on the enemy grid to attack'
  )

  instructionsDiv.appendChild(instructionsP)

  return instructionsDiv
}

function createMainContainer (playerGridTracker, enemyGridTracker) {
  // Parent
  const mainContainer = domUtil.create('div', '', {
    id: 'main-container'
  })

  // Children
  const playerGridContainer = createGridContainer(playerGridTracker, 'Your Grid', 'player')
  const enemyGridContainer = createGridContainer(enemyGridTracker, 'Enemy Grid', 'enemy')
  const children = [playerGridContainer, enemyGridContainer]

  // Append children to parent
  domUtil.appendChildren(mainContainer, children)

  return mainContainer
}

function createMainBtnContainer () {
  const mainBtnContainer = domUtil.create('div', '', {
    id: 'main-btn-container'
  })

  const resetBtn = domUtil.create('button', 'Reset Game', {
    id: 'reset-game'
  })

  mainBtnContainer.appendChild(resetBtn)

  return mainBtnContainer
}

/*
 * Public
 */

function createMainView (playerGridTracker, enemyGridTracker) {
  // Parent
  const contentContainer = domUtil.create('div', '', {
    id: 'content'
  })

  // Children
  const instructionsDiv = createInstructionsDiv()
  const mainContainer = createMainContainer(playerGridTracker, enemyGridTracker)
  const mainBtnContainer = createMainBtnContainer()
  const children = [
    instructionsDiv,
    mainContainer,
    mainBtnContainer
  ]

  // Append children to parent
  domUtil.appendChildren(contentContainer, children)

  return contentContainer
}

export default createMainView
