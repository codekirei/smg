'use strict'

const m = require('mithril')
const mnr = require('mithril-node-render')

const render = module.exports = (data, els) =>
  [ '<!DOCTYPE html>'
  , mnr(m('html', {lang: 'en-us'}, els.map(el => el(data))))
  ].join('')
