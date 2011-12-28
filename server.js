var express = require('express')
  , er = require('express-resource')
  , app = express.createServer()
  , dirty = require('dirty')
  , db = require('dirty')('t.db');

db.on('load', function() {
  app.use(express.bodyParser());

  app.resource('tasks', require('./lib/controllers/tasks')(db));
  app.resource('categories', require('./lib/controllers/categories')(db));

  app.listen(8000);
});
