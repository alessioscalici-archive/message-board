'use strict';


/**
 * Controller configuration for the User resource
 *
 * @param {Application} app the express application
 * @param {object} db the object containing the NeDB collections
 */
module.exports = function (app, db) {


  /**
   * Controller for GET requests.
   * Returns all the users in an array if called without :id, or a single object user data
   * if :id is provided
   */
  app.get(__api_base + '/user(/:id)?', function getCtrl(req, res) {

    try {
      var query = {},
        singleDoc = !!req.params.id;

      if (singleDoc)
        query._id = req.params.id;


      db.users.find(query, function (err, docs) {
        if (err) {
          res
            .status(500)
            .send({
              message: 'Error retrieving users'
            });
          return;
        }

        res
          .status(200)
          .send(singleDoc ? docs[0] : docs);
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
   * Controller for GET requests on /me URL
   * Returns the current user data
   */
  app.get(__api_base + '/me$', function getMe(req, res) {

    try {

      var query = {
        _id: req.oauth.bearerToken.userId
      };


      db.users.findOne(query, function (err, doc) {
        if (err) throw err;

        res
          .status(200)
          .send(doc);
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
