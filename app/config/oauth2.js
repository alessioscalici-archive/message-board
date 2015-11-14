module.exports = function (app, db) {

  var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    sha1 = require('sha1');


 // var router = express.Router();


  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());


  app.oauth = oauthserver({

    model: {
      getAccessToken : function (bearerToken, callback) {

        console.log('getAccessToken');
        db.accessTokens.findOne({ key: bearerToken }, function (err, doc) {

           console.log('AccessToken retrieved', err, doc);
          callback(err, doc);

        });
      },
      getClient : function (clientSecret, clientId, callback) {

        console.log('getClient');
        db.clients.findOne({ _id: clientId, secret: clientSecret}, function (err, doc) {

             console.log('client retrieved', clientSecret, clientId, doc);
          callback(err, doc);

        });
      },
      grantTypeAllowed : function (clientId, grantType, callback) {

        console.log('grantTypeAllowed');
        //   console.log('grantTypeAllowed ' + grantType);
        callback(false, true);
      },
      saveAccessToken : function (accessToken, clientId, expires, user, callback) {
        console.log('saveAccessToken');
        var accessToken = {
          key: accessToken,
          expires: expires,
          userId: user.id || user.id
        };

        db.accessTokens.insert(accessToken, function (err) {

          callback(err);//     console.log('access token saved');
        });

      },

      // required for password grant type
      getUser : function (username, password, callback) {
        console.log('getUser');
        // hashes the password
        password = sha1(password);


        db.users.findOne({ username: username, password: password}, function (err, user) {

          callback(err, user);

        });
      },

      // required for refresh_token grant type
      saveRefreshToken : function (refreshToken, clientId, expires, user, callback) {
        console.log('saveRefreshToken');
        var token = {
          key: refreshToken,
          expires: expires,
          clientId: clientId,
          userId: user._id || user.id
        };

        db.refreshTokens.insert(token, function (err) {

          callback(err);
        });
      },

      // required for refresh_token grant type
      getRefreshToken : function (refreshToken, callback) {

        console.log('getRefreshToken');

        db.refreshTokens.findOne({ key: refreshToken}, function (err, doc) {

          callback(err, doc);

        });
      }

    }, // See below for specification
    grants: ['password', 'refresh_token'],
    debug: false,
    accessTokenLifetime: 10,//3060,
    refreshTokenLifetime: 1209600,
    clientIdRegex: /^[a-z0-9-_]{3,40}$/i
  });



  app.all('/oauth/token', app.oauth.grant());
  app.all('/api/v1', app.oauth.grant());


  app.all('/api/v1/*', function(req, res, next) {

    // oauth exceptions
    if (req.method === 'POST' && req.url === '/api/v1/user') {
      return next();
    }

    return app.oauth.authorise().apply(this, arguments);
  });


};