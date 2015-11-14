
// used to encrypt the passwords
var sha1 = require('sha1');


module.exports = function (db) {

  var i;

  // users:  user0 ... user9

  var users = [];
  for (i = 0; i < 10; ++i) {
    users.push({
      username: 'user' + i,
      password: sha1('user' + i)
    });
  }

  db.users.insert(users);

  // users:  client0 ... client9

  var clients = [];
  for (i = 0; i < 10; ++i) {
    clients.push({
      _id: 'client' + i,
      secret: 'client' + i
    });
  }

  db.clients.insert(clients);

};