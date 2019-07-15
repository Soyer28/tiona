import {all} from 'redux-saga/effects';
import auth from './auth';
import strategy from './strategy';
import logs from './logs';
import indicators from './indicators';
import favorites from './favorites';

export default function* () {
  yield all([
    ...auth,
    ...strategy,
    ...logs,
    ...indicators,
    ...favorites
  ]);
}
