/*
 * GET home page.
 */

var exec = require('child_process').exec,
  fs = require('fs'),
  child;

exports.index = function(req, res) {
  'use strict';
  res.render('index', {
    title: 'Express'
  });
};

exports.bives = function(req, res) {
  'use strict';
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  fs.writeFile("first.xml", req.body.first, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  fs.writeFile("second.xml", req.body.second, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });

  var output = {};

  var command = 'java -cp BiVeS-1.1.jar de.unirostock.sems.bives.api.SBMLDiff first.xml second.xml';

  child = exec(command, function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    output.diff = stdout;
    //res.send(stdout);
    //res.send(200);
    command = 'java -cp BiVeS-1.1.jar de.unirostock.sems.bives.api.SBMLDiff --graphml first.xml second.xml';
    exec(command, function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      output.graphml = stdout;
      res.send(output);
      //res.send(200);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
};
