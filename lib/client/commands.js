var helpers = require('../storage')
  , display = require('./helpers')
  , fs = require('fs')
  , path = require('path')
  , request = require('request')
  , qs = require('querystring');

function handleRequestErrors(err, success) {
  if (err) {
    switch (err.code) {
      case 'ECONNREFUSED':
        console.log('Connection refused.');
        break;

      case 'ENOTFOUND':
        console.log('Could not reach server.');
        break;

      default:
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
  // allow optional setting of category
  if (env.argv.c != undefined) {
    args.category = env.argv.c;
    exports.listTasksInCategory(args, env);
  } else {
    if (env.db) {
      display.displayTasks(env.db.get('tasks'), {groupByCategory: true});
    } else {
      request(env.baseUrl + '/tasks', function(err, response, body) {
        handleRequestErrors(err, function() {
          tasks = JSON.parse(body);
          display.displayTasks(tasks, {groupByCategory: true});
        });
      });
    }
  }
}

exports.listTasksInCategory = function(args, env) {
  if (env.db) {
    display.displayTasks(helpers.getTasksInCategory(env.db, args.category));
  } else {
    request(env.baseUrl + '/categories/' + args.category, function(err, response, body) {
      handleRequestErrors(err, function() {
        tasks = JSON.parse(body);
        display.displayTasks(tasks);
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
      console.log('Added task ID %d.', task.id);
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
          task = JSON.parse(body);
          console.log('Added task ID %d.', task.id);
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

  args.property = (args.property == 'p') ? 'priority' : args.property;
  args.property = (args.property == 'c') ? 'category' : args.property;
  args.property = (args.property == 'd') ? 'description' : args.property;

  task[args.property] = args['value*'];

  if (env.db) {
    helpers.updateTask(env.db, args.id, task, function(updated) {
      display.commandResult(updated, 'updated');
    });
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
          var result = JSON.parse(body);
          display.commandResult(result.updated, 'updated');
        } else {
          console.log('Abnormal response: HTTP %d', response.statusCode);
        }
      });
    })
  }
}

exports.deleteTask = function(args, env) {
  if (env.db) {
    helpers.deleteTask(env.db, args.id, function(deleted) {
      display.commandResult(deleted, 'deleted');
    });
  } else {
    var postData = {password: env.config.password};
    var options = {
      'headers': {'content-type': 'application/x-www-form-urlencoded'},
      'url':  env.baseUrl + '/tasks/' + args.id,
      'body': qs.stringify(postData)
    }
    request.del(options, function (err, response, body) {
      handleRequestErrors(err, function() {
        if (response.statusCode == 200) {
          display.commandResult(1, 'deleted');
        } else if (response.statusCode == 404) {
          display.commandResult(0, 'deleted');
        } else {
          console.log('Abnormal response: HTTP %d', response.statusCode);
        }
      });
    });
  }
}
