import {setSlots, updateAttendees} from './slots';
import {rooms} from '../conf/rooms';
import _ from 'lodash';
import uuid from 'uuid';

const defaultState = {session: {status: "UNKNOWN"}, slots: [], voters: []};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'START_SESSION':
      return {session: {id: uuid.v4(), status: "ACTIVE"}, slots: setSlots([], action.slots[action.moment]), voters: []};
      break;
    case 'TERMINATE_SESSION':
      return {...state, slots: chooseRooms(state.slots), session: {id: state.session.id, status: "TERMINATE"}};
      break;
    case 'SUBMIT_CHOOSEN_TALKS':
      if (!_.contains(state.voters, action.voter) || !action.checkVote) {
        updateAttendees(state.slots, action.choosenTalks);
        return {...state, voters: [...state.voters, action.voter]};
      } else {
        return state;
      }

      break;
  }
  return state;
};

const chooseRooms = (slots) => {
  return slots.map(s => {
    var roomsByPriority = _.sortBy(rooms, 'priority').reverse();
    var talks = _(s.talks).sortBy('id').sortBy('attendees').value().reverse();
    return {
      ...s, talks: talks.map(t => {
        let selectedRoom;
        if (_.isUndefined(t.room)) {
          selectedRoom = roomsByPriority.pop().name;
        } else {
          selectedRoom = t.room;
          _.remove(roomsByPriority, (r) => r.name === selectedRoom);
        }
        return {...t, room: selectedRoom};
      })
    };
  });
};

export default reducer;