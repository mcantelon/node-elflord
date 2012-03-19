var commander = require('commander')

  , fs = require('fs')
  , express = require('express')
  , er = require('express-resource')
  , app = express.createServer()
  , dirty = require('dirty')
  , controllerDir = './controllers';

exports.run = function(argv, config) {
  config.db = require('dirty')(config.dbFile);
  config.db.on('load', function() {
    app.use(express.bodyParser());

    app.get('/', function(req, res) {
      res.send('Elflord Server running free.');
    });

    app.resource('tasks', require(controllerDir + '/tasks')(config));
    app.resource('categories', require(controllerDir + '/categories')(config));

    // heroku, etc., support
    var port = process.env.PORT || config.port;

    app.listen(port);
    console.log('elflord server started on port %d...', port);
  });
}

exports.makeConfigFile = function(configFile) {
  console.log("No configuration file found. Please enter information");
  console.log("needed for configuration.");

  commander.prompt(
    "What TCP/IP port should the server run on? [8000] ",
    function(port) {
      commander.prompt(
        "What is the server's password? [none] ",
        function(password) {
          config = {
            'port': (port == '') ? '8000' : port,
            'password': (password == '') ? '' : password
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
