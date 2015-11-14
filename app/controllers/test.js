module.exports = function (app) {
  app.get('/api/v1', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
  });

  app.get('/api/v1/test', app.oauth.authorise(), function (req, res) {
    res.send('Secret test area');
  });
};
