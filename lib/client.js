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
    'list': {
      'syntax': ['ls', 'list'],
      'logic': commands.listTasks
    },

    'listCategory': {
      'syntax': ['ls <category>', 'list <category>'],
      'logic': commands.listTasksInCategory
    },

    'showCategories': {
      'syntax': ['categories'],
      'logic': commands.showCategories
    },

    'add': {
      'syntax': ['add <description*>'],
      'logic': commands.addTask
    },

   'update': {
      'syntax': ['update <id> <property> <value*>'],
      'logic': commands.updateTask
    }
 }

  parser = new Parser(commandSyntax);
  parser.setEnv('argv', argv);
  parser.setEnv('baseUrl', baseUrl);

  // if manipulating local DB, include it in command environment
  if (baseUrl == 'http://none:none') {
    var db = require('dirty')('elflord.db');
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

  commander.prompt(
    "What is the Elflord server's IP address? [none] ",
    function(host) {
      commander.prompt(
        "What is the Elflord server's port? [none] ",
        function(port) {
          config = {
            'host': (host == '') ? 'none' : host,
            'port': (port == '') ? 'none' : port
          }
          fs.writeFile(configFile, JSON.stringify(config), 'utf8', function(err) {
            if (err) throw err;
            console.log('Configuration written.');
            process.exit();
          });
        }
      );
    }
  );
}

exports.parse = function(parser, argv) {
  if (!parser.parseLexemes(argv['_'])) {
    console.log('unrecognized command.\n');
  }
}
