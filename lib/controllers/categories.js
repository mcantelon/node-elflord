var helpers = require('../helpers')
  , db;

module.exports = function(activeDb) {
  db = activeDb;
  return exports;
}

exports.index = function(req, res) {
  var tasks = db.get('tasks')
    , categories = {};

  for(var index in tasks) {
    var task = tasks[index];
    categories[task.category] = (categories[task.category])
      ? categories[task.category] + 1
      : 1;
  }

  res.json(categories, 200);
}

exports.show = function(req, res) {
  var status;

  var categoryTasks = helpers.getTasksInCategory(db, req.params.categorie);

  status = (categoryTasks.length > 0) ? 200 : 404;

  res.json(categoryTasks.sort(function(a, b) {
    return b.priority - a.priority;
  }), status);
}
