import React from 'react';
import PropTypes from 'prop-types';
import {List, Button, Icon, Modal, Menu, Dropdown, Divider, Collapse, Panel} from 'antd';
import {Link} from 'react-router-dom';
import style from './strategy1.scss';
import _ from 'lodash';
import moment from 'moment';

export default class Strategy1 extends React.PureComponent {

  static propTypes = {
    load: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    save: PropTypes.func
  };

  strategyList = [
    {title: 'Strategy 1', value: 1},
    {title: 'Strategy 2', value: 2},
    {title: 'Strategy 3', value: 3},
    {title: 'Strategy 4', value: 4}
  ];

  state = {
    current: Strategy1.getCurrentStrategy(this.strategyList[0])
  };

  intervalId = undefined;

  static getCurrentStrategy = (defaultValue) => {
    const strategy = localStorage.getItem('Strategy');
    if (!strategy) {
      return defaultValue;
    }
    try {
      return JSON.parse(strategy);
    } catch (e) {
      return defaultValue;
    }
  };

  onRemove = item => () => {
    Modal.confirm({
      title: `Do you want to delete these item ${item.symbol}?`,
      onOk: () => {
        this.props.onRemove(item);
      }
    });
  };

  strategyCommand = (id, allowed) => () => {
    this.props.save({
      id,
      allowed
    });
  };

  renderItemAction = (item) => [
    //<Link key="edit" to={`/strategy1/edit/${item.id}`} className="ant-btn"><Icon type="edit"/></Link>,
    <Button key="remove" type="danger" onClick={this.onRemove(item)}><Icon type="delete"/></Button>
  ];

  renderTitle = (item) => (
    <div className={style.strategyTitle}>
      <Link className={style.link}
            to={`/strategy1/${item.id}`}>{item.symbol}</Link>

      <div className={style.id}>{item.id}</div>
    </div>
  );
  renderDescription = ({trades, logger, updated}) => {
    let trade = _.isArray(trades) ? _.last(trades) : trades;
    let logItem = _.isArray(logger) ? _.last(logger) : logger;
    if (!trade && !logItem) {
      return null;
    }

    if (trade && moment(updated).unix() > trade.timestamp) {
      trade = undefined;
    }

    if (logItem && moment(updated).unix() > logItem.timestamp) {
      logItem = undefined;
    }

    if (logItem && (!trade || logItem.timestamp > trade.timestamp)) {
      return (
        <div className={style.strategyDescription}>
          <div>{moment.unix(logItem.timestamp).format('MM-DD HH:mm:ss')}</div>
          <div>{logItem.type}</div>
        </div>
      );
    }
    return (
      (
        <div className={style.strategyDescription}>
          <div>{moment.unix(trades.timestamp).format('MM-DD HH:mm:ss')}</div>
          <div>{trades.side}</div>
          <div>{trades.price}</div>
        </div>
      )

    );
  };

  renderItem = (item) => (
    <List.Item actions={[this.renderItemAction(item)]}>
      <List.Item.Meta
        avatar={!item.allowed ?
          <Button htmlType="button" shape="circle-outline" className={style.arrowIcon}
                  onClick={this.strategyCommand(item.id, true)}>
            <Icon type="play-circle"/>
          </Button> :
          <Button htmlType="button" shape="circle-outline" type="primary" className={style.arrowIcon}
                  onClick={this.strategyCommand(item.id, false)}>
            <Icon type="pause-circle"/>
          </Button>

        }
        title={this.renderTitle(item)}
        description={this.renderDescription(item)}
      />
    </List.Item>
  );

  handleMenuClick = (n) => {
    console.log(n);
    const value = this.strategyList[n.key];
    localStorage.setItem('Strategy', JSON.stringify(value));
    this.setState({
      current: value
    });
  };

  componentDidMount() {
    this.props.load();
    this.intervalId = setInterval(this.props.load, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const {loading, items} = this.props;


    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {this.strategyList.map(({title, value}, index) => (
          <Menu.Item key={index}>
            <span>{title}</span>
          </Menu.Item>
        ))}

      </Menu>
    );
    return (
      <div className={style.strategy1}>
        <h1>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" href="#">
              {this.state.current.title} <Icon type="down"/>
            </a>
          </Dropdown>
          <Link to={`/strategy1/new/${this.state.current.value}`} className="ant-btn">
            <Icon type="plus"/>
          </Link>
        </h1>
        <Collapse defaultActiveKey={['1']}>
          {_(items)
            .filter({type: this.state.current.value})
            .groupBy(({related_exchange}) => `${related_exchange.name} (${_.takeRight(related_exchange.apikey, 6).join('')})`)
            .map((group, groupName) => (
              <Collapse.Panel key={groupName} header={groupName}>
                <Collapse defaultActiveKey={['1']}>
                {_(group)
                  .groupBy('group')
                  .map((subGroup, subGroupName) => (
                    <Collapse.Panel key={subGroupName} header={subGroupName}>
                      <List
                        loading={loading && !items}
                        itemLayout="horizontal"
                        dataSource={_(subGroup)
                          .orderBy('symbol')
                          .value()}
                        renderItem={this.renderItem}
                      />
                    </Collapse.Panel>
                  ))
                  .value()}

                </Collapse>
              </Collapse.Panel>
            ))
            .value()}
        </Collapse>

      </div>
    );
  }
}