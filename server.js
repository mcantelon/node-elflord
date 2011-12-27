var express = require('express')
  , er = require('express-resource')
  , app = express.createServer();

app.use(express.bodyParser());

app.resource('tasks', require('./lib/controllers/tasks'));
app.resource('categories', require('./lib/controllers/categories'));

app.listen(8000);
