import { createStore, combineReducers, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import products from './reducers/product';
import users from './reducers/user';
import orders from './reducers/order';

const reducer = combineReducers({
  products,
  users,
  orders,
});

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware)
);

export default store;
