import Strategy1 from './strategy1';
import {connect} from 'react-redux';
import * as actions from '../../actions';
import _ from 'lodash';

const mapStateToProps = ({strategy1: {items, error, loading}}) => ({
  items: _.filter(items, {type: 2}), error, loading
});

const mapDispatchToProps = {
  load: actions.strategy.STRATEGY_REQUEST,
  save: actions.strategy.STRATEGY_ALLOWED_REQUEST,
  onRemove: actions.strategy.STRATEGY_REMOVE_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(Strategy1);