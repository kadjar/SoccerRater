var   fs = require('fs')
,      Q = require('q');

var PATH = '/static/'
,    EXT = '.json'; 

exports.get = function(filename) {
  return _readFile(filename);
}

function _readFile(filename) {
  var file = __dirname + PATH + filename + EXT;
  console.log('readfile', file)
  var d = Q.defer();
  
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    var obj = JSON.parse(data)
    d.resolve(obj);
  });

  return d.promise;
}
