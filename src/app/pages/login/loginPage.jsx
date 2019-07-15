import React from 'react';
import {Form, Input, Icon, Button, Spin} from 'antd';
import PropTypes from 'prop-types';
import style from './style.scss';

export default class LoginPage extends React.PureComponent {
  static propTypes = {
    login: PropTypes.func.isRequired,
    process: PropTypes.bool,
    error: PropTypes.shape()
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;
    this.props.login({
      username, password
    });
  };

  render() {
    const {process, error} = this.props;
    return (
      <div className={(style.loginPage) + ' login'}>
        <Spin spinning={process}>
          <Form onSubmit={this.handleSubmit}>
            <h1>Tiona.</h1><small>io</small>
            <Form.Item hasFeedback={!!error} validateStatus={error && 'error'}>
              <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"
                     name="username" autoFocus={true}
                     disabled={process} error="22" required={true}/>
            </Form.Item>
            <Form.Item hasFeedback={!!error} validateStatus={error && 'error'}>
              <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" name="password"
                     placeholder="Password" disabled={process} required={true}/>
            </Form.Item>

            <Button type="primary" htmlType="submit" className="login-form-button" loading={process}>
              Войти
            </Button>
          </Form>
        </Spin>
      </div>
    );
  }
}
