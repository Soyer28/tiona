import {takeLatest, put, call} from 'redux-saga/effects';
import {push} from 'connected-react-router';
import {indicators} from '../actions';
import {api} from '../api';
import _ from 'lodash';
import * as strategy from '../actions/strategy';

function* lookup() {
  try {
    const response = yield call(api.indicatorVolatility);

    // debugger;
    // console.log('Response sagas Indicators', response);

    yield put(indicators.INDICATORS_SUCCESS(response));

  } catch (e) {
    yield put(indicators.INDICATORS_FAILURE(e));
  }
}

export default [
  takeLatest(indicators.INDICATORS_REQUEST, lookup)

];
