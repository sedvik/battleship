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

export { letterMap, convertCoordinatesToIndices }
