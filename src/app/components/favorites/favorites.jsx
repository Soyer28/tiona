import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Table, Button, Input, notification, Modal, Radio, Form, Switch, Card} from 'antd';
import _ from 'lodash';
import style from './favorites.scss';
import DiagrammBlock from '../DiagrammBlock/DiagrammBlock';

const FormItem = Form.Item;

const showOpacity = true;
const pagination = { position: 'bottom' };


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Настройки фаворитов"
                    okText="Задать"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical" className={style.FavForm}>
                        <Form.Item label="Coins">
                            {getFieldDecorator('Coins', {
                                rules: [{ required: true, message: 'Please input the title of collection!' }],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Indicators">
                            {getFieldDecorator('Indicators')(<Input type="textarea" />)}
                        </Form.Item>
                        <Form.Item className="collection-create-form_last-form-item">
                            {getFieldDecorator('modifier', {
                                initialValue: 'public',
                            })(
                                <Radio.Group>
                                    <Radio value="public">Тест</Radio>
                                    <Radio value="private">Тест2</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export default class Favorites extends React.PureComponent  {

    static propTypes = {
        loading: PropTypes.bool,
        data: PropTypes.array,
        load: PropTypes.func
    };


    static cumulatives = [
        'i', 'v', 's', 'd'
    ];

    columns = [];

    constructor(props) {
        super(props);
        this.columns = Favorites.columns;
        console.log('PROPS', props);
    }

    // constructor(props) {
    //     super(props);
    //     this.columns = _.concat(Indicators.columns, _.map(Indicators.cumulatives, item => ({
    //         title: `${item}Avr`,
    //         key: item,
    //         dataIndex: 'volatility',
    //         render: this.renderCumulative(item),
    //         sorter: true
    //     })));
    // }

    state = {
        filters: undefined,
        sorter: undefined,
        coins: [],
        bases: [],
        data: [],
        showOpacity,
        pagination,
        searchText: '',
        filteredInfo: null,
        sortedInfo: null,
        visible: false,
        selectedRowKeys: [],
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

    // handlePagination2Change = e => {
    //     this.setState({ showOpacity: e ? showOpacity : false });
    //     //console.log('EEEEEEEE', e);
    //     let b, c;
    //     let arrayFav = [];
    //     for (b = 0; b < 3; b++) {
    //         let favTable = document.getElementsByClassName('ant-table-tbody')[b].childElementCount;
    //
    //         for (c = 6; c < favTable; c++) {
    //             let styleFavorites = document.getElementsByClassName(style.favorites)[0].childNodes[b]
    //                 .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
    //                 .tBodies[0].childNodes[c];
    //
    //             arrayFav.push(styleFavorites);
    //
    //             if (showOpacity === true) {
    //                 styleFavorites.style.opacity = '0.2';
    //             } else {
    //                 styleFavorites.style.opacity = '1';
    //             }
    //         }
    //
    //         //console.log(arrayFav);
    //     }
    // };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const {loading, data} = this.props;
        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        // const { selectedRowKeys } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectedRowKeysChange,
        // };


        let arrayFavorite2m = [];
        let arrayFavorite5m = [];
        let arrayFavorite15m = [];

        let nowTime = function now() {
            return Math.floor(((new Date().getTime()) / 1000));
        };
        let nowTimeRender = nowTime();

        // setTimeout(function FStyleFavorites() {
        //     let b, c;
        //     for (b = 0; b < 3; b++) {
        //         let favTable = document.getElementsByClassName('ant-table-tbody')[b].childElementCount;
        //
        //         for (c = 6; c < favTable; c++) {
        //             let styleFavorites = document.getElementsByClassName(style.favorites)[0].childNodes[b]
        //                 .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        //                 .tBodies[0].childNodes[c];
        //             if (showColumn === true) {
        //                 styleFavorites.style.opacity = '0.2';
        //             } else {
        //                 styleFavorites.style.opacity = '1';
        //             }
        //         }
        //     }
        // }, 5000);

        //let elemntFavorites = styleFavorites.document.getElementsByTagName('div');


        let functionFavoritesTF = _.map(data,(coin, index) => {
            coin.values.i = parseFloat((coin.values.i).toFixed(2));
            coin.values.d = parseFloat((coin.values.d).toFixed(2));
            coin.values.v = parseFloat((coin.values.v).toFixed(2));
            coin.values.s = parseFloat((coin.values.s).toFixed(2));

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
                    dataIndex: 'values.s',
                    key: 's',
                    sorter: (a, b) => a.values.s - b.values.s,
                    render: text => {
                        let color;
                        if (text > 0) {
                            color = 'rgb(84, 189, 0, ' + text + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
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
                    dataIndex: 'values.s',
                    key: 's',
                    sorter: (a, b) => a.values.s - b.values.s,
                    render: text => {
                        let color;
                        if (text > 0) {
                            color = 'rgb(84, 189, 0, ' + text + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
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
                    dataIndex: 'values.s',
                    key: 's',
                    sorter: (a, b) => a.values.s - b.values.s,
                    render: text => {
                        let color;
                        if (text > 0) {
                            color = 'rgb(84, 189, 0, ' + text + ')';
                        } else if (text < 0) {
                            let textColor = text * -1;
                            color = 'rgb(189, 26, 0, ' + textColor + ')';
                        }

                        return (
                            <div className={style.tdFav} style={{backgroundColor: color}}>
                                {text}
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

        const close = () => {
            console.log(
                'Notification was closed. Either the close button was clicked or duration time elapsed.',
            );
        };

        const openNotification = () => {
            const key = `open${Date.now()}`;
            const btn = (
                <Button type="primary" size="small" onClick={() => notification.close(key)}>
                    Подробнее
                </Button>
            );
            notification.open({
                message: 'Справка значений для фаворитов',
                duration: 0,
                description:
                    'i - процент изменения цены за период \n v - приращение объема в процентах по сравнению с предыдущим периодом \n s - скорость изменения цены \n d - доминирование покупателя над продавцом (отношения объёмы покупок к объему продаж)',
                btn,
                key,
                onClose: close,
            });
        };

        const { state } = this;

        return (
            <React.Fragment>
                <div className={style.commands}>
                    <b className={style.buttonReload}>Reload: </b><Button id="myCheck" onClick={this.props.load} shape="circle" icon="reload" size="small" loading={loading}/>
                    <b>Time: </b><span>{this.props.data && this.props.data.length > 0 ? moment.unix(this.props.data[0].updated).format('DD.MM.YY HH:mm:ss') : '--.--.-- --:--:--'}</span>

                    {/*<Form className={style.form}>*/}
                        {/*<FormItem label="Opacity">*/}
                            {/*<Switch checked={!!state.showOpacity} onChange={this.handlePagination2Change} />*/}
                        {/*</FormItem>*/}
                    {/*</Form>*/}

                    <FormItem label="" className={style.form2}>
                        <Radio.Group
                            value={state.pagination ? state.pagination.position : 'none'}
                            onChange={this.handlePaginationChange}>
                            <Radio.Button value="none">On</Radio.Button>
                            <Radio.Button value="bottom">Off</Radio.Button>
                        </Radio.Group>
                    </FormItem>

                    <Button type="primary" onClick={this.showModal} className={style.legend}>
                        Setting
                    </Button>

                    <CollectionCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />

                    <Button type="primary" onClick={openNotification} className={style.legend}>
                        Legend
                    </Button>
                </div>
                {/*rowSelection={rowSelection}  onRow={(record) => ({onClick: () => {this.selectRow(record);},})}*/}
                <div className={style.favorites}>
                    <Table {...this.state} className={style.tableM1} loading={loading} dataSource={arrayFavorite2m} columns={columns2m} expandedRowRender={record =>
                        <React.Fragment>
                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Time</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{moment.unix(record.updated).format('(DD.MM) YY HH:mm:ss')}</p>
                            </div>

                        </React.Fragment> }
                           onChange={this.handleChange}/>
                    <Table {...this.state} className={style.tableM2} loading={loading} dataSource={arrayFavorite5m} columns={columns5m} expandedRowRender={record =>
                        <React.Fragment>

                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Time</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{moment.unix(record.updated).format('(DD.MM) YY HH:mm:ss')}</p>
                            </div>

                        </React.Fragment> }
                           onChange={this.handleChange}/>
                    <Table {...this.state} className={style.tableM3} loading={loading} dataSource={arrayFavorite15m} columns={columns15m} expandedRowRender={record =>
                        <React.Fragment>
                            <div>
                                <span>Ƀ</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_btc).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Цена за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_changes_24h).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>$</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.price_usdt).toFixed(2))}</p>
                            </div>

                            <div>
                                <span>Объём за 24часа:</span>
                                <p style={{ margin: 0, marginLeft: '5px', display: 'inline'}}>{parseFloat((record.values.vol_24h).toFixed(2))}</p>
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
