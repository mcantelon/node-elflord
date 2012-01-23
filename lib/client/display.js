var sortable = require('./sortable');

exports.commandResult = function(taskAffected, operation) {
  var response = (taskAffected > 0)
    ? 'Task ' + operation + '.'
    : 'Task not found.';
  console.log(response);
}

exports.displayTasksForSingleCategory = function(tasks, indent) {
  tasks.sort(sortable.propertySorter('priority', true));
  sortable.display(tasks, function(task) {
    var format = (indent) ? '  %d) %s %s' : '%d) %s %s';
    priorityDescription = (task.priority != 0)
      ? '[' + task.priority + ']'
      : '';
    console.log(
      format,
      task.id,
      task.description,
      priorityDescription
    );
  });
}

exports.displayAllTasks = function(tasks) {
  var task
    , categoryAndPriority
    , categoryData = {};

  /*
  if (typeof tasks == 'object') {
    console.log('No tasks found.');
    return;
  }
  */

  tasks.map(function(task) {
    categoryData[task.category] = (categoryData[task.category] == undefined)
      ? []
      : categoryData[task.category];
    categoryData[task.category].push(task);
  });

  exports.displayTasksByCategory(categoryData);
}

exports.displayTasksByCategory = function(categoryData) {
  var sortedCategories = Object.keys(categoryData).sort()
    , category
    , taskAndPriority
    , priority;

  for (var index in sortedCategories) {
    category = sortedCategories[index];
    console.log((category) ? category : '<uncategorized>');
    exports.displayTasksForSingleCategory(categoryData[category], true);
  }
}

exports.displayCategoryTaskCount = function(categoryTaskCounts) {
  var arrayOfCategoryCounts = [];

  var categories = sortable.objectToSortable(categoryTaskCounts);
  categories.sort(sortable.propertySorter('value', true));

  sortable.display(categories, '%s: %s');
}
