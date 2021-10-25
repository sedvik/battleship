import game from './modules/game.js'
import displayController from './modules/displayController.js'
import './css/reset.css'
import './css/style.css'

displayController.init()
game.setup()
game.start()
