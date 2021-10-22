import { letterMap, indexMap, convertCoordinatesToIndices, convertIndicesToCoordinates } from './util.js'

function isValidAttack (col, row, enemyGridTracker) {
  // Return false for undefined row/col
  if (col === undefined || row === undefined) {
    return false
  }

  // return false for spaces that have already been hit
  const spaceVal = enemyGridTracker[col][row]

  if (spaceVal !== '') {
    return false
  }

  return true
}

const playerPrototype = {
  attack: function (enemyGameboard, coordinate) {
    const result = enemyGameboard.receiveAttack(coordinate)

    // Convert coordinate to row and col indices
    const { row, col } = convertCoordinatesToIndices(coordinate, letterMap)

    // Mark enemyGridTracker based on result
    if (result === 'hit') {
      this.enemyGridTracker[col][row] = 'X'
    } else if (result === 'miss') {
      this.enemyGridTracker[col][row] = '/'
    }
  }
}

function Player (playerType) {
  let isComputer

  if (playerType === 'human') {
    isComputer = false
  } else if (playerType === 'computer') {
    isComputer = true
  } else {
    throw new Error('playerType must be "human" or "computer"')
  }

  const enemyGridTracker = [
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

  const props = {
    isComputer,
    enemyGridTracker
  }

  // Computers gain a randomAttack function
  if (isComputer) {
    props.randomAttack = function (enemyGameboard, mathRandomFn) {
      let colIndex
      let rowIndex

      // Loop until valid attack is generated
      while (!isValidAttack(colIndex, rowIndex, this.enemyGridTracker)) {
        colIndex = Math.floor(mathRandomFn() * 10)
        rowIndex = Math.floor(mathRandomFn() * 10)
      }

      // Convert indices to grid coordinates (e.g. A1, F5, etc.)
      const coordinate = convertIndicesToCoordinates(colIndex, rowIndex, indexMap)

      // Attack enemy gameboard
      this.attack(enemyGameboard, coordinate)
    }
  }

  return Object.assign(Object.create(playerPrototype), props)
}

export default Player
