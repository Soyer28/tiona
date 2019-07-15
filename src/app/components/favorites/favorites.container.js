import {connect} from 'react-redux';
import * as actions from '../../actions';
import Favorites from './favorites';

const mapStateToProps = ({favorites: {data, loading}}) => ({
  loading, data
});

const mapDispatchToProps = {
  load: actions.favorites.FAVORITES_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
