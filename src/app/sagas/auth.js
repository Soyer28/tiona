import {takeLatest, put, call} from 'redux-saga/effects';
import {auth} from '../actions';
import {api} from '../api';

function* login({payload}) {
  try {
    const response = yield call(api.login, payload);
    yield put(auth.LOGIN_SUCCESS(response));

  } catch (e) {
    yield put(auth.LOGIN_FAILURE(e));
  }
}

function* logout() {
  try {
    yield call(api.logout);
    yield put(auth.LOGOUT_SUCCESS());
  } catch (e) {
    // fail
  }
}

export default [
  takeLatest(auth.LOGIN_REQUEST, login),
  takeLatest(auth.LOGOUT_REQUEST, logout)
];
