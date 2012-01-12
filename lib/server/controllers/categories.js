var helpers = require('../../storage')
  , db
  , password;

module.exports = function(options) {
  db = options.db;
  password = options.password;
  return exports;
}

exports.index = function(req, res) {
  res.json(helpers.categoryTaskCount(db), 200);
}

exports.show = function(req, res) {
  var categoryTasks = helpers.getTasksInCategory(db, req.params.categorie)
    ,  status = (categoryTasks.length > 0) ? 200 : 404;

  res.json(categoryTasks.sort(function(a, b) {
    return b.priority - a.priority;
  }), status);
}
