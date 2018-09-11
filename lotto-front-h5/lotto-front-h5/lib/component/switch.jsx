/**
 * Created by manaster
 * date 2017-03-13
 * desc:个人中心模块-switch子模块
 */

import React,{Component} from 'react';
// import '../scss/component/component.scss';

export default class Switch extends Component{
    constructor(props){
        super(props);
        this.state = {
            value:this.props.value || 'off'
        }
    }
    tap() {
        this.state.value == 'off' ? this.setState({value:'on'}) : this.setState({value:'off'});
        if(typeof this.props.switchClick === 'function'){
            this.props.switchClick();
        }else{
            console.log('error:the switchClick is not a function');
        }
    }
    render() {
        let {value} = this.state;
        return (
            <div className="switch" onClick={this.tap.bind(this)}>
                <i className={value == 'on' ? 'icon-switchon':'icon-switchoff'}></i>
            </div>
        )
    }
}


