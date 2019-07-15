import {connect} from 'react-redux';
import Routes from './routes';

const mapStateToProps = ({auth: {authenticated}}) => ({
  authenticated
});

export default connect(mapStateToProps)(Routes);