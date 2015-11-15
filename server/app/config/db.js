
var Datastore = require('nedb');

module.exports = function () {

  var db = {
    users: new Datastore(),
    accessTokens: new Datastore(),
    refreshTokens: new Datastore(),
    clients: new Datastore(),
    messages: new Datastore()
  };

  return db;
};