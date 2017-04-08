import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import routes from './routes';
import configureStore from './utils/configureStore';
import { updateVotes } from './actions/slotsActions';

import '!file-loader?name=[name].[ext]!./static/icon-72x72.png';
import '!file-loader?name=[name].[ext]!./static/icon-96x96.png';
import '!file-loader?name=[name].[ext]!./static/icon-128x128.png';
import '!file-loader?name=[name].[ext]!./static/icon-144x144.png';
import '!file-loader?name=[name].[ext]!./static/icon-152x152.png';
import '!file-loader?name=[name].[ext]!./static/icon-192x192.png';
import '!file-loader?name=[name].[ext]!./static/icon-384x384.png';
import '!file-loader?name=[name].[ext]!./static/icon-512x512.png';

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

if ('serviceWorker' in navigator) {
  runtime.register().then((registration) => {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch((err) => {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

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
