import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch, Router} from 'react-router-dom';

import LoginPage from './pages/login';
import AppLayout from './components/appLayout';
import Strategy1 from './pages/strategy1';
import Strategy2 from './pages/strategy2';
import Strategy3 from './pages/strategy3';
import Strategy1Edit from './pages/strategy1/edit';
import Strategy1View from './pages/strategy1/view';
import Indicators from './pages/indicators';
import Favorites from './pages/favorites';
import FavoritesLight from './pages/favoritesLight';
import FavoritesV2 from './pages/favoritesV2';

export default class Routes extends React.PureComponent {
  static propTypes = {
    authenticated: PropTypes.bool,
    history: PropTypes.shape().isRequired
  };

  renderForAuthenticated() {
    return (
      <AppLayout>
        <Switch>
          <Route path="/strategy1" exact={true} component={Strategy1}/>
          {/*<Route path="/strategy1/new" exact={true} component={CreateUserPage}/>*/}
          <Route path="/strategy1/new/:strategyNum" exact={true} component={Strategy1Edit}/>
          <Route path="/strategy1/edit/:strategyId" exact={true} component={Strategy1Edit}/>
          <Route path="/strategy1/:strategyId" exact={true} component={Strategy1View}/>

          <Route path="/strategy2" exact={true} component={Strategy2}/>
          <Route path="/strategy3" exact={true} component={Strategy3}/>
          <Route path="/indicators" exact={true} component={Indicators}/>
          <Route path="/favorites" exact={true} component={Favorites}/>
          <Route path="/favoritesV2" exact={true} component={FavoritesV2}/>
          <Route path="/favoritesLight" exact={true} component={FavoritesLight}/>

          <Route path="/login">
            {({location: {state}}) => state && state.referrer ?
              <Redirect to={state.referrer}/> : <Redirect to={'/strategy1'}/>}
          </Route>

          <Redirect to={'/strategy1'}/>
        </Switch>
      </AppLayout>
    );

  }

  renderForNotAuthenticated() {
    return (
      <Switch>
        <Route path="/login" component={LoginPage}/>
        <Redirect to={{
          pathname: '/login',
          state: {referrer: window.location.pathname}
        }}/>
      </Switch>
    );

  }

  render() {
    const {authenticated, history} = this.props;
    return (
      <Router history={history}>
        {authenticated ? this.renderForAuthenticated() : this.renderForNotAuthenticated()}
      </Router>
    );
  }
}
