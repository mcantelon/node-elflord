#!/usr/bin/env node

var express = require('express')
  , er = require('express-resource')
  , app = express.createServer()
  , dirty = require('dirty')
  , db = require('dirty')('t.db')
  , controllerDir = '../lib/server/controllers'
  , controllerOptions = {db: db, password: 'aaa'};

db.on('load', function() {
  app.use(express.bodyParser());

  app.resource('tasks', require(controllerDir + '/tasks')(controllerOptions));
  app.resource('categories', require(controllerDir + '/categories')(controllerOptions));

  app.listen(8000);
});
