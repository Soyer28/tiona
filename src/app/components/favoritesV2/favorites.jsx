import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Table} from 'antd';
import _ from 'lodash';
import style from './favorites.scss';


export default class Favorites extends React.PureComponent {

	static propTypes = {
		data: PropTypes.array,
	};

    constructor(props) {
        super(props);
        this.state = {date: 0, base: 123,};
        console.log('state', this.state);
        console.log('props', this.props);
    }

    state = {
		data: [],
        updated: 0,
	};

    componentDidMount() {
		this.props.load();

        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({date: this.state.date + 1});
        const {loading, data} = this.props;

        console.log(data[0]);

        this.setState({updated: data[0].updated});
    }

    render() {
        const {loading, data} = this.props;

        let dataBase;

        if (data === undefined) {
            // console.log(data);
            dataBase = new Array({updated: 0});
        } else {
            _.map(data, function (object) {
               if (object.coin === 'ADA') {
                   // console.log(object);
               }
            });
            dataBase = data;
        }

        console.log('RENDER', dataBase[0].updated);



        return (
            <div>
                <h1 style={{color: 'white'}}>Hello, world!</h1>
                <h2 style={{color: 'white'}}>It is {this.state.date}.</h2>
                <h3>
                    {
                        this.state.updated
                    }
                </h3>
            </div>
        );
    }
}

