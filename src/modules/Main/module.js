/*jshint strict: false */
/**
 * @ngdoc overview
 * @name Main
 *
 * @description
 * The main app module, it defines application-wide configurations as routes, translations, constants etc.
 *
 * @requires ngResource
 * @requires ngMessages
 * @requires ui.router
 * @requires ui.bootstrap
 * @requires MessageCenterModule
 * @requires duScroll
 * @requires ngStorage
 * @requires ngWebSocket
 * @requires login
 * @requires messages
 *
 */
angular.module('Main', [
  'ngResource',
  'ngMessages',
  'ui.router',
  'ui.bootstrap',
  'MessageCenterModule',
  'duScroll',
  'ngStorage',
  'ngWebSocket',
  'login',
  'messages'
]);

