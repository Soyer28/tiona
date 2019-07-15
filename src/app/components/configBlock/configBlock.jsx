import React from 'react';
import PropTypes from 'prop-types';
import {List, Button, Icon, Modal, Input, Form, Row, Col, Switch, Divider} from 'antd';
import {Link} from 'react-router-dom';
import style from './configBlock.scss';
import _ from 'lodash';

export default class ConfigBlock extends React.PureComponent {

  static propTypes = {
    save: PropTypes.func,
    strategyType: PropTypes.number,
    config: PropTypes.shape({
      DEPOSIT: PropTypes.number,
      PANIC_SELL: PropTypes.number,
      SEED_DEFF_DUMP: PropTypes.number,
      SEED_DEFF_PUMP: PropTypes.number,
      STOP_LIMIT_JITTER: PropTypes.number
    })

  };

  state = {
    config: {}
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
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.config, this.props.config)) {
      console.log(this.props.config, prevProps.config);
      this.init();
    }
  }

  onStopSwitch = (value) => {
    this.setState(({config}) => ({
      config: {
        ...config,
        IS_STOP: value
      }
    }));
  };

  onChange = (e) => {
    const {name, value} = e.currentTarget;
    console.log(name, value);
    const {config} = this.state;
    _.set(config, name, value);
    this.setState({config: {...config}});
  };

  onCheckbox = (name) => value => {
    const {config} = this.state;
    _.set(config, name, value);
    this.setState({config: {...config}});
  };

  onLevelChange = (itemIndex) => (e) => {
    const configs = [...this.state.config.LEVELS_CONFIG];
    const {name, value} = e.currentTarget;
    configs[itemIndex][name] = value;
    this.setState({
      config: {
        ...this.state.config,
        LEVELS_CONFIG: configs
      }
    });
  };

  onItemRemove = (itemIndex) => () => {
    const configs = [...this.state.config.LEVELS_CONFIG];
    configs.splice(itemIndex, 1);
    this.setState({
      config: {
        ...this.state.config,
        LEVELS_CONFIG: configs
      }
    }, () => console.log(this.state.config));
  };

  onAddItem = () => {
    const configs = [...this.state.config.LEVELS_CONFIG, {
      name: `level${this.state.config.LEVELS_CONFIG.length}`,
      deposit: 0,
      jitter_dump: 0,
      jitter_pump: 0
    }];
    this.setState({
      config: {
        ...this.state.config,
        LEVELS_CONFIG: configs,
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const strategy3Params = this.props.strategyType === 2 || this.props.strategyType === 3 || this.props.strategyType === 4 ? {
      START_PRICE: Number(this.state.config.START_PRICE),
      START_BUY_DIFF: Number(this.state.config.START_BUY_DIFF),
      SELL_AND_STOP: Number(this.state.config.SELL_AND_STOP),
      START_SELL_DIFF: Number(this.state.config.START_SELL_DIFF),

      START_PUMP: Number(this.state.config.START_PUMP),
      START_DUMP: Number(this.state.config.START_DUMP),
      PUMPDUMP_MULTIPLIER: Number(this.state.config.PUMPDUMP_MULTIPLIER),

      IS_STOP: this.state.config.IS_STOP
    } : {};

    if ((this.props.strategyType === 3 || this.props.strategyType === 4) && this.state.config.START_PRICE_PCT) {
      strategy3Params.START_PRICE_PCT = {
        timer: Number(this.state.config.START_PRICE_PCT.timer),
        percent: Number(this.state.config.START_PRICE_PCT.percent),
        is_on: this.state.config.START_PRICE_PCT.is_on
      };
    }

    this.props.save({
      ...this.props.config,
      DEPOSIT: Number(this.state.config.DEPOSIT),
      PANIC_SELL: Number(this.state.config.PANIC_SELL),
      SEED_DEFF_DUMP: Number(this.state.config.SEED_DEFF_DUMP),
      SEED_DEFF_PUMP: Number(this.state.config.SEED_DEFF_PUMP),
      STOP_LIMIT_JITTER: Number(this.state.config.STOP_LIMIT_JITTER),
      LEVELS_CONFIG: this.state.config.LEVELS_CONFIG,

      ...strategy3Params
    });
  };

  render() {
    const {config = {}} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <Form onSubmit={this.handleSubmit} className={style.configBlock}>
        <Form.Item label="Deposit" {...formItemLayout}>
          <Input defaultValue="0.00" value={config.DEPOSIT} onChange={this.onChange} name="DEPOSIT"/>
        </Form.Item>
        {(this.props.strategyType === 2 || this.props.strategyType === 3 || this.props.strategyType === 4) && (
          <React.Fragment>
            <Form.Item label="Start price" {...formItemLayout}>
              <Input defaultValue="0.00" value={config.START_PRICE} onChange={this.onChange} name="START_PRICE"/>
            </Form.Item>
            <Form.Item label="Start buy" {...formItemLayout}>
              <Input defaultValue="0.00" value={config.START_BUY_DIFF} onChange={this.onChange} name="START_BUY_DIFF"/>
            </Form.Item>
            <Form.Item label="Start sell" {...formItemLayout}>
              <Input name="START_SELL_DIFF" onChange={this.onChange} defaultValue="0.00"
                     value={config.START_SELL_DIFF}/>
            </Form.Item>
            <Form.Item label="Is stop" {...formItemLayout}>
              <Switch onChange={this.onStopSwitch} name="IS_STOP" checked={config.IS_STOP}/>
            </Form.Item>
            {(this.props.strategyType === 3 || this.props.strategyType === 4) && config.START_PRICE_PCT && (
              <React.Fragment>
                <Form.Item label="Timer" {...formItemLayout}>
                  <Input defaultValue="0.00" value={config.START_PRICE_PCT.timer} onChange={this.onChange}
                         name="START_PRICE_PCT.timer"/>
                </Form.Item>
                <Form.Item label="Percent" {...formItemLayout}>
                  <Input name="START_PRICE_PCT.percent" onChange={this.onChange} defaultValue="0.00"
                         value={config.START_PRICE_PCT.percent}/>
                </Form.Item>
                <Form.Item label="Is on" {...formItemLayout}>
                  <Switch onChange={this.onCheckbox('START_PRICE_PCT.is_on')} name="START_PRICE_PCT.is_on"
                          checked={config.START_PRICE_PCT.is_on}/>
                </Form.Item>
              </React.Fragment>
            )}


            <Form.Item label="Sell&stop" {...formItemLayout}>
              <Input defaultValue="0.00" value={config.SELL_AND_STOP} onChange={this.onChange} name="SELL_AND_STOP"/>
            </Form.Item>

            <Form.Item label="Start P." {...formItemLayout}>
              <Input defaultValue="0.00" value={config.START_PUMP} onChange={this.onChange} name="START_PUMP"/>
            </Form.Item>
            <Form.Item label="Start D." {...formItemLayout}>
              <Input defaultValue="0.00" value={config.START_DUMP} onChange={this.onChange} name="START_DUMP"/>
            </Form.Item>
            <Form.Item label="PDM" {...formItemLayout}>
              <Input defaultValue="0.00" value={config.PUMPDUMP_MULTIPLIER} onChange={this.onChange}
                     name="PUMPDUMP_MULTIPLIER"/>
            </Form.Item>


          </React.Fragment>
        )}

        <Form.Item label="Panic sell" {...formItemLayout}>
          <Input defaultValue="0.00" value={config.PANIC_SELL} onChange={this.onChange} name="PANIC_SELL"/>

        </Form.Item>

        <Form.Item label="Seed D.P." {...formItemLayout}>
          <Input defaultValue="0.00" value={config.SEED_DEFF_PUMP} onChange={this.onChange} name="SEED_DEFF_PUMP"/>
        </Form.Item>
        <Form.Item label="Seed D.D." {...formItemLayout}>
          <Input defaultValue="0.00" value={config.SEED_DEFF_DUMP} onChange={this.onChange} name="SEED_DEFF_DUMP"/>

        </Form.Item>
        <Form.Item label="Stop lim.j" {...formItemLayout}>
          <Input defaultValue="0.00" value={config.STOP_LIMIT_JITTER} onChange={this.onChange}
                 name="STOP_LIMIT_JITTER"/>
        </Form.Item>
        <Divider/>
        <div>
          <Row gutter={8}>
            <Col span={8}>
              Name
            </Col>
            <Col span={5}>
              Deposit
            </Col>
            <Col span={5}>
              Jitter dump
            </Col>
            <Col span={6}>
              Jitter pump
            </Col>
          </Row>
          {_.map(config.LEVELS_CONFIG, (config, index) => (
            <Row gutter={8} key={index} className={style.row}>
              <Col span={8}>
                <Input onChange={this.onLevelChange(index)}
                       name="name" value={config.name}
                       required={true}/>
              </Col>
              <Col span={5}>
                <Input onChange={this.onLevelChange(index)}
                       name="deposit" value={config.deposit}
                       required={true}/>
              </Col>
              <Col span={5}>
                <Input onChange={this.onLevelChange(index)}
                       name="jitter_dump" value={config.jitter_dump}
                       required={true}/>
              </Col>
              <Col span={5}>
                <Input onChange={this.onLevelChange(index)}
                       name="jitter_pump" value={config.jitter_pump}
                       required={true}/>
              </Col>
              <Col span={1}>
                <Icon type="close" onClick={this.onItemRemove(index)} className={style.removeIcon}/>
              </Col>
            </Row>
          ))}
          <Button htmlType="button" onClick={this.onAddItem}>
            <Icon type="plus"/>
          </Button>
        </div>
        <Divider/>

        <Form.Item {...formItemLayout}>
          <Row gutter={8}>
            <Col span={11}>
              <Button type="primary" htmlType="submit">Save</Button>
            </Col>
            <Col span={5}>
              <Button htmlType="button" onClick={this.init}>Cancel</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}