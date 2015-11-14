

var inProcess = false;

function compile (codeFilePath, callback) {
  var
    fs = require('fs'),
    closure = require('closurecompiler')
    ;

  inProcess = true;
  closure.compile(
    [codeFilePath],
    {
      // Options in the API exclude the "--" prefix
      // WHITESPACE_ONLY
      // SIMPLE_OPTIMIZATIONS
      // ADVANCED_OPTIMIZATIONS
      compilation_level: "ADVANCED_OPTIMIZATIONS",

      // Capitalization does not matter
      formatting: "PRETTY_PRINT",
      warning_level: 'VERBOSE',

      jscomp_error: ['checkTypes', 'checkVars'],
      jscomp_warning: ['reportUnknownTypes']

      // If you specify a directory here, all files inside are used
      // externs: ["externs/file3.js", "externs/contrib/"],

      // ^ As you've seen, multiple options with the same name are
      //   specified using an array.

    },
    function (error, result) {
      if (result) {
        var fileName = codeFilePath.replace('code_', 'output_');
        // Write result to file
        fs.writeFile(fileName, result, 'utf8');
        // Display error (warnings from stderr)
        console.log(error);
      } else {
        // Display error...
        console.log(error);
      }

      inProcess = false;
      callback(error, result);
    }
  );
}

module.exports = function () {


  var jobProcessor = setInterval(function () {

    // do not start more than one build together
    if (inProcess) {
      return;
    }


    var fs = require('fs'),
      _ = require('lodash'),
      JobRequest = require(__modelsPath + 'JobRequest'),
      ClassObject = require(__modelsPath + 'ClassObject'),
      CodeHelper = require(__helpersPath + 'CodeHelper');


    JobRequest.findOne({status: 'pending'}, function (err, doc) {
      if (err || !doc) {
        return;
      }

      var codeFilePath = '../workspace/code_' + doc._id + '.js';

      ClassObject.find({ project: doc.project }, function (err, docs) {
        //console.log(err, docs);

        var gen = new CodeHelper(),
          fileText = '';
        _.each(docs, function (cls) {
          fileText += gen.getClassCode(cls);
        });

        fileText += '\n\n// added by batch.js as entry point\nMain.main();';

        fs.writeFileSync(codeFilePath, fileText, 'utf8');


        var wsMessage = {};

        compile(codeFilePath, function (err, result) {
          if (result) {
            doc.status = 'done';

            wsMessage = {
              _key: 'compile.success',
              code: result
            };

          } else {
            doc.status = 'error';

            wsMessage = {
              _key: 'compile.error',
              error: err.toString()
            };
          }

          doc.save(function (err2) {
            if (err2) {
              console.log('ERROR saving job', err2);
              return;
            }
            console.log('alert("Job ' + doc._id + ' ' + doc.status + '")');
            console.log(result);
            __wss.broadcast(wsMessage);
          });
        });
      });


    });
  }, 3000);

  return jobProcessor;

};