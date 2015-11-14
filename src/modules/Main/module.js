/*jshint strict: false */
/**
 * @ngdoc overview
 * @name Main
 *
 * @description
 * The main app module, it defines application-wide configurations as routes, translations, constants etc.
 *
 * @requires _meta
 * @requires ui.router
 * @requires messages
 * 
 */
angular.module('Main', [
  '_meta', // auto-generated constant with development metadata
  'ngResource',
  'ui.router',
  'ngStorage',

  'login',
  'messages'
]);

