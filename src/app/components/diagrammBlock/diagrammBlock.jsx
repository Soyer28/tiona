import React from 'react';
import PropTypes from 'prop-types';
import TradingView from '../tradingView/tradingView';
import style from './diagrammBlock.scss';

export default class DiagrammBlock extends React.PureComponent {

  static propTypes = {
    symbol: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    save: PropTypes.func
  };


  render() {
    if (!this.props.symbol) {
      return null;
    }
    return (
      <div className={style.trading}>
        <TradingView symbol={this.props.symbol}/>
      </div>
    );
  }
}