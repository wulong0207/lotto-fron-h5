/**
 * @author: LZY
 * @date time: 2017-07-10 12:05:46
 * @小轮播
 */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import "../../scss/component/number/loopPic.scss";


export default class LoopPic extends Component {
	constructor(args){
		super(args);
		this.state = {
			flag:false
		}
	}
	// 页面加载完成执行的事件
	componentDidMount(){
		this.onsetLoop();
		this.onloadLoop();
	}

	ontapShowHistory(){
		const { ontapShowHistory } = this.props;
		if (ontapShowHistory) {
			ontapShowHistory(this.state)
		}
	}

	onsetLoop(index){
		let itemArr = this.props.loopData.length;
		let ind = index || 1;
		let index2;
		for (let i = 0; i < itemArr; i++) {
			index2 = i + 1;
			if (index2 != ind) {
				this.refs['item'+(i+1)].style.display = "none";
			}else {
				this.refs['item'+(i+1)].style.display = "block";
			}
		};
	}
	onloadLoop(){
		let index2 = -1;
		let self = this;
		let timerId = setInterval(function(){
			index2++;
			self.onsetLoop(self.props.loopArr[index2]);

			if (index2 >= self.props.loopArr.length - 1){
				clearInterval(timerId);
			}
		},5000)
	}

	clearLoop(){
		if(this.timerId){
			clearInterval(this.timerId);
		}
	}

	render() {
		let {loopData} = this.props;

		return (
			<div className={"lotterTime"} onClick={this.ontapShowHistory.bind(this)}>
		        <div className="loopPic">
		            <ul>
		                {
		                	loopData.map((item,index) => {
		                		return (
		                			<li ref={'item'+(index+1)} className={'item'+(index+1)} key={index}>{item}</li>
	                			)
		                	})
		                }
		            </ul>
		        </div>
		    </div>
	    )
	}
}




LoopPic.PropTypes = {
	loopData : PropTypes.array.isRequired
}

LoopPic.defaultProps = {
	loopArr:[2,1,2],
}