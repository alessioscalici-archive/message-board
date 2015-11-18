
/**
 * Configure the web socket server
 *
 * @param {object} db the object containing the NeDB collections
 */
module.exports = function (server) {


  var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server });


  // start listening
  wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
      var msg = JSON.parse(message);


      switch (msg.type) {

        // set the user data on the datastream object
        case 'setUser':
          ws.user = msg.data;
          break;
      }

    });

  });


  /**
   * Notifies all the connected users
   * @param type the event type (e.g. WS_MESSAGE to notify a new message)
   * @param data The data to send
   */
  wss.broadcast = function broadcast(type, data) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ type: type, data: data }));
    });
  };

  /**
   * Notifies a specific user (if connected)
   * @param userId The user ID
   * @param type the event type (e.g. WS_MESSAGE to notify a new message)
   * @param data The data to send
   */
  wss.notifyUser = function notifyUser(userId, type, data) {
    wss.clients.forEach(function each(client) {
      if (client.user && client.user._id === userId) {
        client.send(JSON.stringify({ type: type, data: data }));
        return;
      }
    });
  };

  return wss;
};