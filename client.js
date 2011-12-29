var path = require('path')
  , mingy = require('mingy')
  , Parser = mingy.Parser
  , argv = require('optimist').argv
  , fs = require('fs')
  , client = require('./lib/client');

var configFile = path.join(process.env.HOME, '.elflord')
  , config;

path.exists(configFile, function(exists) {
  if (exists) {
    fs.readFile(configFile, 'utf8', function(err, data) {
      if (err) throw err;
      config = JSON.parse(data.toString());
      client.run(argv, config);
    });
  } else {
    client.makeConfigFile(configFile);
  }
});
