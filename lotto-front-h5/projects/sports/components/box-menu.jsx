/**
 * Created by YLD on 2017/12/07.
 */

import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import "../css/box-menu";

export default class BoxMenu extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            showMenu: true, //展示菜单
            index: 0,
        };
    }

    toggle(){
        let showMenu = !this.state.showMenu;
        this.setState({showMenu});
    }

    onTabChange(i, e){
        if(this.props.child){
            this.setState({index: i});
            if(this.props.onTabChange){
                this.props.onTabChange(i);
            }
            e.stopPropagation();
        }
    }

    renderTitle(){
        let result = [this.props.title];
        if(this.props.child){
            if(this.props.child instanceof Array){
                result = result.concat(this.props.child);
            }else{
                result.push(this.props.child);
            }
        }

        return result.map((val, i)=>{
            return <span onClick={this.onTabChange.bind(this, i)} key={i}
                         className={this.state.index == i?"active":""}>
                         {val}
                    </span>
        });
    }

    render(){
        let {showMenu} = this.state;
        return <div className="box-menu">
            <div className={"title "+(showMenu?"":"noshow")}
                 onClick={this.toggle.bind(this)}>
                {this.renderTitle()}
                <span className="arrows">
                </span>
            </div>
            <div className="cd-area" style={{display: showMenu?"block":"none"}}>
                {this.props.children}
            </div>
        </div>
    }
}