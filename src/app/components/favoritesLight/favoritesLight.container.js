import {connect} from 'react-redux';
import * as actions from '../../actions';
import FavoritesLight from './favoritesLight';

const mapStateToProps = ({indicators: {data, loading}}) => ({
  loading, data
});

const mapDispatchToProps = {
  load: actions.favorites.FAVORITES_REQUEST
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesLight);
