import Ship from './Ship.js'

const letterMap = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9
}

function convertCoordinatesToIndices (coordinates, letterMap) {
  // Convert column coordinate from letter to number
  const letterCol = coordinates.charAt(0)
  const col = letterMap[letterCol]

  // Downshift row number by 1 so that is 0-indexed instead of starting with 1
  // const row = parseInt(coordinates.charAt(1)) - 1
  const row = parseInt(coordinates.slice(1)) - 1

  return { col, row }
}

function getShipIndices (frontIndices, orientation, length) {
  const indices = []
  const frontCol = frontIndices.col
  const frontRow = frontIndices.row

  if (orientation === 'horizontal') {
    for (let i = frontCol; i < frontCol + length; i++) {
      indices.push({ col: i, row: frontRow })
    }
  } else if (orientation === 'vertical') {
    for (let i = frontRow; i < frontRow + length; i++) {
      indices.push({ col: frontCol, row: i })
    }
  }

  return indices
}

/*
 * Position specified is invalid if any of the following conditions are met:
 * 1. Any of the positions specified are not empty on the grid
 * 2. Any provided index is less than 0
 * 3. Any provided index is greater than the grid length minus 1
 * 4. Any of the indices aren't of type number
 */
function invalidPosition (grid, indices) {
  return indices.some(point => {
    return (
      typeof point.col !== 'number' ||
      typeof point.row !== 'number' ||
      point.col < 0 ||
      point.col > grid.length - 1 ||
      point.row < 0 ||
      point.row > grid.length - 1 ||
      grid[point.col][point.row] !== ''
    )
  })
}

/*
 * Attack is invalid if any of the following conditions are met:
 * 1. The space chosen has already been attacked and missed
 * 2. The space chosen has already been attacked and a ship hit at that position
 */
function invalidAttack (gridSpaceVal, ships) {
  // If the space value is 'miss' it has already been attacked. If it is empty, the attack is valid
  if (gridSpaceVal === 'miss') {
    return true
  } else if (gridSpaceVal === '') {
    return false
  }

  // If the space wasn't empty or already shot and missed, it must have a ship
  const hitShipNum = getHitShipNum(gridSpaceVal)
  const hitShipPosition = getHitPosition(gridSpaceVal)
  const ship = ships[hitShipNum]

  // Check the ship's hit map at the specified position and return true if it is already hit
  return ship.hitMap[hitShipPosition] === 'hit'
}

function placeShipIndices (grid, indices, shipNumber) {
  const shipIdentifier = `S${shipNumber}`
  indices.forEach((point, index) => {
    const positionIdentifier = `P${index}`
    const identifier = `${shipIdentifier}-${positionIdentifier}`
    grid[point.col][point.row] = identifier
  })
}

// Parses a gridSpaceVal (e.g. S0-P0, S2-P3) to extract which ship was hit
function getHitShipNum (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[0].slice(1))
}

// Parses a gridSpaceVal to extract which ship position was hit
function getHitPosition (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[1].slice(1))
}

const gameboardPrototype = {
  placeShip: function (frontCoordinates, orientation, length) {
    // Convert front coordinates to indices
    const frontIndices = convertCoordinatesToIndices(frontCoordinates, letterMap)

    // Get all ship coordinates based on front indices, orientation, and length
    const indices = getShipIndices(frontIndices, orientation, length)

    // Throw an error if any invalid coordinates have been specified
    if (invalidPosition(this.grid, indices)) {
      throw new Error('Invalid ship position')
    }

    // The new ship number is equal to the length of the gameboard ships property
    const shipNumber = this.ships.length

    // Place ship indices
    placeShipIndices(this.grid, indices, shipNumber)

    // Create the new ship and add it to ships array
    const newShip = Ship(length)
    this.ships.push(newShip)
  },

  receiveAttack: function (coordinate) {
    const point = convertCoordinatesToIndices(coordinate, letterMap)
    const gridSpaceVal = this.grid[point.col][point.row]

    if (invalidAttack(gridSpaceVal, this.ships)) {
      throw new Error('Cannot attack the same space twice')
    }

    if (gridSpaceVal === '') {
      // Mark a miss on the grid
      this.grid[point.col][point.row] = 'miss'

      // Report that a ship was missed
      return 'miss'
    } else {
      // Determine which ship was hit
      const hitShipNum = getHitShipNum(gridSpaceVal)

      // Determine which ship position was hit
      const hitPosition = getHitPosition(gridSpaceVal)

      // Call hit() method on hit ship
      const ship = this.ships[hitShipNum]
      ship.hit(hitPosition)

      // Report that a ship was hit
      return 'hit'
    }
  },

  allShipsSunk: function () {
    return this.ships.every(ship => {
      return ship.isSunk()
    })
  }
}

function Gameboard () {
  const grid = [
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '']
  ]

  const ships = []

  return Object.assign(Object.create(gameboardPrototype), {
    grid,
    ships
  })
}

export default Gameboard
