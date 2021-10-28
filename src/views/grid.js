import domUtil from './domUtil.js'

/*
 * Private
 */

function createLabelSpace (labelText) {
  return (domUtil.create('div', labelText, {
    class: ['label', 'space']
  })
  )
}

function createShipSpace (coordinate) {
  return (domUtil.create('div', '', {
    class: ['ship', 'space'],
    attributes: {
      'data-coordinate': coordinate
    }
  })
  )
}

function createHitShipSpace (coordinate) {
  return (domUtil.create('div', '', {
    class: ['hit-ship', 'space'],
    attributes: {
      'data-coordinate': coordinate
    }
  })
  )
}

function createEmptySpace (coordinate) {
  return (domUtil.create('div', '', {
    class: ['empty', 'space'],
    attributes: {
      'data-coordinate': coordinate
    }
  })
  )
}

function createMissSpace (coordinate) {
  return (domUtil.create('div', '', {
    class: ['miss', 'space'],
    attributes: {
      'data-coordinate': coordinate
    }
  })
  )
}

function createRowLabels () {
  const labels = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

  // Parent
  const colDiv = domUtil.create('div', '', {
    class: 'col'
  })

  // Children
  const children = labels.map(labelText => createLabelSpace(labelText))

  // Append children to parent
  domUtil.appendChildren(colDiv, children)

  return colDiv
}

function createGridColumns (playerGridTracker) {
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  const columns = colLabels.map((label, colIndex) => {
    const colElements = playerGridTracker[colIndex].map((gridSpaceVal, rowIndex) => {
      const coordinate = label + (rowIndex + 1)
      if (gridSpaceVal === '') {
        return createEmptySpace(coordinate)
      } else if (gridSpaceVal === 'S') {
        return createShipSpace(coordinate)
      } else if (gridSpaceVal === '/') {
        return createMissSpace(coordinate)
      } else {
        return createHitShipSpace(coordinate)
      }
    })

    // Parent
    const colDiv = domUtil.create('div', '', {
      class: 'col'
    })

    // Children
    const labelSpace = createLabelSpace(label)
    const children = [labelSpace, ...colElements]

    // Append children to parent
    domUtil.appendChildren(colDiv, children)

    return colDiv
  })

  return columns
}

/*
 * Public
 */

function createPlayerGrid (playerGridTracker, gridType) {
  // Parent
  const playerGridDiv = domUtil.create('div', '', {
    class: [gridType, 'grid']
  })

  // Children
  const rowLabels = createRowLabels()
  const gridColumns = createGridColumns(playerGridTracker)
  const children = [rowLabels, ...gridColumns]

  // Append children to parent
  domUtil.appendChildren(playerGridDiv, children)

  return playerGridDiv
}

export { createPlayerGrid }
