import {handleActions} from 'redux-actions';
import {logs as actions} from '../actions';

const defaultState = {
  loading: false,
  error: undefined,
  logs: undefined
};

export default handleActions({
  [actions.LOGS_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.LOGS_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    logs: payload
  }),
  [actions.LOGS_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    logs: undefined
  })
}, defaultState);