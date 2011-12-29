var helpers = require('../helpers')
  , request = require('request')
  , qs = require('querystring');

exports.listTasks = function(args, env) {
  if (env.db) {
    helpers.displayTasks(env.db.get('tasks'));
  } else {
    request(env.baseUrl + '/tasks', function(err, response, body) {
      if (err) throw err;
      tasks = JSON.parse(body);
      helpers.displayTasks(tasks);
    });
  }
}

exports.listTasksInCategory = function(args, env) {
  if (env.db) {
    helpers.displayTasks(helpers.getTasksInCategory(env.db, args.category));
  } else {
    request(env.baseUrl + '/categories/' + args.category, function(err, response, body) {
      if (err) throw err;
      tasks = JSON.parse(body);
      for (var index in tasks) {
        console.log(tasks[index].description);
      }
    });
  }
}

exports.showCategories = function(args, env) {
  console.log(JSON.stringify(helpers.categoryTaskCount(env.db)));
}

exports.addTask = function(args, env) {
  var task = {
    'description': args['description*']
  }

  // allow optional setting of category
  if (env.argv.c != undefined) {
    task.category = env.argv.c;
  }

  // allow optional setting of priority
  if (env.argv.p != undefined) {
    task.priority = env.argv.p;
  }

  if (env.db) {
    helpers.addTask(env.db, task, function(task) {
      console.log('added');
    });
  } else {
    var options = {
      'headers': {'content-type': 'application/x-www-form-urlencoded'},
      'url':     env.baseUrl + '/tasks',
      'body':    qs.stringify(task)
    }

    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
    })
  }

  return true;
}

exports.updateTask = function(args, env) {
  var task = {}
  task[args.property] = args['value*'];

  if (env.db) {
    helpers.updateTask(env.db, args.id, task);
  } else {
    var options = {
      'headers': {'content-type': 'application/x-www-form-urlencoded'},
      'url':     env.baseUrl + '/tasks/' + args.id,
      'body':    qs.stringify(task)
    }

    request.put(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
    })
  }
}

exports.deleteTask = function(args, env) {
  if (env.db) {
    console.log('local');
    helpers.deleteTask(env.db, args.id, function(deleted) {
      console.log(deleted);
    });
  } else {
    var options = {
      'url': env.baseUrl + '/tasks/' + args.id
    }
    request.del(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
    })
  }
}
