const _ = require('lodash');

function setSlots(state, slots) {
  return [
    ...state,
    ...slots,
  ];
}

function updateAttendees(state, choosenTalks) {
  state.map((s) => {
    const selectedTalk = _(choosenTalks).filter({ period: s.period }).first();
    if (selectedTalk !== undefined) {
      return s.talks.map((t) => (t.id === selectedTalk.talk) ? Object.assign({}, t, {
        attendees: t.attendees + 1,
      }) : t);
    }
    return s;
  });
}

module.exports = {
  setSlots,
  updateAttendees,
};
