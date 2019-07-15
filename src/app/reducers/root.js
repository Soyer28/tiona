import * as actions from '../actions';

export default (state, action) => {
  if(action === actions.auth.LOGOUT_SUCCESS) {
    return;
  }
  return state;
};
