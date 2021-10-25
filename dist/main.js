/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/Gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship.js */ "./src/modules/Ship.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/modules/util.js");



function getShipIndices (frontIndices, orientation, length) {
  const indices = []
  const frontCol = frontIndices.col
  const frontRow = frontIndices.row

  if (orientation === 'horizontal') {
    for (let i = frontCol; i < frontCol + length; i++) {
      indices.push({ col: i, row: frontRow })
    }
  } else if (orientation === 'vertical') {
    for (let i = frontRow; i < frontRow + length; i++) {
      indices.push({ col: frontCol, row: i })
    }
  }

  return indices
}

/*
 * Position specified is invalid if any of the following conditions are met:
 * 1. Any of the positions specified are not empty on the grid
 * 2. Any provided index is less than 0
 * 3. Any provided index is greater than the grid length minus 1
 * 4. Any of the indices aren't of type number
 */
function invalidPosition (grid, indices) {
  return indices.some(point => {
    return (
      typeof point.col !== 'number' ||
      typeof point.row !== 'number' ||
      point.col < 0 ||
      point.col > grid.length - 1 ||
      point.row < 0 ||
      point.row > grid.length - 1 ||
      grid[point.col][point.row] !== ''
    )
  })
}

/*
 * Attack is invalid if any of the following conditions are met:
 * 1. The space chosen has already been attacked and missed
 * 2. The space chosen has already been attacked and a ship hit at that position
 */
function invalidAttack (gridSpaceVal, ships) {
  // If the space value is 'miss' it has already been attacked. If it is empty, the attack is valid
  if (gridSpaceVal === 'miss') {
    return true
  } else if (gridSpaceVal === '') {
    return false
  }

  // If the space wasn't empty or already shot and missed, it must have a ship
  const hitShipNum = getHitShipNum(gridSpaceVal)
  const hitShipPosition = getHitPosition(gridSpaceVal)
  const ship = ships[hitShipNum]

  // Check the ship's hit map at the specified position and return true if it is already hit
  return ship.hitMap[hitShipPosition] === 'hit'
}

function placeShipIndices (grid, indices, shipNumber) {
  const shipIdentifier = `S${shipNumber}`
  indices.forEach((point, index) => {
    const positionIdentifier = `P${index}`
    const identifier = `${shipIdentifier}-${positionIdentifier}`
    grid[point.col][point.row] = identifier
  })
}

// Parses a gridSpaceVal (e.g. S0-P0, S2-P3) to extract which ship was hit
function getHitShipNum (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[0].slice(1))
}

// Parses a gridSpaceVal to extract which ship position was hit
function getHitPosition (gridSpaceVal) {
  return parseInt(gridSpaceVal.split('-')[1].slice(1))
}

const gameboardPrototype = {
  placeShip: function (frontCoordinates, orientation, length) {
    // Convert front coordinates to indices
    const frontIndices = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.convertCoordinatesToIndices)(frontCoordinates, _util_js__WEBPACK_IMPORTED_MODULE_1__.letterMap)

    // Get all ship coordinates based on front indices, orientation, and length
    const indices = getShipIndices(frontIndices, orientation, length)

    // Throw an error if any invalid coordinates have been specified
    if (invalidPosition(this.grid, indices)) {
      throw new Error('Invalid ship position')
    }

    // The new ship number is equal to the length of the gameboard ships property
    const shipNumber = this.ships.length

    // Place ship indices
    placeShipIndices(this.grid, indices, shipNumber)

    // Create the new ship and add it to ships array
    const newShip = (0,_Ship_js__WEBPACK_IMPORTED_MODULE_0__["default"])(length)
    this.ships.push(newShip)
  },

  receiveAttack: function (coordinate) {
    const point = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.convertCoordinatesToIndices)(coordinate, _util_js__WEBPACK_IMPORTED_MODULE_1__.letterMap)
    const gridSpaceVal = this.grid[point.col][point.row]

    if (invalidAttack(gridSpaceVal, this.ships)) {
      throw new Error('Cannot attack the same space twice')
    }

    if (gridSpaceVal === '') {
      // Mark a miss on the grid
      this.grid[point.col][point.row] = 'miss'

      // Report that a ship was missed
      return 'miss'
    } else {
      // Determine which ship was hit
      const hitShipNum = getHitShipNum(gridSpaceVal)

      // Determine which ship position was hit
      const hitPosition = getHitPosition(gridSpaceVal)

      // Call hit() method on hit ship
      const ship = this.ships[hitShipNum]
      ship.hit(hitPosition)

      // Report that a ship was hit
      return 'hit'
    }
  },

  allShipsSunk: function () {
    return this.ships.every(ship => {
      return ship.isSunk()
    })
  }
}

function Gameboard () {
  const grid = [
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

  const ships = []

  return Object.assign(Object.create(gameboardPrototype), {
    grid,
    ships
  })
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);


/***/ }),

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/modules/util.js");


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
    const { row, col } = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.convertCoordinatesToIndices)(coordinate, _util_js__WEBPACK_IMPORTED_MODULE_0__.letterMap)

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
      const coordinate = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.convertIndicesToCoordinates)(colIndex, rowIndex, _util_js__WEBPACK_IMPORTED_MODULE_0__.indexMap)

      // Attack enemy gameboard
      this.attack(enemyGameboard, coordinate)
    }
  }

  return Object.assign(Object.create(playerPrototype), props)
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/modules/Ship.js":
/*!*****************************!*\
  !*** ./src/modules/Ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


/***/ }),

/***/ "./src/modules/displayController.js":
/*!******************************************!*\
  !*** ./src/modules/displayController.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub */ "./src/modules/pubSub.js");


function render (data) {
  console.log(data)
}

function init () {
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('shipPlaced', render)
}

const displayController = {
  init
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (displayController);


/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gameboard.js */ "./src/modules/Gameboard.js");
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player.js */ "./src/modules/Player.js");
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util.js */ "./src/modules/util.js");





/*
 * Private
 */

let gameState

function switchActivePlayer () {
  gameState.activePlayer === 0
    ? gameState.activePlayer = 1
    : gameState.activePlayer = 0
}

function switchGameboards () {
  // Swap active gameboard
  gameState.activePlayerGameboard === 0
    ? gameState.activePlayerGameboard = 1
    : gameState.activePlayerGameboard = 0

  // Swap enemy gameboard
  gameState.enemyPlayerGameboard === 1
    ? gameState.enemyPlayerGameboard = 0
    : gameState.enemyPlayerGameboard = 1
}

function extractGameData (gameState) {
  // Extract player 0's (human player) enemyGridTracker and their own gameboard

  // NEED TO CONVERT GAMEBOARD GRID TO GRID TRACKER THAT ONLY SHOWS SYMBOLS AND NO S0-P1, ETC.
  const gameData = {
    playerGridTracker: (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.convertGameboardToTracker)(gameState.gameboards[0]),
    enemyGridTracker: gameState.players[0].enemyGridTracker
  }

  return gameData
}

function end (winningPlayerNumber) {

}

/*
 * Public
 */

function setup () {
  // Initialize players and gameboards.
  gameState = {
    players: [
      (0,_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"])('human'),
      (0,_Player_js__WEBPACK_IMPORTED_MODULE_1__["default"])('computer')
    ],
    activePlayer: 0,
    gameboards: [
      (0,_Gameboard_js__WEBPACK_IMPORTED_MODULE_0__["default"])(),
      (0,_Gameboard_js__WEBPACK_IMPORTED_MODULE_0__["default"])()
    ],
    activePlayerGameboard: 0,
    enemyPlayerGameboard: 1
  }

  // Populate both gameboards with ships
  // EVENTUALLY PUT A RANDOM SHIP PLACEMENT FUNCTION INTO GAMEBOARD FACTORY

  const p0Gameboard = gameState.gameboards[0]
  const p1Gameboard = gameState.gameboards[1]

  // Place player 0's ships
  placeShip(p0Gameboard, 'B6', 'vertical', 5)
  placeShip(p0Gameboard, 'J2', 'vertical', 4)
  placeShip(p0Gameboard, 'B3', 'horizontal', 3)
  placeShip(p0Gameboard, 'E8', 'vertical', 2)
  placeShip(p0Gameboard, 'G8', 'vertical', 2)
  placeShip(p0Gameboard, 'F4', 'vertical', 1)
  placeShip(p0Gameboard, 'J10', 'vertical', 1)

  // Place Player 1's ships
  placeShip(p1Gameboard, 'B5', 'vertical', 5)
  placeShip(p1Gameboard, 'G1', 'horizontal', 4)
  placeShip(p1Gameboard, 'J4', 'vertical', 3)
  placeShip(p1Gameboard, 'E5', 'horizontal', 2)
  placeShip(p1Gameboard, 'G10', 'horizontal', 2)
  placeShip(p1Gameboard, 'A2', 'vertical', 1)
  placeShip(p1Gameboard, 'D10', 'vertical', 1)
}

function placeShip (gameboard, coordinate, orientation, length) {
  gameboard.placeShip(coordinate, orientation, length)
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('shipPlaced', extractGameData(gameState))
}

function start () {
  // publish event to render game boards so the game can start
  const gameData = extractGameData(gameState)
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('data', gameData)
}

function attack (coordinate) {
  const activePlayer = gameState.players[gameState.activePlayer]
  const enemyGameboard = gameState.gameboards[gameState.enemyPlayerGameboard]

  if (activePlayer.isComputer) {
    activePlayer.randomAttack(enemyGameboard, Math.random)
  } else {
    activePlayer.attack(enemyGameboard, coordinate)
  }

  // Check if there is a winner after attacking
  if (enemyGameboard.allShipsSunk()) {
    // publish game state
    // PUBLISH HERE
    return end(gameState.activePlayer)
  }

  // Switch active players and gameboards
  switchActivePlayer()
  switchGameboards()

  // Publish game state
  // PUBLISH HERE

  // If the computer is now the active player, schedule its next attack
  if (activePlayer.isComputer) {
    setTimeout(attack, 1000)
  }
}

const game = {
  setup,
  placeShip,
  start,
  attack
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);


/***/ }),

/***/ "./src/modules/pubSub.js":
/*!*******************************!*\
  !*** ./src/modules/pubSub.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const pubSub = {
  events: {},
  subscribe: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  },
  unsubscribe: function (eventName, fn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1)
          break
        }
      };
    }
  },
  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data)
      })
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pubSub);


/***/ }),

/***/ "./src/modules/util.js":
/*!*****************************!*\
  !*** ./src/modules/util.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "letterMap": () => (/* binding */ letterMap),
/* harmony export */   "indexMap": () => (/* binding */ indexMap),
/* harmony export */   "convertCoordinatesToIndices": () => (/* binding */ convertCoordinatesToIndices),
/* harmony export */   "convertIndicesToCoordinates": () => (/* binding */ convertIndicesToCoordinates),
/* harmony export */   "getHitShipNum": () => (/* binding */ getHitShipNum),
/* harmony export */   "getHitPosition": () => (/* binding */ getHitPosition),
/* harmony export */   "convertGameboardToTracker": () => (/* binding */ convertGameboardToTracker)
/* harmony export */ });
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




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/game.js */ "./src/modules/game.js");
/* harmony import */ var _modules_displayController_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/displayController.js */ "./src/modules/displayController.js");



_modules_displayController_js__WEBPACK_IMPORTED_MODULE_1__["default"].init()
_modules_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].setup()
_modules_game_js__WEBPACK_IMPORTED_MODULE_0__["default"].start()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7Ozs7Ozs7QUN6QnJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBOztBQVVDOzs7Ozs7O1VDNUdEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQzBCOztBQUU5RCwwRUFBc0I7QUFDdEIsOERBQVU7QUFDViw4REFBVSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZGlzcGxheUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAuanMnXG5pbXBvcnQgeyBsZXR0ZXJNYXAsIGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcyB9IGZyb20gJy4vdXRpbC5qcydcblxuZnVuY3Rpb24gZ2V0U2hpcEluZGljZXMgKGZyb250SW5kaWNlcywgb3JpZW50YXRpb24sIGxlbmd0aCkge1xuICBjb25zdCBpbmRpY2VzID0gW11cbiAgY29uc3QgZnJvbnRDb2wgPSBmcm9udEluZGljZXMuY29sXG4gIGNvbnN0IGZyb250Um93ID0gZnJvbnRJbmRpY2VzLnJvd1xuXG4gIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgZm9yIChsZXQgaSA9IGZyb250Q29sOyBpIDwgZnJvbnRDb2wgKyBsZW5ndGg7IGkrKykge1xuICAgICAgaW5kaWNlcy5wdXNoKHsgY29sOiBpLCByb3c6IGZyb250Um93IH0pXG4gICAgfVxuICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgZm9yIChsZXQgaSA9IGZyb250Um93OyBpIDwgZnJvbnRSb3cgKyBsZW5ndGg7IGkrKykge1xuICAgICAgaW5kaWNlcy5wdXNoKHsgY29sOiBmcm9udENvbCwgcm93OiBpIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZGljZXNcbn1cblxuLypcbiAqIFBvc2l0aW9uIHNwZWNpZmllZCBpcyBpbnZhbGlkIGlmIGFueSBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqIDEuIEFueSBvZiB0aGUgcG9zaXRpb25zIHNwZWNpZmllZCBhcmUgbm90IGVtcHR5IG9uIHRoZSBncmlkXG4gKiAyLiBBbnkgcHJvdmlkZWQgaW5kZXggaXMgbGVzcyB0aGFuIDBcbiAqIDMuIEFueSBwcm92aWRlZCBpbmRleCBpcyBncmVhdGVyIHRoYW4gdGhlIGdyaWQgbGVuZ3RoIG1pbnVzIDFcbiAqIDQuIEFueSBvZiB0aGUgaW5kaWNlcyBhcmVuJ3Qgb2YgdHlwZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaW52YWxpZFBvc2l0aW9uIChncmlkLCBpbmRpY2VzKSB7XG4gIHJldHVybiBpbmRpY2VzLnNvbWUocG9pbnQgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgcG9pbnQuY29sICE9PSAnbnVtYmVyJyB8fFxuICAgICAgdHlwZW9mIHBvaW50LnJvdyAhPT0gJ251bWJlcicgfHxcbiAgICAgIHBvaW50LmNvbCA8IDAgfHxcbiAgICAgIHBvaW50LmNvbCA+IGdyaWQubGVuZ3RoIC0gMSB8fFxuICAgICAgcG9pbnQucm93IDwgMCB8fFxuICAgICAgcG9pbnQucm93ID4gZ3JpZC5sZW5ndGggLSAxIHx8XG4gICAgICBncmlkW3BvaW50LmNvbF1bcG9pbnQucm93XSAhPT0gJydcbiAgICApXG4gIH0pXG59XG5cbi8qXG4gKiBBdHRhY2sgaXMgaW52YWxpZCBpZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKiAxLiBUaGUgc3BhY2UgY2hvc2VuIGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWQgYW5kIG1pc3NlZFxuICogMi4gVGhlIHNwYWNlIGNob3NlbiBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkIGFuZCBhIHNoaXAgaGl0IGF0IHRoYXQgcG9zaXRpb25cbiAqL1xuZnVuY3Rpb24gaW52YWxpZEF0dGFjayAoZ3JpZFNwYWNlVmFsLCBzaGlwcykge1xuICAvLyBJZiB0aGUgc3BhY2UgdmFsdWUgaXMgJ21pc3MnIGl0IGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWQuIElmIGl0IGlzIGVtcHR5LCB0aGUgYXR0YWNrIGlzIHZhbGlkXG4gIGlmIChncmlkU3BhY2VWYWwgPT09ICdtaXNzJykge1xuICAgIHJldHVybiB0cnVlXG4gIH0gZWxzZSBpZiAoZ3JpZFNwYWNlVmFsID09PSAnJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gSWYgdGhlIHNwYWNlIHdhc24ndCBlbXB0eSBvciBhbHJlYWR5IHNob3QgYW5kIG1pc3NlZCwgaXQgbXVzdCBoYXZlIGEgc2hpcFxuICBjb25zdCBoaXRTaGlwTnVtID0gZ2V0SGl0U2hpcE51bShncmlkU3BhY2VWYWwpXG4gIGNvbnN0IGhpdFNoaXBQb3NpdGlvbiA9IGdldEhpdFBvc2l0aW9uKGdyaWRTcGFjZVZhbClcbiAgY29uc3Qgc2hpcCA9IHNoaXBzW2hpdFNoaXBOdW1dXG5cbiAgLy8gQ2hlY2sgdGhlIHNoaXAncyBoaXQgbWFwIGF0IHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gYW5kIHJldHVybiB0cnVlIGlmIGl0IGlzIGFscmVhZHkgaGl0XG4gIHJldHVybiBzaGlwLmhpdE1hcFtoaXRTaGlwUG9zaXRpb25dID09PSAnaGl0J1xufVxuXG5mdW5jdGlvbiBwbGFjZVNoaXBJbmRpY2VzIChncmlkLCBpbmRpY2VzLCBzaGlwTnVtYmVyKSB7XG4gIGNvbnN0IHNoaXBJZGVudGlmaWVyID0gYFMke3NoaXBOdW1iZXJ9YFxuICBpbmRpY2VzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHBvc2l0aW9uSWRlbnRpZmllciA9IGBQJHtpbmRleH1gXG4gICAgY29uc3QgaWRlbnRpZmllciA9IGAke3NoaXBJZGVudGlmaWVyfS0ke3Bvc2l0aW9uSWRlbnRpZmllcn1gXG4gICAgZ3JpZFtwb2ludC5jb2xdW3BvaW50LnJvd10gPSBpZGVudGlmaWVyXG4gIH0pXG59XG5cbi8vIFBhcnNlcyBhIGdyaWRTcGFjZVZhbCAoZS5nLiBTMC1QMCwgUzItUDMpIHRvIGV4dHJhY3Qgd2hpY2ggc2hpcCB3YXMgaGl0XG5mdW5jdGlvbiBnZXRIaXRTaGlwTnVtIChncmlkU3BhY2VWYWwpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGdyaWRTcGFjZVZhbC5zcGxpdCgnLScpWzBdLnNsaWNlKDEpKVxufVxuXG4vLyBQYXJzZXMgYSBncmlkU3BhY2VWYWwgdG8gZXh0cmFjdCB3aGljaCBzaGlwIHBvc2l0aW9uIHdhcyBoaXRcbmZ1bmN0aW9uIGdldEhpdFBvc2l0aW9uIChncmlkU3BhY2VWYWwpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGdyaWRTcGFjZVZhbC5zcGxpdCgnLScpWzFdLnNsaWNlKDEpKVxufVxuXG5jb25zdCBnYW1lYm9hcmRQcm90b3R5cGUgPSB7XG4gIHBsYWNlU2hpcDogZnVuY3Rpb24gKGZyb250Q29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpIHtcbiAgICAvLyBDb252ZXJ0IGZyb250IGNvb3JkaW5hdGVzIHRvIGluZGljZXNcbiAgICBjb25zdCBmcm9udEluZGljZXMgPSBjb252ZXJ0Q29vcmRpbmF0ZXNUb0luZGljZXMoZnJvbnRDb29yZGluYXRlcywgbGV0dGVyTWFwKVxuXG4gICAgLy8gR2V0IGFsbCBzaGlwIGNvb3JkaW5hdGVzIGJhc2VkIG9uIGZyb250IGluZGljZXMsIG9yaWVudGF0aW9uLCBhbmQgbGVuZ3RoXG4gICAgY29uc3QgaW5kaWNlcyA9IGdldFNoaXBJbmRpY2VzKGZyb250SW5kaWNlcywgb3JpZW50YXRpb24sIGxlbmd0aClcblxuICAgIC8vIFRocm93IGFuIGVycm9yIGlmIGFueSBpbnZhbGlkIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBzcGVjaWZpZWRcbiAgICBpZiAoaW52YWxpZFBvc2l0aW9uKHRoaXMuZ3JpZCwgaW5kaWNlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzaGlwIHBvc2l0aW9uJylcbiAgICB9XG5cbiAgICAvLyBUaGUgbmV3IHNoaXAgbnVtYmVyIGlzIGVxdWFsIHRvIHRoZSBsZW5ndGggb2YgdGhlIGdhbWVib2FyZCBzaGlwcyBwcm9wZXJ0eVxuICAgIGNvbnN0IHNoaXBOdW1iZXIgPSB0aGlzLnNoaXBzLmxlbmd0aFxuXG4gICAgLy8gUGxhY2Ugc2hpcCBpbmRpY2VzXG4gICAgcGxhY2VTaGlwSW5kaWNlcyh0aGlzLmdyaWQsIGluZGljZXMsIHNoaXBOdW1iZXIpXG5cbiAgICAvLyBDcmVhdGUgdGhlIG5ldyBzaGlwIGFuZCBhZGQgaXQgdG8gc2hpcHMgYXJyYXlcbiAgICBjb25zdCBuZXdTaGlwID0gU2hpcChsZW5ndGgpXG4gICAgdGhpcy5zaGlwcy5wdXNoKG5ld1NoaXApXG4gIH0sXG5cbiAgcmVjZWl2ZUF0dGFjazogZnVuY3Rpb24gKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBwb2ludCA9IGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcyhjb29yZGluYXRlLCBsZXR0ZXJNYXApXG4gICAgY29uc3QgZ3JpZFNwYWNlVmFsID0gdGhpcy5ncmlkW3BvaW50LmNvbF1bcG9pbnQucm93XVxuXG4gICAgaWYgKGludmFsaWRBdHRhY2soZ3JpZFNwYWNlVmFsLCB0aGlzLnNoaXBzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXR0YWNrIHRoZSBzYW1lIHNwYWNlIHR3aWNlJylcbiAgICB9XG5cbiAgICBpZiAoZ3JpZFNwYWNlVmFsID09PSAnJykge1xuICAgICAgLy8gTWFyayBhIG1pc3Mgb24gdGhlIGdyaWRcbiAgICAgIHRoaXMuZ3JpZFtwb2ludC5jb2xdW3BvaW50LnJvd10gPSAnbWlzcydcblxuICAgICAgLy8gUmVwb3J0IHRoYXQgYSBzaGlwIHdhcyBtaXNzZWRcbiAgICAgIHJldHVybiAnbWlzcydcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNoaXAgd2FzIGhpdFxuICAgICAgY29uc3QgaGl0U2hpcE51bSA9IGdldEhpdFNoaXBOdW0oZ3JpZFNwYWNlVmFsKVxuXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2hpcCBwb3NpdGlvbiB3YXMgaGl0XG4gICAgICBjb25zdCBoaXRQb3NpdGlvbiA9IGdldEhpdFBvc2l0aW9uKGdyaWRTcGFjZVZhbClcblxuICAgICAgLy8gQ2FsbCBoaXQoKSBtZXRob2Qgb24gaGl0IHNoaXBcbiAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLnNoaXBzW2hpdFNoaXBOdW1dXG4gICAgICBzaGlwLmhpdChoaXRQb3NpdGlvbilcblxuICAgICAgLy8gUmVwb3J0IHRoYXQgYSBzaGlwIHdhcyBoaXRcbiAgICAgIHJldHVybiAnaGl0J1xuICAgIH1cbiAgfSxcblxuICBhbGxTaGlwc1N1bms6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeShzaGlwID0+IHtcbiAgICAgIHJldHVybiBzaGlwLmlzU3VuaygpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBHYW1lYm9hcmQgKCkge1xuICBjb25zdCBncmlkID0gW1xuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ11cbiAgXVxuXG4gIGNvbnN0IHNoaXBzID0gW11cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGdhbWVib2FyZFByb3RvdHlwZSksIHtcbiAgICBncmlkLFxuICAgIHNoaXBzXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZFxuIiwiaW1wb3J0IHsgbGV0dGVyTWFwLCBpbmRleE1hcCwgY29udmVydENvb3JkaW5hdGVzVG9JbmRpY2VzLCBjb252ZXJ0SW5kaWNlc1RvQ29vcmRpbmF0ZXMgfSBmcm9tICcuL3V0aWwuanMnXG5cbmZ1bmN0aW9uIGlzVmFsaWRBdHRhY2sgKGNvbCwgcm93LCBlbmVteUdyaWRUcmFja2VyKSB7XG4gIC8vIFJldHVybiBmYWxzZSBmb3IgdW5kZWZpbmVkIHJvdy9jb2xcbiAgaWYgKGNvbCA9PT0gdW5kZWZpbmVkIHx8IHJvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyByZXR1cm4gZmFsc2UgZm9yIHNwYWNlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGhpdFxuICBjb25zdCBzcGFjZVZhbCA9IGVuZW15R3JpZFRyYWNrZXJbY29sXVtyb3ddXG5cbiAgaWYgKHNwYWNlVmFsICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuY29uc3QgcGxheWVyUHJvdG90eXBlID0ge1xuICBhdHRhY2s6IGZ1bmN0aW9uIChlbmVteUdhbWVib2FyZCwgY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGVuZW15R2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSlcblxuICAgIC8vIENvbnZlcnQgY29vcmRpbmF0ZSB0byByb3cgYW5kIGNvbCBpbmRpY2VzXG4gICAgY29uc3QgeyByb3csIGNvbCB9ID0gY29udmVydENvb3JkaW5hdGVzVG9JbmRpY2VzKGNvb3JkaW5hdGUsIGxldHRlck1hcClcblxuICAgIC8vIE1hcmsgZW5lbXlHcmlkVHJhY2tlciBiYXNlZCBvbiByZXN1bHRcbiAgICBpZiAocmVzdWx0ID09PSAnaGl0Jykge1xuICAgICAgdGhpcy5lbmVteUdyaWRUcmFja2VyW2NvbF1bcm93XSA9ICdYJ1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSAnbWlzcycpIHtcbiAgICAgIHRoaXMuZW5lbXlHcmlkVHJhY2tlcltjb2xdW3Jvd10gPSAnLydcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gUGxheWVyIChwbGF5ZXJUeXBlKSB7XG4gIGxldCBpc0NvbXB1dGVyXG5cbiAgaWYgKHBsYXllclR5cGUgPT09ICdodW1hbicpIHtcbiAgICBpc0NvbXB1dGVyID0gZmFsc2VcbiAgfSBlbHNlIGlmIChwbGF5ZXJUeXBlID09PSAnY29tcHV0ZXInKSB7XG4gICAgaXNDb21wdXRlciA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsYXllclR5cGUgbXVzdCBiZSBcImh1bWFuXCIgb3IgXCJjb21wdXRlclwiJylcbiAgfVxuXG4gIGNvbnN0IGVuZW15R3JpZFRyYWNrZXIgPSBbXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXVxuICBdXG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgaXNDb21wdXRlcixcbiAgICBlbmVteUdyaWRUcmFja2VyXG4gIH1cblxuICAvLyBDb21wdXRlcnMgZ2FpbiBhIHJhbmRvbUF0dGFjayBmdW5jdGlvblxuICBpZiAoaXNDb21wdXRlcikge1xuICAgIHByb3BzLnJhbmRvbUF0dGFjayA9IGZ1bmN0aW9uIChlbmVteUdhbWVib2FyZCwgbWF0aFJhbmRvbUZuKSB7XG4gICAgICBsZXQgY29sSW5kZXhcbiAgICAgIGxldCByb3dJbmRleFxuXG4gICAgICAvLyBMb29wIHVudGlsIHZhbGlkIGF0dGFjayBpcyBnZW5lcmF0ZWRcbiAgICAgIHdoaWxlICghaXNWYWxpZEF0dGFjayhjb2xJbmRleCwgcm93SW5kZXgsIHRoaXMuZW5lbXlHcmlkVHJhY2tlcikpIHtcbiAgICAgICAgY29sSW5kZXggPSBNYXRoLmZsb29yKG1hdGhSYW5kb21GbigpICogMTApXG4gICAgICAgIHJvd0luZGV4ID0gTWF0aC5mbG9vcihtYXRoUmFuZG9tRm4oKSAqIDEwKVxuICAgICAgfVxuXG4gICAgICAvLyBDb252ZXJ0IGluZGljZXMgdG8gZ3JpZCBjb29yZGluYXRlcyAoZS5nLiBBMSwgRjUsIGV0Yy4pXG4gICAgICBjb25zdCBjb29yZGluYXRlID0gY29udmVydEluZGljZXNUb0Nvb3JkaW5hdGVzKGNvbEluZGV4LCByb3dJbmRleCwgaW5kZXhNYXApXG5cbiAgICAgIC8vIEF0dGFjayBlbmVteSBnYW1lYm9hcmRcbiAgICAgIHRoaXMuYXR0YWNrKGVuZW15R2FtZWJvYXJkLCBjb29yZGluYXRlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUocGxheWVyUHJvdG90eXBlKSwgcHJvcHMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllclxuIiwiZnVuY3Rpb24gbWFrZUhpdE1hcCAobGVuZ3RoKSB7XG4gIGNvbnN0IGhpdE1hcCA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBoaXRNYXAucHVzaCgnaW50YWN0JylcbiAgfVxuICByZXR1cm4gaGl0TWFwXG59XG5cbmNvbnN0IHNoaXBQcm90b3R5cGUgPSB7XG4gIGhpdDogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBwb3NpdGlvbiAhPT0gJ251bWJlcicgfHwgcG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gKHRoaXMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9zaXRpb24gcHJvdmlkZWQgbXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIHRoZSBzaGlwIGxlbmd0aCBtaW51cyAxJylcbiAgICB9XG4gICAgdGhpcy5oaXRNYXBbcG9zaXRpb25dID0gJ2hpdCdcbiAgfSxcbiAgaXNTdW5rOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGl0TWFwLmV2ZXJ5KHBvc2l0aW9uID0+IHBvc2l0aW9uID09PSAnaGl0JylcbiAgfVxufVxuXG5mdW5jdGlvbiBTaGlwIChsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBsZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlZCBsZW5ndGggYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBjb25zdCBoaXRNYXAgPSBtYWtlSGl0TWFwKGxlbmd0aClcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHNoaXBQcm90b3R5cGUpLCB7XG4gICAgbGVuZ3RoLFxuICAgIGhpdE1hcFxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwXG4iLCJpbXBvcnQgcHViU3ViIGZyb20gJy4vcHViU3ViJ1xuXG5mdW5jdGlvbiByZW5kZXIgKGRhdGEpIHtcbiAgY29uc29sZS5sb2coZGF0YSlcbn1cblxuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIHB1YlN1Yi5zdWJzY3JpYmUoJ3NoaXBQbGFjZWQnLCByZW5kZXIpXG59XG5cbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0ge1xuICBpbml0XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyXG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vR2FtZWJvYXJkLmpzJ1xuaW1wb3J0IFBsYXllciBmcm9tICcuL1BsYXllci5qcydcbmltcG9ydCBwdWJTdWIgZnJvbSAnLi9wdWJTdWIuanMnXG5pbXBvcnQgeyBjb252ZXJ0R2FtZWJvYXJkVG9UcmFja2VyIH0gZnJvbSAnLi91dGlsLmpzJ1xuXG4vKlxuICogUHJpdmF0ZVxuICovXG5cbmxldCBnYW1lU3RhdGVcblxuZnVuY3Rpb24gc3dpdGNoQWN0aXZlUGxheWVyICgpIHtcbiAgZ2FtZVN0YXRlLmFjdGl2ZVBsYXllciA9PT0gMFxuICAgID8gZ2FtZVN0YXRlLmFjdGl2ZVBsYXllciA9IDFcbiAgICA6IGdhbWVTdGF0ZS5hY3RpdmVQbGF5ZXIgPSAwXG59XG5cbmZ1bmN0aW9uIHN3aXRjaEdhbWVib2FyZHMgKCkge1xuICAvLyBTd2FwIGFjdGl2ZSBnYW1lYm9hcmRcbiAgZ2FtZVN0YXRlLmFjdGl2ZVBsYXllckdhbWVib2FyZCA9PT0gMFxuICAgID8gZ2FtZVN0YXRlLmFjdGl2ZVBsYXllckdhbWVib2FyZCA9IDFcbiAgICA6IGdhbWVTdGF0ZS5hY3RpdmVQbGF5ZXJHYW1lYm9hcmQgPSAwXG5cbiAgLy8gU3dhcCBlbmVteSBnYW1lYm9hcmRcbiAgZ2FtZVN0YXRlLmVuZW15UGxheWVyR2FtZWJvYXJkID09PSAxXG4gICAgPyBnYW1lU3RhdGUuZW5lbXlQbGF5ZXJHYW1lYm9hcmQgPSAwXG4gICAgOiBnYW1lU3RhdGUuZW5lbXlQbGF5ZXJHYW1lYm9hcmQgPSAxXG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RHYW1lRGF0YSAoZ2FtZVN0YXRlKSB7XG4gIC8vIEV4dHJhY3QgcGxheWVyIDAncyAoaHVtYW4gcGxheWVyKSBlbmVteUdyaWRUcmFja2VyIGFuZCB0aGVpciBvd24gZ2FtZWJvYXJkXG5cbiAgLy8gTkVFRCBUTyBDT05WRVJUIEdBTUVCT0FSRCBHUklEIFRPIEdSSUQgVFJBQ0tFUiBUSEFUIE9OTFkgU0hPV1MgU1lNQk9MUyBBTkQgTk8gUzAtUDEsIEVUQy5cbiAgY29uc3QgZ2FtZURhdGEgPSB7XG4gICAgcGxheWVyR3JpZFRyYWNrZXI6IGNvbnZlcnRHYW1lYm9hcmRUb1RyYWNrZXIoZ2FtZVN0YXRlLmdhbWVib2FyZHNbMF0pLFxuICAgIGVuZW15R3JpZFRyYWNrZXI6IGdhbWVTdGF0ZS5wbGF5ZXJzWzBdLmVuZW15R3JpZFRyYWNrZXJcbiAgfVxuXG4gIHJldHVybiBnYW1lRGF0YVxufVxuXG5mdW5jdGlvbiBlbmQgKHdpbm5pbmdQbGF5ZXJOdW1iZXIpIHtcblxufVxuXG4vKlxuICogUHVibGljXG4gKi9cblxuZnVuY3Rpb24gc2V0dXAgKCkge1xuICAvLyBJbml0aWFsaXplIHBsYXllcnMgYW5kIGdhbWVib2FyZHMuXG4gIGdhbWVTdGF0ZSA9IHtcbiAgICBwbGF5ZXJzOiBbXG4gICAgICBQbGF5ZXIoJ2h1bWFuJyksXG4gICAgICBQbGF5ZXIoJ2NvbXB1dGVyJylcbiAgICBdLFxuICAgIGFjdGl2ZVBsYXllcjogMCxcbiAgICBnYW1lYm9hcmRzOiBbXG4gICAgICBHYW1lYm9hcmQoKSxcbiAgICAgIEdhbWVib2FyZCgpXG4gICAgXSxcbiAgICBhY3RpdmVQbGF5ZXJHYW1lYm9hcmQ6IDAsXG4gICAgZW5lbXlQbGF5ZXJHYW1lYm9hcmQ6IDFcbiAgfVxuXG4gIC8vIFBvcHVsYXRlIGJvdGggZ2FtZWJvYXJkcyB3aXRoIHNoaXBzXG4gIC8vIEVWRU5UVUFMTFkgUFVUIEEgUkFORE9NIFNISVAgUExBQ0VNRU5UIEZVTkNUSU9OIElOVE8gR0FNRUJPQVJEIEZBQ1RPUllcblxuICBjb25zdCBwMEdhbWVib2FyZCA9IGdhbWVTdGF0ZS5nYW1lYm9hcmRzWzBdXG4gIGNvbnN0IHAxR2FtZWJvYXJkID0gZ2FtZVN0YXRlLmdhbWVib2FyZHNbMV1cblxuICAvLyBQbGFjZSBwbGF5ZXIgMCdzIHNoaXBzXG4gIHBsYWNlU2hpcChwMEdhbWVib2FyZCwgJ0I2JywgJ3ZlcnRpY2FsJywgNSlcbiAgcGxhY2VTaGlwKHAwR2FtZWJvYXJkLCAnSjInLCAndmVydGljYWwnLCA0KVxuICBwbGFjZVNoaXAocDBHYW1lYm9hcmQsICdCMycsICdob3Jpem9udGFsJywgMylcbiAgcGxhY2VTaGlwKHAwR2FtZWJvYXJkLCAnRTgnLCAndmVydGljYWwnLCAyKVxuICBwbGFjZVNoaXAocDBHYW1lYm9hcmQsICdHOCcsICd2ZXJ0aWNhbCcsIDIpXG4gIHBsYWNlU2hpcChwMEdhbWVib2FyZCwgJ0Y0JywgJ3ZlcnRpY2FsJywgMSlcbiAgcGxhY2VTaGlwKHAwR2FtZWJvYXJkLCAnSjEwJywgJ3ZlcnRpY2FsJywgMSlcblxuICAvLyBQbGFjZSBQbGF5ZXIgMSdzIHNoaXBzXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0I1JywgJ3ZlcnRpY2FsJywgNSlcbiAgcGxhY2VTaGlwKHAxR2FtZWJvYXJkLCAnRzEnLCAnaG9yaXpvbnRhbCcsIDQpXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0o0JywgJ3ZlcnRpY2FsJywgMylcbiAgcGxhY2VTaGlwKHAxR2FtZWJvYXJkLCAnRTUnLCAnaG9yaXpvbnRhbCcsIDIpXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0cxMCcsICdob3Jpem9udGFsJywgMilcbiAgcGxhY2VTaGlwKHAxR2FtZWJvYXJkLCAnQTInLCAndmVydGljYWwnLCAxKVxuICBwbGFjZVNoaXAocDFHYW1lYm9hcmQsICdEMTAnLCAndmVydGljYWwnLCAxKVxufVxuXG5mdW5jdGlvbiBwbGFjZVNoaXAgKGdhbWVib2FyZCwgY29vcmRpbmF0ZSwgb3JpZW50YXRpb24sIGxlbmd0aCkge1xuICBnYW1lYm9hcmQucGxhY2VTaGlwKGNvb3JkaW5hdGUsIG9yaWVudGF0aW9uLCBsZW5ndGgpXG4gIHB1YlN1Yi5wdWJsaXNoKCdzaGlwUGxhY2VkJywgZXh0cmFjdEdhbWVEYXRhKGdhbWVTdGF0ZSkpXG59XG5cbmZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAgLy8gcHVibGlzaCBldmVudCB0byByZW5kZXIgZ2FtZSBib2FyZHMgc28gdGhlIGdhbWUgY2FuIHN0YXJ0XG4gIGNvbnN0IGdhbWVEYXRhID0gZXh0cmFjdEdhbWVEYXRhKGdhbWVTdGF0ZSlcbiAgcHViU3ViLnB1Ymxpc2goJ2RhdGEnLCBnYW1lRGF0YSlcbn1cblxuZnVuY3Rpb24gYXR0YWNrIChjb29yZGluYXRlKSB7XG4gIGNvbnN0IGFjdGl2ZVBsYXllciA9IGdhbWVTdGF0ZS5wbGF5ZXJzW2dhbWVTdGF0ZS5hY3RpdmVQbGF5ZXJdXG4gIGNvbnN0IGVuZW15R2FtZWJvYXJkID0gZ2FtZVN0YXRlLmdhbWVib2FyZHNbZ2FtZVN0YXRlLmVuZW15UGxheWVyR2FtZWJvYXJkXVxuXG4gIGlmIChhY3RpdmVQbGF5ZXIuaXNDb21wdXRlcikge1xuICAgIGFjdGl2ZVBsYXllci5yYW5kb21BdHRhY2soZW5lbXlHYW1lYm9hcmQsIE1hdGgucmFuZG9tKVxuICB9IGVsc2Uge1xuICAgIGFjdGl2ZVBsYXllci5hdHRhY2soZW5lbXlHYW1lYm9hcmQsIGNvb3JkaW5hdGUpXG4gIH1cblxuICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHdpbm5lciBhZnRlciBhdHRhY2tpbmdcbiAgaWYgKGVuZW15R2FtZWJvYXJkLmFsbFNoaXBzU3VuaygpKSB7XG4gICAgLy8gcHVibGlzaCBnYW1lIHN0YXRlXG4gICAgLy8gUFVCTElTSCBIRVJFXG4gICAgcmV0dXJuIGVuZChnYW1lU3RhdGUuYWN0aXZlUGxheWVyKVxuICB9XG5cbiAgLy8gU3dpdGNoIGFjdGl2ZSBwbGF5ZXJzIGFuZCBnYW1lYm9hcmRzXG4gIHN3aXRjaEFjdGl2ZVBsYXllcigpXG4gIHN3aXRjaEdhbWVib2FyZHMoKVxuXG4gIC8vIFB1Ymxpc2ggZ2FtZSBzdGF0ZVxuICAvLyBQVUJMSVNIIEhFUkVcblxuICAvLyBJZiB0aGUgY29tcHV0ZXIgaXMgbm93IHRoZSBhY3RpdmUgcGxheWVyLCBzY2hlZHVsZSBpdHMgbmV4dCBhdHRhY2tcbiAgaWYgKGFjdGl2ZVBsYXllci5pc0NvbXB1dGVyKSB7XG4gICAgc2V0VGltZW91dChhdHRhY2ssIDEwMDApXG4gIH1cbn1cblxuY29uc3QgZ2FtZSA9IHtcbiAgc2V0dXAsXG4gIHBsYWNlU2hpcCxcbiAgc3RhcnQsXG4gIGF0dGFja1xufVxuXG5leHBvcnQgZGVmYXVsdCBnYW1lXG4iLCJjb25zdCBwdWJTdWIgPSB7XG4gIGV2ZW50czoge30sXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXVxuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbilcbiAgfSxcbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBwdWJsaXNoOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgZm4oZGF0YSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHB1YlN1YlxuIiwiY29uc3QgbGV0dGVyTWFwID0ge1xuICBBOiAwLFxuICBCOiAxLFxuICBDOiAyLFxuICBEOiAzLFxuICBFOiA0LFxuICBGOiA1LFxuICBHOiA2LFxuICBIOiA3LFxuICBJOiA4LFxuICBKOiA5XG59XG5cbmNvbnN0IGluZGV4TWFwID0ge1xuICAwOiAnQScsXG4gIDE6ICdCJyxcbiAgMjogJ0MnLFxuICAzOiAnRCcsXG4gIDQ6ICdFJyxcbiAgNTogJ0YnLFxuICA2OiAnRycsXG4gIDc6ICdIJyxcbiAgODogJ0knLFxuICA5OiAnSidcbn1cblxuZnVuY3Rpb24gY29udmVydENvb3JkaW5hdGVzVG9JbmRpY2VzIChjb29yZGluYXRlcywgbGV0dGVyTWFwKSB7XG4gIC8vIENvbnZlcnQgY29sdW1uIGNvb3JkaW5hdGUgZnJvbSBsZXR0ZXIgdG8gbnVtYmVyXG4gIGNvbnN0IGxldHRlckNvbCA9IGNvb3JkaW5hdGVzLmNoYXJBdCgwKVxuICBjb25zdCBjb2wgPSBsZXR0ZXJNYXBbbGV0dGVyQ29sXVxuXG4gIC8vIERvd25zaGlmdCByb3cgbnVtYmVyIGJ5IDEgc28gdGhhdCBpcyB6ZXJvLWluZGV4ZWQgaW5zdGVhZCBvZiBzdGFydGluZyB3aXRoIDFcbiAgLy8gY29uc3Qgcm93ID0gcGFyc2VJbnQoY29vcmRpbmF0ZXMuY2hhckF0KDEpKSAtIDFcbiAgY29uc3Qgcm93ID0gcGFyc2VJbnQoY29vcmRpbmF0ZXMuc2xpY2UoMSkpIC0gMVxuXG4gIHJldHVybiB7IGNvbCwgcm93IH1cbn1cblxuZnVuY3Rpb24gY29udmVydEluZGljZXNUb0Nvb3JkaW5hdGVzIChjb2xJbmRleCwgcm93SW5kZXgsIGluZGV4TWFwKSB7XG4gIC8vIENvbnZlcnQgY29sdW1uIGNvb3JkaW5hdGUgZnJvbSBpbmRleCB0byBsZXR0ZXJcbiAgY29uc3QgY29sTGV0dGVyID0gaW5kZXhNYXBbY29sSW5kZXhdXG5cbiAgLy8gQ29udmVydCByb3cgY29vcmRpbmF0ZSBmcm9tIHplcm8taW5kZXhlZCB0byBvbmUtaW5kZXhlZFxuICBjb25zdCByb3cgPSByb3dJbmRleCArIDFcblxuICByZXR1cm4gY29sTGV0dGVyICsgcm93LnRvU3RyaW5nKClcbn1cblxuLy8gUGFyc2VzIGEgZ3JpZFNwYWNlVmFsIChlLmcuIFMwLVAwLCBTMi1QMykgdG8gZXh0cmFjdCB3aGljaCBzaGlwIHdhcyBoaXRcbmZ1bmN0aW9uIGdldEhpdFNoaXBOdW0gKGdyaWRTcGFjZVZhbCkge1xuICByZXR1cm4gcGFyc2VJbnQoZ3JpZFNwYWNlVmFsLnNwbGl0KCctJylbMF0uc2xpY2UoMSkpXG59XG5cbi8vIFBhcnNlcyBhIGdyaWRTcGFjZVZhbCB0byBleHRyYWN0IHdoaWNoIHNoaXAgcG9zaXRpb24gd2FzIGhpdFxuZnVuY3Rpb24gZ2V0SGl0UG9zaXRpb24gKGdyaWRTcGFjZVZhbCkge1xuICByZXR1cm4gcGFyc2VJbnQoZ3JpZFNwYWNlVmFsLnNwbGl0KCctJylbMV0uc2xpY2UoMSkpXG59XG5cbi8vIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyBhIGdhbWVib2FyZCBvYmplY3QgYW5kIHBhcnNlcyBpdCB0byByZXR1cm4gYSB0cmFja2VyIHRoYXQgc2hvd3MgdW5oaXQgc2hpcCBwb3NpdGlvbnMsIGhpdCBzaGlwIHBvc2l0aW9ucywgYW5kIG1pc3NlZCBsb2NhdGlvbnNcbmZ1bmN0aW9uIGNvbnZlcnRHYW1lYm9hcmRUb1RyYWNrZXIgKGdhbWVib2FyZCkge1xuICBjb25zdCBnYW1lYm9hcmRHcmlkID0gZ2FtZWJvYXJkLmdyaWRcbiAgY29uc3Qgc2hpcHMgPSBnYW1lYm9hcmQuc2hpcHNcblxuICBjb25zdCB0cmFja2VyID0gW1xuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ11cbiAgXVxuXG4gIC8vIEl0ZXJhdGUgdGhyb3VnaCBnYW1lYm9hcmRHcmlkIGFuZCBwYXJzZSB0aGluZ3MgbGlrZSAnbWlzcycgaW50byAnLycgYW5kIGhpdHMgaW50byAnWCcuICdTJyByZXByZXNlbnRzIGFuIHVuaGl0IHNoaXAgcGFydFxuICBnYW1lYm9hcmRHcmlkLmZvckVhY2goKGNvbCwgY29sSW5kZXgpID0+IHtcbiAgICBjb2wuZm9yRWFjaCgoZ3JpZFNwYWNlVmFsLCByb3dJbmRleCkgPT4ge1xuICAgICAgaWYgKGdyaWRTcGFjZVZhbCA9PT0gJ21pc3MnKSB7XG4gICAgICAgIC8vIElmIGdyaWQgc3BhY2UgaXMgbWFya2VkIGFzIG1pc3MsIG1hcmsgYSAnLycgaW4gdGhlIHRyYWNrZXJcbiAgICAgICAgdHJhY2tlcltjb2xJbmRleF1bcm93SW5kZXhdID0gJy8nXG4gICAgICB9IGVsc2UgaWYgKGdyaWRTcGFjZVZhbCAhPT0gJycpIHtcbiAgICAgICAgLy8gSWYgZ3JpZCBzcGFjZSBpcyBub3QgZW1wdHksIGl0IG11c3QgY29udGFpbiBhIHNoaXBcbiAgICAgICAgY29uc3Qgc2hpcE51bSA9IGdldEhpdFNoaXBOdW0oZ3JpZFNwYWNlVmFsKVxuICAgICAgICBjb25zdCBzaGlwUG9zID0gZ2V0SGl0UG9zaXRpb24oZ3JpZFNwYWNlVmFsKVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBzaGlwIGhhcyBiZWVuIGhpdCBhdCB0aGUgZ2l2ZW4gcG9zaXRpb25cbiAgICAgICAgaWYgKHNoaXBzW3NoaXBOdW1dLmhpdE1hcFtzaGlwUG9zXSA9PT0gJ2ludGFjdCcpIHtcbiAgICAgICAgICB0cmFja2VyW2NvbEluZGV4XVtyb3dJbmRleF0gPSAnUydcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwc1tzaGlwTnVtXS5oaXRNYXBbc2hpcFBvc10gPT09ICdoaXQnKSB7XG4gICAgICAgICAgdHJhY2tlcltjb2xJbmRleF1bcm93SW5kZXhdID0gJ1gnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiB0cmFja2VyXG59XG5cbmV4cG9ydCB7XG4gIGxldHRlck1hcCxcbiAgaW5kZXhNYXAsXG4gIGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcyxcbiAgY29udmVydEluZGljZXNUb0Nvb3JkaW5hdGVzLFxuICBnZXRIaXRTaGlwTnVtLFxuICBnZXRIaXRQb3NpdGlvbixcbiAgY29udmVydEdhbWVib2FyZFRvVHJhY2tlclxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZSBmcm9tICcuL21vZHVsZXMvZ2FtZS5qcydcbmltcG9ydCBkaXNwbGF5Q29udHJvbGxlciBmcm9tICcuL21vZHVsZXMvZGlzcGxheUNvbnRyb2xsZXIuanMnXG5cbmRpc3BsYXlDb250cm9sbGVyLmluaXQoKVxuZ2FtZS5zZXR1cCgpXG5nYW1lLnN0YXJ0KClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==