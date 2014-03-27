module.exports = function() {
  this._array = [];
  this._oddsBase = 0;

  this.register = function(value, odds) {
    this._oddsBase += odds;
    this._array.push({ val: value, odds: this._oddsBase })
  }
  this.getRandom = function() {
    var rando = Math.random();
    var res = false;

    this._array.some(function(item) {
      if (rando < item.odds) {
        res = item.val;
        return true;        
      }
      return false;
    })

    return res;
  }
}