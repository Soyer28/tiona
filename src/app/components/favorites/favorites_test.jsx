import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Skeleton, Table, Spin, Button, Icon} from 'antd';
import _ from 'lodash';
import style from './favorites.scss';

export default class Favorites extends React.PureComponent  {

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
        // filters: [{text:'btc', value: 'btc'}, {text:'asc', value: 'asc'}],
    }, {
        title: 'base',
        dataIndex: 'market',
        key: 'base',
        sorter: true,
    }];

    static cumulatives = [
        '1m', '3m', '5m', '15m', '30m', '60m', '120m', '180m', '240m'
    ];

    // static getDerivedStateFromProps(props, state) {
    //     console.log('PROPS', props);
    //     console.log('STATE', state);
    //     if (props.data) {
    //         const sorter = state.sorter;
    //         const filters = state.filters;
    //         console.log('Sorter, filter',{sorter, filters});
    //
    //         console.log('DATA PROPS', props.data);
    //         let data = _.map(props.data, item => ({
    //             ...item,
    //             coin: item.symbol.split('/')[0]
    //         }));
    //         console.log('DATA MAP', data);
    //         if (sorter && sorter.field) {
    //             if (sorter.field === 'volatility') {
    //                 data = _.sortBy(data, ({volatility}) => _.get(volatility, `${sorter.columnKey}.average`) * (sorter.order === 'ascend' ? 1 : -1));
    //             } else {
    //                 data = _.orderBy(data, sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc');
    //             }
    //         }
    //
    //         if (filters) {
    //             if (filters.coin) {
    //                 data = _.filter(data, item => filters.coin.indexOf(item.coin) >= 0);
    //             }
    //             if (filters.base) {
    //                 data = _.filter(data, item => filters.base.indexOf(item.market) >= 0);
    //             }
    //         }
    //
    //         if (!state.coins || state.coins.length === 0) {
    //             console.log('coins');
    //             state.coins = _(data)
    //                 .map(({coin}) => coin)
    //                 .uniq()
    //                 .sort()
    //                 .map(symbol => ({text: symbol, value: symbol}))
    //                 .value();
    //         }
    //
    //         if (!state.bases || state.bases.length === 0) {
    //             console.log('base');
    //             state.bases = _(data)
    //                 .map(({market}) => market)
    //                 .uniq()
    //                 .sort()
    //                 .map(symbol => ({text: symbol, value: symbol}))
    //                 .value();
    //         }
    //
    //         state.data = data;
    //
    //     }
    //     return state;
    // }

    columns = [];

    constructor(props) {
        super(props);
        const {loading, data} = this.props;
        console.log('DATA ', data);
        this.columns = _.concat(Favorites.columns, _.map(Favorites.cumulatives, item => ({
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

    renderMinutes() {

    }

    onTableChange = (pagination, filters, sorter) => {
        this.setState({
            filters, sorter
        });

    };

    renderCumulative = (name) => (data) => {
        const avr = _.get(data, `${name}.average`);
        const val = _.get(data, `${name}.cumulative`);
        console.log('Вывод информаци', val);
        return (
            <span title={`CUR: ${val}  AVR: ${avr}`}>{avr}</span>
        );
    };


    componentDidMount() {
        this.props.load();
    }


    render() {
        const {loading, data} = this.props;
        let arrayFavorite5m = [];
        let arrayFavorite15m = [];
        let arrayFavorite30m = [];
        let arrayFavorite120m = [];

        let itemFavorite5m, itemFavorite15m, itemFavorite30m, itemFavorite120m;

        let functionFavoritesTF = _.map(data,(coin, index) => {
                if (coin.timeframe === 5) {
                    arrayFavorite5m.push(coin);
                } else if (coin.timeframe === 15) {
                    arrayFavorite15m.push(coin);
                } else if (coin.timeframe === 30) {
                    arrayFavorite30m.push(coin);
                } else {
                    arrayFavorite120m.push(coin);
                }
            }
        );

        if (data !== undefined) {
            itemFavorite5m = arrayFavorite5m.map((coin, index) =>
                <React.Fragment key={index}>
                    <td>{coin.coin}</td>
                    <table>
                        <thead>
                        <tr>
                            <td>
                                Значения 5m
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{coin.values.d}</td>
                            <td>{coin.values.i}</td>
                        </tr>
                        <tr>
                            <td>{coin.values.s}</td>
                            <td>{coin.values.v}</td>
                        </tr>
                        </tbody>
                    </table>
                </React.Fragment>
            );
            itemFavorite15m = arrayFavorite15m.map((coin, index) =>
                <React.Fragment key={index}>
                    <td>{coin.coin}</td>
                    <table>
                        <thead>
                        <tr>
                            <td>
                                Значения 15m
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{coin.values.d}</td>
                            <td>{coin.values.i}</td>
                        </tr>
                        <tr>
                            <td>{coin.values.s}</td>
                            <td>{coin.values.v}</td>
                        </tr>
                        </tbody>
                    </table>
                </React.Fragment>
            );
            itemFavorite30m = arrayFavorite30m.map((coin, index) =>
                <React.Fragment key={index}>
                    <td>{coin.coin}</td>
                    <table>
                        <thead>
                        <tr>
                            <td>
                                Значения 30m
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{coin.values.d}</td>
                            <td>{coin.values.i}</td>
                        </tr>
                        <tr>
                            <td>{coin.values.s}</td>
                            <td>{coin.values.v}</td>
                        </tr>
                        </tbody>
                    </table>
                </React.Fragment>
            );
            itemFavorite120m = arrayFavorite120m.map((coin, index) =>
                <React.Fragment key={index}>
                    <td>{coin.coin}</td>
                    <table>
                        <thead>
                        <tr>
                            <td>
                                Значения 120m
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{coin.values.d}</td>
                            <td>{coin.values.i}</td>
                        </tr>
                        <tr>
                            <td>{coin.values.s}</td>
                            <td>{coin.values.v}</td>
                        </tr>
                        </tbody>
                    </table>
                </React.Fragment>
            );
        }

        const coinsColumn = _.findIndex(this.columns, {title: 'coin'});

        if (coinsColumn >= 0 && (!this.columns[coinsColumn].filters || this.columns[coinsColumn].filters.length === 0)) {
            console.warn('SET cons');
            this.columns[coinsColumn].filters = this.state.coins;
        }

        const baseColumn = _.findIndex(this.columns, {title: 'base'});

        if (baseColumn >= 0 && (!this.columns[baseColumn].filters || this.columns[baseColumn].filters.length === 0)) {
            console.warn('SET base');
            this.columns[baseColumn].filters = this.state.bases;
        }

        console.log(this.columns, coinsColumn);

        if (data !== undefined) {
            return (
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Монета</th>
                            <th>1м.</th>
                            <th>5м.</th>
                            <th>10м.</th>
                            <th>15м.</th>
                        </tr>
                        </thead>
                        <tbody className={style.favorites}>
                            <tr>
                                <td>{itemFavorite5m}</td>
                                <td>{itemFavorite15m}</td>
                                <td>{itemFavorite30m}</td>
                                <td>{itemFavorite120m}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="news">
                    <strong>Информации нет</strong>
                </div>
            );
        }
    }
}
