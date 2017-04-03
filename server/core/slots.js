const _ = require('lodash');

function setSlots(state, slots) {
  return [
    ...state,
    ...slots,
  ];
}

function updateAttendees(state, choosenTalks) {
  // slots.map((s) => {
  //   const selectedTalk = _(choosenTalks).filter({ period: s.period }).first();
  //   if (selectedTalk !== undefined) {
  //     return s.talks.map((t) => (t.id === selectedTalk.talk) ? Object.assign({}, t, {
  //       attendees: t.attendees + 1,
  //     }) : t);
  //   }
  //   return s;
  // });
    console.log('SSSSSSS', state);
    const result = _.cloneDeep(state);
    choosenTalks.map(ct => {
        const slots = result.slots;
        const period = _.find(slots, {period: ct.period});
        const talk = _.find(period.talks, {id: ct.talk});

        if (talk) {
            console.log('kikou');
            const slotIndex = _.findIndex(result.slots, {period: ct.period});
            const talkIndex = _.findIndex(period.talks, {id: ct.talk});
            const update = _.update(result, `slots[${slotIndex}].talks[${talkIndex}].attendees`, (nb) => nb + 1);
            console.log('update', update);
            return update;
        }
    });
    return result;
}

module.exports = {
  setSlots,
  updateAttendees,
};
