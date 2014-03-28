var eventTextMap = {
  caution: { eventText: "has been cautioned.", adjustment: -2 },
  foul: { eventText: "committed a foul.", adjustment: -.5 },
  wasFouled: { eventText: "was fouled.", adjustment: .25 },
  missedAttempt: { eventText: "fires a shot, but missed!", adjustment: -.5 },
  savedAttempt: { eventText: "fires a shot, but it was saved!", adjustment: .5 },  
  save: { eventText: "with the save.", adjustment: .5 },
  offside: { eventText: "was caught offside.", adjustment: -.25 },
  goal: { eventText: "scored a goal!", adjustment: 3 },
  assist: { eventText: "with the assist.", adjustment: 1.5 },
  missedSave: { eventText: "couldn't block the shot.", adjustment: -3 }
}

module.exports = function(type, playerData) {
  this.type = type;
  this.eventText = eventTextMap[type].eventText;
  this.player = playerData.player;
  this.team = playerData.team;
  this.adjustment = eventTextMap[type].adjustment;
}