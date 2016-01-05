'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
const Smg = require('../')
const gulp = require('gulp')
const del = require('del')

//----------------------------------------------------------
// config
//----------------------------------------------------------
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

//----------------------------------------------------------
// tasks
//----------------------------------------------------------
const smg = () => new Smg(cfg)
const watch = () => gulp.watch('src/**/*.{js,md}', ['smg'])
const clean = () => del([cfg.paths.dist])

gulp.task('smg', smg)
gulp.task('watch', ['smg'], watch)
gulp.task('clean', clean)
