exports.displayTasks = function(tasks) {
  for (var index in tasks) {
    console.log(tasks[index].description);
  }
}

// TODO: need error handling for when task doesn't have a description
exports.addTask = function(task, cb) {
  var tasks = db.get('tasks')
    , id = db.get('id');

  tasks = (tasks == undefined) ? [] : tasks;
  id = (id == undefined) ? 1 : id + 1;

  var category = (task.category == undefined) ? '' : task.category;
  var priority = (task.priority == undefined) ? 0 : task.priority;

  tasks.push({
    'id':          id,
    'category':    category,
    'description': task.description,
    'priority':    priority
  });

  db.set('id', id, function() {
    db.set('tasks', tasks, function() {
      cb(task);
    });
  });
}
