import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Navigator from "../utils/navigator";

export default class PageHeader extends Component{
    constructor(props){
        super(props);
    }

    /**
     * 回退点击
     */
    backClick(){
        let {url, title, accept} = this.props;
        Navigator.goback(url, accept);
    }

    render() {
        let {url, title} = this.props;

        return <div className="header">
            <a href="javascript:void(0)" onClick={this.backClick.bind(this)} className="back"></a>
            <div className="user-info big">{title}</div>
            {this.props.children}
        </div>
    }
}