'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const m = require('mithril')

// local
const render = require('./utils/render')
const head = require('./modules/head')
const body = require('./modules/body')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
const content = data =>
  m('section'
    , { class: 'content' }
    , data.content
  )

const page = data => render(data,
  [ head
  , body(content)
  ]
)

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports = page
