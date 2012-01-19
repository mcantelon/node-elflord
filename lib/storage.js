exports.getTasksInCategory = function(db, category) {
  var tasks = db.get('tasks')
    , categoryTasks = [];

  for(var index in tasks) {
    var task = tasks[index];
    if (task.category == category) {
      categoryTasks.push(task);
    }
  }

  return categoryTasks;
}

exports.categoryTaskCount = function(db) {
  var tasks = db.get('tasks')
    , categories = {};

  for(var index in tasks) {
    var task = tasks[index];
    categories[task.category] = (categories[task.category])
      ? categories[task.category] + 1
      : 1;
  }

  return categories;
}

exports.addTask = function(db, task, cb) {
  var tasks = db.get('tasks')
    , id = db.get('id');

  tasks = (tasks == undefined) ? [] : tasks;
  id = (id == undefined) ? 1 : id + 1;

  newTask = {
    'id':          id,
    'category':    (task.category == undefined) ? '' : task.category,
    'description': (task.description == undefined) ? '' : task.description,
    'priority':    (task.priority == undefined) ? 3 : task.priority
  };

  tasks.push(newTask);

  db.set('id', id, function() {
    db.set('tasks', tasks, function() {
      cb(newTask);
    });
  });
}

exports.updateTask = function(db, id, properties, cb) {
  var tasks = db.get('tasks')
    , tasksUpdated = []
    , updatedCount = 0;

  for(var index in tasks) {
    if (tasks[index].id == id) {
      for(var key in properties) {
        tasks[index][key] = properties[key];
      }
      updatedCount++;
    }
    tasksUpdated.push(tasks[index]);
  }

  db.set('tasks', tasksUpdated, cb(updatedCount));
}

exports.deleteTask = function(db, id, cb) {
  var tasks = db.get('tasks')
    , tasksUpdated = []
    , deletedCount = 0;

  for(var index in tasks) {
    if (tasks[index].id != id) {
      tasksUpdated.push(tasks[index]);
    } else {
      deletedCount++;
    }
  }

  db.set('tasks', tasksUpdated, cb(deletedCount));
}
