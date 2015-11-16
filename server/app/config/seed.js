
// used to encrypt the passwords
var sha1 = require('sha1');


/**
 * Seed for the sample database
 *
 * @param {object} db the object containing the NeDB collections
 */
module.exports = function (db) {

  var finn = { _id: 'finn', username: 'finn', password: sha1('password'), name: 'Finn the human', avatar: 'assets/profilePic/finn.png' },
    jake = { _id: 'jake', username: 'jake', password: sha1('password'), name: 'Jake the dog', avatar: 'assets/profilePic/jake.jpg' },
    bmo = { _id: 'bmo', username: 'bmo', password: sha1('password'), name: 'BMO', avatar: 'assets/profilePic/bmo.png' },
    bubblegum = { _id: 'bubblegum', username: 'bubblegum', password: sha1('password'), name: 'Princess Bubblegum', avatar: 'assets/profilePic/bubblegum.png' },
    lumpy = { _id: 'lumpy', username: 'lumpy', password: sha1('password'), name: 'Lumpy space princess', avatar: 'assets/profilePic/lumpy.png' },
    marceline = { _id: 'marceline', username: 'marceline', password: sha1('password'), name: 'Marceline', avatar: 'assets/profilePic/marceline.png'},

    users = [ finn, jake, bmo, bubblegum, lumpy, marceline ];

  var minute = 0,
    messages = [
      { from: finn._id, text: 'Hey guys, it\'s adventure time! Who\'s up for a battle with chicken gloves?', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: jake._id, text: 'Come on Finn, again? We did it last weekend...', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: bubblegum._id, text: 'Ok to me <3', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: bmo._id, text: 'Yeah, I will take some video of you fighting!', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: lumpy._id, text: 'Guys c\'mon... seriously?', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: finn._id, text: 'Come on, it\'s finntastic!', created: new Date(2015, 10, 9, 19, minute++, 0) },
      { from: marceline._id, text: '\'-_-', created: new Date(2015, 10, 9, 19, minute++, 0) }
    ];


  db.users.insert(users, function (err, newDocs) {

    db.messages.insert(messages);

  });



  // client for oauth 2

  var client = {
    _id: 'client1',
    secret: 'client1'
  };

  db.clients.insert(client);


};