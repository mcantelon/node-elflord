#!/usr/bin/env node

var path = require('path')
  , argv = require('optimist').argv
  , fs = require('fs')
  , client = require('../lib/client/client');

var configFile = path.join(process.env.HOME, '.elflord')
  , config;

// allow overriding of default configuration location
configFile = (argv['f']) ? argv['f'] : configFile;

path.exists(configFile, function(exists) {
  if (exists) {
    fs.readFile(configFile, 'utf8', function(err, data) {
      if (err) throw err;

      config = JSON.parse(data.toString());

      // allow overriding of default DB location
      config.dbFile = argv['d'] || config.db || 'elflord.db';

      client.run(argv, config);
    });
  } else {
    client.makeConfigFile(configFile);
  }
});
