'use strict'

const Smg = require('../')

const url = 'bobloblawlawblog.com'
const cfg =
  { needPosts: ['index']
  , nav:
    [ { text: 'Home'
      , link: '/'
      }
    , { text: 'About'
      , link: '/about'
      }
    ]
  , defaultAuthor:
    { name: 'Bob Loblaw'
    , link: `${url}/bob`
    , email: `bob@${url}`
    }
  , hostname: `http://${url}`
  , defaultTemplate: 'page'
  , paths:
    { dist: './dist'
    , pages: './src/markup/content/*.md'
    , posts: './src/markup/content/posts/*.md'
    , templates: './src/markup/templates/*.js'
    }
  }

new Smg(cfg)
