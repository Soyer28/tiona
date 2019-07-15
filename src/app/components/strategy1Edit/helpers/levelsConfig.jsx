import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, Icon, Row, Col, Button} from 'antd';
import _ from 'lodash';

export default class LevelsConfig extends React.PureComponent {

  static propTypes = {
    configs: PropTypes.array,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  };

  onChange = (itemIndex) => (e) => {
    const config = [...this.props.configs];
    const {name, value} = e.currentTarget;
    config[itemIndex][name] = value;
    this.props.onChange(config);
  };

  onItemRemove = (itemIndex) => () => {
    const config = [...this.props.configs];
    config.splice(itemIndex, 1);
    this.props.onChange(config);
  };

  onAddItem = () => {
    const config = [...this.props.configs, {
      name: `level${this.props.configs.length}`,
      deposit: 0,
      jitter_dump: 0,
      jitter_pump: 0
    }];
    this.props.onChange(config);
  };

  render() {
    const {disabled, configs} = this.props;
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

      <Form.Item label="LEVELS CONFIG" {...formItemLayout}>
        {_.map(configs, (config, index) => (
          <Row gutter={8} key={index}>
            <Col span={5}>
              <Form.Item label="name"  {...formItem2Layout}>
                <Input onChange={this.onChange(index)}
                       name="name" value={config.name}
                       disabled={disabled} required={true}/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="deposit"  {...formItem2Layout}>
                <Input onChange={this.onChange(index)}
                  name="deposit" value={config.deposit}
                  disabled={disabled} required={true}/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="jitter dump" {...formItem2Layout}>
                <Input onChange={this.onChange(index)}
                  name="jitter_dump" value={config.jitter_dump}
                  disabled={disabled} required={true}/>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="jitter pump" {...formItem2Layout}>
                <Input onChange={this.onChange(index)}
                  name="jitter_pump" value={config.jitter_pump}
                  disabled={disabled} required={true}/>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button type="danger" disabled={disabled} onClick={this.onItemRemove(index)}>
                <Icon type="close"/>
              </Button>
            </Col>
          </Row>
        ))}
        <Button htmlType="button" disabled={disabled} onClick={this.onAddItem}>
          <Icon type="plus"/>
        </Button>
      </Form.Item>

    );
  }
}