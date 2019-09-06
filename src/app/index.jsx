import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {LocaleProvider} from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import moment from 'moment';
import createStore from './store';
import Routes from './routes.container';
import {createBrowserHistory} from 'history';
import 'moment/locale/ru';
import {configure} from './api';

const history = createBrowserHistory();
const store = createStore({history}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); // REDUX chrome extension - проверка экшенов

console.log('store', history);

configure();

moment.locale('ru');

const App = () => (
  <ReduxProvider store={store}>
    <LocaleProvider locale={ruRU}>
      <Routes history={history}/>
    </LocaleProvider>
  </ReduxProvider>
);

export default App;
