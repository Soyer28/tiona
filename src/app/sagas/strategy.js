import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {strategy} from '../actions';
import {api} from '../api';
import _ from 'lodash';

// const getIdByURL = url => {
//   const re = url.match(/\/(\d+)\/$/);
//   if (re) {
//     return Number(re[1]);
//   }
//   return null;
// };

function* lookup() {
  try {
    const response = yield call(api.lookupStrategy1);

    // debugger;
    // console.log('Response sagas Strategy', response);

    yield put(strategy.STRATEGY_SUCCESS(response));

  } catch (e) {
    yield put(strategy.STRATEGY_FAILURE(e));
  }
}

function* get({payload}) {
  try {
    const response = yield call(api.getStrategy1, payload);
    yield put(strategy.STRATEGY_GET_SUCCESS(response));

  } catch (e) {
    yield put(strategy.STRATEGY_GET_FAILURE(e));
  }
}

function* update({payload: {id, patch}}) {
  try {
    const response = yield call(api.updateStrategy1, id, patch);
    yield put(strategy.STRATEGY_UPDATE_SUCCESS(response));
    yield put(strategy.STRATEGY_GET_REQUEST(id));

  } catch (e) {
    yield put(strategy.STRATEGY_UPDATE_FAILURE(e));
  }
}

function* allowed({payload: {id, allowed}}) {
  try {
    const response = yield call(api.updateStrategy1, id, {allowed});
    yield put(strategy.STRATEGY_ALLOWED_SUCCESS(response));
    yield put(strategy.STRATEGY_REQUEST());

    yield put(strategy.STRATEGY_GET_REQUEST(id));

  } catch (e) {
    yield put(strategy.STRATEGY_ALLOWED_FAILURE(e));
  }
}

function* create({payload: {patch}}) {
  try {
    const response = yield call(api.addStrategy1, patch);
    yield put(strategy.STRATEGY_CREATE_SUCCESS(response));
    yield put(push('/strategy1'));

  } catch (e) {
    yield put(strategy.STRATEGY_CREATE_FAILURE(e));
  }
}

function* remove({payload: {id}}) {
  try {
    const response = yield call(api.deleteStrategy1, id);
    yield put(strategy.STRATEGY_REMOVE_SUCCESS(response));
    yield put(strategy.STRATEGY_REQUEST());

  } catch (e) {
    yield put(strategy.STRATEGY_REMOVE_FAILURE(e));
  }
}

function* restart({payload: id}) {
  try {
    yield call(api.updateStrategy1, id, {allowed: false});
    yield call(api.updateStrategy1, id, {allowed: true});

    yield put(strategy.STRATEGY_RESTART_SUCCESS(id));

  } catch (e) {
    yield put(strategy.STRATEGY_RESTART_FAILURE(e));
  }
}

export default [
  takeLatest(strategy.STRATEGY_REQUEST, lookup),
  takeLatest(strategy.STRATEGY_GET_REQUEST, get),
  takeLatest(strategy.STRATEGY_UPDATE_REQUEST, update),
  takeLatest(strategy.STRATEGY_RESTART_REQUEST, restart),
  takeLatest(strategy.STRATEGY_ALLOWED_REQUEST, allowed),
  takeLatest(strategy.STRATEGY_CREATE_REQUEST, create),
  takeLatest(strategy.STRATEGY_REMOVE_REQUEST, remove)

];
