import Strategy1View from './strategy1View';
import {connect} from 'react-redux';
import {push} from 'connected-react-router';
import * as actions from '../../actions';

const mapStateToProps = ({strategy1View: {strategy, error, loading}}) => ({
  strategy, error, loading
});

const mapDispatchToProps = {
  get: actions.strategy.STRATEGY_GET_REQUEST,
  save: actions.strategy.STRATEGY_UPDATE_REQUEST,
  onAllowed: actions.strategy.STRATEGY_ALLOWED_REQUEST,
  restart: actions.strategy.STRATEGY_RESTART_REQUEST,
  clear: actions.strategy.STRATEGY_CLEAR,
  cancel: () => push('/strategy1')
};

export default connect(mapStateToProps, mapDispatchToProps)(Strategy1View);