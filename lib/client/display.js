var sortable = require('./sortable');

exports.commandResult = function(taskAffected, operation) {
  var response = (taskAffected > 0)
    ? 'Task ' + operation + '.'
    : 'Task not found.';
  console.log(response);
}

exports.displayTasks = function(tasks, options) {
  var task
    , categoryAndPriority
    , categoryData = {};

  options = (options == undefined) ? {} : options;

  // if not grouping, to be sorted later, sort by priority in descending order
  if (!options.groupByCategory) {
    tasks.sort(sortable.propertySorter('priority', true));
  }

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
        category: task.category,
        priority: task.priority,
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
    console.log((category) ? category : '<uncategorized>');
    categoryData[category].sort(sortable.propertySorter('priority', true));
    for (var index in categoryData[category]) {
      taskAndPriority = categoryData[category][index];
      exports.displayTask(taskAndPriority, '  ');
    }
  }
}

exports.displayCategoryTaskCount = function(categoryTaskCounts) {
  var arrayOfCategoryCounts = [];

  var categories = sortable.objectToSortable(categoryTaskCounts);
  categories.sort(sortable.propertySorter('value', true));

  sortable.display(categories, '%s: %s');
}
