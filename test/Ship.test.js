import { test, expect, describe } from '@jest/globals'
import Ship from '../src/modules/Ship.js'

describe('Ship Object Properties', () => {
  test('Produces an object', () => {
    const expectedType = 'object'

    const actualType = typeof Ship(1)

    expect(actualType).toBe(expectedType)
  })

  test('When provided with a length argument, produces an object property with the same length', () => {
    const inputLengths = [3, 5]
    const expectedLength = [3, 5]

    const ships = inputLengths.map(Ship)

    ships.forEach((ship, index) => expect(ship).toHaveLength(expectedLength[index]))
  })

  test('Produces a hitMap property which is an array', () => {
    const ship = Ship(2)

    expect(Array.isArray(ship.hitMap)).toBe(true)
  })

  test('hitMap property length is same as object length property', () => {
    const lengths = [2, 5]
    const ships = lengths.map(Ship)

    ships.forEach((ship, index) => expect(ship.hitMap).toHaveLength(lengths[index]))
  })

  test('hitMap array contains "intact" string value at each index', () => {
    const ship = Ship(3)
    const expectedHitMap = ['intact', 'intact', 'intact']

    expect(ship.hitMap).toEqual(expectedHitMap)
  })

  test('Throws an error if a valid length is not provided to Factory Function', () => {
    expect(() => Ship()).toThrow('Provided length argument must be a number')
  })
})

describe('Ship Object Methods', () => {
  test('Has a hit() method on the object\'s prototype', () => {
    const ship = Ship(2)

    // Check that .hit() doesn't exist directly on the object
    expect(Object.prototype.hasOwnProperty.call(ship, 'hit')).toBe(false)

    // Check that .hit() is a function
    expect(typeof ship.hit).toBe('function')
  })

  test('hit() marks the provided position as \'hit\'', () => {
    const ship = Ship(4)
    const position = 2
    const expectedHitMap = ['intact', 'intact', 'hit', 'intact']

    ship.hit(position)

    expect(ship.hitMap).toEqual(expectedHitMap)
  })

  test('hit() throws an error if a position argument greater than length - 1 is provided', () => {
    const ship = Ship(4)

    expect(() => ship.hit(5)).toThrow('Position provided must be a number between 0 and the ship length minus 1')
  })

  test('hit() throws an error if a non-number argument is provided', () => {
    const ship = Ship(3)

    expect(() => ship.hit('cat')).toThrow('Position provided must be a number between 0 and the ship length minus 1')
  })

  test('Has a isSunk() method on the object\'s prototype', () => {
    const ship = Ship(1)

    // Check that .isSunk() doesn't exist directly on the object
    expect(Object.prototype.hasOwnProperty.call(ship, 'isSunk')).toBe(false)

    // Check that .isSunk() is a function
    expect(typeof ship.isSunk).toBe('function')
  })

  test('isSunk() returns false when called on a fully intact ship', () => {
    const ship = Ship(3)

    expect(ship.isSunk()).toBe(false)
  })

  test('isSunk() returns false when called on a partially intact ship', () => {
    const ship = Ship(4)
    ship.hit(0)
    ship.hit(3)

    expect(ship.isSunk()).toBe(false)
  })

  test('isSunk() returns true when called on a fully hit ship', () => {
    const ship = Ship(2)
    ship.hit(0)
    ship.hit(1)

    expect(ship.isSunk()).toBe(true)
  })
})
