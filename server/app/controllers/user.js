'use strict';

var db;


module.exports = function (app, dpParm) {
  db = dpParm;
  app.get(__api_base + '/user(/:id)?', getCtrl);
  app.get(__api_base + '/me$', getMe);

};


function getCtrl(req, res) {

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


}


function getMe(req, res) {

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


}
