var   R = require('../rating/rating.js');

module.exports = function(raw) {
  for (var key in raw) {
    this[key] = raw[key];
  }

  this.gameStats = { 
    stats: {},
    liveRating: new R('live'),
    proRating: new R('pro')
  }
}


