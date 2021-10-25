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
  const hitShipNum = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getHitShipNum)(gridSpaceVal)
  const hitShipPosition = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getHitPosition)(gridSpaceVal)
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
      const hitShipNum = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getHitShipNum)(gridSpaceVal)

      // Determine which ship position was hit
      const hitPosition = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getHitPosition)(gridSpaceVal)

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


// Renders setup of first player's board
function renderSetup (data) {
  console.log('Setup', data)
}

// Renders main battleship game, including player's board and tracker of enemy's grid
function renderMain (data) {
  console.log('Main', data)
}

// Renders end screen after a player has won
function renderEnd (data) {
  console.log('End', data)
}

function init () {
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('setupStart', renderSetup)
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('shipPlaced', renderSetup)
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('gameStart', renderMain)
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('roundPlayed', renderMain)
  _pubSub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('gameEnd', renderEnd)
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
  // Extract player 0's (human player) enemyGridTracker and their own grid tracker
  const gameData = {
    playerGridTracker: (0,_util_js__WEBPACK_IMPORTED_MODULE_3__.convertGameboardToTracker)(gameState.gameboards[0]),
    enemyGridTracker: gameState.players[0].enemyGridTracker
  }

  return gameData
}

function end () {
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('gameEnd', extractGameData(gameState))
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

  // Publish that setup has started
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('setupStart', extractGameData(gameState))

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
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('gameStart', extractGameData(gameState))
}

// Plays a single round of battleship
function playRound (coordinate) {
  const activePlayer = gameState.players[gameState.activePlayer]
  const enemyGameboard = gameState.gameboards[gameState.enemyPlayerGameboard]

  // Attack the enemy gameboard
  if (activePlayer.isComputer) {
    activePlayer.randomAttack(enemyGameboard, Math.random)
  } else {
    activePlayer.attack(enemyGameboard, coordinate)
  }

  // Check if there is a winner after attacking
  if (enemyGameboard.allShipsSunk()) {
    return end()
  }

  // Switch active players and gameboards
  switchActivePlayer()
  switchGameboards()

  // Publish game state
  _pubSub_js__WEBPACK_IMPORTED_MODULE_2__["default"].publish('roundPlayed', extractGameData(gameState))

  // If a computer is now the active player, schedule its next play at least 1sec from now
  if (activePlayer.isComputer) {
    setTimeout(playRound, 1000)
  }
}

const game = {
  setup,
  placeShip,
  start,
  playRound
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdEOzs7Ozs7Ozs7Ozs7O0FDTm9DO0FBQzBCOztBQUU5RCwwRUFBc0I7QUFDdEIsOERBQVU7QUFDViw4REFBVSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9HYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZGlzcGxheUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdXRpbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAuanMnXG5pbXBvcnQgeyBsZXR0ZXJNYXAsIGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcywgZ2V0SGl0U2hpcE51bSwgZ2V0SGl0UG9zaXRpb24gfSBmcm9tICcuL3V0aWwuanMnXG5cbmZ1bmN0aW9uIGdldFNoaXBJbmRpY2VzIChmcm9udEluZGljZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpIHtcbiAgY29uc3QgaW5kaWNlcyA9IFtdXG4gIGNvbnN0IGZyb250Q29sID0gZnJvbnRJbmRpY2VzLmNvbFxuICBjb25zdCBmcm9udFJvdyA9IGZyb250SW5kaWNlcy5yb3dcblxuICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgIGZvciAobGV0IGkgPSBmcm9udENvbDsgaSA8IGZyb250Q29sICsgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGluZGljZXMucHVzaCh7IGNvbDogaSwgcm93OiBmcm9udFJvdyB9KVxuICAgIH1cbiAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgIGZvciAobGV0IGkgPSBmcm9udFJvdzsgaSA8IGZyb250Um93ICsgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGluZGljZXMucHVzaCh7IGNvbDogZnJvbnRDb2wsIHJvdzogaSB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRpY2VzXG59XG5cbi8qXG4gKiBQb3NpdGlvbiBzcGVjaWZpZWQgaXMgaW52YWxpZCBpZiBhbnkgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKiAxLiBBbnkgb2YgdGhlIHBvc2l0aW9ucyBzcGVjaWZpZWQgYXJlIG5vdCBlbXB0eSBvbiB0aGUgZ3JpZFxuICogMi4gQW55IHByb3ZpZGVkIGluZGV4IGlzIGxlc3MgdGhhbiAwXG4gKiAzLiBBbnkgcHJvdmlkZWQgaW5kZXggaXMgZ3JlYXRlciB0aGFuIHRoZSBncmlkIGxlbmd0aCBtaW51cyAxXG4gKiA0LiBBbnkgb2YgdGhlIGluZGljZXMgYXJlbid0IG9mIHR5cGUgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRQb3NpdGlvbiAoZ3JpZCwgaW5kaWNlcykge1xuICByZXR1cm4gaW5kaWNlcy5zb21lKHBvaW50ID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZW9mIHBvaW50LmNvbCAhPT0gJ251bWJlcicgfHxcbiAgICAgIHR5cGVvZiBwb2ludC5yb3cgIT09ICdudW1iZXInIHx8XG4gICAgICBwb2ludC5jb2wgPCAwIHx8XG4gICAgICBwb2ludC5jb2wgPiBncmlkLmxlbmd0aCAtIDEgfHxcbiAgICAgIHBvaW50LnJvdyA8IDAgfHxcbiAgICAgIHBvaW50LnJvdyA+IGdyaWQubGVuZ3RoIC0gMSB8fFxuICAgICAgZ3JpZFtwb2ludC5jb2xdW3BvaW50LnJvd10gIT09ICcnXG4gICAgKVxuICB9KVxufVxuXG4vKlxuICogQXR0YWNrIGlzIGludmFsaWQgaWYgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICogMS4gVGhlIHNwYWNlIGNob3NlbiBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkIGFuZCBtaXNzZWRcbiAqIDIuIFRoZSBzcGFjZSBjaG9zZW4gaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZCBhbmQgYSBzaGlwIGhpdCBhdCB0aGF0IHBvc2l0aW9uXG4gKi9cbmZ1bmN0aW9uIGludmFsaWRBdHRhY2sgKGdyaWRTcGFjZVZhbCwgc2hpcHMpIHtcbiAgLy8gSWYgdGhlIHNwYWNlIHZhbHVlIGlzICdtaXNzJyBpdCBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkLiBJZiBpdCBpcyBlbXB0eSwgdGhlIGF0dGFjayBpcyB2YWxpZFxuICBpZiAoZ3JpZFNwYWNlVmFsID09PSAnbWlzcycpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2UgaWYgKGdyaWRTcGFjZVZhbCA9PT0gJycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIElmIHRoZSBzcGFjZSB3YXNuJ3QgZW1wdHkgb3IgYWxyZWFkeSBzaG90IGFuZCBtaXNzZWQsIGl0IG11c3QgaGF2ZSBhIHNoaXBcbiAgY29uc3QgaGl0U2hpcE51bSA9IGdldEhpdFNoaXBOdW0oZ3JpZFNwYWNlVmFsKVxuICBjb25zdCBoaXRTaGlwUG9zaXRpb24gPSBnZXRIaXRQb3NpdGlvbihncmlkU3BhY2VWYWwpXG4gIGNvbnN0IHNoaXAgPSBzaGlwc1toaXRTaGlwTnVtXVxuXG4gIC8vIENoZWNrIHRoZSBzaGlwJ3MgaGl0IG1hcCBhdCB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBpcyBhbHJlYWR5IGhpdFxuICByZXR1cm4gc2hpcC5oaXRNYXBbaGl0U2hpcFBvc2l0aW9uXSA9PT0gJ2hpdCdcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwSW5kaWNlcyAoZ3JpZCwgaW5kaWNlcywgc2hpcE51bWJlcikge1xuICBjb25zdCBzaGlwSWRlbnRpZmllciA9IGBTJHtzaGlwTnVtYmVyfWBcbiAgaW5kaWNlcy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwb3NpdGlvbklkZW50aWZpZXIgPSBgUCR7aW5kZXh9YFxuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgJHtzaGlwSWRlbnRpZmllcn0tJHtwb3NpdGlvbklkZW50aWZpZXJ9YFxuICAgIGdyaWRbcG9pbnQuY29sXVtwb2ludC5yb3ddID0gaWRlbnRpZmllclxuICB9KVxufVxuXG5jb25zdCBnYW1lYm9hcmRQcm90b3R5cGUgPSB7XG4gIHBsYWNlU2hpcDogZnVuY3Rpb24gKGZyb250Q29vcmRpbmF0ZXMsIG9yaWVudGF0aW9uLCBsZW5ndGgpIHtcbiAgICAvLyBDb252ZXJ0IGZyb250IGNvb3JkaW5hdGVzIHRvIGluZGljZXNcbiAgICBjb25zdCBmcm9udEluZGljZXMgPSBjb252ZXJ0Q29vcmRpbmF0ZXNUb0luZGljZXMoZnJvbnRDb29yZGluYXRlcywgbGV0dGVyTWFwKVxuXG4gICAgLy8gR2V0IGFsbCBzaGlwIGNvb3JkaW5hdGVzIGJhc2VkIG9uIGZyb250IGluZGljZXMsIG9yaWVudGF0aW9uLCBhbmQgbGVuZ3RoXG4gICAgY29uc3QgaW5kaWNlcyA9IGdldFNoaXBJbmRpY2VzKGZyb250SW5kaWNlcywgb3JpZW50YXRpb24sIGxlbmd0aClcblxuICAgIC8vIFRocm93IGFuIGVycm9yIGlmIGFueSBpbnZhbGlkIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBzcGVjaWZpZWRcbiAgICBpZiAoaW52YWxpZFBvc2l0aW9uKHRoaXMuZ3JpZCwgaW5kaWNlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzaGlwIHBvc2l0aW9uJylcbiAgICB9XG5cbiAgICAvLyBUaGUgbmV3IHNoaXAgbnVtYmVyIGlzIGVxdWFsIHRvIHRoZSBsZW5ndGggb2YgdGhlIGdhbWVib2FyZCBzaGlwcyBwcm9wZXJ0eVxuICAgIGNvbnN0IHNoaXBOdW1iZXIgPSB0aGlzLnNoaXBzLmxlbmd0aFxuXG4gICAgLy8gUGxhY2Ugc2hpcCBpbmRpY2VzXG4gICAgcGxhY2VTaGlwSW5kaWNlcyh0aGlzLmdyaWQsIGluZGljZXMsIHNoaXBOdW1iZXIpXG5cbiAgICAvLyBDcmVhdGUgdGhlIG5ldyBzaGlwIGFuZCBhZGQgaXQgdG8gc2hpcHMgYXJyYXlcbiAgICBjb25zdCBuZXdTaGlwID0gU2hpcChsZW5ndGgpXG4gICAgdGhpcy5zaGlwcy5wdXNoKG5ld1NoaXApXG4gIH0sXG5cbiAgcmVjZWl2ZUF0dGFjazogZnVuY3Rpb24gKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBwb2ludCA9IGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcyhjb29yZGluYXRlLCBsZXR0ZXJNYXApXG4gICAgY29uc3QgZ3JpZFNwYWNlVmFsID0gdGhpcy5ncmlkW3BvaW50LmNvbF1bcG9pbnQucm93XVxuXG4gICAgaWYgKGludmFsaWRBdHRhY2soZ3JpZFNwYWNlVmFsLCB0aGlzLnNoaXBzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXR0YWNrIHRoZSBzYW1lIHNwYWNlIHR3aWNlJylcbiAgICB9XG5cbiAgICBpZiAoZ3JpZFNwYWNlVmFsID09PSAnJykge1xuICAgICAgLy8gTWFyayBhIG1pc3Mgb24gdGhlIGdyaWRcbiAgICAgIHRoaXMuZ3JpZFtwb2ludC5jb2xdW3BvaW50LnJvd10gPSAnbWlzcydcblxuICAgICAgLy8gUmVwb3J0IHRoYXQgYSBzaGlwIHdhcyBtaXNzZWRcbiAgICAgIHJldHVybiAnbWlzcydcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNoaXAgd2FzIGhpdFxuICAgICAgY29uc3QgaGl0U2hpcE51bSA9IGdldEhpdFNoaXBOdW0oZ3JpZFNwYWNlVmFsKVxuXG4gICAgICAvLyBEZXRlcm1pbmUgd2hpY2ggc2hpcCBwb3NpdGlvbiB3YXMgaGl0XG4gICAgICBjb25zdCBoaXRQb3NpdGlvbiA9IGdldEhpdFBvc2l0aW9uKGdyaWRTcGFjZVZhbClcblxuICAgICAgLy8gQ2FsbCBoaXQoKSBtZXRob2Qgb24gaGl0IHNoaXBcbiAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLnNoaXBzW2hpdFNoaXBOdW1dXG4gICAgICBzaGlwLmhpdChoaXRQb3NpdGlvbilcblxuICAgICAgLy8gUmVwb3J0IHRoYXQgYSBzaGlwIHdhcyBoaXRcbiAgICAgIHJldHVybiAnaGl0J1xuICAgIH1cbiAgfSxcblxuICBhbGxTaGlwc1N1bms6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeShzaGlwID0+IHtcbiAgICAgIHJldHVybiBzaGlwLmlzU3VuaygpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBHYW1lYm9hcmQgKCkge1xuICBjb25zdCBncmlkID0gW1xuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ11cbiAgXVxuXG4gIGNvbnN0IHNoaXBzID0gW11cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGdhbWVib2FyZFByb3RvdHlwZSksIHtcbiAgICBncmlkLFxuICAgIHNoaXBzXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZFxuIiwiaW1wb3J0IHsgbGV0dGVyTWFwLCBpbmRleE1hcCwgY29udmVydENvb3JkaW5hdGVzVG9JbmRpY2VzLCBjb252ZXJ0SW5kaWNlc1RvQ29vcmRpbmF0ZXMgfSBmcm9tICcuL3V0aWwuanMnXG5cbmZ1bmN0aW9uIGlzVmFsaWRBdHRhY2sgKGNvbCwgcm93LCBlbmVteUdyaWRUcmFja2VyKSB7XG4gIC8vIFJldHVybiBmYWxzZSBmb3IgdW5kZWZpbmVkIHJvdy9jb2xcbiAgaWYgKGNvbCA9PT0gdW5kZWZpbmVkIHx8IHJvdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyByZXR1cm4gZmFsc2UgZm9yIHNwYWNlcyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIGhpdFxuICBjb25zdCBzcGFjZVZhbCA9IGVuZW15R3JpZFRyYWNrZXJbY29sXVtyb3ddXG5cbiAgaWYgKHNwYWNlVmFsICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuY29uc3QgcGxheWVyUHJvdG90eXBlID0ge1xuICBhdHRhY2s6IGZ1bmN0aW9uIChlbmVteUdhbWVib2FyZCwgY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGVuZW15R2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZSlcblxuICAgIC8vIENvbnZlcnQgY29vcmRpbmF0ZSB0byByb3cgYW5kIGNvbCBpbmRpY2VzXG4gICAgY29uc3QgeyByb3csIGNvbCB9ID0gY29udmVydENvb3JkaW5hdGVzVG9JbmRpY2VzKGNvb3JkaW5hdGUsIGxldHRlck1hcClcblxuICAgIC8vIE1hcmsgZW5lbXlHcmlkVHJhY2tlciBiYXNlZCBvbiByZXN1bHRcbiAgICBpZiAocmVzdWx0ID09PSAnaGl0Jykge1xuICAgICAgdGhpcy5lbmVteUdyaWRUcmFja2VyW2NvbF1bcm93XSA9ICdYJ1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSAnbWlzcycpIHtcbiAgICAgIHRoaXMuZW5lbXlHcmlkVHJhY2tlcltjb2xdW3Jvd10gPSAnLydcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gUGxheWVyIChwbGF5ZXJUeXBlKSB7XG4gIGxldCBpc0NvbXB1dGVyXG5cbiAgaWYgKHBsYXllclR5cGUgPT09ICdodW1hbicpIHtcbiAgICBpc0NvbXB1dGVyID0gZmFsc2VcbiAgfSBlbHNlIGlmIChwbGF5ZXJUeXBlID09PSAnY29tcHV0ZXInKSB7XG4gICAgaXNDb21wdXRlciA9IHRydWVcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3BsYXllclR5cGUgbXVzdCBiZSBcImh1bWFuXCIgb3IgXCJjb21wdXRlclwiJylcbiAgfVxuXG4gIGNvbnN0IGVuZW15R3JpZFRyYWNrZXIgPSBbXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXVxuICBdXG5cbiAgY29uc3QgcHJvcHMgPSB7XG4gICAgaXNDb21wdXRlcixcbiAgICBlbmVteUdyaWRUcmFja2VyXG4gIH1cblxuICAvLyBDb21wdXRlcnMgZ2FpbiBhIHJhbmRvbUF0dGFjayBmdW5jdGlvblxuICBpZiAoaXNDb21wdXRlcikge1xuICAgIHByb3BzLnJhbmRvbUF0dGFjayA9IGZ1bmN0aW9uIChlbmVteUdhbWVib2FyZCwgbWF0aFJhbmRvbUZuKSB7XG4gICAgICBsZXQgY29sSW5kZXhcbiAgICAgIGxldCByb3dJbmRleFxuXG4gICAgICAvLyBMb29wIHVudGlsIHZhbGlkIGF0dGFjayBpcyBnZW5lcmF0ZWRcbiAgICAgIHdoaWxlICghaXNWYWxpZEF0dGFjayhjb2xJbmRleCwgcm93SW5kZXgsIHRoaXMuZW5lbXlHcmlkVHJhY2tlcikpIHtcbiAgICAgICAgY29sSW5kZXggPSBNYXRoLmZsb29yKG1hdGhSYW5kb21GbigpICogMTApXG4gICAgICAgIHJvd0luZGV4ID0gTWF0aC5mbG9vcihtYXRoUmFuZG9tRm4oKSAqIDEwKVxuICAgICAgfVxuXG4gICAgICAvLyBDb252ZXJ0IGluZGljZXMgdG8gZ3JpZCBjb29yZGluYXRlcyAoZS5nLiBBMSwgRjUsIGV0Yy4pXG4gICAgICBjb25zdCBjb29yZGluYXRlID0gY29udmVydEluZGljZXNUb0Nvb3JkaW5hdGVzKGNvbEluZGV4LCByb3dJbmRleCwgaW5kZXhNYXApXG5cbiAgICAgIC8vIEF0dGFjayBlbmVteSBnYW1lYm9hcmRcbiAgICAgIHRoaXMuYXR0YWNrKGVuZW15R2FtZWJvYXJkLCBjb29yZGluYXRlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUocGxheWVyUHJvdG90eXBlKSwgcHJvcHMpXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllclxuIiwiZnVuY3Rpb24gbWFrZUhpdE1hcCAobGVuZ3RoKSB7XG4gIGNvbnN0IGhpdE1hcCA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBoaXRNYXAucHVzaCgnaW50YWN0JylcbiAgfVxuICByZXR1cm4gaGl0TWFwXG59XG5cbmNvbnN0IHNoaXBQcm90b3R5cGUgPSB7XG4gIGhpdDogZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBwb3NpdGlvbiAhPT0gJ251bWJlcicgfHwgcG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID4gKHRoaXMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9zaXRpb24gcHJvdmlkZWQgbXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIHRoZSBzaGlwIGxlbmd0aCBtaW51cyAxJylcbiAgICB9XG4gICAgdGhpcy5oaXRNYXBbcG9zaXRpb25dID0gJ2hpdCdcbiAgfSxcbiAgaXNTdW5rOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGl0TWFwLmV2ZXJ5KHBvc2l0aW9uID0+IHBvc2l0aW9uID09PSAnaGl0JylcbiAgfVxufVxuXG5mdW5jdGlvbiBTaGlwIChsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBsZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlZCBsZW5ndGggYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cblxuICBjb25zdCBoaXRNYXAgPSBtYWtlSGl0TWFwKGxlbmd0aClcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHNoaXBQcm90b3R5cGUpLCB7XG4gICAgbGVuZ3RoLFxuICAgIGhpdE1hcFxuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwXG4iLCJpbXBvcnQgcHViU3ViIGZyb20gJy4vcHViU3ViJ1xuXG4vLyBSZW5kZXJzIHNldHVwIG9mIGZpcnN0IHBsYXllcidzIGJvYXJkXG5mdW5jdGlvbiByZW5kZXJTZXR1cCAoZGF0YSkge1xuICBjb25zb2xlLmxvZygnU2V0dXAnLCBkYXRhKVxufVxuXG4vLyBSZW5kZXJzIG1haW4gYmF0dGxlc2hpcCBnYW1lLCBpbmNsdWRpbmcgcGxheWVyJ3MgYm9hcmQgYW5kIHRyYWNrZXIgb2YgZW5lbXkncyBncmlkXG5mdW5jdGlvbiByZW5kZXJNYWluIChkYXRhKSB7XG4gIGNvbnNvbGUubG9nKCdNYWluJywgZGF0YSlcbn1cblxuLy8gUmVuZGVycyBlbmQgc2NyZWVuIGFmdGVyIGEgcGxheWVyIGhhcyB3b25cbmZ1bmN0aW9uIHJlbmRlckVuZCAoZGF0YSkge1xuICBjb25zb2xlLmxvZygnRW5kJywgZGF0YSlcbn1cblxuZnVuY3Rpb24gaW5pdCAoKSB7XG4gIHB1YlN1Yi5zdWJzY3JpYmUoJ3NldHVwU3RhcnQnLCByZW5kZXJTZXR1cClcbiAgcHViU3ViLnN1YnNjcmliZSgnc2hpcFBsYWNlZCcsIHJlbmRlclNldHVwKVxuICBwdWJTdWIuc3Vic2NyaWJlKCdnYW1lU3RhcnQnLCByZW5kZXJNYWluKVxuICBwdWJTdWIuc3Vic2NyaWJlKCdyb3VuZFBsYXllZCcsIHJlbmRlck1haW4pXG4gIHB1YlN1Yi5zdWJzY3JpYmUoJ2dhbWVFbmQnLCByZW5kZXJFbmQpXG59XG5cbmNvbnN0IGRpc3BsYXlDb250cm9sbGVyID0ge1xuICBpbml0XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlDb250cm9sbGVyXG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vR2FtZWJvYXJkLmpzJ1xuaW1wb3J0IFBsYXllciBmcm9tICcuL1BsYXllci5qcydcbmltcG9ydCBwdWJTdWIgZnJvbSAnLi9wdWJTdWIuanMnXG5pbXBvcnQgeyBjb252ZXJ0R2FtZWJvYXJkVG9UcmFja2VyIH0gZnJvbSAnLi91dGlsLmpzJ1xuXG4vKlxuICogUHJpdmF0ZVxuICovXG5cbmxldCBnYW1lU3RhdGVcblxuZnVuY3Rpb24gc3dpdGNoQWN0aXZlUGxheWVyICgpIHtcbiAgZ2FtZVN0YXRlLmFjdGl2ZVBsYXllciA9PT0gMFxuICAgID8gZ2FtZVN0YXRlLmFjdGl2ZVBsYXllciA9IDFcbiAgICA6IGdhbWVTdGF0ZS5hY3RpdmVQbGF5ZXIgPSAwXG59XG5cbmZ1bmN0aW9uIHN3aXRjaEdhbWVib2FyZHMgKCkge1xuICAvLyBTd2FwIGFjdGl2ZSBnYW1lYm9hcmRcbiAgZ2FtZVN0YXRlLmFjdGl2ZVBsYXllckdhbWVib2FyZCA9PT0gMFxuICAgID8gZ2FtZVN0YXRlLmFjdGl2ZVBsYXllckdhbWVib2FyZCA9IDFcbiAgICA6IGdhbWVTdGF0ZS5hY3RpdmVQbGF5ZXJHYW1lYm9hcmQgPSAwXG5cbiAgLy8gU3dhcCBlbmVteSBnYW1lYm9hcmRcbiAgZ2FtZVN0YXRlLmVuZW15UGxheWVyR2FtZWJvYXJkID09PSAxXG4gICAgPyBnYW1lU3RhdGUuZW5lbXlQbGF5ZXJHYW1lYm9hcmQgPSAwXG4gICAgOiBnYW1lU3RhdGUuZW5lbXlQbGF5ZXJHYW1lYm9hcmQgPSAxXG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RHYW1lRGF0YSAoZ2FtZVN0YXRlKSB7XG4gIC8vIEV4dHJhY3QgcGxheWVyIDAncyAoaHVtYW4gcGxheWVyKSBlbmVteUdyaWRUcmFja2VyIGFuZCB0aGVpciBvd24gZ3JpZCB0cmFja2VyXG4gIGNvbnN0IGdhbWVEYXRhID0ge1xuICAgIHBsYXllckdyaWRUcmFja2VyOiBjb252ZXJ0R2FtZWJvYXJkVG9UcmFja2VyKGdhbWVTdGF0ZS5nYW1lYm9hcmRzWzBdKSxcbiAgICBlbmVteUdyaWRUcmFja2VyOiBnYW1lU3RhdGUucGxheWVyc1swXS5lbmVteUdyaWRUcmFja2VyXG4gIH1cblxuICByZXR1cm4gZ2FtZURhdGFcbn1cblxuZnVuY3Rpb24gZW5kICgpIHtcbiAgcHViU3ViLnB1Ymxpc2goJ2dhbWVFbmQnLCBleHRyYWN0R2FtZURhdGEoZ2FtZVN0YXRlKSlcbn1cblxuLypcbiAqIFB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHNldHVwICgpIHtcbiAgLy8gSW5pdGlhbGl6ZSBwbGF5ZXJzIGFuZCBnYW1lYm9hcmRzLlxuICBnYW1lU3RhdGUgPSB7XG4gICAgcGxheWVyczogW1xuICAgICAgUGxheWVyKCdodW1hbicpLFxuICAgICAgUGxheWVyKCdjb21wdXRlcicpXG4gICAgXSxcbiAgICBhY3RpdmVQbGF5ZXI6IDAsXG4gICAgZ2FtZWJvYXJkczogW1xuICAgICAgR2FtZWJvYXJkKCksXG4gICAgICBHYW1lYm9hcmQoKVxuICAgIF0sXG4gICAgYWN0aXZlUGxheWVyR2FtZWJvYXJkOiAwLFxuICAgIGVuZW15UGxheWVyR2FtZWJvYXJkOiAxXG4gIH1cblxuICAvLyBQdWJsaXNoIHRoYXQgc2V0dXAgaGFzIHN0YXJ0ZWRcbiAgcHViU3ViLnB1Ymxpc2goJ3NldHVwU3RhcnQnLCBleHRyYWN0R2FtZURhdGEoZ2FtZVN0YXRlKSlcblxuICAvLyBQb3B1bGF0ZSBib3RoIGdhbWVib2FyZHMgd2l0aCBzaGlwc1xuICAvLyBFVkVOVFVBTExZIFBVVCBBIFJBTkRPTSBTSElQIFBMQUNFTUVOVCBGVU5DVElPTiBJTlRPIEdBTUVCT0FSRCBGQUNUT1JZXG5cbiAgY29uc3QgcDBHYW1lYm9hcmQgPSBnYW1lU3RhdGUuZ2FtZWJvYXJkc1swXVxuICBjb25zdCBwMUdhbWVib2FyZCA9IGdhbWVTdGF0ZS5nYW1lYm9hcmRzWzFdXG5cbiAgLy8gUGxhY2UgcGxheWVyIDAncyBzaGlwc1xuICBwbGFjZVNoaXAocDBHYW1lYm9hcmQsICdCNicsICd2ZXJ0aWNhbCcsIDUpXG4gIHBsYWNlU2hpcChwMEdhbWVib2FyZCwgJ0oyJywgJ3ZlcnRpY2FsJywgNClcbiAgcGxhY2VTaGlwKHAwR2FtZWJvYXJkLCAnQjMnLCAnaG9yaXpvbnRhbCcsIDMpXG4gIHBsYWNlU2hpcChwMEdhbWVib2FyZCwgJ0U4JywgJ3ZlcnRpY2FsJywgMilcbiAgcGxhY2VTaGlwKHAwR2FtZWJvYXJkLCAnRzgnLCAndmVydGljYWwnLCAyKVxuICBwbGFjZVNoaXAocDBHYW1lYm9hcmQsICdGNCcsICd2ZXJ0aWNhbCcsIDEpXG4gIHBsYWNlU2hpcChwMEdhbWVib2FyZCwgJ0oxMCcsICd2ZXJ0aWNhbCcsIDEpXG5cbiAgLy8gUGxhY2UgUGxheWVyIDEncyBzaGlwc1xuICBwbGFjZVNoaXAocDFHYW1lYm9hcmQsICdCNScsICd2ZXJ0aWNhbCcsIDUpXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0cxJywgJ2hvcml6b250YWwnLCA0KVxuICBwbGFjZVNoaXAocDFHYW1lYm9hcmQsICdKNCcsICd2ZXJ0aWNhbCcsIDMpXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0U1JywgJ2hvcml6b250YWwnLCAyKVxuICBwbGFjZVNoaXAocDFHYW1lYm9hcmQsICdHMTAnLCAnaG9yaXpvbnRhbCcsIDIpXG4gIHBsYWNlU2hpcChwMUdhbWVib2FyZCwgJ0EyJywgJ3ZlcnRpY2FsJywgMSlcbiAgcGxhY2VTaGlwKHAxR2FtZWJvYXJkLCAnRDEwJywgJ3ZlcnRpY2FsJywgMSlcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwIChnYW1lYm9hcmQsIGNvb3JkaW5hdGUsIG9yaWVudGF0aW9uLCBsZW5ndGgpIHtcbiAgZ2FtZWJvYXJkLnBsYWNlU2hpcChjb29yZGluYXRlLCBvcmllbnRhdGlvbiwgbGVuZ3RoKVxuICBwdWJTdWIucHVibGlzaCgnc2hpcFBsYWNlZCcsIGV4dHJhY3RHYW1lRGF0YShnYW1lU3RhdGUpKVxufVxuXG5mdW5jdGlvbiBzdGFydCAoKSB7XG4gIC8vIHB1Ymxpc2ggZXZlbnQgdG8gcmVuZGVyIGdhbWUgYm9hcmRzIHNvIHRoZSBnYW1lIGNhbiBzdGFydFxuICBwdWJTdWIucHVibGlzaCgnZ2FtZVN0YXJ0JywgZXh0cmFjdEdhbWVEYXRhKGdhbWVTdGF0ZSkpXG59XG5cbi8vIFBsYXlzIGEgc2luZ2xlIHJvdW5kIG9mIGJhdHRsZXNoaXBcbmZ1bmN0aW9uIHBsYXlSb3VuZCAoY29vcmRpbmF0ZSkge1xuICBjb25zdCBhY3RpdmVQbGF5ZXIgPSBnYW1lU3RhdGUucGxheWVyc1tnYW1lU3RhdGUuYWN0aXZlUGxheWVyXVxuICBjb25zdCBlbmVteUdhbWVib2FyZCA9IGdhbWVTdGF0ZS5nYW1lYm9hcmRzW2dhbWVTdGF0ZS5lbmVteVBsYXllckdhbWVib2FyZF1cblxuICAvLyBBdHRhY2sgdGhlIGVuZW15IGdhbWVib2FyZFxuICBpZiAoYWN0aXZlUGxheWVyLmlzQ29tcHV0ZXIpIHtcbiAgICBhY3RpdmVQbGF5ZXIucmFuZG9tQXR0YWNrKGVuZW15R2FtZWJvYXJkLCBNYXRoLnJhbmRvbSlcbiAgfSBlbHNlIHtcbiAgICBhY3RpdmVQbGF5ZXIuYXR0YWNrKGVuZW15R2FtZWJvYXJkLCBjb29yZGluYXRlKVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSB3aW5uZXIgYWZ0ZXIgYXR0YWNraW5nXG4gIGlmIChlbmVteUdhbWVib2FyZC5hbGxTaGlwc1N1bmsoKSkge1xuICAgIHJldHVybiBlbmQoKVxuICB9XG5cbiAgLy8gU3dpdGNoIGFjdGl2ZSBwbGF5ZXJzIGFuZCBnYW1lYm9hcmRzXG4gIHN3aXRjaEFjdGl2ZVBsYXllcigpXG4gIHN3aXRjaEdhbWVib2FyZHMoKVxuXG4gIC8vIFB1Ymxpc2ggZ2FtZSBzdGF0ZVxuICBwdWJTdWIucHVibGlzaCgncm91bmRQbGF5ZWQnLCBleHRyYWN0R2FtZURhdGEoZ2FtZVN0YXRlKSlcblxuICAvLyBJZiBhIGNvbXB1dGVyIGlzIG5vdyB0aGUgYWN0aXZlIHBsYXllciwgc2NoZWR1bGUgaXRzIG5leHQgcGxheSBhdCBsZWFzdCAxc2VjIGZyb20gbm93XG4gIGlmIChhY3RpdmVQbGF5ZXIuaXNDb21wdXRlcikge1xuICAgIHNldFRpbWVvdXQocGxheVJvdW5kLCAxMDAwKVxuICB9XG59XG5cbmNvbnN0IGdhbWUgPSB7XG4gIHNldHVwLFxuICBwbGFjZVNoaXAsXG4gIHN0YXJ0LFxuICBwbGF5Um91bmRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtZVxuIiwiY29uc3QgcHViU3ViID0ge1xuICBldmVudHM6IHt9LFxuICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW11cbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pXG4gIH0sXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgcHVibGlzaDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIGZuKGRhdGEpXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBwdWJTdWJcbiIsImNvbnN0IGxldHRlck1hcCA9IHtcbiAgQTogMCxcbiAgQjogMSxcbiAgQzogMixcbiAgRDogMyxcbiAgRTogNCxcbiAgRjogNSxcbiAgRzogNixcbiAgSDogNyxcbiAgSTogOCxcbiAgSjogOVxufVxuXG5jb25zdCBpbmRleE1hcCA9IHtcbiAgMDogJ0EnLFxuICAxOiAnQicsXG4gIDI6ICdDJyxcbiAgMzogJ0QnLFxuICA0OiAnRScsXG4gIDU6ICdGJyxcbiAgNjogJ0cnLFxuICA3OiAnSCcsXG4gIDg6ICdJJyxcbiAgOTogJ0onXG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDb29yZGluYXRlc1RvSW5kaWNlcyAoY29vcmRpbmF0ZXMsIGxldHRlck1hcCkge1xuICAvLyBDb252ZXJ0IGNvbHVtbiBjb29yZGluYXRlIGZyb20gbGV0dGVyIHRvIG51bWJlclxuICBjb25zdCBsZXR0ZXJDb2wgPSBjb29yZGluYXRlcy5jaGFyQXQoMClcbiAgY29uc3QgY29sID0gbGV0dGVyTWFwW2xldHRlckNvbF1cblxuICAvLyBEb3duc2hpZnQgcm93IG51bWJlciBieSAxIHNvIHRoYXQgaXMgemVyby1pbmRleGVkIGluc3RlYWQgb2Ygc3RhcnRpbmcgd2l0aCAxXG4gIC8vIGNvbnN0IHJvdyA9IHBhcnNlSW50KGNvb3JkaW5hdGVzLmNoYXJBdCgxKSkgLSAxXG4gIGNvbnN0IHJvdyA9IHBhcnNlSW50KGNvb3JkaW5hdGVzLnNsaWNlKDEpKSAtIDFcblxuICByZXR1cm4geyBjb2wsIHJvdyB9XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRJbmRpY2VzVG9Db29yZGluYXRlcyAoY29sSW5kZXgsIHJvd0luZGV4LCBpbmRleE1hcCkge1xuICAvLyBDb252ZXJ0IGNvbHVtbiBjb29yZGluYXRlIGZyb20gaW5kZXggdG8gbGV0dGVyXG4gIGNvbnN0IGNvbExldHRlciA9IGluZGV4TWFwW2NvbEluZGV4XVxuXG4gIC8vIENvbnZlcnQgcm93IGNvb3JkaW5hdGUgZnJvbSB6ZXJvLWluZGV4ZWQgdG8gb25lLWluZGV4ZWRcbiAgY29uc3Qgcm93ID0gcm93SW5kZXggKyAxXG5cbiAgcmV0dXJuIGNvbExldHRlciArIHJvdy50b1N0cmluZygpXG59XG5cbi8vIFBhcnNlcyBhIGdyaWRTcGFjZVZhbCAoZS5nLiBTMC1QMCwgUzItUDMpIHRvIGV4dHJhY3Qgd2hpY2ggc2hpcCB3YXMgaGl0XG5mdW5jdGlvbiBnZXRIaXRTaGlwTnVtIChncmlkU3BhY2VWYWwpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGdyaWRTcGFjZVZhbC5zcGxpdCgnLScpWzBdLnNsaWNlKDEpKVxufVxuXG4vLyBQYXJzZXMgYSBncmlkU3BhY2VWYWwgdG8gZXh0cmFjdCB3aGljaCBzaGlwIHBvc2l0aW9uIHdhcyBoaXRcbmZ1bmN0aW9uIGdldEhpdFBvc2l0aW9uIChncmlkU3BhY2VWYWwpIHtcbiAgcmV0dXJuIHBhcnNlSW50KGdyaWRTcGFjZVZhbC5zcGxpdCgnLScpWzFdLnNsaWNlKDEpKVxufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgYSBnYW1lYm9hcmQgb2JqZWN0IGFuZCBwYXJzZXMgaXQgdG8gcmV0dXJuIGEgdHJhY2tlciB0aGF0IHNob3dzIHVuaGl0IHNoaXAgcG9zaXRpb25zLCBoaXQgc2hpcCBwb3NpdGlvbnMsIGFuZCBtaXNzZWQgbG9jYXRpb25zXG5mdW5jdGlvbiBjb252ZXJ0R2FtZWJvYXJkVG9UcmFja2VyIChnYW1lYm9hcmQpIHtcbiAgY29uc3QgZ2FtZWJvYXJkR3JpZCA9IGdhbWVib2FyZC5ncmlkXG4gIGNvbnN0IHNoaXBzID0gZ2FtZWJvYXJkLnNoaXBzXG5cbiAgY29uc3QgdHJhY2tlciA9IFtcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxuICAgIFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXG4gICAgWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcbiAgICBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddXG4gIF1cblxuICAvLyBJdGVyYXRlIHRocm91Z2ggZ2FtZWJvYXJkR3JpZCBhbmQgcGFyc2UgdGhpbmdzIGxpa2UgJ21pc3MnIGludG8gJy8nIGFuZCBoaXRzIGludG8gJ1gnLiAnUycgcmVwcmVzZW50cyBhbiB1bmhpdCBzaGlwIHBhcnRcbiAgZ2FtZWJvYXJkR3JpZC5mb3JFYWNoKChjb2wsIGNvbEluZGV4KSA9PiB7XG4gICAgY29sLmZvckVhY2goKGdyaWRTcGFjZVZhbCwgcm93SW5kZXgpID0+IHtcbiAgICAgIGlmIChncmlkU3BhY2VWYWwgPT09ICdtaXNzJykge1xuICAgICAgICAvLyBJZiBncmlkIHNwYWNlIGlzIG1hcmtlZCBhcyBtaXNzLCBtYXJrIGEgJy8nIGluIHRoZSB0cmFja2VyXG4gICAgICAgIHRyYWNrZXJbY29sSW5kZXhdW3Jvd0luZGV4XSA9ICcvJ1xuICAgICAgfSBlbHNlIGlmIChncmlkU3BhY2VWYWwgIT09ICcnKSB7XG4gICAgICAgIC8vIElmIGdyaWQgc3BhY2UgaXMgbm90IGVtcHR5LCBpdCBtdXN0IGNvbnRhaW4gYSBzaGlwXG4gICAgICAgIGNvbnN0IHNoaXBOdW0gPSBnZXRIaXRTaGlwTnVtKGdyaWRTcGFjZVZhbClcbiAgICAgICAgY29uc3Qgc2hpcFBvcyA9IGdldEhpdFBvc2l0aW9uKGdyaWRTcGFjZVZhbClcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2hpcCBoYXMgYmVlbiBoaXQgYXQgdGhlIGdpdmVuIHBvc2l0aW9uXG4gICAgICAgIGlmIChzaGlwc1tzaGlwTnVtXS5oaXRNYXBbc2hpcFBvc10gPT09ICdpbnRhY3QnKSB7XG4gICAgICAgICAgdHJhY2tlcltjb2xJbmRleF1bcm93SW5kZXhdID0gJ1MnXG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcHNbc2hpcE51bV0uaGl0TWFwW3NoaXBQb3NdID09PSAnaGl0Jykge1xuICAgICAgICAgIHRyYWNrZXJbY29sSW5kZXhdW3Jvd0luZGV4XSA9ICdYJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICByZXR1cm4gdHJhY2tlclxufVxuXG5leHBvcnQge1xuICBsZXR0ZXJNYXAsXG4gIGluZGV4TWFwLFxuICBjb252ZXJ0Q29vcmRpbmF0ZXNUb0luZGljZXMsXG4gIGNvbnZlcnRJbmRpY2VzVG9Db29yZGluYXRlcyxcbiAgZ2V0SGl0U2hpcE51bSxcbiAgZ2V0SGl0UG9zaXRpb24sXG4gIGNvbnZlcnRHYW1lYm9hcmRUb1RyYWNrZXJcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWUgZnJvbSAnLi9tb2R1bGVzL2dhbWUuanMnXG5pbXBvcnQgZGlzcGxheUNvbnRyb2xsZXIgZnJvbSAnLi9tb2R1bGVzL2Rpc3BsYXlDb250cm9sbGVyLmpzJ1xuXG5kaXNwbGF5Q29udHJvbGxlci5pbml0KClcbmdhbWUuc2V0dXAoKVxuZ2FtZS5zdGFydCgpXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=