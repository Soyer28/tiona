import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {favorites} from '../actions';
import {api} from '../api';
import _ from 'lodash';
import * as strategy from '../actions/strategy';

function* lookup() {
  try {
    const response = yield call(api.lookupFavorites);

    // debugger;
    // console.log('Response sagas favorites', response);

    yield put(favorites.FAVORITES_SUCCESS(response));

  } catch (e) {
    yield put(favorites.FAVORITES_FAILURE(e));
  }
}

export default [
  takeLatest(favorites.FAVORITES_REQUEST, lookup)
];
