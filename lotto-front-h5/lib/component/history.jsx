/**
 * @author: LZY
 * @date time: 2017-07-06 14:15:46
 * @历史开奖详情
 */

import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import '../scss/component/history.scss';

export default class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false
		}
	}

	toggle() {
		this.setState({ active: !this.state.active });
	}

	render() {
		let { drawHistory } = this.props;
		return (
			<div className={cx('drawHistory', {'active': this.state.active})} onClick={this.toggle.bind(this)}>
		        <ul>{drawHistory}</ul>
		    </div>
		)
	}

}


History.propTypes = {
	drawHistory : PropTypes.array
}
