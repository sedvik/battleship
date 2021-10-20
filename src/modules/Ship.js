function makeHitMap (length) {
  const hitMap = []
  for (let i = 0; i < length; i++) {
    hitMap.push('intact')
  }
  return hitMap
}

const shipPrototype = {
  hit: function (position) {
    if (typeof position !== 'number' || position < 0 || position > (this.length - 1)) {
      throw new Error('Position provided must be a number between 0 and the ship length minus 1')
    }
    this.hitMap[position] = 'hit'
  },
  isSunk: function () {
    return this.hitMap.every(position => position === 'hit')
  }
}

function Ship (length) {
  if (typeof length !== 'number') {
    throw new Error('Provided length argument must be a number')
  }

  const hitMap = makeHitMap(length)

  return Object.assign(Object.create(shipPrototype), {
    length,
    hitMap
  })
}

export default Ship
