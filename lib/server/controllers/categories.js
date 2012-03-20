var storage = require('../../storage')
  , auth
  , db
  , password;

// use options to set up this module and the auth module
module.exports = function(options) {
  db = options.db;
  password = options.password;
  auth = require('../../auth')(password);
  return exports;
}

exports.index = function(req, res) {
  auth.handleAuthorization(res, req.query.password, function() {
    res.json({
      'status': 200,
      'categories': storage.categoryTaskCount(db)
    }, 200);
  });
}

exports.show = function(req, res) {
  var categoryTasks = storage.getTasksInCategory(db, req.params.categorie)
    ,  status = (categoryTasks.length > 0) ? 200 : 404;

  res.json({
    'status': status,
    'tasks': categoryTasks.sort(function(a, b) {
      return b.priority - a.priority;
    })
  }, status);
}
