#!/usr/bin/env node

var path = require('path')
  , argv = require('optimist').argv
  , fs = require('fs')
  , helpers = require('../lib/helpers')
  , server = require('../lib/server/server.js');

var configFile = path.join(helpers.homeDir(), '.elflord-server')
  , config;

if (argv['h']) {
  console.log(fs.readFileSync('./docs/usage_server.txt').toString());
} else {

  // allow overriding of default configuration location
  configFile = (argv['f']) ? argv['f'] : configFile;

  path.exists(configFile, function(exists) {
    if (exists) {
      fs.readFile(configFile, 'utf8', function(err, data) {
        if (err) throw err;

        config = JSON.parse(data.toString());

        // allow overriding of default DB location
        config.dbFile = argv['d'] || config.db || 'elflord-server.db';

        server.run(argv, config);
      });
    } else {
      server.makeConfigFile(configFile);
    }
  });
}
