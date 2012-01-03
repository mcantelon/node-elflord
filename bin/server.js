#!/usr/bin/env node

var path = require('path')
  , argv = require('optimist').argv
  , fs = require('fs')
  , server = require('../lib/server/server.js');

var configFile = path.join(process.env.HOME, '.elflord-server')
  , config;

// allow overriding of default configuration location
configFile = (argv['f']) ? argv['f'] : configFile;

path.exists(configFile, function(exists) {
  if (exists) {
    fs.readFile(configFile, 'utf8', function(err, data) {
      if (err) throw err;
      config = JSON.parse(data.toString());
      server.run(argv, config);
    });
  } else {
    server.makeConfigFile(configFile);
  }
});
