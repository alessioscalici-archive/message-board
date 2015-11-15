/**
 * @ngdoc service
 * @name Main.service:Current
 *
 * @description
 *
 * This service contains current application-wide data (e.g. current user data).
 *
 */
angular.module('Main').service('Current', function(){
  'use strict';


  var me = {

    /**
     * @ngdoc property
     * @name user
     * @propertyOf Main.service:Current
     *
     * @description Contains the current user data
     */
    user : undefined



  };

  return me;
});