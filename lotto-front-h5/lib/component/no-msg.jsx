/**
 * Created by YLD
 * date 2017-03-17
 * desc:个人中心模块-圆弧扇形子模块
 */

import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import '../scss/component/component.scss';

export default class Circle extends Component{
    constructor(props){
        super(props);
    }

    render() {
        let {msg, style} = this.props;

        return <div className="no-msg" style={style}>
            <div className="icon-errpic"></div>
            <div className="no-rep">{msg}</div>
            <div className="gone">大家都去外星了</div>
        </div>
    }
}