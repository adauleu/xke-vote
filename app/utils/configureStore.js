import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import socketIoMiddleware from '../utils/socket_io_middleware';

const isDev = process.env.NODE_ENV !== 'production';

export default function configureStore({ initialState = {}, history, socket }) {
  // Sync with router via history instance (main.js)
  // const routerHistory = syncHistory(history);
  // const routerMiddleware = applyMiddleware(thunk, routerHistory);

  // socket io middleware
  // const socketMiddleware = applyMiddleware(socketIoMiddleware(socket));

  const middlewares = [
    thunk,
    routerMiddleware(history),
    socketIoMiddleware(socket),
  ];

  // Compose final middleware and use devtools in debug environment
  // let middleware = compose(routerMiddleware, socketMiddleware);

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // if (__DEBUG__) {
  //   const devTools = window.devToolsExtension
  //     ? window.devToolsExtension()
  //     : require('components/containers/DevTools').default.instrument();
  //   middleware = compose(routerMiddleware, socketMiddleware, devTools);
  // }
  const composeEnhancers =
    isDev &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

  // Create final store and subscribe router in debug env ie. for devtools
  // const store = middleware(createStore)(rootReducer, initialState);
  const store = createStore(rootReducer, initialState, composeEnhancers(...enhancers));
  // if (isDev) routerHistory.listenForReplays(store, ({ router }) => router.location);

  if (module.hot) {
    module.hot.accept('../reducers/rootReducer', () => {
      const nextRootReducer = require('../reducers/rootReducer').default;

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
