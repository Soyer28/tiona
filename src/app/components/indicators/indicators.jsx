import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Skeleton, Table, Spin, Button, Icon} from 'antd';
import _ from 'lodash';
import style from './indicators.scss';

export default class Indicators extends React.PureComponent {

  static propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array,
    load: PropTypes.func
  };

  static columns = [{
    title: 'coin',
    dataIndex: 'coin',
    key: 'coin',
    sorter: true,
    // filters: [{text:'ada', value: 'ada'}, {text:'asc', value: 'asc'}],
  }, {
    title: 'base',
    dataIndex: 'market',
    key: 'base',
    sorter: true,
  }];

  static cumulatives = [
    '1m', '3m', '5m', '15m', '30m', '60m', '120m', '180m', '240m'
  ];

  static getDerivedStateFromProps(props, state) {
    console.log('PROPS', props);
    console.log('STATE', state);

    if (props.data) {
      const sorter = state.sorter;
      const filters = state.filters;

      console.log('Sorter, filter',{sorter, filters});
      console.log('DATA PROPS', props.data);

		let data = _.map(props.data, item => ({
			...item,
			coin: item.symbol.split('/')[0]
		}));

		console.log('DATA MAP', data);

		console.log(sorter);

      if (sorter && sorter.field) {
        if (sorter.field === 'volatility') {
          data = _.sortBy(data, ({volatility}) => _.get(volatility, `${sorter.columnKey}.average`) * (sorter.order === 'ascend' ? 1 : -1));
        } else {
          data = _.orderBy(data, sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc');
        }
      }

      if (filters) {
        if (filters.coin) {
          data = _.filter(data, item => filters.coin.indexOf(item.coin) >= 0);
        }
        if (filters.base) {
          data = _.filter(data, item => filters.base.indexOf(item.market) >= 0);
        }
      }

      if (!state.coins || state.coins.length === 0) {
        console.log('coins');
        state.coins = _(data)
            .map(({coin}) => coin)
            .uniq()
            .sort()
            .map(symbol => ({text: symbol, value: symbol}))
            .value();

      }
      console.log(state.coins);

      if (!state.bases || state.bases.length === 0) {
        console.log('base');
        state.bases = _(data)
            .map(({market}) => market)
            .uniq()
            .sort()
            .map(symbol => ({text: symbol, value: symbol}))
            .value();
      }
      console.log(state);
		console.log(state.bases);
      console.log(state.bases);

      state.data = data;

    }
    return state;
  }

  columns = [];

  constructor(props) {
    super(props);
    this.columns = _.concat(Indicators.columns, _.map(Indicators.cumulatives, item => ({
      title: `${item}Avr`,
      key: item,
      dataIndex: 'volatility',
      render: this.renderCumulative(item),
      sorter: true
    })));
  }

  state = {
    filters: undefined,
    sorter: undefined,
    coins: [],
    bases: [],
    data: []
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({
      filters, sorter
    });

  };

  renderCumulative = (name) => (data) => {
    const avr = _.get(data, `${name}.average`);
    const val = _.get(data, `${name}.cumulative`);
    return (
        <span title={`CUR: ${val}  AVR: ${avr}`}>{avr}</span>
    );
  };

  componentDidMount() {
    this.props.load();
    console.log('THIS PROPS LOAD', this.props.load());
  }

  render() {
    const {loading, data} = this.props;
    console.log('DATA');
    console.log(data);


    const coinsColumn = _.findIndex(this.columns, {title: 'coin'});



    if (coinsColumn >= 0 && (!this.columns[coinsColumn].filters || this.columns[coinsColumn].filters.length === 0)) {
      console.warn('SET cons');
      this.columns[coinsColumn].filters = this.state.coins;
    }

    const baseColumn = _.findIndex(this.columns, {title: 'base'});

    if (baseColumn >= 0 && (!this.columns[baseColumn].filters || this.columns[baseColumn].filters.length === 0)) {
      console.warn('SET BASE');
      console.log('SET BASE', this.state);
      this.columns[baseColumn].filters = this.state.bases;
    }

    console.log('COLUMNS', this.columns, coinsColumn);
    return (
        <div className={style.indicators}>
          <div className={style.commands}>
            <span>{this.props.data && this.props.data.length > 0 ? moment.unix(this.props.data[0].updated).format('DD.MM.YY HH:mm:ss') : '--.--.-- --:--:--'}</span>
            <Button onClick={this.props.load} shape="circle" icon="reload" size="small" loading={loading}/>
          </div>
          <Table loading={loading} dataSource={this.state.data} columns={this.columns} pagination={{pageSize: 100}}
                 onChange={this.onTableChange}/>
        </div>
    );
  }

}
