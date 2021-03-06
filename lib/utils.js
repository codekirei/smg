'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const p = require('path')

// npm
const fs = require('fs-extra')
const globby = require('globby')
const P = require('bluebird')

//----------------------------------------------------------
// objects and arrays
//----------------------------------------------------------
/**
  Convert a pair of arrays into a 2D array of pairs.

  @param {Array} a - first array
  @param {Array} b - second array
  @returns {Array} 2D array
  @example
  var foo = ['a', 'b', 'c']
  var bar = [1, 2, 3]
  arsTo2DAr(foo, bar)
    // => [['a', 1], ['b', 2], ['c', 3]]
 */
const arsTo2DAr = (a, b) => a.map((_a, i) => [_a, b[i]])

/**
  Convert an array of paired values into an object.

  @param {Array} ar - array of paired values
  @returns {Object} object with k:v pair
  @example
  var ar = ['foo', 1]
  airToOb(ar)
    // => {foo: 1}
 */
const arToOb = ar => {const ob = {}; ob[ar[0]] = ar[1]; return ob}

/**
  Create a flat object with Array.prototype.reduce().

  @param {Object} prev - previous object
  @param {Object} cur - current object
  @returns {Object} combined flat object
  @example
  var obs = [{foo: 1}, {bar: 2}]
  obs.reduce(flatOb)
    // => {foo: 1, bar: 2}
 */
const flatOb = (prev, cur) => Object.assign(prev, cur)

/**
  Flatten an array of arrays.

  @param {Array} ars - an array of arrays
  @returns {Array} a flat array
  @example
  var foo = [1, 2, 3]
  var bar = [4, 5, 6]
  flatAr([foo, bar])
    // => [1, 2, 3, 4, 5, 6]
 */
const flatAr = ars => ars.reduce((a, b) => a.concat(b), [])

//----------------------------------------------------------
// io
//----------------------------------------------------------
/**
  Promisifed, curried fs.readFile.

  @param {String} path - path to read
  @returns {String} contents of file at path
 */
const read = path => P.promisify(fs.readFile)(path, 'utf8')

/**
  Generator fn to read files that match glob.

  @param {String|String[]} glob - file glob(s) to match
  @returns {String[]} contents of files
 */
function* readContent(glob) {
  const paths = yield globby(glob)
  return yield paths.map(read)
}

/**
  Generator fn to read files that match glob and retain paths.

  @param {String|String[]} glob - file glob(s) to match
  @returns {Array[]} 2D array with path and file content pairs
 */
function* readTemplates(glob) {
  const paths = yield globby(glob)
  const names = paths.map(path => p.basename(path, '.js'))
  const reqs = paths.map(path => require(p.join(
    process.cwd(),
    path.substring(0, path.indexOf(p.extname(path)))
  )))
  return arsTo2DAr(names, reqs)
}

/**
  Promisified fs.outputFile fn.

  @param {String} path - path to write to
  @param {String} data - data to write
  @returns {undefined}
 */
const write = (path, data) => P.promisify(fs.outputFile)(path, data)

/**
  Iterative write fn that reads 2D array for params.

  @param {Array[]} ar - 2D array with [path, data] subarrays
  @returns {undefined}
 */
const write2D = ar => ar.map(_ar => write(_ar[0], _ar[1]))

//----------------------------------------------------------
// other
//----------------------------------------------------------
/**
  Handle errors.

  @param {Object} err - error object
  @throws
 */
const errHandler = err => {console.log(err.stack); throw new Error(err)}

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { arsTo2DAr
  , arToOb
  , errHandler
  , flatAr
  , flatOb
  , read
  , readContent
  , readTemplates
  , write
  , write2D
  }
