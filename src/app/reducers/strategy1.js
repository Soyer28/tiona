import {handleActions} from 'redux-actions';
import {strategy as actions} from '../actions';

const defaultState = {
  loading: false,
  error: undefined,
  items: undefined
};

export default handleActions({
  [actions.STRATEGY_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.STRATEGY_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    items: payload
  }),
  [actions.STRATEGY_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    items: undefined
  })
}, defaultState);