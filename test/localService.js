// Tests for local service

var expect = require("chai").expect;
var ls = require("../data/localService.js");
 
describe("Game", function(){
  describe('#init()', function() {
    it('should return new game data', function() {
      ls.init().then(function(data) {
        expect(data.name).to.equal('Bayern Munich vs. Arsenal')
      })
    })
  })
 
});