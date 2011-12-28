var db;

module.exports = function(activeDb) {
  db = activeDb;
  return exports;
}

exports.index = function(req, res) {
  res.send(JSON.stringify(db.get('tasks')), 200);
}

exports.create = function(req, res) {
  helpers.createTask(req.body, function(task) {
    res.json({'id': id}, 200);
  });
}

exports.update = function(req, res) {
  var status;

  if (req.params.task == parseInt(req.params.task, 10)) {
    var post = req.body
      , tasks = db.get('tasks')
      , tasksUpdated = []
      , updatedCount = 0;

    for(var index in tasks) {
      if (tasks[index].id == req.params.task) {
        for(var key in post) {
          tasks[index][key] = post[key];
        }
        updatedCount++;
      }
      tasksUpdated.push(tasks[index]);
    }

    db.set('tasks', tasksUpdated);

    status = (tasksUpdated) ? 200 : 404;
  } else {
    status = 400;
  }

  res.json({'updated': updatedCount}, status);
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
