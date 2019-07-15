import React from 'react';
import style from './tradingView.scss';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class TradingView extends React.PureComponent {

  static propTypes = {
    symbol: PropTypes.string.isRequired
  };

  id = _.uniqueId('trading');
  trend = undefined;

  componentDidMount() {
    this.trend = new window.TradingView.widget(
      {
        'enable_publishing': false,
        'autosize': true,
        'symbol': 'BINANCE:' + this.props.symbol.replace('/', ''),
        'interval': '1',
        'timezone': 'Etc/UTC',
        'theme': 'Dark',
        'style': '1',
        'locale': 'en',
        'toolbar_bg': '#f1f3f6',
        'allow_symbol_change': true,
        'container_id': this.id,
      }
    );
  }

  render() {
    return (
      <div className="tradingview-widget-container">
        <div id={this.id} className={style.trading}/>
      </div>
    );
  }
}
