

module.exports = function () {


  var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ port: 8080 });


  wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    /*
    var i = 0;
    var interv = setInterval(function () {

      ws.send('something ' + (i++), function ack(error) {
        console.log('ACK: ' + error);
      });
      if (i > 5)
        clearInterval(interv);
    }, 2000);
    */
    ws.send('welcome', function ack(error) {
      error && console.log('ACK: ' + error);
    });

  });

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(data));
    });
  };

  return wss;
};