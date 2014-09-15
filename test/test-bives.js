'use strict';

var getDiff = require('../lib/bives').getDiff;
var async = require('async');
var request = require('request');

var firstUrl = 'https://raw.githubusercontent.com/stanleygu/simpleSbmlModel/80aad35047242cda253272c3a4a98904e432388d/model.sbml';
var secondUrl = 'https://raw.githubusercontent.com/stanleygu/simpleSbmlModel/80bbf49c9de4f8cfb30596ec01e58a9f118c42ef/model.sbml';

var requestFile =  function(url, cb) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      cb(null, body);
    } else {
      cb(error);
    }
  });
};
async.parallel({
  first: function(cb) {
    requestFile(firstUrl, cb);
  },
  second: function(cb) {
    requestFile(secondUrl, cb);
  }
}, function(err, results) {
  if (err) {
    console.log('ERROR: ' + err);
  } else {
    getDiff({
      first: results.first,
      second: results.second,
      callback: function(err, results) {
        if (err) {
          console.log('ERROR: ' + err);
        } else {
          console.log(results);
        }
      }
    });
  }
});

