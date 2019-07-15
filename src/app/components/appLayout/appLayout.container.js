import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import AppLayout from './appLayout';
import * as actions from '../../actions';

const mapDispatchToProps = {
  logout: actions.auth.LOGOUT_REQUEST
};

export default withRouter(connect(null, mapDispatchToProps)(AppLayout));

