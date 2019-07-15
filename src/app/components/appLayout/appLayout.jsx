import React from 'react';
import PropTypes from 'prop-types';
import style from './style.scss';
import {Layout, Menu, Icon, Form} from 'antd';
import {Link} from 'react-router-dom';


export default class AppLayout extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    logout: PropTypes.func.isRequired,
    location: PropTypes.shape()
  };

  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onMenuClick = ({key}) => {
    if (key === 'logout') {
      this.props.logout();
    }
  };

  onClose = () => {
    this.props.history.push('/');
  };

  render() {
    const {children} = this.props;
    return (
      <Layout className={style.layout}>
        {this.props.location.pathname !== '/indicators' && (
            <div className={style.asideMenu}>
            <Layout.Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            className={style.aside}
          >
            <div className={(style.logo) + ' logoType'}>
              <Link to="/"><h1>Tiona.</h1><small>io</small></Link>
            </div>
            <Menu mode="inline" className={style.menu} onSelect={this.onMenuClick}>
              <Menu.Item key="1">
                <Link to="/strategy1">
                  <Icon type="setting"/>
                  <span>
                  Strategy
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="4">
                <Link to="/indicators">
                  <Icon type="table"/>
                  <span>
                  Indicators
                  </span>
                </Link>
              </Menu.Item>

              <Menu.Item key="5">
                <Link to="/favorites">
                  <Icon type="forward"/>
                  <span>
                  Favorites
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="6">
                <Link to="/favoritesV2">
                  <Icon type="forward"/>
                  <span>
                  Favorites V2
                  </span>
                </Link>
              </Menu.Item>
              <Menu.Item key="7">
                <Link to="/favoritesLight">
                  <Icon type="arrow-down"/>
                  <span>
                  Favorites <small>light</small>
                  </span>
                </Link>
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              className={style.aside} >
          <Menu>
            <Menu.Item key="logout">
              <Icon type="logout"/>
              <span>Logout</span>
            </Menu.Item>
          </Menu>
          </Layout.Sider>
          </div>
        )}

        <Layout>

          <Layout.Header style={{background: 'rgba(221, 221, 221, 0)', padding: 0, position: 'absolute'}}>
            {this.props.location.pathname !== ('/indicators' || '/favorites')  ? (<Icon
                className={style.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            ) : (<Icon
              className={style.trigger}
              type="close"
              onClick={this.onClose}
            />)}

          </Layout.Header>


          <Layout.Content style={{margin: '50px 16px 24px', padding: 24, background: 'rgb(38, 42, 72)', minHeight: 280, borderRadius: '7px', border: '2px solid #343655'}}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
