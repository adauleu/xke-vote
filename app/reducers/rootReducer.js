import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { slots } from '../reducers/slots';
import { session } from '../reducers/session';
import { voters } from '../reducers/voters';

export default combineReducers({
  routing: routerReducer,
  slots,
  session,
  voters,
});
