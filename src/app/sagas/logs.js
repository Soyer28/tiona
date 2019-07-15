import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {logs} from '../actions';
import {api} from '../api';

function* lookup({payload}) {
  try {
    const response = yield call(api.getTradeStrategy, payload);
    yield put(logs.LOGS_SUCCESS(response));

  } catch (e) {
    yield put(logs.LOGS_FAILURE(e));
  }
}

export default [
  takeLatest(logs.LOGS_REQUEST, lookup)

];
