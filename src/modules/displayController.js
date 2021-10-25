import pubSub from './pubSub'

function render (data) {
  console.log(data)
}

function init () {
  pubSub.subscribe('shipPlaced', render)
}

const displayController = {
  init
}

export default displayController
