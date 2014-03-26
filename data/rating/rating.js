module.exports = function(type) { 
  this.type = type;
  this.cumulative = 5;
  this.atomic = [];
  this.graph = 'M '

  this.pushRating = function(newRating) {
    this.cumulative = newRating
  }
}