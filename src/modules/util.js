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

export { letterMap, indexMap, convertCoordinatesToIndices, convertIndicesToCoordinates }
