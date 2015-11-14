'use strict';



var _ = require('lodash'),
  Project = require(__modelsPath + 'ProjectModel');


module.exports = function (app) {

  // TODO create a helper ROUTE (e.g. ROUTE('project/:id')) that makes 'project/:id' -> '/project/:id^'
  app.post(__api_base + '/project', app.oauth.authorise(), post);
  app.get(__api_base + '/project', app.oauth.authorise(), get);

  app.get(__api_base + '/project/:id', app.oauth.authorise(), getOne);
  app.put(__api_base + '/project/:id', app.oauth.authorise(), put);
  app.delete(__api_base + '/project/:id', app.oauth.authorise(), del);
};




function post(req, res) {

  var parms = _.extend({
    createdBy: req.user.id,
    createdAt: new Date()
  }, req.body);

  var project = new Project(parms);

  project.save(function (err) {
    if (err) {
      res
        .status(400)
        .send({
          code: 'error.project_exists',
          message: err.toString()
        });
      return;
    }

    res
      .status(201)
      .send(project.toObject());
  });

}

function get(req, res) {

  try {

    console.log('project get');

    // if the id is in the url
    var query = _.pick(req.body, ['id']),
      pagOptions = _.pick(req.query, ['page', 'limit', 'sortBy']);
    _.extend(pagOptions, { lean: true });
    _.defaults(pagOptions, { limit: __page_default_limit, page: 1 });


    Project.paginate(query, pagOptions, function (err, docs) {

      if (err) {
        res
          .status(400)
          .send({
            code: 'error.project_get',
            message: err.toString()
          });
        return;
      }

      Project.count(query, function (err2, count) {

        if (err2) {
          res
            .status(400)
            .send({
              code: 'error.project_get',
              message: err.toString()
            });
          return;
        }

        res
          .status(200)
          .header('X-Page', pagOptions.page )
          .header('X-Page-Size', pagOptions.limit )
          .header('X-Page-Total', count )
          .send(docs);

      });


    });

  } catch (err) {
    res
      .status(500)
      .send({
        code: 'error.server',
        message: err.toString()
      });
  }



}


function checkGetOneError(err, doc, res) {
  if (err) {
    res
      .status(400)
      .send({
        code: 'error.project_get',
        message: err.toString()
      });
    return true;
  }

  if (!doc) {
    res
      .status(404)
      .send({
        code: 'error.project_not_found',
        message: 'not_found'
      });
    return true;
  }
}

function getOne(req, res) {

  try {

    console.log('project getOne');

    // if the id is in the url
    var query = {
      _id: req.params.id
    };


    Project.findOne(query).lean().exec(function (err, doc) {

      if (checkGetOneError(err, doc, res)) {
        return;
      }

      res.status(200).send(doc);

    });

  } catch (err) {
    res
      .status(500)
      .send({
        code: 'error.server',
        message: err.toString()
      });
  }



}


function put(req, res) {

  try {


    // if the id is in the url
    var query = {
      _id: req.params.id
    };


    Project.findOne(query).exec(function (err, doc) {

      if (checkGetOneError(err, doc, res)) {
        return;
      }

      _.extend(doc, req.body);

      doc.save(function (err) {
        if (err) {
          res
            .status(400)
            .send({
              code: 'error.project_exists',
              message: err.toString()
            });
          return;
        }

        res
          .status(200)
          .send(doc.toObject());
      });


    });

  } catch (err) {
    res
      .status(500)
      .send({
        code: 'error.server',
        message: err.toString()
      });
  }

}


function del(req, res) {

  try {

    // if the id is in the url
    var query = {
      _id: req.params.id
    };


    Project.findOne(query).remove(function (err) {

      if (checkGetOneError(err, true, res)) {
        return;
      }

      res
        .status(200)
        .send();

    });

  } catch (err) {
    res
      .status(500)
      .send({
        code: 'error.server',
        message: err.toString()
      });
  }

}
