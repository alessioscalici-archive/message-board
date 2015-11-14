
var yaml = require('yamljs');


module.exports = function (app) {

  // serves locale files
  app.get('/locale/:lang', function(req, res, next){

    try {
      res
        .status(200)
        .send(yaml.load(__localesPath + req.params.lang + '.yml'));
    }
    catch (e) {
      res
        .status(404)
        .send({
          code: 'error.not_found',
          message: 'not_found'
        });
    }
  });

};