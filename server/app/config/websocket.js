

module.exports = function () {


  var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080 });


  wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
      var msg = JSON.parse(message);


      switch (msg.type) {

        // set the user data on the datastream object
        case 'setUser':
          ws.user = msg.data;
          break;
      }

      console.log('received: %s', message);
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