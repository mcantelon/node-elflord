var mingy = require('mingy')
  , Parser = mingy.Parser
  , commands = require('./commands');

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

  if (!parser.parseLexemes(argv['_'])) {
    console.log('Unrecognized command.\n');
  }
}
