import {connect} from 'react-redux';
import LoginPage from './loginPage';
import * as actions from '../../actions';

const mapStateToProps = ({auth: {process, error}}) => ({
  process,
  error
});

const mapDispatchToProps = {
  login: actions.auth.LOGIN_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

