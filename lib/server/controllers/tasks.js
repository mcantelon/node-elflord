var helpers = require('../../helpers')
  , db
  , password;

module.exports = function(options) {
  db = options.db;
  password = options.password;
  return exports;
}

exports.handleAuthorization = function(res, submittedPassword, cb) {
  helpers.send401ifWrongPassword(
    res,
    submittedPassword,
    password,
    cb
  );
}

exports.index = function(req, res) {
  res.send(JSON.stringify(db.get('tasks')), 200);
}

exports.create = function(req, res) {
  exports.handleAuthorization(res, req.body.password, function() {
    helpers.addTask(db, req.body, function(task) {
      res.json(task, 200);
    });
  });
}

exports.update = function(req, res) {
  if (req.params.task == parseInt(req.params.task, 10)) {
    exports.handleAuthorization(res, req.body.password, function() {
      helpers.updateTask(db, req.params.task, req.body, function(updatedCount) {
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
    exports.handleAuthorization(res, req.body.password, function() {
      helpers.deleteTask(db, req.params.task, function(deleted) {
        var status = (deleted) ? 200 : 404;
        res.json({'deleted': deleted}, status);
      });
    });
  } else {
    res.json({'deleted': 0}, 400);
  }
}
