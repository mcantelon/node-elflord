#!/usr/bin/env node

var express = require('express')
  , er = require('express-resource')
  , app = express.createServer()
  , dirty = require('dirty')
  , db = require('dirty')('t.db')
  , controllerDir = '../lib/server/controllers';

db.on('load', function() {
  app.use(express.bodyParser());

  app.resource('tasks', require(controllerDir + '/tasks')(db));
  app.resource('categories', require(controllerDir + '/categories')(db));

  app.listen(8000);
});
