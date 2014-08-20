fs = require('fs')

DOCSET_BASE = "#{__dirname}/ampersandjs.docset"
DOCSET_RES_DIR = "#{DOCSET_BASE}/Contents/Resources"
DOCSET_DOC_DIR = "#{DOCSET_RES_DIR}/Documents"

targets = [
  "#{DOCSET_RES_DIR}/docSet.dsidx",
  "#{DOCSET_DOC_DIR}/index.html",
  "#{DOCSET_DOC_DIR}/main.css",
  "#{DOCSET_DOC_DIR}/normalize.min.css"
]

fs.unlink(target, ->) for target in targets