var storage = require('../../storage')
  , auth
  , db
  , password;

// use options to set up this module and the auth module
module.exports = function(options) {
  db = options.db;
  password = options.password;
  auth = require('../../auth')(password);
  return exports;
}

exports.index = function(req, res) {
  auth.handleAuthorization(res, req.query.password, function() {
    res.json(db.get('tasks'), 200);
  });
}

exports.create = function(req, res) {
  auth.handleAuthorization(res, req.body.password, function() {
    storage.addTask(db, req.body, function(task) {
      res.json(task, 200);
    });
  });
}

exports.update = function(req, res) {
  if (req.params.task == parseInt(req.params.task, 10)) {
    auth.handleAuthorization(res, req.body.password, function() {
      storage.updateTask(db, req.params.task, req.body, function(updatedCount) {
        var status = (updatedCount) ? 200 : 404;
        res.json({'updated': updatedCount}, status);
      });
    });
  } else {
    res.json({}, 400);
  }
}

exports.destroy = function(req, res) {
  if (req.params.task == parseInt(req.params.task, 10)) {
    auth.handleAuthorization(res, req.body.password, function() {
      storage.deleteTask(db, req.params.task, function(deleted) {
        var status = (deleted) ? 200 : 404;
        res.json({'deleted': deleted}, status);
      });
    });
  } else {
    res.json({'deleted': 0}, 400);
  }
}
