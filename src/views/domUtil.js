// domUtil module - contains functions to simplify DOM node manipulation and creation
const domUtil = (function () {
  // _addId function - adds id to a specified element
  function _addId (elem, id) {
    elem.id = id
    return elem
  }

  // _addClass - adds specified classes to an element
  function _addClass (elem, classes) {
    if (typeof classes === 'string') {
      elem.classList.add(classes)
    } else {
      classes.forEach(className => {
        elem.classList.add(className)
      })
    }
    return elem
  }

  // _addAttribute - adds specified attributes to an element
  function _addAttribute (elem, attributes) {
    for (const key in attributes) {
      elem.setAttribute(key, attributes[key])
    }
    return elem
  }

  /* create method - creates an element with specified tag, given text, and supplied options
    options paremter is of the form:
    {
        id: String,
        class: String | [String]
        attributes: {
            attribute1: String,
            attribute2: String
        }
    }
    */
  function create (tag, text, options) {
    const elem = document.createElement(tag)
    elem.textContent = text

    // return the element if no options were specified
    if (options === undefined || Object.keys(options).length === 0) {
      return elem
    }

    // Add specified id
    if (options.id) {
      _addId(elem, options.id)
    }

    // Add specified class
    if (options.class) {
      _addClass(elem, options.class)
    }

    // Add specified attributes
    if (options.attributes !== undefined && Object.keys(options.attributes).length !== 0) {
      _addAttribute(elem, options.attributes)
    }

    return elem
  }

  // appendChildren method - appends an array of children to the parent node in the provided order
  function appendChildren (parent, children) {
    children.forEach(child => {
      parent.appendChild(child)
    })
    return parent
  }

  // removeContent method - empties the content of the provided element
  function removeContent (elem) {
    elem.textContent = ''
    return elem
  }

  // Clear
  return {
    create,
    appendChildren,
    removeContent
  }
})()

export default domUtil
