import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Skeleton, Table, Spin, Button, Icon} from 'antd';
import _ from 'lodash';
import style from './favoritesLight.scss';

//
// const CollectionCreateForm = (
//     <div>
//       <p>
//         i - процент изменения цены за период
//       </p>
//       <p>
//         v - приращение объема в процентах по сравнению с предыдущим периодом
//       </p>
//       <p>
//         s - изменения цены за 24 часа
//       </p>
//       <p>
//         d - доминирование покупателя над продавцом (отношения объёмы покупок к объему продаж)
//       </p>
//     </div>
// );


// const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
//     // eslint-disable-next-line
//     class extends React.Component {
//       render() {
//         const { visible, onCancel, onCreate, form } = this.props;
//         const { getFieldDecorator } = form;
//         return (
//             <Modal
//                 visible={visible}
//                 title="Настройки фаворитов"
//                 okText="Задать"
//                 onCancel={onCancel}
//                 onOk={onCreate}
//             >
//               <Form layout="vertical" className={style.FavForm}>
//                 <Form.Item label="Объём за 24 часа">
//                   {getFieldDecorator('Volume24h', {
//                     rules: [{ required: true, message: 'Введите корректное число' }],
//                   })(<Input />)}
//                 </Form.Item>
//               </Form>
//             </Modal>
//         );
//       }
//     },
// );
//
// const close = () => {
//   console.log(
//       'Notification was closed. Either the close button was clicked or duration time elapsed.',
//   );
// };
//
// const openNotification = () => {
//   const key = `open${Date.now()}`;
//   const btn = (
//       <Button type="primary" size="small" onClick={() => notification.close(key)}>
//         Подробнее
//       </Button>
//   );
//   notification.open({
//     message: 'Справка значений для фаворитов',
//     duration: 0,
//     description:
//         'i - процент изменения цены за период \n v - приращение объема в процентах по сравнению с предыдущим периодом \n s - изменения цены за 24 часа \n d - доминирование покупателя над продавцом (отношения объёмы покупок к объему продаж)',
//     btn,
//     key,
//     onClose: close,
//   });
// };

// {/*<CollectionCreateForm*/}
//     {/*wrappedComponentRef={this.saveFormRef}*/}
//     {/*visible={state.visible}*/}
//     {/*onCancel={this.handleCancel}*/}
//     {/*onCreate={this.handleCreate}*/}
// {/*/>*/}
//
// {/*CollectionCreateForm*/}
//
// {/*<Button type="primary" onClick={openNotification} className={style.legend}>*/}
//     {/*Инфо*/}
//     {/*</Button>*/}

export default class FavoritesLight extends React.PureComponent {

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
    //   filters: [{text:'btc', value: 'btc'}, {text:'asc', value: 'asc'}],
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
    if (props.data) {
      const sorter = state.sorter;
      const filters = state.filters;
      console.log({sorter, filters});

      let data = _.map(props.data, item => ({
        ...item,
        coin: item.symbol.split('/')[0]
      }));
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

      if (!state.bases || state.bases.length === 0) {
        console.log('base');
        state.bases = _(data)
          .map(({market}) => market)
          .uniq()
          .sort()
          .map(symbol => ({text: symbol, value: symbol}))
          .value();
      }

      state.data = data;

    }
    return state;
  }

  columns = [];

  constructor(props) {
    super(props);
    this.columns = _.concat(FavoritesLight.columns, _.map(FavoritesLight.cumulatives, item => ({
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
  }


  render() {
    const {loading, data} = this.props;
    console.log(data);


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
    return (
        <div className={style.indicators}>
          <div className={style.commands}>
            <table id="favorites-light">
              <thead className="table-bordered table-light">
              <tr>
                <th scope="col"><span id="time__stamp"></span></th>
                <th scope="col">
                  <select name="" id="">
                    <option value="">BTC</option>
                    <option value="">USDT</option>
                    <option value="">BNB</option>
                  </select>
                </th>
                <th scope="col">5m</th>
                <th scope="col">15m</th>
                <th scope="col">30m</th>
                <th scope="col">2h</th>
              </tr>
              </thead>
              <tr>
                <th>BTC/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>BTC/USDT<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ADA/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ADA/BTC<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ADA/USDT<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>NEO/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>NEO/USDT<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>NEO/BTC<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ETH/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ETH/BTC<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>ETH/USDT<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>XRP/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <th>IOS/BNB<br /><em className="art__em">price: </em><span id="price__close"></span></th>
                <td></td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td>
                        <span className="symbol-table">I</span>
                        <span className=""></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Процент изменения</span>
                      </td>

                      <td><span className="symbol-table">S</span>
                        <span></span>
                        <dfn>%/min</dfn>
                        <span className="tooltip__table">Скорость изменения цены за единицу времени</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="symbol-table">Δ</span>
                        <span  className=""></span>
                        <dfn></dfn>
                        <span className="tooltip__table">Коэфф. доминирования</span>
                      </td>
                      <td>
                        <span className="symbol-table">V</span>
                        <span></span>
                        <dfn>%</dfn>
                        <span className="tooltip__table">Объём</span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span ></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table ">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="double__table">
                    <tbody>
                    <tr>
                      <td><span className="symbol-table">I</span><span  className=""></span><dfn>%</dfn><span className="tooltip__table">Процент изменения</span></td>
                      <td><span className="symbol-table">S</span><span ></span><dfn>%/min</dfn><span className="tooltip__table">Скорость изменения цены за единицу времени</span></td>
                    </tr>
                    <tr>
                      <td><span className="symbol-table">Δ</span><span className=""></span><dfn></dfn><span className="tooltip__table">Коэфф. доминирования</span></td>
                      <td><span className="symbol-table">V</span><span></span><dfn>%</dfn><span className="tooltip__table">Объём</span></td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
    );
  }
}
