const { createStore } = require('redux');
const reducer = require('./reducer');

module.exports = function makeStore() {
  return createStore(reducer);
};

