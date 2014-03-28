var events = require('events');

module.exports = function(mod) {
  this.events = new events.EventEmitter();

  this._SECOND = mod ? 1000 / mod : 1000;
  this._MINUTE = 60;
  this._FULLTIME = 5400; 

  this.start = function() {
    this.resetData();
    this.kickoff = new Date();
    this._ticker = setInterval(this._tick.bind(this), this._SECOND);
  }

  this.stop = function() {
    clearInterval(this._ticker);
  }

  this.resetData = function() {
    this.kickoff = null;
    this.seconds = 0;
    this.minutes = 0;
    this.pctComplete = 0;
    this.text = '00:00';    
  }

  this.resetData();

  this._tick = function() {
    if (this.seconds > this._FULLTIME) {
      this.events.emit('gameOver');
      this.stop();
      return;
    }

    if (this.seconds % this._MINUTE === 0) {
      this.minutes = this.seconds / this._MINUTE;
      this.events.emit('minute', this.minutes);
    }

    this.events.emit('second');

    this.seconds = _generateSeconds(new Date(), this.kickoff, this._SECOND);
    this.text = _generateText(this.seconds + 1);
    this.pctComplete = _generatePct(this.seconds, this._FULLTIME);

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

  function _generatePct(secs, full) {
    return secs / full;
  }

  function _timePad(num) {
    return ("00" + num).slice(-2);
  }
}