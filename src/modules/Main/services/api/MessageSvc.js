/**
 * @ngdoc service
 * @name Main.service:MessageSvc
 *
 * @requires $resource
 *
 * @description
 *
 *  This is the resource service for messages
 *
 */
angular.module('Main').factory('MessageSvc', function($resource, URL) {
  'use strict';

  return $resource(URL.apiBase + 'message', {id: '@id'}, {

  });

});