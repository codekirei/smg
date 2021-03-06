'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const p = require('path')

// npm
const mdi = require('markdown-it')({html: true})
  .use(require('markdown-it-highlightjs'))

//----------------------------------------------------------
// transformers
//----------------------------------------------------------
/**
  Set default template for data objects that have no template specified.

  @param {String} template - default template
  @returns {Function} curried function that mutates data object
 */
const defaultTemplate = template => ob =>
  ob.template ? ob : Object.assign(ob, {template})

/**
  Inject post data into content that will use a template requiring post data.

  @param {String[]} need - templates that require post data
  @param {Object[]} content - content data objects
  @param {Object[]} posts - post data objects
  @returns {Object[]} content data objects with post data conditionally injected
 */
const injectPostData = (need, content, posts) =>
  content.map(ob =>
    need.indexOf(ob.template) > -1
      ? Object.assign({}, ob, {posts})
      : ob
  )

/**
  Render markdown to html with markdown-it.

  @param {Object} data - object with markdown to render
  @returns {Object} object with markdown rendered to html
  */
const markdown = data => {
  ['preview', 'content'].map(k => {
    if (data[k]) data[k] = mdi.render(data[k]).trim()
  })
  return data
}

/**
  Calculate the estimated reading time of a string.

  @param {String} str - string
  @param {Number} wpm - average word per minute to use in calculation
  @returns {Number} estimated reading time in minutes
 */
const ertCalc = (str, wpm) => Math.ceil(str.split(' ').length / wpm)

/**
  Curried fn to calculate the reading time of obj.content.

  @param {Number} wpm - average word per minute to use in calculation
  @returns {Function} fn that accepts an object and returns a mutated object
 */
const ert = wpm => obj => Object.assign(obj, {ert: ertCalc(obj.content, wpm)})

/**
  Make canonical link from hostname and slug.

  @param {String} host - hostname (e.g. http://example.com)
  @param {String} slug - slug (e.g. about)
  @returns {String} canonical link
 */
const makeCanonical = (host, slug) => slug === '/'
  ? host
  : `${host}${slug}`

/**
  Attach generated canonical link to Object.canonical.

  @param {String} host - hostname
  @returns {Function} pure curriend function that returns object
 */
const addCanonical = host => ob =>
  Object.assign({}, ob, {canonical: makeCanonical(host, ob.slug)})

// TODO jsdoc
const addDateOb = ob => Object.assign({}, ob, {dateOb: new Date(ob.posted)})

// TODO jsdoc
const parseDate = d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

// TODO jsdoc
const addDate = ob => Object.assign({}, ob, {date: parseDate(ob.dateOb)})

// TODO jsdoc
const addDateNum = ob => Object.assign(ob, {dateNum: ob.dateOb.valueOf()})

// TODO jsdoc
const byReverseDate = (a, b) => b.dateNum - a.dateNum

/**
  Attach generated path to Object.path.

  @param {String} dist - base dist dir to write to
  @returns {Function} curried function that mutates data object
 */
const addPath = dist => ob =>
  Object.assign(ob, {path: p.join(dist, ob.slug, 'index.html')})

/**
  Assign split string to object.preview and object.content.

  @param {String[]} strs - array of two strings
  @param {Object} ob - object to mutate
  @returns {Object} mutated object
 */
const assignSplits = (strs, ob) => Object.assign(ob
  , {preview: strs[0]}
  , {content: strs[1]}
)

/**
  Split object.content by preview delimiter.

  @param {String} delim - delimiter to split around
  @returns {Function} curried fn that mutates object with assignSplits if delim
    is found
 */
const splitPreview = delim => ob => {
  const content = ob.content.toString()
  return content.includes(delim)
    ? assignSplits(content.split(delim), ob)
    : Object.assign(ob, {content})
}

/**
  Add author data to objects with unspecified author.

  @param {Object} author - default author
  @returns {Function} pure curried function that returns object
 */
const addAuthor = author => ob =>
  ob.author ? ob : Object.assign({}, ob, {author})

/**
  Add nav data to object.

  @param {Object} nav - links to include in site nav; each link must be an
    object with `text` and `link` entries
  @returns {Function} pure curried function that returns object
 */
const addNav = nav => ob => Object.assign({}, ob, {nav})

/**
  Render all content with templates.

  @param {Object[]} content - ar of data objects
  @param {Object} templates - templates to render with
  @returns {Array[]} 2D array of pairs with the following values:
    value 1: path to write to
    value 2: rendered HTML
 */
const render = (content, templates) =>
  content.map(data => [data.path, templates[data.template](data)])

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { addAuthor
  , addCanonical
  , addDate
  , addDateOb
  , addDateNum
  , addNav
  , addPath
  , assignSplits
  , byReverseDate
  , defaultTemplate
  , ert
  , ertCalc
  , injectPostData
  , makeCanonical
  , markdown
  , parseDate
  , render
  , splitPreview
  }
