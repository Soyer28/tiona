import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {favorites} from '../actions';
import {api} from '../api';
import _ from 'lodash';
import * as strategy from '../actions/strategy';

//
// function* lookup() {
//   try {
//     const response = yield call(api.lookupFavorites);
//
//     // debugger;
//     // console.log('Response sagas favorites', response);
//
//     yield put(favorites.FAVORITES_SUCCESS(response));
//
//   } catch (e) {
//     yield put(favorites.FAVORITES_FAILURE(e));
//   }
// }
//

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

function* get({payload}) {
  try {
    const response = yield call(api.getFavorites, payload);
    yield put(favorites.FAVORITES_GET_SUCCESS(response));

  } catch (e) {
    yield put(favorites.FAVORITES_GET_FAILURE(e));
  }
}

function* update({payload: {id, patch}}) {
  try {
    const response = yield call(api.updateFavorites, id, patch);
    yield put(favorites.FAVORITES_UPDATE_SUCCESS(response));
    yield put(favorites.FAVORITES_GET_REQUEST(id));

  } catch (e) {
    yield put(favorites.FAVORITES_UPDATE_FAILURE(e));
  }
}
//
// function* allowed({payload: {id, allowed}}) {
//   try {
//     const response = yield call(api.updatefavorites1, id, {allowed});
//     yield put(favorites.favorites_ALLOWED_SUCCESS(response));
//     yield put(favorites.favorites_REQUEST());
//
//     yield put(favorites.favorites_GET_REQUEST(id));
//
//   } catch (e) {
//     yield put(favorites.favorites_ALLOWED_FAILURE(e));
//   }
// }
//
// function* create({payload: {patch}}) {
//   try {
//     const response = yield call(api.addfavorites1, patch);
//     yield put(favorites.favorites_CREATE_SUCCESS(response));
//     yield put(push('/favorites1'));
//
//   } catch (e) {
//     yield put(favorites.favorites_CREATE_FAILURE(e));
//   }
// }
//
// function* remove({payload: {id}}) {
//   try {
//     const response = yield call(api.deletefavorites1, id);
//     yield put(favorites.favorites_REMOVE_SUCCESS(response));
//     yield put(favorites.favorites_REQUEST());
//
//   } catch (e) {
//     yield put(favorites.favorites_REMOVE_FAILURE(e));
//   }
// }
//
// function* restart({payload: id}) {
//   try {
//     yield call(api.updatefavorites1, id, {allowed: false});
//     yield call(api.updatefavorites1, id, {allowed: true});
//
//     yield put(favorites.favorites_RESTART_SUCCESS(id));
//
//   } catch (e) {
//     yield put(favorites.favorites_RESTART_FAILURE(e));
//   }
// }

// export default [
//   takeLatest(favorites.FAVORITES_REQUEST, lookup)
// ];

export default [
  takeLatest(favorites.FAVORITES_REQUEST, lookup),
  takeLatest(favorites.FAVORITES_GET_REQUEST, get),
  takeLatest(favorites.FAVORITES_UPDATE_REQUEST, update),
  // takeLatest(favorites.favorites_RESTART_REQUEST, restart),
  // takeLatest(favorites.favorites_ALLOWED_REQUEST, allowed),
  // takeLatest(favorites.favorites_CREATE_REQUEST, create),
  // takeLatest(favorites.favorites_REMOVE_REQUEST, remove)

];

