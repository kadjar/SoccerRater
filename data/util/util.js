exports.randomInt = function(ceil, floor) {
  // will never == ceil
  floor = floor || 0;
  var diff = ceil - floor;
  return floor + Math.floor(Math.random() * diff);
}
exports.randomBool = function() {
  return this.randomInt(2) == true;
}
exports.opposite = function(inp) {
  return Math.abs(inp - 1);
}

exports._relativeRating = function(current, newAmt) {
  return (((5 - Math.abs(5 - current)) / 5) * newAmt);
}
exports._generateGraph = function(graph, stamp, newAmt) {
  return graph += " L " + (stamp * 100) + " " + ((10 - newAmt) * 10)
}