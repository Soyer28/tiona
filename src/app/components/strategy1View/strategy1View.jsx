import React from 'react';
import PropTypes from 'prop-types';
import {Spin, Card, Input} from 'antd';
import DepositBlock from '../depositBlock/depositBlock';
import LevelsBlock from '../levelsBlock/levelsBlock';
import LogsBlock from '../logsBlock';
import DiagrammBlock from '../diagrammBlock/diagrammBlock';
import CommandBlock from '../commandBlock/commandBlock';
import style from './strategy1View.scss';
import ConfigBlock from '../configBlock/configBlock';
import _ from 'lodash';

export default class Strategy1View extends React.PureComponent {

  static propTypes = {
    get: PropTypes.func.isRequired,
    clear: PropTypes.func,
    save: PropTypes.func.isRequired,
    onAllowed: PropTypes.func,
    cancel: PropTypes.func,
    id: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.object,
    strategy: PropTypes.shape(),
    restart: PropTypes.func
  };

  state = {
    groupName: '',

  };

  intervalId = undefined;


  handleArrow = () => {
    const allowed = !this.props.strategy.allowed;
    this.props.onAllowed({
      id: this.props.id,
      allowed
    });

  };

  onConfigSave = (config) => {
    this.props.save({
      id: this.props.id,
      patch: {
        config,
        group: this.state.groupName
      }
    });
  };

  onLevelsSave = (levels) => {
    this.props.save({
      id: this.props.id,
      patch: {
        config: {
          ...this.props.strategy.config,
          LEVELS_CONFIG: levels
        }
      }
    });
  };

  onRestart = () => {
    this.props.restart(this.props.strategy.id);
  };

  onReload = () => {
    if (this.props.id) {
      this.props.get(this.props.id);
    }
  };

  onGroupChangeHandle = (e) => {
    this.setState({
      groupName: e.target.value
    });
  };

  componentDidMount() {
    if (this.props.id) {
      this.props.get(this.props.id);
    }
    this.intervalId = setInterval(this.onReload, 10000);
  }

  componentDidUpdate(prevProps) {

    const group = _.get(this.props, 'strategy.group');
    const prevGroup = _.get(prevProps, 'strategy.group');
    if(group !== prevGroup) {
      this.setState({
        groupName: group
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.props.clear();
  }

  render() {
    const {loading, strategy = {config: {LEVELS_CONFIG: []}}} = this.props;

    return (
      <div className={style.strategy1}>
        <Spin spinning={loading && !strategy.symbol}>
          <div className={style.dashboard}>
            <div className={`${style.column} ${style.column1}`}>
              <Card>
                <DepositBlock symbol={strategy.symbol} id={strategy.id} onReload={this.onReload}/>

                <Input value={this.state.groupName} onChange={this.onGroupChangeHandle}/>
              </Card>
              <Card>
                <ConfigBlock config={strategy.config} save={this.onConfigSave} strategyType={strategy.type}/>
              </Card>
            </div>
            <div className={`${style.column} ${style.column2}`}>
              <Card>
                <DiagrammBlock symbol={strategy.symbol}/>
              </Card>
              <Card>
                <CommandBlock onClick={this.handleArrow} allowed={strategy.allowed} onRestart={this.onRestart}/>
              </Card>
              <Card>
                <LogsBlock id={strategy.id}/>
              </Card>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}