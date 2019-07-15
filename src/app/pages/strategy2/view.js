import React from 'react';
import PropTypes from 'prop-types';
import Strategy1View from '../../components/strategy1View';

const Strategy1ViewPage = ({match: {params: {strategyId}}}) =>
  <Strategy1View id={strategyId}/>;

Strategy1ViewPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      strategyId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Strategy1ViewPage;
