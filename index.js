'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const p = require('path')

// npm
const P = require('bluebird')
const co = require('co')
const fm = require('yaml-fm')
const merge = require('lodash.merge')

// local
const defaults = require('./lib/defaults')
const u = require('./lib/utils')
const x = require('./lib/transforms')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
module.exports = class Smg {
  constructor(custom) {
    const opts = merge({}, defaults, custom)
    Object.keys(opts).map(k => this[k] = opts[k])
    return co(() => this.main()).catch(u.errHandler)
  }

  /**
    Main logic loop:
      - call methods (pages/posts/templates)
      - render content
      - write output

    @returns {String[]} array of all paths written to
   */
  * main() {
    const pages = yield this.pages(this.paths.pages)
    const posts = yield this.posts(this.paths.posts)

    const content = u.flatAr([pages, posts])
    const injectedContent = x.injectPostData(this.needPosts, content, posts)

    const templates = yield this.templates(this.paths.templates)
    const html = x.render(injectedContent, templates)

    yield u.write2D(html)

    return html.map(_ => _[0])
  }

  /**
    Read and parse page content.

    @param {String|String[]} glob - glob of paths to page content
    @returns {Object[]} array of page data objects
   */
  * pages(glob) {
    return P.resolve(yield u.readContent(glob))
      .map(fm(this.delims.yaml))
      .map(x.splitPreview(this.delims.preview))
      .map(x.markdown)
      .map(x.addNav(this.nav))
      .map(x.addAuthor(this.defaultAuthor))
      .map(x.defaultTemplate(this.defaultTemplate))
      .map(x.addCanonical(this.hostname))
      .map(x.addPath(this.paths.dist))
  }

  /**
    Read and parse post content.

    @param {String|String[]} glob - glob of paths to post content
    @returns {Object[]} array of post data objects
   */
  * posts(glob) {
    return P.resolve(yield this.pages(glob))
      .map(x.ert(this.wpm))
      .map(x.addDateOb)
      .map(x.addDate)
      .map(x.addDateNum)
      .then(_ => _.sort(x.byReverseDate))
  }

  /**
    Read templates.

    @param {String|String[]} glob - glob of paths to templates
    @returns {Object} templates: {foo: renderFn, bar: renderFn}
   */
  * templates(glob) {
    return P.resolve(yield u.readTemplates(glob))
      .map(u.arToOb)
      .reduce(u.flatOb)
  }
}
