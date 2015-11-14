/**
 * @ngdoc service
 * @name Main.service:UserSvc
 *
 * @requires $resource
 *
 * @description
 *
 *  This is the resource service for users
 *
 */
angular.module('Main').factory('UserSvc', function($resource, URL) {
  'use strict';

  return $resource(URL.apiBase + 'user', {id: '@id'}, {

  });

});