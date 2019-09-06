import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Table, Button, Input, Popover, notification, Modal, Radio, Form, Switch, Card} from 'antd';
import _ from 'lodash';
import style from './favorites.scss';
import DiagrammBlock from '../DiagrammBlock/DiagrammBlock';

const FormItem = Form.Item;

const showOpacity = true;
const pagination = { position: 'bottom' };


export default class Favorites extends React.PureComponent  {

    static propTypes = {
        loading: PropTypes.bool,
        data: PropTypes.array,
        load: PropTypes.func,
        config: PropTypes.shape({
            DEPOSIT: PropTypes.number,
            PANIC_SELL: PropTypes.number,
            SEED_DEFF_DUMP: PropTypes.number,
            SEED_DEFF_PUMP: PropTypes.number,
            STOP_LIMIT_JITTER: PropTypes.number
        }),
    };

    columns = [];

    constructor(props) {
        super(props);
        this.columns = Favorites.columns;
        console.log('PROPS', props);
    }

    state = {
        filters: undefined,
        sorter: undefined,
        coins: [],
        bases: [],
        data: [],
        dataSorted: [],
        showOpacity,
        pagination,
        searchText: '',
        filteredInfo: null,
        sortedInfo: null,
        visible: false,
        selectedRowKeys: [],
        volume24h_USDT_min: '100 000',
        volume24h_USDT_max: '200 000',
        volume24h_BTC_min: '10',
        volume24h_BTC_max: '50',
        difference: [],
        config: {},
    };

    init = () => {
        const {config} = this.props;
        this.setState({
            config: {
                ...config,
                START_PRICE_PCT: {...(config.START_PRICE_PCT || {})},
                LEVELS_CONFIG: [...(config.LEVELS_CONFIG || [])]
            }
        });
    };

    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
    };
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    componentDidMount() {
        this.props.load();

        function onTableRefresh() {
            document.getElementById('myCheck').click();
        }

        setInterval(onTableRefresh, 40000);

        console.log(this.props);
    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filters,
            sortedInfo: sorter,
        });
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handlePaginationChange = e => {
        const { value } = e.target;
        this.setState({
            pagination: value === 'none' ? false : { position: value },
        });
    };

    render() {
        let {loading, data} = this.props;
        let { sortedInfo, dataSorted } = this.state;
        sortedInfo = sortedInfo || {};

        console.log('props', this.props);

        let arrayFavorite2m = [];
        let arrayFavorite5m = [];
        let arrayFavorite15m = [];

        let nowTime = function now() {
            return Math.floor(((new Date().getTime()) / 1000));
        };
        let nowTimeRender = nowTime();

        const CollectionCreateForm = (
            <div>
                <p>
                    i - процент изменения цены за период
                </p>
                <p>
                    v - приращение объема в процентах по сравнению с предыдущим периодом
                </p>
                <p>
                    s - изменения цены за 24 часа
                </p>
                <p>
                    d - доминирование покупателя над продавцом (отношения объёмы покупок к объему продаж)
                </p>
            </div>
        );
        const SettingWindow = (
            <div>
                <p>
                    i - процент изменения цены за период
                </p>
            </div>
        );

        const handleVolumeUSDTmin = e => {
            let target = e.target;
            let targetFormatting = target.value = (target.value + e.key)
                    .replace(/\D/g, '')
                    .replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
            this.setState({volume24h_USDT_min: targetFormatting,});
        };

        const handleVolumeUSDTmax = e => {
            let target = e.target;
            let targetFormatting = target.value = (target.value + e.key)
                    .replace(/\D/g, '')
                    .replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
            this.setState({volume24h_USDT_max: targetFormatting,});
        };

        const handleVolumeBTCmax = e => {
            const target = e.target;
            this.setState({volume24h_BTC_max: target.value,});
        };

        const handleVolumeBTCmin = e => {
            const target = e.target;
            this.setState({volume24h_BTC_min: target.value,});
        };

        const differencesFunc = e => {
            const target = e.target;
            this.setState({difference: target.value,});
        };

        if (dataSorted.length === 0) {
            dataSorted = data;
        }

        let handleSubmitVolumeBTC = e => {
            function onTableRefresh() {
                document.getElementById('myCheck').click();
            }

            dataSorted = [];

            // console.log(this.state.volume24h_BTC_min, this.state.volume24h_BTC_max);

            let functionVolumeSorter = _.map(data,(coin) => {
                if (coin.market === 'BTC') {
                    if (this.state.volume24h_BTC_min < coin.values.vol_btc && coin.values.vol_btc < this.state.volume24h_BTC_max) {
                        dataSorted.push(coin);
                        console.log(coin.values.vol_btc);
                    }
                }
            });

            onTableRefresh();

            this.setState({
                dataSorted,
            });

            //console.log('NEW DATA', dataSorted);

            e.preventDefault();
        };

        let handleSubmitVolumeUSDT = e => {
            function onTableRefresh() {
                document.getElementById('myCheck').click();
            }

            dataSorted = [];

            let USDT_min = this.state.volume24h_USDT_min.replace(/\s/g, '');
            let USDT_max = this.state.volume24h_USDT_max.replace(/\s/g, '');

            //console.log(USDT_min, USDT_max);

            let functionVolumeSorter = _.map(data,(coin) => {
                if (coin.market === 'USDT') {
                    if (USDT_min < coin.values.vol_usdt && coin.values.vol_usdt < USDT_max) {
                        dataSorted.push(coin);
                        //console.log(coin.values.vol_usdt);
                    }
                }
            });

            onTableRefresh();

            this.setState({
                dataSorted,
            });

            //console.log('NEW DATA', dataSorted);

            e.preventDefault();
        };

        let functionFavoritesTF = _.map(dataSorted,(coin, index) => {
            coin.values.i = parseFloat((coin.values.i).toFixed(2));
            coin.values.d = parseFloat((coin.values.d).toFixed(2));
            coin.values.v = parseFloat((coin.values.v).toFixed(2));
            coin.values.changes_24h = parseFloat((coin.values.changes_24h).toFixed(2));

            if (coin.timeframe === 1) {
                arrayFavorite2m.push(coin);
            } else if (coin.timeframe === 5) {
                arrayFavorite5m.push(coin);
            } else if (coin.timeframe === 15) {
                arrayFavorite15m.push(coin);
            }

            if (coin.coin === 'ADA') {
                nowTime = coin.update;
            }
        });

        const refreshData = e => {
            this.setState({
                dataSorted: data,
            });
        };


        // console.log('CONSOLE DATA', data);

        const columns2m = [
            {
                title: '',
                dataIndex: 'updated',
                key: 'updated',
                render: data => {
                    let dataCoin = nowTimeRender - data;
                    let color = '';
                    let animationBlink;
                    if (dataCoin < 600) {
                        color = 'green';
                        animationBlink = 'initial';
                    } else if (dataCoin > 600) {
                        color = 'red';
                        animationBlink = 'blink 1s step-start 0s infinite';
                    }
                    return (
                        <div>
                            <i className={style.iconConnect} style={{backgroundColor: color, animation: animationBlink}}></i>
                        </div>
                    );
                },
            },
            {
                title: 'coin',
                dataIndex: 'symbol',
                key: 'coin',
                filters: [
                    {
                        text: 'BTC',
                        value: 'BTC',
                    },
                    {
                        text: 'USDT',
                        value: 'USDT',
                    }
                ],
                onFilter: (value, record) => record.market.indexOf(value) === 0,
                sorter: (a, b) => a.coin.localeCompare(b.coin),
            },
            {
            title: '1m',
            dataIndex: 1,
            children: [
                {
                    title: 'i',
                    dataIndex: 'values.i',
                    key: 'i',
                    sorter: (a, b) => a.values.i - b.values.i,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 2;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'v',
                    dataIndex: 'values.v',
                    key: 'v',
                    sorter: (a, b) => a.values.v - b.values.v,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 1000;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            textColor = textColor / 100;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 's',
                    dataIndex: 'values.changes_24h',
                    key: 's',
                    sorter: (a, b) => a.values.changes_24h - b.values.changes_24h,
                    render: text => {
                        let color;
                        if (text < 10 && text > 0) {
                            let textColor = text / 10;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0 && text > -10) {
                            let textColor = text * -1 / 10;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        } else if (text > 10) {
                            color = 'rgb(84, 189, 0, ' + 1 + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'd',
                    dataIndex: 'values.d',
                    key: 'd',
                    sorter: (a, b) => a.values.d - b.values.d,
                    render: text => {
                        let color;
                        if (text > 1) {
                            color = 'rgb(84, 189, 0, 1)';
                        } else if (text < 1) {
                            let textColor = 1 - text;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
                            </div>
                        );
                    },
                }
            ]
            },
            {
                title: 'diff',
                dataIndex: 'values.price_btc',
                key: 'diff',
                render: text => {
                    text = parseFloat((text).toFixed(8));
                    console.log(this, text.proto);
                    //console.log(text);
                    // let arr = this.state.difference;
                    // arr.push(text);
                    this.setState({

                    });
                    //console.log(this.state.difference);
                    return (
                        <div>
                            <input type="text" value={this.state.difference} onChange={differencesFunc} />
                        </div>
                    );
                },
            }
        ];

        const columns5m = [
            {
                title: '',
                dataIndex: 'updated',
                key: 'updated',
                render: data => {
                    let dataCoin = nowTimeRender - data;
                    let color = '';
                    let animationBlink;
                    if (dataCoin < 600) {
                        color = 'green';
                        animationBlink = 'initial';
                    } else if (dataCoin > 600) {
                        color = 'red';
                        animationBlink = 'blink 1s step-start 0s infinite';
                    }
                    return (
                        <div>
                            <i className={style.iconConnect} style={{backgroundColor: color, animation: animationBlink}}></i>
                        </div>
                    );
                },
            },{
            title: 'coin',
            dataIndex: 'symbol',
            key: 'coin',
            filters: [
                {
                    text: 'BTC',
                    value: 'BTC',
                },
                {
                    text: 'USDT',
                    value: 'USDT',
                }
            ],
            onFilter: (value, record) => record.market.indexOf(value) === 0,
            sorter: (a, b) => a.coin.localeCompare(b.coin),
        }, {
            title: '5m',
            dataIndex: 5,
            children: [
                {
                    title: 'i',
                    dataIndex: 'values.i',
                    key: 'i',
                    sorter: (a, b) => a.values.i - b.values.i,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 2;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'v',
                    dataIndex: 'values.v',
                    key: 'v',
                    sorter: (a, b) => a.values.v - b.values.v,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 1000;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            textColor = textColor / 100;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 's',
                    dataIndex: 'values.changes_24h',
                    key: 's',
                    sorter: (a, b) => a.values.changes_24h - b.values.changes_24h,
                    render: text => {
                        let color;
                        if (text < 10 && text > 0) {
                            let textColor = text / 10;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0 && text > -10) {
                            let textColor = text * -1 / 10;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        } else if (text > 10) {
                            color = 'rgb(84, 189, 0, ' + 1 + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'd',
                    dataIndex: 'values.d',
                    key: 'd',
                    sorter: (a, b) => a.values.d - b.values.d,
                    render: text => {
                        let color;
                        if (text > 1) {
                            color = 'rgb(84, 189, 0, 1)';
                        } else if (text < 1) {
                            let textColor = 1 - text;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
                            </div>
                        );
                    },
                }
            ]
        }];

        const columns15m = [
            {
                title: '',
                dataIndex: 'updated',
                key: 'updated',
                render: data => {
                    let dataCoin = nowTimeRender - data;
                    let color = '';
                    let animationBlink;
                    //color = moment.unix(color).format('hh:ss:mm a');
                    if (dataCoin < 600) {
                        color = 'green';
                        animationBlink = 'initial';
                    } else if (dataCoin > 600) {
                        color = 'red';
                        animationBlink = 'blink 1s step-start 0s infinite';
                    }
                    return (
                        <div>
                            <i className={style.iconConnect} style={{backgroundColor: color, animation: animationBlink}}></i>
                        </div>
                    );
                },
            }, {
            title: 'coin',
            dataIndex: 'symbol',
            key: 'coin',
            filters: [
                {
                    text: 'BTC',
                    value: 'BTC',
                },
                {
                    text: 'USDT',
                    value: 'USDT',
                }
            ],
            onFilter: (value, record) => record.market.indexOf(value) === 0,
            sorter: (a, b) => a.coin.localeCompare(b.coin),
        }, {
            title: '15m',
            dataIndex: 15,
            children: [
                {
                    title: 'i',
                    dataIndex: 'values.i',
                    key: 'i',
                    sorter: (a, b) => a.values.i - b.values.i,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 2;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'v',
                    dataIndex: 'values.v',
                    key: 'v',
                    sorter: (a, b) => a.values.v - b.values.v,
                    render: text => {
                        let color;
                        if (text > 0) {
                            let textColor = text / 1000;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            textColor = textColor / 100;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 's',
                    dataIndex: 'values.changes_24h',
                    key: 's',
                    sorter: (a, b) => a.values.changes_24h - b.values.changes_24h,
                    render: text => {
                        let color;
                        if (text < 10 && text > 0) {
                            let textColor = text / 10;
                            color = 'rgb(84, 189, 0, ' + textColor + ')';
                        } else if (text < 0 && text > -10) {
                            let textColor = text * -1 / 10;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        } else if (text > 10) {
                            color = 'rgb(84, 189, 0, ' + 1 + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text + '%'}
                            </div>
                        );
                    },
                },
                {
                    title: 'd',
                    dataIndex: 'values.d',
                    key: 'd',
                    sorter: (a, b) => a.values.d - b.values.d,
                    render: text => {
                        let color;
                        if (text > 1) {
                            color = 'rgb(84, 189, 0, 1)';
                        } else if (text < 1) {
                            let textColor = 1 - text;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
                            </div>
                        );
                    },
                }
            ]
        }];

        const { state } = this;

        return (
            <React.Fragment>
                <div className={style.commands}>
                    <b className={style.buttonReload}>Reload: </b><Button id="myCheck" onClick={this.props.load} shape="circle" icon="reload" size="small" loading={loading}/>
                    <b>Time: </b><span>{this.props.data && this.props.data.length > 0 ? moment.unix(this.props.data[0].updated).format('DD.MM.YY HH:mm:ss') : '--.--.-- --:--:--'}</span>

                    <FormItem label="" className={style.form2}>
                        <Radio.Group
                            value={state.pagination ? state.pagination.position : 'none'}
                            onChange={this.handlePaginationChange}>
                            <Radio.Button value="none">On</Radio.Button>
                            <Radio.Button value="bottom">Off</Radio.Button>
                        </Radio.Group>
                    </FormItem>

                    <Form onSubmit={handleSubmitVolumeBTC} className={style.form3}>
                        <FormItem label="">
                               Фильтрация по Volume 24h BTC
                                <Input type="text" name="vol_BTC_min" onChange={handleVolumeBTCmin} value={this.state.volume24h_BTC_min}/>
                                <Input type="text" name="vol_BTC_max" onChange={handleVolumeBTCmax} value={this.state.volume24h_BTC_max}/>
                                <Input type="submit" value="Фильтрация"/>
                        </FormItem>
                    </Form>

                    <Form onSubmit={handleSubmitVolumeUSDT} className={style.form3}>
                        <FormItem label="">
                            Фильтрация по Volume 24h USDT
                            <Input type="text" name="vol_USDT_min" onChange={handleVolumeUSDTmin} value={this.state.volume24h_USDT_min}/>
                            <Input type="text" name="vol_USDT_max" onChange={handleVolumeUSDTmax} value={this.state.volume24h_USDT_max}/>
                            $
                            <Input type="submit" value="Фильтрация"/>
                        </FormItem>
                    </Form>


                    {/*<Button type="primary" onClick={this.showModal} className={style.legend}>*/}
                        {/*Setting*/}
                    {/*</Button>*/}

                    <Button type="primary" onClick={refreshData} className={style.legend}>
                        Сбросить
                    </Button>

                    <Popover content={CollectionCreateForm} title="Справка значений для фаворитов" trigger="click" className={style.legend}>
                        <Button>Инфо</Button>
                    </Popover>

                    <Popover content={SettingWindow} title="Настройки" trigger="click" className={style.legend}>
                        <Button>Настройки</Button>
                    </Popover>

                </div>
                {/*rowSelection={rowSelection}  onRow={(record) => ({onClick: () => {this.selectRow(record);},})}*/}
                <div className={style.favorites}>
                    <Table {...this.state} className={style.tableM1} rowKey={record => record.symbol} loading={loading} dataSource={arrayFavorite2m} columns={columns2m} expandedRowRender={record =>
                        <React.Fragment>
                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(8))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(8))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа BTC:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа USDT:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Time</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{moment.unix(record.updated).format('(DD.MM) YY HH:mm:ss')}</p>
                            </div>
                        </React.Fragment> }
                           onChange={this.handleChange}/>
                    <Table {...this.state} className={style.tableM2} rowKey={record => record.symbol} loading={loading} dataSource={arrayFavorite5m} columns={columns5m} expandedRowRender={record =>
                        <React.Fragment>

                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа BTC:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа USDT:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Time</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{moment.unix(record.updated).format('(DD.MM) YY HH:mm:ss')}</p>
                            </div>

                        </React.Fragment> }
                           onChange={this.handleChange}/>
                    <Table {...this.state} className={style.tableM3} rowKey={record => record.symbol} loading={loading} dataSource={arrayFavorite15m} columns={columns15m} expandedRowRender={record =>
                        <React.Fragment>

                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа BTC:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа USDT:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Time</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{moment.unix(record.updated).format('(DD.MM) YY HH:mm:ss')}</p>
                            </div>

                        </React.Fragment> }
                           onChange={this.handleChange}/>
                </div>

                {/*<div className="tradingview-widget-container">*/}
                    {/*<div id="tradingview_cb46c"></div>*/}
                    {/*<div className="tradingview-widget-copyright"><a href="https://ru.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span className="blue-text">График AAPL</span></a> предоставлен TradingView</div>*/}
                {/*</div>*/}

                <div className={style.favorites}>
                    <DiagrammBlock symbol='ADABTC' className={style.iframe1}/>
                    <DiagrammBlock symbol='ADABTC' className={style.iframe2}/>
                    <DiagrammBlock symbol='ADABTC' className={style.iframe3}/>
                </div>
            </React.Fragment>
        );
    }
}
