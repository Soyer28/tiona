import { createAction } from 'redux-actions';

export const STRATEGY_CLEAR = createAction('STRATEGY/CLEAR');

export const STRATEGY_SUCCESS = createAction('STRATEGY/SUCCESS');
export const STRATEGY_FAILURE = createAction('STRATEGY/FAILURE');
export const STRATEGY_REQUEST = createAction('STRATEGY/REQUEST');

export const STRATEGY_RESTART_SUCCESS = createAction('STRATEGY/RESTART/SUCCESS');
export const STRATEGY_RESTART_FAILURE = createAction('STRATEGY/RESTART/FAILURE');
export const STRATEGY_RESTART_REQUEST = createAction('STRATEGY/RESTART/REQUEST');

export const STRATEGY_GET_SUCCESS = createAction('STRATEGY/GET/SUCCESS');
export const STRATEGY_GET_FAILURE = createAction('STRATEGY/GET/FAILURE');
export const STRATEGY_GET_REQUEST = createAction('STRATEGY/GET/REQUEST');

export const STRATEGY_UPDATE_SUCCESS = createAction('STRATEGY/UPDATE/SUCCESS');
export const STRATEGY_UPDATE_FAILURE = createAction('STRATEGY/UPDATE/FAILURE');
export const STRATEGY_UPDATE_REQUEST = createAction('STRATEGY/UPDATE/REQUEST');

export const STRATEGY_CREATE_SUCCESS = createAction('STRATEGY/CREATE/SUCCESS');
export const STRATEGY_CREATE_FAILURE = createAction('STRATEGY/CREATE/FAILURE');
export const STRATEGY_CREATE_REQUEST = createAction('STRATEGY/CREATE/REQUEST');


export const STRATEGY_REMOVE_SUCCESS = createAction('STRATEGY/REMOVE/SUCCESS');
export const STRATEGY_REMOVE_FAILURE = createAction('STRATEGY/REMOVE/FAILURE');
export const STRATEGY_REMOVE_REQUEST = createAction('STRATEGY/REMOVE/REQUEST');

export const STRATEGY_ALLOWED_SUCCESS = createAction('STRATEGY/ALLOWED/SUCCESS');
export const STRATEGY_ALLOWED_FAILURE = createAction('STRATEGY/ALLOWED/FAILURE');
export const STRATEGY_ALLOWED_REQUEST = createAction('STRATEGY/ALLOWED/REQUEST');