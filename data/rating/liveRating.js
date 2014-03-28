var util = require('../util/util.js');

module.exports = function() {
  this.cumulative = 5;
  this.atomic = [];
  this.graph = 'M 0 50';

  this._store = {};
  this._count = 0;
  this._sum = 0;

  this.pushRating = function(amt, id) {
    this._store[id] = amt;
    console.log('rating pushed:', amt, id, this._store)
  }

  this.flushQueue = function(stamp) {
    for (var id in this._store) {
      this._count++;
      this._sum += this._store[id];
    }

    if (this._count === 0)
      this.cumulative = 5;
    else 
      this.cumulative = this._sum / this._count;
    
    this.atomic.push(this.cumulative);
    this.graph = util._generateGraph(this.graph, stamp, this.cumulative);

    this._count = 0;
    this._sum = 0;
  }
}