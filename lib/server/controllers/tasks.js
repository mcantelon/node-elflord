var helpers = require('../../helpers')
  , db
  , password;

module.exports = function(options) {
  db = options.db;
  password = options.password;
  return exports;
}

exports.index = function(req, res) {
  res.send(JSON.stringify(db.get('tasks')), 200);
}

exports.create = function(req, res) {
  helpers.send401ifWrongPassword(
    res,
    req.body.password,
    password,
    function() {
      helpers.addTask(db, req.body, function(task) {
        res.json(task, 200);
      });
    }
  );
  /*
  if (password == '' || req.body.password == password) {
    helpers.addTask(db, req.body, function(task) {
      res.json(task, 200);
    });
  } else {
    res.json({}, 401);
  }
  */
}

exports.update = function(req, res) {
  if (req.params.task == parseInt(req.params.task, 10)) {
    helpers.updateTask(db, req.params.task, req.body, function(updatedCount) {
      var status = (updatedCount) ? 200 : 404;
      res.json({'updated': updatedCount}, status);
    });
  } else {
    res.json({'updated': updatedCount}, 400);
  }
}

exports.destroy = function(req, res) {
  if (req.params.task == parseInt(req.params.task, 10)) {
    helpers.deleteTask(db, req.params.task, function(deleted) {
      var status = (deleted) ? 200 : 404;
      res.json({'deleted': deleted}, status);
    });
  } else {
    res.json({'deleted': 0}, 400);
  }
}
