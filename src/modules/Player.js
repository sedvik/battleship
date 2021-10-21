const playerPrototype = {
  attack: function (enemyGameboard, coordinate) {
    const result = enemyGameboard.receiveAttack(coordinate)

    // Convert coordinate to row and col indices
    const { row, col } = 3

    // Mark enemyGridTracker based on result
    if (result === 'hit') {
      this.enemyGridTracker
    } else if (result === 'miss') {

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

  return Object.assign(Object.create(playerPrototype), {
    enemyGridTracker,
    isComputer
  })
}

export default Player
