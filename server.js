
global.__localesPath = __dirname + '/app/locales/';
global.__modelsPath = __dirname + '/app/models/';
global.__controllersPath = __dirname + '/app/controllers/';
global.__configPath = __dirname + '/app/config/';
global.__helpersPath = __dirname + '/app/helpers/';




// defaults
global.__page_default_limit = 10;
global.__page_max_limit = 100;

global.__api_base = '/api/v1';


var express = require('express'),
  cors = require('cors');

var app = express();


/*

 // configure cors
 var corsOptions = {
 exposedHeaders : ['X-Page', 'X-Page-Size', 'X-Page-Total']
 };

 app.use(require('cors')(corsOptions));




 // configure websocket server
 global.__wss = require(__configPath + 'websocket')(app);




 mongoose.connect('mongodb://localhost/ll-dev');

 app.mongoose = mongoose;

 require(__configPath + 'batch')(app);


 require(__configPath + 'locale')(app);


 require(__configPath + 'i18n')(app);



 // API
 require(__configPath + 'oauth2')(app);
 require(__controllersPath + 'user')(app);
 //require(__controllersPath + 'project')(app);



 var Datastore = require('nedb')
 , db = new Datastore();

 var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));



 // set this AFTER all the routes
 app.use(app.oauth.errorHandler());


 // start server
 var server = app.listen(3000, function () {
 var host = server.address().address;
 var port = server.address().port;

 console.log('ll-server listening at http://%s:%s', host, port);
 });

 */


// serve the client
app.use(express.static(__dirname + '/build'));


var db = require(__configPath + 'db')();

// seed the test db with default data
require(__configPath + 'seed')(db);

// set the oauth2 server
require(__configPath + 'oauth2')(app, db);

// set the api controllers
require(__controllersPath + 'user')(app, db);



// set this AFTER all the routes
app.use(app.oauth.errorHandler());



// start server
var server = app.listen(3000, function () {
  var host = server.address().address,
    port = server.address().port;
  console.log('server listening at http://%s:%s', host, port);
});