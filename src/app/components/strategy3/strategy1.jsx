import React from 'react';
import PropTypes from 'prop-types';
import {List, Button, Icon, Modal} from 'antd';
import {Link} from 'react-router-dom';
import style from './strategy1.scss';
import _ from 'lodash';

export default class Strategy1 extends React.PureComponent {

  static propTypes = {
    load: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    save: PropTypes.func
  };

  intervalId = undefined;


  componentDidMount() {
    this.props.load();
    this.intervalId = setInterval(this.props.load, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
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
    <Link key="edit" to={`/strategy1/edit/${item.id}`} className="ant-btn"><Icon type="edit"/></Link>,
    <Button key="remove" type="danger" onClick={this.onRemove(item)}><Icon type="delete"/></Button>
  ];

  renderTitle = (item) => (
    <Link
      to={`/strategy1/${item.id}`}> {item.exchangeAccount && `[${_.takeRight(item.exchangeAccount.apikey, 6).join('')}] `} {item.symbol}</Link>
  );

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
        description={item.id}
      />
    </List.Item>
  );

  render() {
    const {loading, items} = this.props;

    return (
      <div className={style.strategy1}>
        <h1>
          Strategy 3 <Link to="/strategy1/new" className="ant-btn">
          <Icon type="plus"/>
        </Link>
        </h1>

        <List
          loading={loading && !items}
          itemLayout="horizontal"
          dataSource={_.orderBy(items, 'symbol')}
          renderItem={this.renderItem}
        />
      </div>
    );
  }
}