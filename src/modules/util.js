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

const indexMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J'
}

function convertCoordinatesToIndices (coordinates, letterMap) {
  // Convert column coordinate from letter to number
  const letterCol = coordinates.charAt(0)
  const col = letterMap[letterCol]

  // Downshift row number by 1 so that is zero-indexed instead of starting with 1
  // const row = parseInt(coordinates.charAt(1)) - 1
  const row = parseInt(coordinates.slice(1)) - 1

  return { col, row }
}

function convertIndicesToCoordinates (colIndex, rowIndex, indexMap) {
  // Convert column coordinate from index to letter
  const colLetter = indexMap[colIndex]

  // Convert row coordinate from zero-indexed to one-indexed
  const row = rowIndex + 1

  return colLetter + row.toString()
}

// Parses a gridSpaceVal (e.g. S0-P0, S2-P3) to extract which ship was hit
function getHitShipNum (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[0].slice(1))
}

// Parses a gridSpaceVal to extract which ship position was hit
function getHitPosition (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[1].slice(1))
}

// This function accepts a gameboard object and parses it to return a tracker that shows unhit ship positions, hit ship positions, and missed locations
function convertGameboardToTracker (gameboard) {
  const gameboardGrid = gameboard.grid
  const ships = gameboard.ships

  const tracker = [
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

  // Iterate through gameboardGrid and parse things like 'miss' into '/' and hits into 'X'. 'S' represents an unhit ship part
  gameboardGrid.forEach((col, colIndex) => {
    col.forEach((gridSpaceVal, rowIndex) => {
      if (gridSpaceVal === 'miss') {
        // If grid space is marked as miss, mark a '/' in the tracker
        tracker[colIndex][rowIndex] = '/'
      } else if (gridSpaceVal !== '') {
        // If grid space is not empty, it must contain a ship
        const shipNum = getHitShipNum(gridSpaceVal)
        const shipPos = getHitPosition(gridSpaceVal)

        // Check if the ship has been hit at the given position
        if (ships[shipNum].hitMap[shipPos] === 'intact') {
          tracker[colIndex][rowIndex] = 'S'
        } else if (ships[shipNum].hitMap[shipPos] === 'hit') {
          tracker[colIndex][rowIndex] = 'X'
        }
      }
    })
  })

  return tracker
}

export {
  letterMap,
  indexMap,
  convertCoordinatesToIndices,
  convertIndicesToCoordinates,
  getHitShipNum,
  getHitPosition,
  convertGameboardToTracker
}
