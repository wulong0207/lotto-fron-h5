/**
 * Created by manaster
 * date 2017-03-17
 * desc:个人中心模块-圆弧扇形子模块
 */

import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// import '../scss/component/component.scss';

export default class Circle extends Component{
    constructor(props){
        super(props);
        this.state = {
            colorOne:this.props.colorOne,
            colorTwo:this.props.colorTwo,
            colorThree:this.props.colorThree,
            angleOne:this.props.angleOne,
            angleTwo:this.props.angleTwo,
            angleThree:this.props.angleThree
        }
    }
    componentDidMount(){
        let canvas = ReactDOM.findDOMNode(this.refs.canvas);
        let ctx = canvas.getContext('2d');
        const PI = Math.PI;
        let w = canvas.width,
            h = canvas.height,
            r = w / 2,
            firstAngleStart = 0,
            firstAngleEnd = this.state.angleOne*2*PI,
            secondAngleEnd = (this.state.angleOne+this.state.angleTwo)*2*PI,
            thirdAngleEnd = (this.state.angleOne+this.state.angleTwo+this.state.angleThree)*2*PI;
        //画第一个圆
        ctx.beginPath();
        ctx.arc(w/2, h/2, r * 0.6, firstAngleStart, firstAngleEnd, false); //false 瞬时针，true 逆时针
        ctx.lineWidth = 70;
        ctx.strokeStyle = this.state.colorOne;
        ctx.stroke();
        //画第二个圆
        ctx.beginPath();
        ctx.arc(w/2, h/2, r * 0.6, firstAngleEnd, secondAngleEnd, false); //false 瞬时针，true 逆时针
        ctx.strokeStyle = this.state.colorTwo;
        ctx.stroke();
        //画第三个圆
        ctx.beginPath();
        ctx.arc(w/2, h/2, r * 0.6, secondAngleEnd, thirdAngleEnd, false); //false 瞬时针，true 逆时针
        ctx.strokeStyle = this.state.colorThree;
        ctx.stroke();
    }
    render() {
        return (
            <canvas className="canvas" ref="canvas" width={ this.props.width } height={ this.props.height }></canvas>
        )
    }
}


