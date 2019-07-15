import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Skeleton, Table} from 'antd';
import _ from 'lodash';
import style from './logsBlock.scss';

export default class LogsBlock extends React.PureComponent {

  static propTypes = {
    logs: PropTypes.array,
    loading: PropTypes.bool,
    load: PropTypes.func,
    id: PropTypes.string
  };

  static columns = [{
    title: 'Date',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: '80px',
    render: data => moment.unix(data).format('MM-DD HH:mm:ss'),
  }, {
    title: 'Side',
    dataIndex: 'side',
    key: 'side',
    width: '35px'
  }, {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: '70px'
  }, {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: '45px'
  }, {
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  }, {
    title: 'R',
    dataIndex: 'info',
    key: 'info',
    render: ({r}) => <span className={style.orderField} title={r}>{r}</span>
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  }, {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
    render: (order) => <span className={style.orderField} title={order}>{order}</span>
  }];

  state = {
    logs: []
  };

  intervalId = undefined;

  componentDidMount() {
    if (this.props.id) {
      this.update();
    }

    this.intervalId = setInterval(this.update, 10000);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.id && this.props.id) {
      this.update();
    }
    if (prevProps.logs !== this.props.logs) {
      this.setState({
        logs: _(this.props.logs)
          .orderBy('timestamp', 'desc')
          .value()
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  update = () => {
    if (this.props.id) {
      this.props.load(this.props.id);
    }
  };

  render() {
    const {loading, logs} = this.props;
    console.log(this.props);

    if (!logs && loading) {
      return <Skeleton/>;
    }
    return (
      <div className={style.logs}>
        <Table loading={loading && !logs} columns={LogsBlock.columns} dataSource={this.state.logs} className={style.table}/>
      </div>
    );
  }
}