import { createAction } from 'redux-actions';

export const LOGIN_SUCCESS = createAction('AUTH/LOGIN/SUCCESS');
export const LOGIN_FAILURE = createAction('AUTH/LOGIN/FAILURE');
export const LOGIN_REQUEST = createAction('AUTH/LOGIN/REQUEST');

export const LOGOUT_REQUEST= createAction('AUTH/LOGOUT/REQUEST');
export const LOGOUT_SUCCESS= createAction('AUTH/LOGOUT/SUCCESS');
