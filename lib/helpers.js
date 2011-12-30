exports.displayTasks = function(tasks, options) {
  var task
    , categoryAndPriority
    , categoryData = {};

  options = (options == undefined) ? {} : options;

  for (var index in tasks) {
    task = tasks[index];
    if (options.groupByCategory) {
      categoryAndPriority = (task.priority != 0)
        ? '[' + task.priority + ']'
        : '';
    } else {
      if (task.category != '' || task.priority != 0) {
        categoryAndPriority = '[' + task.category;
        categoryAndPriority +=
          (task.category != '' && task.priority != 0) ? ', ' : '';
        categoryAndPriority += (task.priority != 0) ? task.priority : '';
        categoryAndPriority += ']';
      } else {
        categoryAndPriority = '';
      }
    }
    if (options.groupByCategory) {
      categoryData[task.category] = (categoryData[task.category] == undefined)
        ? []
        : categoryData[task.category];
      categoryData[task.category].push({
        task: task,
        categoryAndPriority: categoryAndPriority
      });
    } else {
      exports.displayTask({
        task: task,
        categoryAndPriority: categoryAndPriority
      });
    }
  }

  if (options.groupByCategory) {
    exports.displayTasksByCategory(categoryData);
  }
}

exports.displayTask = function(taskData, prefix) {
  prefix = (prefix == undefined) ? '' : prefix;
  console.log(
    '%s%d) %s %s',
    prefix,
    taskData.task.id,
    taskData.task.description,
    taskData.categoryAndPriority
  );
}

exports.displayTasksByCategory = function(categoryData) {
  var sortedCategories = Object.keys(categoryData).sort()
    , category
    , taskAndPriority
    , priority;

  for (var index in sortedCategories) {
    category = sortedCategories[index];
    console.log(category);
    for (var index in categoryData[category]) {
      taskAndPriority = categoryData[category][index];
      exports.displayTask(taskAndPriority, '  ');
    }
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
