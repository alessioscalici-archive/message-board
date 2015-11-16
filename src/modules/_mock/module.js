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
 * @name modalMock
 *
 * @description
 * This module is used in the unit tests to mock the $modal service.
 *
 */
angular.module('modalMock',  []).service("$modal",  function(){
  'use strict';

  var modalInstanceMock = {
    result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback || function () {};
        this.cancelCallback = cancelCallback || function () {};
      }
    },
    close: function( item ) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback( type );
    }
  };
  var me = {

    open: function () {
      return modalInstanceMock;
    },

    instance : modalInstanceMock
  };
  return me;
})
  .service("Dialog",  function(){
    'use strict';

    var modalInstanceMock = {

        then: function(confirmCallback, cancelCallback) {
          //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
          this.confirmCallBack = confirmCallback || function () {};
          this.cancelCallback = cancelCallback || function () {};
        },

        close: function( item ) {
          //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
          this.confirmCallBack( item );
        },
        dismiss: function( type ) {
          //The user clicked cancel on the modal dialog, call the stored cancel callback
          this.cancelCallback( type );
        }
      },
      returnInstance = function () {
        return modalInstanceMock;
      },
      me = {

        confirm: returnInstance,

        prompt: returnInstance,

        showClassFormDialog: returnInstance,

        instance : modalInstanceMock
      };
    return me;
  });

/**
 * @ngdoc overview
 * @name translateMock
 *
 * @description
 * This module is used in the unit tests to mock the $translate service.
 *
 */
angular.module('translateMock',  []).config(function ($provide, $translateProvider) {

  $provide.factory('customLoader', function ($q) {
    return function () {
      var deferred = $q.defer();

      deferred.resolve({

        // needed to make $translate().then  work

        'class_setup.class_joined' :'class_setup.class_joined',
        'announcements.created' : 'announcements.created'

      });
      return deferred.promise;
    };
  });

  $translateProvider.useLoader('customLoader');

});


angular.module('_mock',  ['Main'])

.service('EntityMock',  function(){
    'use strict';

    // arrays of entities mocks as they come from the server
    var me = {
      users: [
        { _id: 'finn', username: 'finn', password: ('password'), name: 'Finn the human', avatar: 'assets/profilePic/finn.png' },
        { _id: 'jake', username: 'jake', password: ('password'), name: 'Jake the dog', avatar: 'assets/profilePic/jake.jpg' }
      ]
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


