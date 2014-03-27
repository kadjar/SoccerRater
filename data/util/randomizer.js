module.exports = function(ctxt) {
  this.ctxt = ctxt;
  this._array = [];
  this._oddsBase = 0;

  this.register = function(odds, callback) {
    odds += this._oddsBase;
    this._array.push({ odds: odds, callback: callback})
  }
  this.getRandom = function() {
    var rando = Math.random();

    this._array.some(function(item) {
      if (rando < item.odds) {
        item.callback.call(ctxt);
        return true;
      }
      return false;
    })
  }
}