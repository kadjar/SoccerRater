var   fs = require('fs')
,      Q = require('q')
,     ce = require('cloneextend')
, events = require('events');

var   gf = require('./game/gameFactory.js');

exports.getGame = function(id) {
  return gf.getGame(id);
}
exports.resetGame = function(id) {
  return gf.resetGame(id);
}

// var      newGame = {}
// ,    currentGame = {}
// ,      gameClock;

// var speedModifier = 10;

// exports.init = function() {
//   var d = Q.defer();  
//   readFile('/static/gameData.json').then(function(data) {
//     newGame = {data: data[0]}
//     d.resolve(data[0]);
//   })
//   return d.promise;
// }
// exports.getCurrent = function() {
//   var d = Q.defer();  
//   d.resolve(currentGame);  
//   return d.promise;
// }

// exports.startGame = function () {
//   var d = Q.defer();

//   currentGame = gm.init(newGame);
//   d.resolve(currentGame);

//   return d.promise;
// }
// exports.stopGame = function() {  
//   currentGame.stop();
//   currentGame = newGame;
// }
// exports.getMatchData = function() {
//   var d = Q.defer();
//   d.resolve(currentGame.data.match);
//   return d.promise;
// }

// exports.receivePlayerRating = function(sub) {
//   currentGame.userRatings.addRating(sub);
// }


// function readFile(filename) {
//   var file = __dirname + filename;
//   var d = Q.defer();
  
//   fs.readFile(file, 'utf8', function (err, data) {
//     if (err) {
//       console.log('Error: ' + err);
//       return;
//     }
//     var obj = JSON.parse(data)
//     d.resolve(obj);
//   });

//   return d.promise;
// }

