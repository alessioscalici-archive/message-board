'use strict';


var fs = require('fs'),
  _ = require('lodash');


// exports
module.exports = {
  post: create
};

/*
  Expects an object like this:

  {
    _id: the id of the class (if we are editing)
    name: the name of the class
    properties: []
      name: the name
      type: the type
    methods: []
      name: the name
      returnType: the return type
      params: []
        name: the param name
        type: the param type
      body: the code
  }
 */
function create(req, res) {


  var str = getClassCode(req);

  str += '\nconsole.log(new ' + req.body.name + '());';

  fs.writeFileSync('../workspace/' + req.body.name + '.js', str, 'utf8');
  console.log(str);

  //console.log(str);
  res
    .status(201)
    .send({
      message: str
    });
}

function CodeHelper () {

  var indentLevel = 0,
    indentString = '  ',
    indentation = function () {
      var str = '';
      for (var i = 0; i < indentLevel; ++i) {
        str += indentString;
      }
      return str;
    };

  this.code = '';

  this.indent = function () {
    indentLevel += 1;
    return this;
  };

  this.dedent = function () {
    indentLevel -= 1;
    return this;
  };



  this.commentBegin = function () {
    this.code += indentation() + '/**\n';
    return this;
  };
  this.commentLine = function (text) {
    this.code += indentation() + ' * ' + text + '\n';
    return this;
  };
  this.commentEnd = function () {
    this.code += indentation() + ' */\n';
    return this;
  };

  this.line = function (text) {
    this.code += indentation() + text + '\n';
    return this;
  };
}

function getClassCode (req) {
  var data = req.body,
    gen = new CodeHelper ();

  // class comment
  gen.commentBegin()
    .commentLine('@constructor')
    .commentLine('@struct')
    .commentEnd();

  // open class declaration
  gen.line('function ' + data.name + '() {').indent();

  // properties
  for (var i = 0, length = data.properties.length; i < length; ++i) {
    var prop = data.properties[i];
    gen.commentBegin();
    if (prop.constant) {
      gen.commentLine('@const');
    }
    gen.commentLine('@type {' + (prop.nullable ? '?' : '!') + prop.type + '}')
      .commentEnd();

    var str = 'this.' + prop.name;
    if (prop.default) {
      switch (prop.type) {
        case 'string': prop.default = "'" + prop.default + "'"; break;
        default: break;
      }
      str += ' = ' + prop.default;
    }
    str += ';\n';


    gen.line(str);
  }


  // methods
  for (var i = 0, length = data.methods.length; i < length; ++i) {
    var met = data.methods[i];
    gen.commentBegin();
    for (var j = 0, jj = met.params.length; j < jj; ++j) {
      var parm = met.params[j];
      gen.commentLine('@param {' + parm.type + '} ' + parm.name)
    }
    gen.commentLine('@returns {' + met.returnType + '}')
      .commentEnd();


    // parameters
    // TODO: OPTIONAL PARAMETERS
    var ar = [];
    for (var j = 0, jj = met.params.length; j < jj; ++j) {
      var parm = met.params[j];
      ar.push(parm.name);
    }

    gen.line('this.' + met.name + ' = function (' + ar.join(', ') + ') {').indent()
        .line(met.body).dedent()
      .line('}');
  }


  // close class declaration
  gen.dedent().line('}');

  return gen.code;
}

