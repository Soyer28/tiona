import {handleActions} from 'redux-actions';
import {favorites as actions} from '../actions';

const defaultState = {
  loading: false,
  error: undefined,
  data: undefined
};

// debugger;
// console.log('REDUCER FAVORITES');

export default handleActions({
  [actions.FAVORITES_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.FAVORITES_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    data: payload
  }),
  [actions.FAVORITES_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    data: undefined
  })
}, defaultState);
