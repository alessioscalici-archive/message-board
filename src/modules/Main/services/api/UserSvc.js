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
angular.module('Main').factory('UserSvc', function($resource, $localStorage, URL, Current) {
  'use strict';


  /**
   * Updates the current user data every time the service is called
   */
  var setCurrentUser = function (resp) {
    Current.user = resp.data;

    return resp.resource;
  };

  return $resource(URL.apiBase + 'user/:id', {id: '@id'}, {


    /**
     * @ngdoc method
     * @name me
     * @methodOf Main.service:UserSvc
     *
     * @description Returns the currently logged user.
     *
     * @return {Resource} the Resource containing the current user data
     */
    me : { method: 'GET', url: URL.user.me, isArray: false, interceptor: { response : setCurrentUser } },

  });

});