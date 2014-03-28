var   Pro = require('../rating/proRating.js')
,    Live = require('../rating/liveRating.js')

module.exports = function(raw) {
  for (var key in raw) {
    this[key] = raw[key];
  }

  this.gameStats = { 
    stats: {},
    liveRating: new Live(),
    proRating: new Pro()
  }
}


