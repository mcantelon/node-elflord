exports.displayTasks = function(tasks) {
  for (var index in tasks) {
    console.log(tasks[index].description);
  }
}

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
