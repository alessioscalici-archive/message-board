/**
 * Oauth2 server configuration for express app
 * @param {Application} app the express application
 * @param {object} db the object containing the NeDB collections
 */
module.exports = function (app, db) {

  var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    sha1 = require('sha1');


  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());


  app.oauth = oauthserver({

    model: {

      // retrieve the access token given the bearer token
      getAccessToken : function (bearerToken, callback) {

        db.accessTokens.findOne({ key: bearerToken }, function (err, doc) {
          callback(err, doc);
        });
      },

      // gets the client given client id and secret key
      getClient : function (clientSecret, clientId, callback) {

        db.clients.findOne({ _id: clientId, secret: clientSecret}, function (err, doc) {
          callback(err, doc);
        });
      },

      // all grants are the same in this app
      grantTypeAllowed : function (clientId, grantType, callback) {
        callback(false, true);
      },

      // persist the access token
      saveAccessToken : function (accessToken, clientId, expires, user, callback) {

        var accessToken = {
          key: accessToken,
          expires: expires,
          userId: user._id || user.id
        };

        db.accessTokens.insert(accessToken, function (err) {
          callback(err);
        });

      },

      // required for password grant type
      getUser : function (username, password, callback) {

        // hashes the password
        password = sha1(password);


        db.users.findOne({ username: username, password: password}, function (err, user) {
          callback(err, user);
        });
      },

      // required for refresh_token grant type
      saveRefreshToken : function (refreshToken, clientId, expires, user, callback) {

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

        db.refreshTokens.findOne({ key: refreshToken}, function (err, doc) {
          callback(err, doc);
        });
      }

    },
    grants: ['password', 'refresh_token'],
    debug: false,
    accessTokenLifetime: 3060,
    refreshTokenLifetime: 1209600,
    clientIdRegex: /^[a-z0-9-_]{3,40}$/i
  });



  app.all('/oauth/token', app.oauth.grant());
  app.all('/api/v1', app.oauth.grant());

  // require authorization for API URLs
  app.all('/api/v1/*', function(req, res, next) {

    // oauth exceptions
    if (req.method === 'POST' && req.url === '/api/v1/user') {
      return next();
    }

    return app.oauth.authorise().apply(this, arguments);
  });


};