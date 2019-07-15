import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import rootReducer from './root';
import auth from './auth';
import strategy1 from './strategy1';
import strategy1View from './strategy1View';
import logs from './logs';
import indicators from './indicators';
import favorites from './favorites';

const appReducers = ({history}) => combineReducers({
  router: connectRouter(history),
  auth,
  strategy1,
  strategy1View,
  logs,
  indicators,
  favorites
});

export const getReducers = ({history}) => (state, action) => {
  const newState = rootReducer(state, action);
  return appReducers({history})(newState, action);
};
