/*jshint strict: false */
/**
 * @ngdoc overview
 * @name stateMock
 *
 * @description
 * This module is used in the unit tests to mock the ui-router $state service.
 * This is meant to avoid expecting the $httpBackend requests for templates,  decoupling them from router states.
 *
 */
angular.module('stateMock',  []).service("$state",  function(){
  'use strict';
  this.expectedTransitions = [];
  this.enabled = false;
  this.current = {
    name: 'app.dashboard'
  };
  this.transitionTo = function(stateName){
    if (!this.enabled) {
      return;
    }


    this.current.name = stateName;

    if (this.expectedTransitions.length > 0){
      var expectedState = this.expectedTransitions.shift();
      if (expectedState !== stateName){
        throw Error("Expected transition to state: " + expectedState + " but transitioned to " + stateName );
      }
    } else {
      throw Error("No more transitions were expected!");
    }
  };

  this.expectTransitionTo = function(stateName){
    this.enabled = true;
    this.expectedTransitions.push(stateName);
  };


  this.ensureAllTransitionsHappened = function(){
    if (this.enabled && this.expectedTransitions.length > 0){
      throw Error("Not all transitions happened!");
    }
  };

  this.go = this.transitionTo;
});





/**
 * @ngdoc overview
 * @name websocketMock
 *
 * @description
 * This module is used in the unit tests to mock the $websocket service.
 *
 */
angular.module('websocketMock',  []).service("$websocket",  function(){
  'use strict';

  var dataStreamMock = {
    listeners: {
      message: [],
      open: [],
      close: [],
      error: []
    },
    onMessage: function( func ) {
      dataStreamMock.listeners.message.push(func);
    },
    onOpen: function( func ) {
      dataStreamMock.listeners.open.push(func);
    },
    onClose: function( func ) {
      dataStreamMock.listeners.close.push(func);
    },
    onError: function( func ) {
      dataStreamMock.listeners.error.push(func);
    },

    send: function(  ) {}

  };

  var me = function () {
    return dataStreamMock;
  };

  me.trigger = function ( event, args ) {

    args = args || [];

    if (args.constructor !== Array) {
      throw '$websocket mock .trigger() needs an array as a 2nd parameter';
    }
    var listeners = dataStreamMock.listeners[event];
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i].apply(this, args);
    }
  };

  me.dataStream = dataStreamMock;
  return me;
});



angular.module('_mock',  ['Main'])

.service('EntityMock',  function(){
    'use strict';

  // arrays of entities mocks as they come from the server
  var me = {
    users: [
      { _id: 'finn', username: 'finn', password: ('password'), name: 'Finn the human', avatar: 'assets/profilePic/finn.png' },
      { _id: 'jake', username: 'jake', password: ('password'), name: 'Jake the dog', avatar: 'assets/profilePic/jake.jpg' }
    ],

    messages: [
      { from: 'finn', text: 'Hi!! this is a message', created: new Date(2015, 10, 9, 19, 3, 0) },
      { from: 'jake', text: 'This too!', created: new Date(2015, 10, 9, 19, 4, 0) }
    ],

    authorizationTokens: [
      { "token_type":"bearer", "access_token": "2b9b1f2909bef702c7f30b117508dbfed92fd718", "expires_in": 3060, "refresh_token": "716ff57486d11728415ee2cd59ec2a0ca32a9fa4" }
    ]
  };

  // messages notifications from web socket
  me.wsMessages = [];
  for (var i = 0; i < me.messages.length; ++i) {
    var msgObject = {
      data: JSON.stringify({ type: 'WS_MESSAGE', data:  me.messages[i] })
    };
    me.wsMessages.push(msgObject);
  }

  return me;
})

.service('HttpResponseMock',  function() {
  'use strict';
  // arrays of entities mocks as they come from the server
  var me = {
    genericError : {
      status: 500,
      data: {
        error: 'Generic error'
      }
    },

    notFoundError : {
      status: 404,
      data: {
        error: 'Not found'
      }
    },

    unauthorizedError : {
      status: 401,
      data: {
        error: 'Unauthorized'
      }
    },

    tokenExpiredError : {
      status: 401,
      data: {
        error: 'invalid_token',
        'error_description': 'The access token has expired.'
      }
    },

    tokenInvalidError : {
      status: 401,
      data: {
        error: 'invalid_token',
        'error_description': 'The access token is invalid.'
      }
    },

    genericSuccess : {
      status: 200,
      data: {
        msg: 'Generic success'
      }
    },

    loginSuccess : {
      access_token : 'ACCESS_TOKEN_HASH',
      refresh_token : 'REFRESH_TOKEN_HASH',
    }
  };
  return me;
})

/**
 * @ngdoc service
 * @name _mock.service:GetUrl
 *
 * @description
 * This service is a function that returns an URL built as Angular does internally (sorting the query parameters and replacing the placeholders)
 *
 */
.service('BuildUrl',  function(lodash){
  'use strict';
  return function (url, data, query){
    data = data || {};
    url =  url.replace(/\/:(\w*)/g,function(m,key){return data.hasOwnProperty(key) ? '/' + data[key] : ''; });

    if (angular.isObject(query)) {
      var qs = lodash(query)
        .pairs()
        .map(function (pair) {
          return { key: pair[0], value: pair[1] };
        })
        .sortBy('key')
        .map(function (obj) {
          return obj.key + '=' + obj.value;
        })
        .value()
        .join('&');

      if (qs !== '') {
        url += '?' + qs;
      }
    }
    return url;
  };
});


