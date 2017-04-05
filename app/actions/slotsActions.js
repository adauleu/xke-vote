import 'whatwg-fetch';

import makeActionCreator from '../utils/actionCreator';
import getClientId from '../utils/clientId';

const SELECT_TALK = 'SELECT_TALK';
const REFRESH_SLOT = 'REFRESH_SLOT';
const SUBMIT_CHOOSEN_TALKS = 'SUBMIT_CHOOSEN_TALKS';
const UPDATE_VOTES = 'UPDATE_VOTES';
const UPDATE_SESSION = 'UPDATE_SESSION';
// const START_SESSION = 'START_SESSION';
const TERMINATE_SESSION = 'TERMINATE_SESSION';
const SUBMIT_NOTIFICATION_SUBSCRIPTION = 'SUBMIT_NOTIFICATION_SUBSCRIPTION';

export const selectTalk = makeActionCreator(SELECT_TALK, 'period', 'talkId');
export const refreshSlot = makeActionCreator(REFRESH_SLOT, 'period');
export const updateVotes = makeActionCreator(UPDATE_VOTES, 'updateVotes');
export const updateSession = makeActionCreator(UPDATE_SESSION, 'updateSession');

// export const startSession = (moment) => {
//   return {
//     type: START_SESSION,
//     moment: moment,
//     meta: {
//       remote: true
//     }
//   };
// };

export const getServerStore = () => (dispatch) => fetch('/api/store')
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  })
  .then((data) => dispatch(updateSession(data)));

export const startSession = (moment) => (dispatch) => fetch(`/api/session-start/${moment}`)
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  })
  .then((data) => dispatch(updateSession(data)));

export const terminateSession = () => ({
  type: TERMINATE_SESSION,
  meta: {
    remote: true,
  },
});

export const submitChoosenTalks = (choosenTalks, checkVote) => ({
  type: SUBMIT_CHOOSEN_TALKS,
  choosenTalks,
  checkVote,
  voter: getClientId(),
  meta: {
    remote: true,
  },
});

export const updateServerNotificationSubscription = subscription => ({
  type: SUBMIT_NOTIFICATION_SUBSCRIPTION,
  subscription,
  id: getClientId(),
  meta: {
    remote: true,
  },
});

// export const updateServerNotificationSubscription = subscription => dispatch =>
//   fetch('/api/notifications/subscriptions', { method: 'POST', })
//     .then((response) => {
//       if (response.status >= 400) {
//         throw new Error('Bad response from server');
//       }
//       return response.json();
//     });
// .then((data) => dispatch(updateSession(data)));
