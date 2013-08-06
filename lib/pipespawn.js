
var spawn = require("child_process").spawn;
var PassThrough = require('stream').PassThrough;
var Q = require("q");


module.exports = function(cmd, args) {
  var d = Q.defer();
  var p = spawn(cmd, args || [], {
      detached: false // leapd and friends should die when Eleet dies
  });

  p.on("error", d.reject);
  p.on("exit", d.resolve);

  d.promise.stream = new PassThrough();
  d.promise.process = p;

  p.stdout.pipe(d.promise.stream);
  p.stderr.pipe(d.promise.stream);

  return d.promise;
};


