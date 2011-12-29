var mingy = require('mingy')
  , Parser = mingy.Parser
  , commands = require('./commands')
  , dirty = require('dirty');

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

    'add': {
      'syntax': ['add <description*>'],
      'logic': commands.addTask
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

exports.parse = function(parser, argv) {
  if (!parser.parseLexemes(argv['_'])) {
    console.log('unrecognized command.\n');
  }
}
