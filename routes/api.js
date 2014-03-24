/*
 * Serve JSON to our AngularJS client
 */
var dm = require('../data/dataModel.js');

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};
exports.game = function(req, res) {
  dm.getGame().then(function(data) {
    res.json(data);
  })  
}
exports.getevents = function(req, res) {
  res.json(dm.getEvents())
}
exports.startgame = function(req, res) {
  dm.startGame().then(function(data) {  
    res.json(data);
  })
}