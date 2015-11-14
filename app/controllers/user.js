'use strict';

var sha1 = require('sha1'),
  db;


module.exports = function (app, dpParm) {
  db = dpParm;
  app.get(__api_base + '/user', getCtrl);

  //app.get(__api_base + 'user', app.oauth.authorise(), get);

  //app.get(__api_base + 'user/:id', app.oauth.authorise(), getOne);
  //app.put(__api_base + 'user/:id', app.oauth.authorise(), put);
  //app.delete(__api_base + 'user/:id', app.oauth.authorise(), del);
};


function getCtrl(req, res) {

/*
  var psw = sha1(req.body.password);

  var query = {
    email: req.body.email,
    password: psw
  };
*/
  db.users.find({}, function (err, docs) {
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
      .send(docs);
  });


}
