import Strategy1Edit from './strategy1Edit';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';
import * as actions from '../../actions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = ({strategy1View: {strategy, error, loading}}) => ({
  strategy, error, loading
});

const mapDispatchToProps = {
  get: actions.strategy.STRATEGY_GET_REQUEST,
  save: actions.strategy.STRATEGY_CREATE_REQUEST,
  clear: actions.strategy.STRATEGY_CLEAR,
  cancel: () => push('/strategy1')
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Strategy1Edit));