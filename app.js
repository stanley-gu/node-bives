
/**
 * Module dependencies.
 */

var io = require('socket.io').listen(8002),
exec = require('child_process').exec,
fs = require('fs');

io.sockets.on('connection', function (socket) {
  socket.on('getDiff', function (data) {
    fs.writeFile("first.xml", data.first, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });

    fs.writeFile("second.xml", data.second, function(err) {
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
        socket.emit('response', output);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
    console.log(data);
  });
});
