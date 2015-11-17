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
 * @name localStorageMock
 *
 * @description
 * This module is used in the unit tests to mock the $localStorage service.
 *
 */
angular.module('localStorageMock',  []).service("$localStorage",  function(){
  'use strict';

  return {
    $save : function(){}
  };
});


/**
 * @ngdoc overview
 * @name directiveCtrlMock
 *
 * @description
 * This module is used in the directive controllers unit tests, to mock services like $element and $attrs
 *
 */
angular.module('directiveCtrlMock',  []).service("$element",  function(){
  'use strict';

  return {
    hide : function(){},
    show : function(){},
    addClass : function(){},
    removeClass : function(){},
    hasClass : function(){},
    css : function(){},
    find : function(){
      return [];
    }
  };
});


/**
 * @ngdoc overview
 * @name windowMock
 *
 * @description
 * This module is used in the unit tests to mock the $window service.
 *
 */
angular.module('windowMock',  []).service("$window",  function(){
  'use strict';

  return {
    location : {
      href : ''
    },
    open : function(){},
    addEventListener : function(){},
    removeEventListener : function(){}
  };
})

  .service("$document", function(){
    'use strict';

    var $documentMock = [
      {
        body : {},
      }
    ];

    $documentMock.bind = function () {};

    return $documentMock;
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
})


  .service("HttpResponseMock",  function(URL, EntityMock){
    'use strict';

    var me = {
      genericApiOk : {
        config : {
          url : URL.accounts.me
        },
        status: 200,
        data: {}
      },

      genericApi422 : {
        config : {
          url : URL.accounts.base,
          method: 'POST'
        },
        status: 422,
        data: {
          code: 1,
          errors: {
            password: 'Password too short'
          }
        }
      },

      genericApi422_singleError : {
        config : {
          url : URL.accounts.base,
          method: 'POST'
        },
        status: 422,
        data: {
          code: 1,
          error:  'Password too short'
        }
      },

      genericNotApi422 : {
        config : {
          url : URL.base + 'some-url',
          method: 'POST'
        },
        status: 422,
        data: {}
      },

      notFoundError : {
        config : {
          url : URL.accounts.me
        },
        status: 400
      },

      apiQuery : {
        years : EntityMock.years,
        levels : EntityMock.levels,
        courses : EntityMock.courses,
        subjects : EntityMock.subjects
      }
    };
    return me;
  });


