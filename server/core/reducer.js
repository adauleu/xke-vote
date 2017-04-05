const { setSlots, updateAttendees } = require('./slots');
const ROOMS = require('../conf/rooms');
const _ = require('lodash');
const uuid = require('uuid');

const defaultState = {
  session: {
    status: 'UNKNOWN',
  },
  slots: [],
  voters: [],
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        session: {
          id: uuid.v4(),
          status: 'ACTIVE',
        },
        slots: setSlots([], action.slots[action.moment]),
        voters: [],
      };
    case 'TERMINATE_SESSION':
      const updatedSlots = chooseRooms(state.slots)
      return Object.assign({}, state, {
        slots: updatedSlots,
        session: {
          id: state.session.id,
          status: 'TERMINATE',
        },
      });
    case 'SUBMIT_CHOOSEN_TALKS':
      if (!_.find(state.voters,
          action.voter) || !action.checkVote) {
        console.log('########', action.choosenTalks);
        const updatedState = updateAttendees(state, action.choosenTalks);
        return Object.assign({},updatedState, {voters: state.voters.concat([action.voter])});
      }
      return state;
    default:
      return state;
  }
};

const chooseRooms = (slots) => slots.map((s) => {
  const roomsByPriority = _.sortBy(ROOMS, ['priority']).reverse();
  const talks = _(s.talks).sortBy(['id']).sortBy(['attendees']).value().reverse();

  console.log('choose room', roomsByPriority, talks)

  return Object.assign({}, s, {
    talks: talks.map((t) => {
      let selectedRoom;
      if (_.isUndefined(t.room)) {
        selectedRoom = roomsByPriority.pop().name;
      } else {
        selectedRoom = t.room;
        _.remove(roomsByPriority, (r) => r.name === selectedRoom);
      }
      return Object.assign({}, t, { room: selectedRoom });
    }),
  });
});

module.exports = reducer;
