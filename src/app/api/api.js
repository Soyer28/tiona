import {auth, client} from './helpers';

export const login = (payload) => auth(payload) || client.get('/');
export const logout = () => auth({});


export const lookupStrategy1 = () => client.get('/strategies/?last_event=on');

export const addStrategy1 = (payload) => client.post('/strategy1/', payload);
export const getStrategy1 = (id) => client.get(`/strategy1/${id}/`);

export const updateStrategy1 = (id, payload) => client.patch(`/strategy1/${id}/`, payload);
export const deleteStrategy1 = (id) => client.delete(`/strategy1/${id}/`);

export const lookupExchangeAccounts = () => client.get('/exchange_accounts/');

export const indicatorVolatility = () => client.get('/favorites/');

export const lookupFavorites = () => client.get('/favorites/');
export const getFavorites = (id) => client.get(`/favorites/${id}/`);
export const updateFavorites = (id, payload) => client.patch(`/favorites/${id}/`, payload);
export const deleteFavorites = (id) => client.delete(`/favorites/${id}/`);

export const favoritesLightVolatility = () => client.get('/favoritesLight_volatility/');

export const getTradeStrategy = (id) => client.get(`/trade/?strategy=${id}`);

