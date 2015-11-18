/**
 * @ngdoc object
 * @name Main.config:interceptors
 *
 * @description
 *
 *    Http interceptors registration happens here.
 *
 * @requires $httpProvider
 *
 */
angular.module('Main').config(function($httpProvider){
  'use strict';
  $httpProvider.interceptors.push('TokenInterceptor');
  $httpProvider.interceptors.push('UnauthorizedInterceptor');
  $httpProvider.interceptors.push('SpinnerInterceptor');
});