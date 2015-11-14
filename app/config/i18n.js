


module.exports = function (app) {

  var i18n = require("i18next");

  app.use(i18n.handle);


  i18n.backend(require('i18next.yaml'));

  i18n.init({
    resGetPath: __localesPath + '__lng__.yml',
    fallbackLng: 'en',
    detectLngFromHeaders: false
  });


};