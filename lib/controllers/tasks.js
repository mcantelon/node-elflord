var helpers = require('../helpers')
  , db;

module.exports = function(activeDb) {
  db = activeDb;
  return exports;
}

exports.index = function(req, res) {
  res.send(JSON.stringify(db.get('tasks')), 200);
}

exports.create = function(req, res) {
  helpers.addTask(db, req.body, function(task) {
    res.json(task, 200);
  });
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
  var status;

  if (req.params.task == parseInt(req.params.task, 10)) {
    var tasks = db.get('tasks')
      , tasksUpdated = []
      , deleted = 0;

    for(var index in tasks) {
      if (tasks[index].id != req.params.task) {
        tasksUpdated.push(tasks[index]);
      } else {
        deleted++;
      }
    }

    db.set('tasks', tasksUpdated);

    status = (deleted) ? 200 : 404;
  } else {
    status = 400;
  }

  res.json({'deleted': deleted}, status);
}
