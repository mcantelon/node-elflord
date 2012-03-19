var mingy = require('mingy')
  , Parser = mingy.Parser
  , commands = require('./commands')
  , dirty = require('dirty')
  , fs = require('fs')
  , commander = require('commander');

exports.run = function(argv, config) {

  var baseUrl = 'http://' + config.host;
  baseUrl += (config.port != undefined) ? ':' + config.port : '';

  var commandSyntax = {
    'help': {
      'syntax': ['help'],
      'logic': commands.usage
    },

    'list': {
      'syntax': ['l', 'ls', 'list'],
      'logic': commands.listTasks
    },

    'listCategory': {
      'syntax': ['l <category>', 'ls <category>', 'list <category>'],
      'logic': commands.listTasksInCategory
    },

    'showCategories': {
      'syntax': ['c', 'categories'],
      'logic': commands.showCategories
    },

    'add': {
      'syntax': ['a <description*>', 'add <description*>'],
      'logic': commands.addTask
    },

   'update': {
      'syntax': [
        'u <id> <property> <value*>',
        'update <id> <property> <value*>'
      ],
      'logic': commands.updateTask
    },

    'delete': {
      'syntax': ['d <id>', 'delete <id>', 'rm <id>'],
      'logic': commands.deleteTask
    },

    'dump': {
      'syntax': ['dump'],
      'logic': commands.dump
    }
  }

  parser = new Parser(commandSyntax);
  parser.setEnv('argv', argv);
  parser.setEnv('baseUrl', baseUrl);
  parser.setEnv('config', config);

  // if manipulating local DB, include it in command environment
  if (config.host == '') {
    var db = require('dirty')(config.dbFile);
    db.on('load', function() {
      parser.setEnv('db', db);
      exports.parse(parser, argv);
    });
  } else {
    exports.parse(parser, argv);
  }
}

exports.makeConfigFile = function(configFile) {
  console.log("No configuration file found. If you're storing to-dos");
  console.log("on a remote Elflord server, please enter the IP address");
  console.log("and port. Otherwise, simply press enter twice.");

  var config = {};

  commander.prompt(
    "What is the Elflord server's IP address? [none] ",
    function(host) {
      if (host == '') {
        config.host = host;
        exports.writeConfig(configFile, config);
      } else {
        commander.prompt(
          "What is the Elflord server's port? [8000] ",
          function(port) {
            commander.prompt(
              "What is the Elflord server's pasword? [none] ",
              function(password) {
                config = {
                  'host': host,
                  'port': (port == '') ? '8000' : port,
                  'password': password
                }
                exports.writeConfig(configFile, config);
              }
            );
          }
        );
      }
    }
  );
}

exports.writeConfig = function(configFile, config) {
  fs.writeFile(configFile, JSON.stringify(config), 'utf8', function(err) {
    if (err) throw err;
    console.log('Configuration written.');
    process.exit();
  });
}

exports.parse = function(parser, argv) {
  if (!parser.parseLexemes(argv['_'])) {
    console.log('Error: unrecognized command.\n');
    commands.usage();
  }
}
