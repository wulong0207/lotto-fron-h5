/*create by wangzhiyong
 date:2017-03-02
 desc 所有页面的基类
 */
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
// let React=require("react");
import React from 'react';

 let  Page=React.createClass({
    render:function(){
        return (<div className="page">
            {this.props.children}
        </div>)
    }
})
export default Page;