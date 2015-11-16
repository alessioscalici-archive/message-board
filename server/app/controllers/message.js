'use strict';

var _ = require('lodash');


/**
 * Controller configuration for the Message resource
 *
 * @param {Application} app the express application
 * @param {object} db the object containing the NeDB collections
 */
module.exports = function (app, db) {


  /**
   * Controller for POST requests
   */
  app.post(__api_base + '/message', function postAction(req, res) {

    try {

      var currentUserId = req.oauth.bearerToken.userId;

      req.body.from = currentUserId;
      req.body.created = new Date();


      db.messages.insert(req.body, function (err, newDoc) {
        if (err) throw err;

        db.users.findOne({ _id: currentUserId }, function (err, user) {
          if (err) throw err;

          newDoc.fromUser = user;


          __wss.broadcast('WS_MESSAGE', newDoc);

          res
            .status(201)
            .send(newDoc);

        });

      });


    } catch (e) {
      res
        .status(500)
        .send({
          message: 'Server error: ' + e.toString()
        });
    }
  });




  /**
   * Controller for GET requests
   */
  app.get(__api_base + '/message', function getAction(req, res) {

    try {

      var msgQuery = {};


      // there is no elegant way to appens associated data with nedb... sorry!
      db.users.find({}, function (err, users) {
        if (err) throw err;

        db.messages.find(msgQuery).sort({ created: 1 }).exec(function (err, msgDocs) {
          if (err) throw err;

          for (var i = 0; i < msgDocs.length; ++i) {
            msgDocs[i].fromUser = _.find(users, { _id: msgDocs[i].from });
          }

          res
            .status(200)
            .send(msgDocs);
        });

      });



    } catch (e) {
      res
        .status(500)
        .send({
          message: 'Server error: ' + e.toString()
        });
    }
  });

};









