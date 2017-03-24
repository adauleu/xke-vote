import _ from 'lodash';

export function setSlots(state, slots) {
  return [
    ...state,
    ...slots
  ];
}

export function updateAttendees(state, choosenTalks){
  state.map(s => {
    let selectedTalk = _(choosenTalks).filter({period: s.period}).first();
    if (selectedTalk !== undefined) {
      s.talks.map(t => {
        return (t.id === selectedTalk.talk) ? {...t, attendees: t.attendees++} : t;
      });
    } else {
      return s;
    }
  });
}