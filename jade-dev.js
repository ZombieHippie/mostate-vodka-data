#!/usr/bin/env node

"use strict";

const fs = require('fs')
  , http = require('http')
  , moment = require('moment')
  , jade = require('pug')
  , nstatic = require('node-static')
  , pathUtil =require('path')
  , jadeRe = /\.jade$/
  , path = process.argv.slice(2)[0]
  , port = parseInt(process.argv.slice(2)[1]) || 8080
  , fileServer = new nstatic.Server(path || '.')

if (path)
  process.chdir(pathUtil.resolve(path));

const dirTemplate = `
pre
  if pathname.length
    a(href="../") ..
  br
each file in results
  a(href=pathname+"\/"+file)=file
  br
`

// Serve File Directory
fileServer.serveDir = function (pathname, req, res, finish) {
  fs.readdir(pathname, function(err, results) {
    res.writeHead(200, {'Content-Type': 'text/html'})

    let dirHtml
    try {
      dirHtml = jade.render(dirTemplate, {
          results: results,
          pathname: req.url.length === 1 ? '' : req.url
        })
    } catch (parseError) {
      let escapedParseError = parseError.replace(/</g, '&lt;')
      dirHtml = '<pre>' + escapedParseError + '</pre>'
    }
    res.end(dirHtml)
    finish(200, {})
  })
}

const LocalVariables = require('./local-variables')

http.createServer(function (req, res) {
  if (req.url.match(jadeRe)) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    LocalVariables.create((error, properties) => {
      let localVariables = Object.assign(
        { filename: '.' + req.url.replace(jadeRe, '')
        , moment: moment
        , error: error
        , pretty: true }
      , properties )
      
      try {
        res.end(jade.renderFile('.' + req.url, localVariables))
      } catch (parseError) {
        res.end('<pre>' + parseError + '</pre>')
      }
    })
  } else {
    req.addListener('end', function () {
      fileServer.serve(req, res)
    }).resume()
  }
}).listen(port)
