var util = require('../util/util.js');

module.exports = function() {
  this.cumulative = 5;
  this.atomic = [];
  this.graph = 'M 0 50';

  this._queue = [];

  this.pushRating = function(adj) {
    this._queue.push(adj)
  }

  this.flushQueue = function(stamp) {
    this._queue.forEach(function(adj) {
      this.cumulative += util._relativeRating(this.cumulative, adj);
    }, this)

    this.atomic.push(this.cumulative);
    this.graph = util._generateGraph(this.graph, stamp, this.cumulative)

    this._queue = [];
  }
}