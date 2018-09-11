/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--底部版权模块
 */

import React,{Component} from 'react';

export default class FootCopy extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <section className="st-copy-absolute">
                <p>@2017益彩网版权所有</p>
                <p>深圳益彩网络技术有限公司</p>
            </section>
        )
    }
}


