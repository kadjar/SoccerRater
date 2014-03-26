var   fs = require('fs')
,      Q = require('q');

var   ds = require('../dataService.js')
,     PM = require('./_playerModel.js');

var raw = null
,    db = [];

exports.init = function() {
  ds.get('players').then(function(res) {
    raw = res;
    this.resetPlayers();
  }.bind(this));
};

exports.getPlayer = function(id) { 
  return playerFilter(id)[0];
}

exports.resetPlayers = function() {
  db = [];
  raw.forEach(function(player) {
    db.push(new PM(player))
  })
}

function playerFilter(id) {
  return db.filter(function(item) {
    return item.id == id;
  })
}