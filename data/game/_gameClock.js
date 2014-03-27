var events = require('events');

module.exports = function(mod) {
  this.__proto__ = events.EventEmitter.prototype;

  this._SECOND = mod ? 1000 / mod : 1000;
  this._MINUTE = 60;
  this._FULLTIME = 5400;  

  this.start = function() {
    this.reset();
    this.kickoff = new Date();
    this._ticker = setInterval(this._tick.bind(this), this._SECOND);
  }

  this.stop = function() {
    clearInterval(this._ticker);
  }

  this.reset = function() {
    this.kickoff = null;
    this.seconds = 0;
    this.minutes = 0;
    this.text = '00:00';
  }

  this._tick = function() {
    if (this.seconds > this._FULLTIME) {
      this.stop();
      return;
    }

    if (this.seconds % this._MINUTE === 0) {
      this.minutes = this.seconds / this._MINUTE;
      this.emit('minute', this.minutes);
    }

    this.emit('second');

    this.seconds = _generateSeconds(new Date(), this.kickoff, this._SECOND);
    this.text = _generateText(this.seconds + 1);

    this.seconds++;
  }


  function _generateSeconds(time, kickoff, second) {
    return Math.floor((time - kickoff) / second) - 1;
  }

  function _generateText(secs) {
    var min = Math.floor(secs / 60)
    ,   sec = secs % 60;

    return _timePad(min) + ":" + _timePad(sec);
  }

  function _timePad(num) {
    return ("00" + num).slice(-2);
  }
}