'use strict';



module.exports = function (app) {

  app.post(__api_base + '/project/:projectId/compile', app.oauth.authorise(), post);

};

function post(req, res) {

  var JobRequest = require(__modelsPath + 'JobRequest');
  var job = new JobRequest({
    status: 'pending',
    project: req.params.projectId
  });
  job.save(function (err) {
    if (err) {
      console.log(' err', err);
      res
        .status(400)
        .send({
          code: 'error.req_not_saved',
          message: err.toString()// req.i18n.t('error.user_email_exists', {email: req.body.email})
        });
      return;
    }

    // this sends back a JSON response which is a single string
    res.status(201).send({
      message: 'REQUEST ID: ' + job._id
    });
  });


}
