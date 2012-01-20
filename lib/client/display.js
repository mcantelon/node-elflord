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
    console.log((category) ? category : '<uncategorized>');
    for (var index in categoryData[category]) {
      taskAndPriority = categoryData[category][index];
      exports.displayTask(taskAndPriority, '  ');
    }
  }
}

function compareByValueDescending(a, b) {
  return compareByValue(a, b, true);
}

function compareByValue(a, b, reverse) {
  var direction = (reverse == true) ? -1 : 1;
  if (a.value < b.value) return -1 * direction;
  if (a.value > b.value) return 1 * direction;
  return 0;
}

function objectToSortable(object) {
  sortable = [];
  for (var key in object) {
    sortable.push({key: key, value: object[key]});
  }
  return sortable;
}

exports.displayCategoryTaskCount = function(categoryTaskCounts) {
  var arrayOfCategoryCounts = [];

  var sortable = objectToSortable(categoryTaskCounts);
  sortable.sort(compareByValueDescending);

  sortable.map(function(pair) {
    console.log('%s: %s', pair.key, pair.value);
  });
}
