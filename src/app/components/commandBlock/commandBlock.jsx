import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import style from './commandBlock.scss';


export default class CommandBlock extends React.PureComponent {
  static propTypes = {
    allowed: PropTypes.bool,
    onClick: PropTypes.func,
    onRestart: PropTypes.func
  };

  onClickHandle = () => {
    this.props.onClick(!this.props.allowed);
  };

  render() {
    const {allowed} = this.props;

    return (
      <div className={style.command}>
        <Button type="primary" htmlType="button" onClick={this.onClickHandle} disabled={allowed}>Start</Button>
        <Button htmlType="button" onClick={this.onClickHandle} disabled={!allowed}>Stop</Button>
        <Button htmlType="button" onClick={this.props.onRestart} disabled={!allowed}>Restart</Button>
      </div>
    );
  }
}