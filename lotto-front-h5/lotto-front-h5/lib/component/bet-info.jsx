/**
 * Created by YLD
 * date 2017-07-08
 * desc:彩票底部投注信息
 */

import React,{Component} from 'react';
import "../scss/component/bet-info.scss";
import {PropTypes} from "prop-types";

export default class BetInfo extends Component {
    constructor(args) {
        super(args);
        this.state = {
            keyboardType: 0,
        };
    }

    componentDidMount(){

    }

    //是否已选择球
    hasBall(){
        let {ballsSet} = this.props;
        let result = false;

        for(let item in ballsSet){
            if(ballsSet[item]){
                if(ballsSet[item].ballCount || ballsSet[item].danCount){
                    return true;
                }
            }
        }
    }

    render() {
        let {ballSet} = this.props;
        let className = "";
        if(this.hasBall()){
            className = " show-tip"
        }

        return (
            <div className={"bet-info"+className}>
                {this.props.children}
            </div>
        );
    }
}

export class Message extends Component{
    constructor(args) {
        super(args);
    }

    render() {
        return (
            <div className="bet-info-msg">
                {this.props.children}
            </div>
        );
    }
}

export class Tip extends Component{
    constructor(args) {
        super(args);
    }

    onDeleteClickHandler(){
        if(this.props.onDeleteClick){
            this.props.onDeleteClick();
        }
    }

    render() {
        return (
            <div className="bet-info-root">
                <div className="bet-info-tip">
                    <div className="del" onClick={this.onDeleteClickHandler.bind(this)}></div>
                    <div className="flex"></div>
                    <div className="info">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
