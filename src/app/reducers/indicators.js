import {handleActions} from 'redux-actions';
import {indicators as actions} from '../actions';

const defaultState = {
  loading: false,
  error: undefined,
  data: undefined
};

// debugger;
// console.log('REDUCER INDICATORS');

export default handleActions({
  [actions.INDICATORS_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.INDICATORS_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    data: payload
  }),
  [actions.INDICATORS_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    data: undefined
  })
}, defaultState);
