angular.module('Main').config(function ($stateProvider, $urlRouterProvider, T_MAIN) {
	'use strict';
	

	$urlRouterProvider
		.otherwise("/login");


	$stateProvider
		.state('meta', {
			url: "/meta",
			templateUrl: T_MAIN.MESSAGES_META,
			controller: 'MetaCtrl'
		})
    .state('login', {
      url: "/login",
      templateUrl: T_MAIN.LOGIN_LOGIN,
      controller: 'LoginCtrl'
    })
    .state('messages', {
      url: "/messages",
      templateUrl: T_MAIN.MESSAGES_MESSAGES,
      controller: 'MessagesCtrl'
    })
	;


});