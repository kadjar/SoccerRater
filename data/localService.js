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