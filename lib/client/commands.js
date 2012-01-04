var helpers = require('../helpers')
  , fs = require('fs')
  , path = require('path')
  , request = require('request')
  , qs = require('querystring');

function handleRequestErrors(err, success) {
  if (err) {
    if (err.code == 'ECONNREFUSED') {
      console.log(err.message);
    } else {
      throw err;
    }
  } else {
    success();
  }
}

exports.usage = function() {
  console.log(
    fs.readFileSync(path.join(__dirname, '../../docs/usage.txt')).toString()
  );
}

exports.listTasks = function(args, env) {
  if (env.db) {
    helpers.displayTasks(env.db.get('tasks'), {groupByCategory: true});
  } else {
    request(env.baseUrl + '/tasks', function(err, response, body) {
      handleRequestErrors(err, function() {
        tasks = JSON.parse(body);
        helpers.displayTasks(tasks, {groupByCategory: true});
      });
    });
  }
}

exports.listTasksInCategory = function(args, env) {
  if (env.db) {
    helpers.displayTasks(helpers.getTasksInCategory(env.db, args.category));
  } else {
    request(env.baseUrl + '/categories/' + args.category, function(err, response, body) {
      handleRequestErrors(err, function() {
        tasks = JSON.parse(body);
        helpers.displayTasks(tasks);
      });
    });
  }
}

exports.showCategories = function(args, env) {
  if (env.db) {
    console.log(JSON.stringify(helpers.categoryTaskCount(env.db)));
  } else {
    // TO DO
  }
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
    var postData = task;
    postData.password = env.config.password;
    var options = {
      'headers': {'content-type': 'application/x-www-form-urlencoded'},
      'url':     env.baseUrl + '/tasks',
      'body':    qs.stringify(postData)
    }

    request.post(options, function (err, response, body) {
      handleRequestErrors(err, function() {
        if (response.statusCode == 200) {
          console.log(body); // TO DO
        } else {
          console.log('Abnormal response: HTTP %d', response.statusCode);
        }
      });
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
    var postData = task;
    postData.password = env.config.password;
    var options = {
      'headers': {'content-type': 'application/x-www-form-urlencoded'},
      'url':     env.baseUrl + '/tasks/' + args.id,
      'body':    qs.stringify(postData)
    }

    request.put(options, function (err, response, body) {
      handleRequestErrors(err, function() {
        if (response.statusCode == 200) {
          console.log(body); // TO DO
        } else {
          console.log('Abnormal response: HTTP %d', response.statusCode);
        }
      });
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
    request.del(options, function (err, response, body) {
      handleRequestErrors(err, function() {
        if (response.statusCode == 200) {
          console.log(body); // TO DO
        } else {
          console.log('Abnormal response: HTTP %d', response.statusCode);
        }
      });
    });
  }
}
