import {connect} from 'react-redux';
import * as actions from '../../actions';
import LogsBlock from './logsBlock';

const mapStateToProps = ({logs: {logs, error, loading}}) => ({
  logs, error, loading
});

const mapDispatchToProps = {
  load: actions.logs.LOGS_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(LogsBlock);