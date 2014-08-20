pack = require('./ampersandjs.com/package.json')
renderJade = require('./ampersandjs.com/lib/render-jade')
getModules = require('./ampersandjs.com/lib/get-modules')
sqlite3 = require('sqlite3')
fs = require('fs-extra')

DOCSET_BASE = "#{__dirname}/ampersandjs.docset"
DOCSET_RES_DIR = "#{DOCSET_BASE}/Contents/Resources"
DOCSET_DOC_DIR = "#{DOCSET_RES_DIR}/Documents"

fs.copy("#{__dirname}/ampersandjs.com/public/css/main.css", "#{DOCSET_DOC_DIR}/main.css")
fs.copy("#{__dirname}/ampersandjs.com/public/css/normalize.min.css", "#{DOCSET_DOC_DIR}/normalize.min.css")

db = new sqlite3.Database("#{DOCSET_RES_DIR}/docSet.dsidx")

db.on 'open', (err) ->
  if err?
    console.log err
  else
    db.exec 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT); CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);', (err) ->
      if err?
        console.log err
      else
        processModules()

processModules = ->
  getModules pack.coreModules, (err, modules) ->
    renderJade("#{__dirname}/index.jade", {modules: modules}, "#{DOCSET_DOC_DIR}/index.html")

    queryString = ''
    for own module of modules
      queryString = "#{queryString} INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('#{module}', 'Module', '##{module}');"

    db.exec queryString, (err) ->
      console.log(err) if err?