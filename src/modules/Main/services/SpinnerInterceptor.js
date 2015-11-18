/**
 * @ngdoc service
 * @name Main.service:SpinnerInterceptor
 *
 * @require $log
 * @require $q
 * @require Main.service:Spinner
 *
 * @description This request / response interceptor checks activate and deactivate spinners based on a request property
 */
angular.module('Main').factory('SpinnerInterceptor', function($log, $q, Spinner){
  'use strict';

  var me = {

    request : function(req){
      if (req.params && req.params.spinner) {
        req.spinner = req.params.spinner;
        Spinner.show(req.spinner);
        delete req.params.spinner;
      }
      return req;
    },

    response : function(resp) {
      if (resp.config.spinner) {
        Spinner.hide(resp.config.spinner);
      }
      return resp;
    },

    responseError : function(resp) {
      if (resp.config.spinner) {
        Spinner.hide(resp.config.spinner);
      }
      return $q.reject(resp);
    }
  };
  return me;
});