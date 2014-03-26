var   fs = require('fs')
,      Q = require('q');

var   ds = require('../dataService.js')
,     PM = require('./_playerModel.js');

var db = null;

exports.init = function() {
  ds.get('players').then(function(res) {
    db = res;
  }.bind(this));
};

exports.getPlayer = function(id) { 
  return playerFilter(id)[0];
}

exports.resetPlayers = function() {
  db.forEach()
}

function playerFilter(id) {
  return db.filter(function(item) {
    return item.id == id;
  })
}