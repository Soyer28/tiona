import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {routerMiddleware} from 'connected-react-router';
import sagas from '../sagas';
import {getReducers} from '../reducers';

export default ({history}) => {
  const composeEnhancers = (
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) || compose;
  const sagaMiddleware = createSagaMiddleware();
  const reducers = getReducers({history});
  const store = createStore(reducers, composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  ));

  sagaMiddleware.run(sagas);

  return store;

};