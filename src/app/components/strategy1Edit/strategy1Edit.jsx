import React from 'react';
import PropTypes from 'prop-types';
import {Spin, Form, Input, Row, Col, Button} from 'antd';
import LevelsConfig from './helpers/levelsConfig';
import _ from 'lodash';
import uuidv5 from 'uuid/v5';

export default class Strategy1Edit extends React.PureComponent {

  static propTypes = {
    get: PropTypes.func.isRequired,
    clear: PropTypes.func,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func,
    id: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.object,
    strategy: PropTypes.shape()
  };

  id = uuidv5(location.hostname ,uuidv5.DNS);

  state = {
    related_exchange: '',
    symbol: undefined,
    group: '',
  };

  changeParam = (e) => {
    const {name, value} = e.currentTarget;
    this.setState({
      [name]: value
    });
  };

  changeConfig = (e) => {
    console.log(e.currentTarget);
    const {name, value} = e.currentTarget;
    this.setState(({config = {}}) => ({
      config: {
        ...config,
        [name]: value
      }
    }));
  };

  changeLevelConfig = (LEVELS_CONFIG) => {
    this.setState(({config = {}}) => ({
      config: {
        ...config,
        LEVELS_CONFIG
      }
    }));
  };

  onDataUpdate = () => {
    const {strategy} = this.props;
    this.setState({
      related_exchange: strategy.related_exchange,
      symbol: strategy.symbol,
      config: strategy.config
    });
  };

  onSave = (e) => {
    e.preventDefault();

    this.props.save({
      id: this.id,
      patch: {
        symbol: this.state.symbol,
        type: this.props.match.params.strategyNum,
        group: this.state.group,
        config: [],
        related_exchange: this.state.related_exchange
      }
    });
  };

  componentDidMount() {
    if (this.props.id) {
      this.props.get(this.props.id);
    }
    if (this.props.strategy) {
      this.onDataUpdate();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.strategy !== this.props.strategy && this.props.strategy) {
      this.onDataUpdate();
    }
  }

  componentWillUnmount() {
    this.props.clear();
  }

  render() {
    const {loading} = this.props;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 4,
          offset: 4,
        },
      },
    };
    console.log(this.props.match.params.strategyNum);
    return (
      <div>
        <Spin spinning={loading}>
          <React.Fragment>
            <Form onSubmit={this.onSave}>
              <Form.Item label="Symbol" {...formItemLayout}>
                <Input onChange={this.changeParam}
                       name="symbol" autoFocus={true} value={this.state.symbol}
                       disabled={loading} required={true}/>
              </Form.Item>
              <Form.Item label="Group" {...formItemLayout}>
                <Input onChange={this.changeParam}
                       name="group"  value={this.state.group}
                       disabled={loading} required={true}/>
              </Form.Item>
              <Form.Item label="Related exchange" {...formItemLayout}>
                <Input onChange={this.changeParam}
                       name="related_exchange"  value={this.state.related_exchange}
                       disabled={loading} required={true}/>
              </Form.Item>


              <Form.Item {...tailFormItemLayout}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Button type="primary" htmlType="submit">Save</Button>
                  </Col>
                  <Col span={8}>
                    <Button htmlType="button" onClick={this.props.cancel}>Cancel</Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </React.Fragment>

        </Spin>
      </div>
    );
  }
}