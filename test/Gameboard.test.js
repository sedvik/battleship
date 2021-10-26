import { test, expect, describe, beforeEach } from '@jest/globals'
import Gameboard from '../src/modules/Gameboard.js'

describe('Gameboard grid', () => {
  let gameboard

  beforeEach(() => {
    // Create new gameboard before each test
    gameboard = Gameboard()
  })

  test('Has a "grid" property', () => {
    expect(gameboard.grid).not.toBeUndefined()
  })

  test('grid property is an array of length 10', () => {
    expect(Array.isArray(gameboard.grid)).toBe(true)
    expect(gameboard.grid).toHaveLength(10)
  })

  test('every grid property item is an array', () => {
    const allColumnsAreArrays = gameboard.grid.every(col => {
      return Array.isArray(col)
    })

    expect(allColumnsAreArrays).toBe(true)
  })

  test('every grid property sub array (col) is of length 10', () => {
    gameboard.grid.forEach(col => expect(col).toHaveLength(10))
  })

  test('every grid column item has an empty string initially assigned', () => {
    gameboard.grid.forEach(col => {
      col.forEach(rowSpace => {
        expect(rowSpace).toBe('')
      })
    })
  })
})

describe('Gameboard ships', () => {
  let gameboard

  beforeEach(() => {
    // Create new gameboard before each test
    gameboard = Gameboard()
  })

  test('ships property is an array', () => {
    expect(Array.isArray(gameboard.ships)).toBe(true)
  })

  test('ships property array initializes with length 0', () => {
    expect(gameboard.ships).toHaveLength(0)
  })
})

describe('placeableShips property', () => {
  let gameboard

  beforeEach(() => {
    gameboard = Gameboard()
  })

  test('has a placeableShips property', () => {
    expect(gameboard.placeableShips).not.toBeUndefined()
  })

  test('initializes to the correct initial object', () => {
    const expectedObj = {
      5: 1,
      4: 1,
      3: 1,
      2: 2,
      1: 2
    }

    expect(gameboard.placeableShips).toEqual(expectedObj)
  })
})

describe('placeShip() method', () => {
  let gameboard

  beforeEach(() => {
    gameboard = Gameboard()
  })

  test('placeShip() method exists on the object\'s prototype', () => {
    // placeShip method does not exist directly on gameboard instance
    expect(Object.prototype.hasOwnProperty.call(gameboard, 'placeShip')).toBe(false)

    // placeShip method is of type "function"
    expect(typeof gameboard.placeShip).toBe('function')
  })

  test('placeShip() at coordinate A1 results in grid[0][0] being S0-P0', () => {
    gameboard.placeShip('A1', 'vertical', 1)

    // Grid should have col 0/row 0 position filled with S0-P0, corresponding to Ship 0, Position 0
    expect(gameboard.grid[0][0]).toBe('S0-P0')
  })

  test('placeShip() at coordinate F5 results in grid[5][4] being S0-P0', () => {
    gameboard.placeShip('F5', 'vertical', 1)

    expect(gameboard.grid[5][4]).toBe('S0-P0')
  })

  test('placeShip() at coordinate J10 results in grid[9][9] being S0-P0', () => {
    gameboard.placeShip('J10', 'horizontal', 1)

    expect(gameboard.grid[9][9]).toBe('S0-P0')
  })

  test('placeShip() at coordinate A1 with vertical ship of length 3 fills appropriate grid spots', () => {
    gameboard.placeShip('A1', 'vertical', 3)

    expect(gameboard.grid[0][0]).toBe('S0-P0')
    expect(gameboard.grid[0][1]).toBe('S0-P1')
    expect(gameboard.grid[0][2]).toBe('S0-P2')
  })

  test('placeShip() at coordinate A1 with horizontal ship of length 3 fills appropriate grid spots', () => {
    gameboard.placeShip('A1', 'horizontal', 3)

    expect(gameboard.grid[0][0]).toBe('S0-P0')
    expect(gameboard.grid[1][0]).toBe('S0-P1')
    expect(gameboard.grid[2][0]).toBe('S0-P2')
  })

  test('placeShip() at coordinate B8 with horizontal ship of length 5 fills appropriate grid spots', () => {
    gameboard.placeShip('B8', 'horizontal', 5)

    expect(gameboard.grid[1][7]).toBe('S0-P0')
    expect(gameboard.grid[2][7]).toBe('S0-P1')
    expect(gameboard.grid[3][7]).toBe('S0-P2')
    expect(gameboard.grid[4][7]).toBe('S0-P3')
    expect(gameboard.grid[5][7]).toBe('S0-P4')
  })

  test('The second vertical ship with length 3 placed at A1 should result in grid[0][0], grid[0][1], grid[0][2], being S1-P0, S1-P1, and S1-P2, respectively', () => {
    gameboard.placeShip('E5', 'horizontal', 2)
    gameboard.placeShip('A1', 'vertical', 3)

    expect(gameboard.grid[0][0]).toBe('S1-P0')
    expect(gameboard.grid[0][1]).toBe('S1-P1')
    expect(gameboard.grid[0][2]).toBe('S1-P2')
  })

  test('Calling placeShip once should result in a ships array of length 1', () => {
    gameboard.placeShip('A7', 'vertical', 3)

    expect(gameboard.ships).toHaveLength(1)
  })

  test('Calling placeShip three times should result in a ships array of length 3', () => {
    gameboard.placeShip('A1', 'vertical', 2)
    gameboard.placeShip('D5', 'horizontal', 3)
    gameboard.placeShip('F9', 'horizontal', 4)

    expect(gameboard.ships).toHaveLength(3)
  })

  test('num ships available for a given length decreases by 1 when a ship with that length is placed', () => {
    const initialAvailableShips = gameboard.placeableShips[3]
    const expectedAvailableShips = initialAvailableShips - 1
    gameboard.placeShip('A1', 'horizontal', 3)

    expect(gameboard.placeableShips[3]).toBe(expectedAvailableShips)
  })

  test('placeShip should throw an error if multiple ships are placed at the same position', () => {
    gameboard.placeShip('A1', 'vertical', 1)

    expect(() => gameboard.placeShip('A1', 'vertical', 1)).toThrow('Invalid ship position')
  })

  test('placeShip should throw an error if two ships overlap with eachother', () => {
    gameboard.placeShip('A1', 'vertical', 5)

    // Second ship will overlap with the tail of the first ship
    expect(() => gameboard.placeShip('A2', 'horizontal', 3)).toThrow('Invalid ship position')
  })

  test('placeShip should throw an error if a ship is attempted to be placed out-of-bounds from the top', () => {
    // A0 doesn't exist
    expect(() => gameboard.placeShip('A0', 'vertical', 3)).toThrow('Invalid ship position')
  })

  test('placeShip should throw an error if a ship is attempted to be placed out-of-bounds from the bottom', () => {
    // Tail of ship would to A11, which does not exist
    expect(() => gameboard.placeShip('A10', 'vertical', 2)).toThrow('Invalid ship position')
  })

  test('placeShip should throw an error if a ship is attempted to be placed horizontally out-of-bounds from the right', () => {
    // K1 doesn't exist
    expect(() => gameboard.placeShip('K1', 'vertical', 1)).toThrow('Invalid ship position')
  })

  test('placeShip should throw an error if tail of ship is attempted to be placed horizontally out-of-bounds', () => {
    // K7 does not exist
    expect(() => gameboard.placeShip('G7', 'horizontal', 5)).toThrow('Invalid ship position')
  })

  test('placeShips throws an error if a ship is attempted to be placed that is not available per placeableShips property', () => {
    // Place 1st and only ship of length 5
    gameboard.placeShip('A1', 'vertical', 5)

    // Attempt to place another ship of length 5 should throw an error
    expect(() => gameboard.placeShip('H4', 'vertical', 5)).toThrow('No ships of this length are available')
  })
})

describe('receiveAttack() method', () => {
  let gameboard

  beforeEach(() => {
    gameboard = Gameboard()

    // Ship 0 (S0)
    gameboard.placeShip('A1', 'vertical', 4)

    // Ship 1 (S1)
    gameboard.placeShip('F5', 'horizontal', 2)

    // Ship 2 (S2)
    gameboard.placeShip('D8', 'horizontal', 5)
  })

  test('receiveAttack() method exists on the object\'s prototype', () => {
    // Method does not exist directly on the gameboard instance
    expect(Object.prototype.hasOwnProperty.call(gameboard, 'receiveAttack')).toBe(false)

    // receiveAttack is of type function
    expect(typeof gameboard.receiveAttack).toBe('function')
  })

  test('receiveAttack() at A1 returns "hit"', () => {
    const result = gameboard.receiveAttack('A1')

    expect(result).toBe('hit')
  })

  test('receiveAttack at G2 returns "miss"', () => {
    const result = gameboard.receiveAttack('G2')

    expect(result).toBe('miss')
  })

  test('receiveAttack() at A1 results in position 0 (P0) of S0 being marked as hit', () => {
    gameboard.receiveAttack('A1')
    const S0 = gameboard.ships[0]

    expect(S0.hitMap[0]).toBe('hit')
  })

  test('receiveAttack() at G8 results in P3 of S2 being marked as hit', () => {
    gameboard.receiveAttack('G8')
    const S2 = gameboard.ships[2]

    expect(S2.hitMap[3]).toBe('hit')
  })

  test('receiveAttack() at F2 results in grid position being marked as missed', () => {
    gameboard.receiveAttack('F2')

    expect(gameboard.grid[5][1]).toBe('miss')
  })

  test('receiveAttack() throws an error if a position with a ship is attacked more than once', () => {
    gameboard.receiveAttack('A1')

    expect(() => gameboard.receiveAttack('A1')).toThrow()
  })

  test('receiveAttack() throws an error if a position without a ship is attacked more than once', () => {
    gameboard.receiveAttack('I3')

    expect(() => gameboard.receiveAttack('I3')).toThrow()
  })
})

describe('allShipsSunk() method', () => {
  let gameboard

  beforeEach(() => {
    gameboard = Gameboard()

    // Ship 0
    gameboard.placeShip('D2', 'vertical', 2)

    // Ship 1
    gameboard.placeShip('A8', 'horizontal', 5)

    // Ship 2
    gameboard.placeShip('H4', 'vertical', 3)
  })

  test('allShipsSunk method exists on the object\'s prototype', () => {
    // Doesn't exist directly on object instance
    expect(Object.prototype.hasOwnProperty.call(gameboard, 'allShipsSunk')).toBe(false)

    // Is of type function
    expect(typeof gameboard.allShipsSunk).toBe('function')
  })

  test('allShipsSunk() returns false for undamaged ships', () => {
    expect(gameboard.allShipsSunk()).toBe(false)
  })

  test('allShipsSunk() returns false for partially damaged ships', () => {
    // Hit S0
    gameboard.receiveAttack('D3')

    // Hit S1
    gameboard.receiveAttack('B8')

    // Hit S2
    gameboard.receiveAttack('H5')

    expect(gameboard.allShipsSunk()).toBe(false)
  })

  test('allShipsSunk() returns false for 1 sunk ship and 2 undamaged ships', () => {
    // Sink S0
    gameboard.receiveAttack('D2')
    gameboard.receiveAttack('D3')

    expect(gameboard.allShipsSunk()).toBe(false)
  })

  test('allShipsSunk() returns true for 3 (all) sunk ships', () => {
    // Sink S0
    gameboard.receiveAttack('D2')
    gameboard.receiveAttack('D3')

    // Sink S1
    gameboard.receiveAttack('A8')
    gameboard.receiveAttack('B8')
    gameboard.receiveAttack('C8')
    gameboard.receiveAttack('D8')
    gameboard.receiveAttack('E8')

    // Sink S2
    gameboard.receiveAttack('H4')
    gameboard.receiveAttack('H5')
    gameboard.receiveAttack('H6')

    expect(gameboard.allShipsSunk()).toBe(true)
  })
})

describe('allShipsPlaced() method', () => {
  let gameboard

  beforeEach(() => {
    gameboard = Gameboard()
  })

  test('allShipsPlaced method exists on the object\'s prototype', () => {
    expect(Object.prototype.hasOwnProperty.call(gameboard, 'allShipsPlaced')).toBe(false)
    expect(typeof gameboard.allShipsPlaced).toBe('function')
  })

  test('returns false when no ships have been placed', () => {
    expect(gameboard.allShipsPlaced()).toBe(false)
  })

  test('returns false when a portion of available ships have been placed', () => {
    gameboard.placeShip('A1', 'horizontal', 5)
    gameboard.placeShip('F6', 'vertical', 3)

    // Should return false since 5 ships remain to be placed
    expect(gameboard.allShipsPlaced()).toBe(false)
  })

  test('returns true when all ships have been placed', () => {
    gameboard.placeShip('A1', 'horizontal', 5)
    gameboard.placeShip('B5', 'vertical', 4)
    gameboard.placeShip('F6', 'vertical', 3)
    gameboard.placeShip('F3', 'horizontal', 2)
    gameboard.placeShip('J9', 'vertical', 2)
    gameboard.placeShip('D6', 'vertical', 1)
    gameboard.placeShip('I2', 'horizontal', 1)

    expect(gameboard.allShipsPlaced()).toBe(true)
  })
})
