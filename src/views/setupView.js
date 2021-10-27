import domUtil from './domUtil.js'
import { createPlayerGrid } from './grid.js'

/*
 * Private
 */

function createShipImg (shipLength) {
  // Parent
  const shipImgDiv = domUtil.create('div', '', {
    class: 'ship-img'
  })

  // Children
  const children = []
  for (let i = 0; i < shipLength; i++) {
    const shipSpace = domUtil.create('div', '', {
      class: ['small', 'ship', 'space']
    })
    children.push(shipSpace)
  }

  // Append children to parent
  domUtil.appendChildren(shipImgDiv, children)

  return shipImgDiv
}

function createShipForm (idNum) {
  // Parent
  const shipForm = domUtil.create('form', '')

  // Children
  const verticalRadio = domUtil.create('input', '', {
    id: `${idNum}-vertical`,
    attributes: {
      name: `${idNum}-orientation`,
      type: 'radio',
      required: 'required',
      checked: 'checked'
    }
  })
  const verticalLabel = domUtil.create('label', 'Vertical', {
    attributes: {
      for: `${idNum}-vertical`
    }
  })
  const horizontalRadio = domUtil.create('input', '', {
    id: `${idNum}-horizontal`,
    attributes: {
      name: `${idNum}-orientation`,
      type: 'radio',
      required: 'required'
    }
  })
  const horizontalLabel = domUtil.create('label', 'Horizontal', {
    attributes: {
      for: `${idNum}-horizontal`
    }
  })
  const lineBreak1 = domUtil.create('br', '')
  const coordinateLabel = domUtil.create('label', 'Coordinate', {
    attributes: {
      for: `${idNum}-coordinate`
    }
  })
  const coordinateInput = domUtil.create('input', '', {
    id: `${idNum}-coordinate`,
    attributes: {
      type: 'text',
      name: `${idNum}-coordinate`,
      required: 'required'
    }
  })
  const lineBreak2 = domUtil.create('br', '')
  const placeShipBtn = domUtil.create('button', 'Place Ship', {
    class: 'place-ship',
    attributes: {
      type: 'button'
    }
  })

  const children = [
    verticalRadio,
    verticalLabel,
    horizontalRadio,
    horizontalLabel,
    lineBreak1,
    coordinateLabel,
    coordinateInput,
    lineBreak2,
    placeShipBtn
  ]

  // Append children to parent
  domUtil.appendChildren(shipForm, children)

  return shipForm
}

function createShipCard (idNum, shipLength) {
  // Parent
  const shipCard = domUtil.create('div', '', {
    id: `ship${idNum}`,
    class: 'ship-card',
    attributes: {
      'data-length': shipLength
    }
  })

  // Children
  const shipImg = createShipImg(shipLength)
  const shipForm = createShipForm(idNum)
  const children = [shipImg, shipForm]

  // Append children to parent
  domUtil.appendChildren(shipCard, children)

  return shipCard
}

function createShipCards (placeableShips) {
  // Convert placeableShips to an array of objects, each representing a ship card that must be created
  const shipCardConfigs = []

  let idNum = 0

  for (const length in placeableShips) {
    const numShips = placeableShips[length]
    for (let i = 0; i < numShips; i++) {
      shipCardConfigs.push({
        idNum: idNum,
        shipLength: length
      })
      idNum++
    }
  }

  const shipCards = shipCardConfigs.map(config => {
    return createShipCard(config.idNum, config.shipLength)
  })

  return shipCards
}

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
  // Parent
  const setupBtnsDiv = domUtil.create('div', '', {
    id: 'setup-btns'
  })

  // Children
  const resetBoardBtn = domUtil.create('button', 'Reset Board', {
    id: 'reset-board'
  })
  const randomizeBtn = domUtil.create('button', 'Randomize Ship Placement', {
    id: 'randomize'
  })
  const children = [resetBoardBtn, randomizeBtn]

  // Append children to parent
  domUtil.appendChildren(setupBtnsDiv, children)

  return setupBtnsDiv
}

function createShipPlacementDiv (placeableShips) {
  // Parent
  const shipPlacementDiv = domUtil.create('div', '', {
    id: 'ship-placement'
  })

  // Children
  const shipCards = createShipCards(placeableShips)

  // Append children to parent
  domUtil.appendChildren(shipPlacementDiv, shipCards)

  return shipPlacementDiv
}

function createStartBtnDiv (placeableShips) {
  const startBtnContainer = domUtil.create('div', '', {
    id: 'start-btn-container'
  })

  // If there are no more placeable ships, add the start button
  if (Object.keys(placeableShips).every(key => placeableShips[key] === 0)) {
    const startBtn = domUtil.create('button', 'Start', {
      id: 'start-btn'
    })
    startBtnContainer.appendChild(startBtn)
  }

  return startBtnContainer
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
  const shipPlacementDiv = createShipPlacementDiv(placeableShips)
  const startBtnDiv = createStartBtnDiv(placeableShips)

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
