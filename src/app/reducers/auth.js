import {handleActions} from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
  process: false,
  error: undefined,
  authenticated: false
};

export default handleActions({
  [actions.auth.LOGIN_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    process: true,
    authenticated: false
  }),
  [actions.auth.LOGIN_SUCCESS]: (state) => ({
    ...state,
    error: undefined,
    process: false,
    authenticated: true
  }),
  [actions.auth.LOGIN_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    process: false,
    authenticated: false
  }),
  [actions.auth.LOGOUT_SUCCESS]: (state) => ({
    ...state,
    error: undefined,
    process: false,
    authenticated: false
  })
}, defaultState);