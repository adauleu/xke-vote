import _ from 'lodash';

export const slots = (state = [], action) => {
  switch (action.type) {

    case 'SELECT_TALK':
    case 'REFRESH_SLOT':
      return state.map(s =>
        slot(s, action)
      );

    case 'UPDATE_SESSION':
      return action.updateSession.slots.map(slot => {
        return {
          ...slot,
          talks: slot.talks.map(talk => {
            return {
              ...talk,
              selected: false
            };
          }),
        };
      });

    case 'UPDATE_VOTES':
      return state.map(s => {
        return slot(s, action);
      });

    default:
      return state;
  }
};

const slot = (state, action) => {
  switch (action.type) {
    case 'SELECT_TALK':
    case 'REFRESH_SLOT':
      if (state.period !== action.period) {
        return state;
      }
      return {
        ...state, talks: state.talks.map(t =>
          talk(t, action)
        ),
      };
    case 'UPDATE_VOTES':
      return {
        ...state, talks: state.talks.map(t =>
          talk(t, action)
        ),
      };
    default:
      return state;
  }
};

const talk = (state, action) => {
  switch (action.type) {
    case 'REFRESH_SLOT':
      return unSelectTalk(state);
    case 'SELECT_TALK':
      return selectTalk(action.talkId, state);
    case 'UPDATE_VOTES':
      return updateAttendees(action.updateVotes.slots, state);
    default:
      return state;
  }
};

function updateAttendees (updatedVotes, state) {
  let talk = _(updatedVotes).map('talks').flatten().filter({id: state.id}).first();
  return {...state, attendees: talk.attendees};
}

function selectTalk (talkId, state) {
  return state.id !== talkId ? {...state, selected: false} : {...state, selected: true};
}

function unSelectTalk (state) {
  return {...state, selected: false};
}
