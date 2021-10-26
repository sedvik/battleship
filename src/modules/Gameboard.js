import Ship from './Ship.js'
import { letterMap, convertCoordinatesToIndices, getHitShipNum, getHitPosition } from './util.js'

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

    // Check placeableShips property to see if the given ship length is available to be placed
    if (this.placeableShips[length] <= 0) {
      throw new Error('No ships of this length are available')
    }

    // The new ship number is equal to the length of the gameboard ships property
    const shipNumber = this.ships.length

    // Place ship indices
    placeShipIndices(this.grid, indices, shipNumber)

    // Create the new ship and add it to ships array
    const newShip = Ship(length)
    this.ships.push(newShip)

    // Decrement applicable placeableShips property
    this.placeableShips[length] = this.placeableShips[length] - 1
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
  },

  allShipsPlaced: function () {
    return Object.keys(this.placeableShips).every(key => this.placeableShips[key] === 0)
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

  // placeableShips represents a mapping of ship length to number of ships remaining that can be placed with that length
  const placeableShips = {
    5: 1,
    4: 1,
    3: 1,
    2: 2,
    1: 2
  }

  return Object.assign(Object.create(gameboardPrototype), {
    grid,
    ships,
    placeableShips
  })
}

export default Gameboard
