import React from 'react';
import PropTypes from 'prop-types';
import {List, Button, Icon, Modal, Input} from 'antd';
import {Link} from 'react-router-dom';
import style from './depositBlock.scss';
import _ from 'lodash';

export default class DepositBlock extends React.PureComponent {

  static propTypes = {
    symbol: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    save: PropTypes.func,
    id: PropTypes.string,
    onReload: PropTypes.func
  };


  render() {
    const {symbol, id} = this.props;

    return (
      <div className={style.depositBlock}>
        <h1>
          Deposit
          <span className={style.edit} onClick={this.props.onReload}><Icon type="reload"/></span>
        </h1>
        <h2>
          BINANCE:{symbol}
        </h2>
        <ul>
          <li>0.00</li>
          <li>0.00</li>
          <li>0.00</li>
        </ul>
        <ul>
          <li>0.00</li>
          <li>0.00</li>
          <li>0.00</li>
        </ul>

      </div>
    );
  }
}