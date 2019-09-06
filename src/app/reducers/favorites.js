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
  }),
  [actions.FAVORITES_CLEAR]: () => defaultState,
  [actions.FAVORITES_GET_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.FAVORITES_GET_SUCCESS]: (state, {payload}) => ({
    ...state,
    error: undefined,
    loading: false,
    favorites: payload
  }),
  [actions.FAVORITES_GET_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false,
    favorites: undefined
  }),
  [actions.FAVORITES_UPDATE_REQUEST]: (state) => ({
    ...state,
    error: undefined,
    loading: true
  }),
  [actions.FAVORITES_UPDATE_SUCCESS]: (state) => ({
    ...state,
    error: undefined,
    loading: false
  }),
  [actions.FAVORITES_UPDATE_FAILURE]: (state, {payload}) => ({
    ...state,
    error: payload,
    loading: false
  })
}, defaultState);
