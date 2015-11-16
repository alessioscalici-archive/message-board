

global.__controllersPath = __dirname + '/app/controllers/';
global.__configPath = __dirname + '/app/config/';
global.__api_base = '/api/v1';


var express = require('express'),
  app = express();





// serve the reports and the docs
app.use('/report', express.static(__dirname + '/../report'));
app.use('/docs', express.static(__dirname + '/../docs'));

// serve the client
app.use(express.static(__dirname + '/../build'));



// configure websocket server
global.__wss = require(__configPath + 'websocket')(app);

// vonfigure the NeDB database
var db = require(__configPath + 'db')();

// seed the test db with default data
require(__configPath + 'seed')(db);

// set the oauth2 server
require(__configPath + 'oauth2')(app, db);

// set the api controllers
require(__controllersPath + 'user')(app, db);
require(__controllersPath + 'message')(app, db);



// set this AFTER all the routes (oauth errors)
app.use(app.oauth.errorHandler());


// start server
var server = app.listen(3000, function () {
  var host = server.address().address,
    port = server.address().port;
  console.log('server listening at http://%s:%s', host, port);
});