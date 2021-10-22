import { test, expect, describe, beforeEach, jest } from '@jest/globals'
import Player from '../src/modules/Player.js'

describe('Player factory function', () => {
  test('Throws an error if called with a non-valid playerType (human or computer)', () => {
    expect(() => Player('John Stamos')).toThrow('playerType must be "human" or "computer"')
  })
})

describe('enemyGridTracker property', () => {
  let player

  beforeEach(() => {
    player = Player('human')
  })

  test('player instances have an enemyGridTracker property that is an array', () => {
    expect(Array.isArray(player.enemyGridTracker)).toBe(true)
  })

  test('enemyGridTracker array is of length 10', () => {
    expect(player.enemyGridTracker).toHaveLength(10)
  })

  test('each enemyGridTracker col is an array of length 10', () => {
    player.enemyGridTracker.forEach(col => {
      expect(Array.isArray(col)).toBe(true)
      expect(col).toHaveLength(10)
    })
  })

  test('enemyGridTracker cols initiallly contain empty strings', () => {
    const allItemsAreEmptyStrings = player.enemyGridTracker.every(col => {
      return col.every(item => item === '')
    })

    expect(allItemsAreEmptyStrings).toBe(true)
  })
})

describe('isComputer property', () => {
  test('isComputer property is false if player factory is called with "human" as an argument', () => {
    const player = Player('human')

    expect(player.isComputer).toBe(false)
  })

  test('isComputer property is true if player factory is called with "computer" as an argument', () => {
    const player = Player('computer')

    expect(player.isComputer).toBe(true)
  })
})

describe('attack() method', () => {
  let player
  let mockPlayerGameboard

  beforeEach(() => {
    player = Player('human')
    mockPlayerGameboard = {
      receiveAttack: jest.fn()
    }
    // Mock fn returns 'hit' on first call and 'miss' on second call
    mockPlayerGameboard.receiveAttack.mockReturnValueOnce('hit')
    mockPlayerGameboard.receiveAttack.mockReturnValueOnce('miss')
  })

  test('attack() method exists on player instance\' prototype', () => {
    // attack method does not exist directly on obj instance
    expect(Object.prototype.hasOwnProperty.call(player, 'attack')).toBe(false)

    // attack method is of type function
    expect(typeof player.attack).toBe('function')
  })

  test('attack() on cell A1 calls the gameboard receiveAttack method with correct argument', () => {
    player.attack(mockPlayerGameboard, 'A1')

    expect(mockPlayerGameboard.receiveAttack).toHaveBeenCalledWith('A1')
  })

  test('attack() on cell B4 and then D5 calls the gameboard receive attack method in order', () => {
    player.attack(mockPlayerGameboard, 'B4')
    player.attack(mockPlayerGameboard, 'D5')

    expect(mockPlayerGameboard.receiveAttack.mock.calls[0][0]).toBe('B4')
    expect(mockPlayerGameboard.receiveAttack.mock.calls[1][0]).toBe('D5')
  })

  test('attack() on cell F2 and then E9 results in enemyGridTracker being marked with X and / for those positions', () => {
    player.attack(mockPlayerGameboard, 'F2')
    player.attack(mockPlayerGameboard, 'E9')

    expect(player.enemyGridTracker[5][1]).toBe('X')
    expect(player.enemyGridTracker[4][8]).toBe('/')
  })
})

describe('randomAttack() method', () => {
  test('Does not exist for a human player', () => {
    const player = Player('human')
    expect(player.randomAttack).toBeUndefined()
  })

  test('Does exist for a computer player', () => {
    const player = Player('computer')
    expect(typeof player.randomAttack).toBe('function')
  })

  test('randomAttack() calls provided random number generator function twice', () => {
    const player = Player('computer')
    const mockEnemyGameboard = {
      receiveAttack: jest.fn()
    }
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('hit')

    const mockMathRandom = jest.fn()
    mockMathRandom.mockReturnValueOnce(0.41)
    mockMathRandom.mockReturnValueOnce(0.74)

    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    expect(mockMathRandom.mock.calls).toHaveLength(2)
  })

  test('randomAttack() results in gameboard receiveAttack method being called once with generated coordinates', () => {
    const player = Player('computer')

    const mockEnemyGameboard = {
      receiveAttack: jest.fn()
    }
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('hit')

    const mockMathRandom = jest.fn()

    // The below mock random values will result in colIndex = 2 and rowIndex = 9 (C10)
    mockMathRandom.mockReturnValueOnce(0.23)
    mockMathRandom.mockReturnValueOnce(0.91)

    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    expect(mockEnemyGameboard.receiveAttack).toBeCalledWith('C10')
  })

  test('randomAttack() results in enemyGridTracker being updated with hit/miss indicators', () => {
    const player = Player('computer')

    const mockEnemyGameboard = {
      receiveAttack: jest.fn()
    }
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('hit')
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('miss')

    const mockMathRandom = jest.fn()

    // The below mock random values will result in colIndex = 3 and rowIndex = 8 (D9)
    mockMathRandom.mockReturnValueOnce(0.33)
    mockMathRandom.mockReturnValueOnce(0.81)

    // The below mock random values will result in colIndex = 5 and rowIndex = 0 (F1)
    mockMathRandom.mockReturnValueOnce(0.56)
    mockMathRandom.mockReturnValueOnce(0.03)

    // Hit D9
    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    // Miss F1
    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    expect(player.enemyGridTracker[3][8]).toBe('X')
    expect(player.enemyGridTracker[5][0]).toBe('/')
  })

  test('randomAttack() cannot attack the same coordinate twice', () => {
    const player = Player('computer')

    const mockEnemyGameboard = {
      receiveAttack: jest.fn()
    }
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('hit')
    mockEnemyGameboard.receiveAttack.mockReturnValueOnce('miss')

    const mockMathRandom = jest.fn()

    // Below mock random values result in colIndex = 2 and rowIndex = 3 (C4)
    mockMathRandom.mockReturnValueOnce(0.24)
    mockMathRandom.mockReturnValueOnce(0.37)

    // Below mock random values result in same coordinates as above (C4)
    mockMathRandom.mockReturnValueOnce(0.21)
    mockMathRandom.mockReturnValueOnce(0.35)

    // Below mock random values result in colIndex = 8 and rowIndex = 8 (I9)
    mockMathRandom.mockReturnValueOnce(0.82)
    mockMathRandom.mockReturnValueOnce(0.85)

    // Hit C4
    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    // Attempt to hit C4 again, then hit I9
    player.randomAttack(mockEnemyGameboard, mockMathRandom)

    // To behave as expected, receiveAttack must have only been called twice and mockMathRandom called 6 times (2 for each coordinate generated)
    expect(mockEnemyGameboard.receiveAttack.mock.calls).toHaveLength(2)
    expect(mockMathRandom.mock.calls).toHaveLength(6)

    // Last call of receiveAttack should be with I9 instead of C4
    expect(mockEnemyGameboard.receiveAttack).toHaveBeenLastCalledWith('I9')
  })
})
