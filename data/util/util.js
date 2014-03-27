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