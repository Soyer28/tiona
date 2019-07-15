import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Icon, Row, Col, Button, Divider} from 'antd';
import _ from 'lodash';
import style from './levelsBlock.scss';

export default class LevelsBlock extends React.PureComponent {

  static propTypes = {
    configs: PropTypes.array,
    strategyType: PropTypes.number,
    disabled: PropTypes.bool,
    save: PropTypes.func.isRequired
  };

  state = {
    configs: {}
  };

  init = () => {
    const {configs = []} = this.props;
    console.log(configs);
    this.setState({
      configs
    });
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.configs, this.props.configs)) {
      this.init();
    }
  }

  onChange = (itemIndex) => (e) => {
    const configs = [...this.state.configs];
    const {name, value} = e.currentTarget;
    configs[itemIndex][name] = value;
    this.setState({
      configs
    });
  };

  onItemRemove = (itemIndex) => () => {
    const configs = [...this.state.configs];
    configs.splice(itemIndex, 1);
    this.setState({
      configs
    });
  };

  onAddItem = () => {
    const configs = [...this.state.configs, {
      name: `level${this.state.configs.length}`,
      deposit: 0,
      jitter_dump: 0,
      jitter_pump: 0
    }];
    this.setState({
      configs
    });
  };

  handleSubmit = (e) => {
    console.log(this.state);
    e.preventDefault();

    this.props.save(this.state.configs);
  };

  render() {
    const {disabled} = this.props;
    const {configs} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    const formItem2Layout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    return (

      <Form onSubmit={this.handleSubmit}>
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
        {_.map(configs, (config, index) => (
          <Row gutter={8} key={index} className={style.row}>
            <Col span={8}>
              <Input onChange={this.onChange(index)}
                     name="name" value={config.name}
                     disabled={disabled} required={true}/>
            </Col>
            <Col span={5}>
              <Input onChange={this.onChange(index)}
                     name="deposit" value={config.deposit}
                     disabled={disabled} required={true}/>
            </Col>
            <Col span={5}>
              <Input onChange={this.onChange(index)}
                     name="jitter_dump" value={config.jitter_dump}
                     disabled={disabled} required={true}/>
            </Col>
            <Col span={5}>
              <Input onChange={this.onChange(index)}
                     name="jitter_pump" value={config.jitter_pump}
                     disabled={disabled} required={true}/>
            </Col>
            <Col span={1}>
              <Icon type="close" onClick={this.onItemRemove(index)} className={style.removeIcon}/>
            </Col>
          </Row>
        ))}
        <Button htmlType="button" disabled={disabled} onClick={this.onAddItem}>
          <Icon type="plus"/>
        </Button>
        <Divider/>
        <Row gutter={8}>
          <Col span={8}>
            <Button type="primary" htmlType="submit">Save</Button>
          </Col>
          <Col span={5}>
            <Button htmlType="button" onClick={this.init}>Cancel</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}