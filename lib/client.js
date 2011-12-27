var mingy = require('mingy')
  , Parser = mingy.Parser
  , commands = require('./commands');

exports.run = function(argv, config) {

  var baseUrl = 'http://' + config.host;
  baseUrl += (config.port != undefined) ? ':' + config.port : '';

  var commandSyntax = {
    'list': {
      'syntax': ['ls', 'list', 'ls <category>', 'list <category>'],
      'logic': commands.listTasks
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
