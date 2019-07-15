import {connect} from 'react-redux';
import * as actions from '../../actions';
import Indicators from './indicators';

const mapStateToProps = ({indicators: {data, loading}}) => ({
  loading, data
});

const mapDispatchToProps = {
  load: actions.indicators.INDICATORS_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(Indicators);
