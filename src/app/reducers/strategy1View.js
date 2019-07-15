import {handleActions} from 'redux-actions';
import {strategy as actions} from '../actions';

const defaultState = {
  loading: false,
  error: undefined,
  strategy: undefined
};

export default handleActions({
  [actions.STRATEGY_CLEAR]: () => defaultState,
  [actions.STRATEGY_GET_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.STRATEGY_GET_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    strategy: payload
  }),
  [actions.STRATEGY_GET_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    strategy: undefined
  }),
  [actions.STRATEGY_UPDATE_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.STRATEGY_UPDATE_SUCCESS]: (state) => ({
    ...state,
    error: undefined,
    loading: false
  }),
  [actions.STRATEGY_UPDATE_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false
  })
}, defaultState);