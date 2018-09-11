/**
 * Created by YLD on 2017-10-14.
 */

import React, {Component } from 'react';

export default class LazyPage extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }

        this.needLazy = true;
    }

    componentDidMount () {
        this.needLazy = false;
    }

    lazyRender(component) {
        if(this.needLazy){
            setTimeout(()=>{
                this.setState({component});
            },100);

            let {component} = this.state;
            return component?component:<div className="loading">
                <div className="loader"></div>
                <span>加载中...</span>
            </div>;
        }else{
            return component;
        }
    }
}
