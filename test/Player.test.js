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
})
