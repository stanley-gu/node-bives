'use strict';
/**
 * Module dependencies.
 */

var temp = require('temp').track(),
  exec = require('child_process').exec,
  fs = require('fs'),
  async = require('async');

function parallelSaveAsFiles(first, second, callback) {
  var prefix = 'bives_diff';
  async.parallel({
    first: function(cb) {
      temp.open(prefix, function(err, info) {
        if (!err) {
          fs.write(info.fd, first);
          fs.close(info.fd, function() {
            cb(null, info.path);
          });
        }
      });
    },
    second: function(cb) {
      temp.open(prefix, function(err, info) {
        if (!err) {
          fs.write(info.fd, second);
          fs.close(info.fd, function() {
            cb(null, info.path);
          });
        }
      });
    }
  }, function(err, results) {
    callback(err, results);
  });
}


var getDiff = function(params) {
  var first = params.first,
      second = params.second,
      callback = params.callback,
      opts = params.opts;

  if (!opts) {
    opts = '--json --SBML';
  }
  var command = 'java -jar lib/BiVeS-SBML-1.3.5.jar ' + opts;

  async.waterfall([

    function(cb) {
      parallelSaveAsFiles(
        first,
        second,
        cb
      );
    },
    function(filePaths, cb) {
      command += ' ' + filePaths.first + ' ' + filePaths.second;
      exec(command, function(error, stdout, stderr) {
        if (error) {
          cb(error);
        } else if (stderr) {
          cb(stderr);
        } else if (stdout) {
          cb(null, stdout);
        }
      });
    }
  ], function(err, result) {
    callback(err, result);
    temp.cleanup();
  });
};

exports.getDiff = getDiff;
