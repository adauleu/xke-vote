import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import routes from './routes';
import Root from './components/containers/Root';
import configureStore from './utils/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';
import {updateVotes, updateSession} from './actions/slotsActions';

injectTapEventPlugin();

const historyConfig = {basename: __BASENAME__};
const history = useRouterHistory(createHistory)(historyConfig);

const initialState = window.__INITIAL_STATE__;

export const socket = io(`${location.protocol}//${location.hostname}`);

const store = configureStore({initialState, history, socket});

socket.on('updateVotes', state =>
  store.dispatch(updateVotes(state))
);

socket.on('updateSession', state =>
  store.dispatch(updateSession(state))
);

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} socket={socket}/>,
  document.getElementById('root')
);
