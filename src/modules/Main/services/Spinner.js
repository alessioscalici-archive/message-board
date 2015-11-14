/**
 * @ngdoc service
 * @name Main.service:Spinner
 *
 * @require $document
 *
 * @description
 *
 *  Provide methods to interact with spinners
 *
 */
angular.module('Main').service('Spinner', function($document){
  'use strict';


  var me = {


    /**
     * @ngdoc method
     * @name show
     * @methodOf Main.service:Spinner
     * @description Shows the spinner given an id
     * @param {string} id the spinner id
     *
     */
    show : function (id) {

      angular.element($document[0].getElementById(id)).removeClass('ng-hide');
    },


    /**
     * @ngdoc method
     * @name hide
     * @methodOf Main.service:Spinner
     * @description Hides the spinner given an id
     * @param {string} id the spinner id
     *
     */
    hide : function (id) {

      angular.element($document[0].getElementById(id)).addClass('ng-hide');
    }

  };

  return me;
});