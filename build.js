// Generated by CoffeeScript 1.7.1
(function() {
  var DOCSET_BASE, DOCSET_DOC_DIR, DOCSET_RES_DIR, db, fs, getModules, pack, processModules, renderJade, sqlite3,
    __hasProp = {}.hasOwnProperty;

  pack = require('./ampersandjs.com/package.json');

  renderJade = require('./ampersandjs.com/lib/render-jade');

  getModules = require('./ampersandjs.com/lib/get-modules');

  sqlite3 = require('sqlite3');

  fs = require('fs-extra');

  DOCSET_BASE = "" + __dirname + "/ampersandjs.docset";

  DOCSET_RES_DIR = "" + DOCSET_BASE + "/Contents/Resources";

  DOCSET_DOC_DIR = "" + DOCSET_RES_DIR + "/Documents";

  fs.copy("" + __dirname + "/ampersandjs.com/public/css/main.css", "" + DOCSET_DOC_DIR + "/main.css");

  fs.copy("" + __dirname + "/ampersandjs.com/public/css/normalize.min.css", "" + DOCSET_DOC_DIR + "/normalize.min.css");

  db = new sqlite3.Database("" + DOCSET_RES_DIR + "/docSet.dsidx");

  db.on('open', function(err) {
    if (err != null) {
      return console.log(err);
    } else {
      return db.exec('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT); CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);', function(err) {
        if (err != null) {
          return console.log(err);
        } else {
          return processModules();
        }
      });
    }
  });

  processModules = function() {
    return getModules(pack.coreModules, function(err, modules) {
      var module, queryString;
      renderJade("" + __dirname + "/index.jade", {
        modules: modules
      }, "" + DOCSET_DOC_DIR + "/index.html");
      queryString = '';
      for (module in modules) {
        if (!__hasProp.call(modules, module)) continue;
        queryString = "" + queryString + " INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('" + module + "', 'Module', 'index.html#" + module + "');";
      }
      return db.exec(queryString, function(err) {
        if (err != null) {
          return console.log(err);
        }
      });
    });
  };

}).call(this);
