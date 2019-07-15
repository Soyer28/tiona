import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {favoritesLight} from '../actions';
import {api} from '../api';
import _ from 'lodash';
import * as strategy from '../actions/strategy';

function* lookup() {
  try {
    const response = yield call(api.favoritesLightVolatility);

    yield put(favoritesLight.FAVORITESLIGHT_SUCCESS(response));

  } catch (e) {
    yield put(favoritesLight.FAVORITESLIGHT_FAILURE(e));
  }
}

export default [
  takeLatest(favoritesLight.FAVORITESLIGHT_REQUEST, lookup)

];
