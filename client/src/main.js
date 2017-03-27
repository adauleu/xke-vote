import React from 'react';
import ReactDOM from 'react-dom';
import {useRouterHistory} from 'react-router';
import {createHistory} from 'history';
import routes from './routes';
import Root from './components/containers/Root';
import configureStore from './utils/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';
import {updateVotes} from './actions/slotsActions';
import '!file-loader?name=[name].[ext]!./manifest.json'

injectTapEventPlugin();

const historyConfig = {basename: __BASENAME__};
const history = useRouterHistory(createHistory)(historyConfig);

const initialState = window.__INITIAL_STATE__;

export const socket = io(`${location.protocol}//${location.host}`);

const store = configureStore({initialState, history, socket});

socket.on('updateVotes', state =>
  store.dispatch(updateVotes(state))
);

// socket.on('updateSession', state =>
//   store.dispatch(updateSession(state))
// );

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} socket={socket}/>,
  document.getElementById('root')
);
