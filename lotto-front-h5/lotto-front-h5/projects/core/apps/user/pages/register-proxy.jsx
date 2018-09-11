import React, { Component } from 'react';
import ProxyPage from '@/component/proxy/proxy-page';

export default class RegProxy extends Component{
    constructor(props){
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div>
                <ProxyPage isPage={true} />
            </div>
        )
    }
}