var path = require('path')
  , fs = require('fs')
  , commander = require('commander')
  , mingy = require('mingy')
  , Parser = mingy.Parser
  , argv = require('optimist').argv
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
});
