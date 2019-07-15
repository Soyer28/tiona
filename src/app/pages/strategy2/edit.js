import React from 'react';
import PropTypes from 'prop-types';
import Strategy1Edit, {NewStrategy} from '../../components/strategy1Edit';

const Strategy1EditPage = ({match: {params: {strategyId}}}) => strategyId === 'new' ? <NewStrategy/> :
  <Strategy1Edit id={strategyId}/>
;

Strategy1EditPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      strategyId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Strategy1EditPage;
