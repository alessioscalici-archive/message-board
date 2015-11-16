
/**
 * @ngdoc object
 * @name Main.config:route
 *
 * @description
 *
 *    Route configuration. In this file resides the configuration for ui-router states
 *
 * @requires $stateProvider
 * @requires $urlRouterProvider
 * @requires Main.constant:T_MAIN
 *
 */
angular.module('Main').config(function ($stateProvider, $urlRouterProvider, T_MAIN) {
	'use strict';


  // solves the ui-router trailing slash problem
  // IMPORTANT: define every state with a trailing slash in the URL path
  /* istanbul ignore next  */
  $urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.url();

    // check to see if the path already has a slash where it should be
    if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
      return;
    }
    if (path.indexOf('?') > -1) {
      return path.replace('?', '/?');
    }
    return path + '/';
  });


  // default url
  $urlRouterProvider.otherwise('/login/');


  // routes

	$stateProvider
		.state('meta', {
			url: '/meta/',
			templateUrl: T_MAIN.MESSAGES_META,
			controller: 'MetaCtrl'
		})
    .state('login', {
      url: '/login/',
      templateUrl: T_MAIN.LOGIN_LOGIN,
      controller: 'LoginCtrl'
    })
    // this is the parent state of the application. It contains always-on functions as logout, home button etc.
    .state('app', {
      abstract: true,
      templateUrl: T_MAIN.MAIN_INDEX,
      controller: 'ApplicationCtrl',
      resolve: {
        // loads the current user data before instantiating the application controller
        curUser : function (UserSvc) {
          return UserSvc.me().$promise;
        }
      }
    })
    .state('app.messages', {
      url: '/messages/',
      templateUrl: T_MAIN.MESSAGES_MESSAGES,
      controller: 'MessagesCtrl'
    })
	;


});