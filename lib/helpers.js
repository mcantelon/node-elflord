exports.displayTasks = function(tasks) {
  for (var index in tasks) {
    console.log(tasks[index].description);
  }
}

// TODO: need error handling for when task doesn't have a description
exports.addTask = function(db, task, cb) {
  var tasks = db.get('tasks')
    , id = db.get('id');

  tasks = (tasks == undefined) ? [] : tasks;
  id = (id == undefined) ? 1 : id + 1;

  var category = (task.category == undefined) ? '' : task.category;
  var priority = (task.priority == undefined) ? 0 : task.priority;

  newTask = {
    'id':          id,
    'category':    category,
    'description': task.description,
    'priority':    priority
  };

  tasks.push(newTask);

  db.set('id', id, function() {
    db.set('tasks', tasks, function() {
      cb(newTask);
    });
  });
}
