import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';
import routes from './routes';
import configureStore from './utils/configureStore';
import { updateVotes } from './actions/slotsActions';

injectTapEventPlugin();

const initialState = {};

export const socket = io(`${location.protocol}//${location.host}`);


const store = configureStore({ initialState, browserHistory, socket });
const history = syncHistoryWithStore(browserHistory, store);

socket.on('updateVotes', (state) =>
  store.dispatch(updateVotes(state))
);

// socket.on('updateSession', state =>
//   store.dispatch(updateSession(state))
// );

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then((registration) => {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }).catch((err) => {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   });
// }

// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
    <div style={{ height: '100%' }}>
      <Router history={history}>
        {routes}
      </Router>
    </div>
  </Provider>,
  document.getElementById('root')
);
