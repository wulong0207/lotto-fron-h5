/**
 * Created by YLD
 * date 2017-06-27
 * desc:彩票底部投注菜单
 */

import React,{Component} from 'react';
import "../scss/component/bet-bar.scss";
import {PropTypes} from "prop-types";

export default class BetBar extends Component {
    constructor(args) {
        super(args);
        this.state = {
        };
    }

    componentDidMount(){

    }

    onButtonClick(item, index){
        let {onBtnClick} = this.props;
        if(onBtnClick){
            onBtnClick(item, index);
        }
    }

    onItemClickHandle(item, index, e){
        let {onItemClick} = this.props;
        if(onItemClick){
            onItemClick(item, index);
        }
    }

    //获取生成带图标的按钮
    getIconButton(item, index){
        return <div key={index} ref={item.ref}
                    className={"icon"}>
            <img src={item.src}></img>
            <div className="icon-title">{item.title}</div>
        </div>
    }

    getChild(name){
        return this.refs[name];
    }

    //点击小图标的事件
    onMarkClickHandler(item, e){
        e.stopPropagation();

        if(item.onMarkClick){
            item.onMarkClick();
        }
    }

    //获取文字按钮
    getTextButton(item, index){
        let titleArea = <span ref={item.ref} className="title">{item.title}</span>;
        let subTitleArea = <div ref={item.subRef} className="subtitle">{item.subTitle}</div>;
        let numMark;
        if(item.num){
            numMark = <div onClick={this.onMarkClickHandler.bind(this, item)} className="num-mark">{item.num}</div>;
        }

        return <div key={index} className={"btn-txt"}>
            {titleArea}
            {subTitleArea}
            {numMark}
        </div>
    }

    //获取按钮
    getButtons(){
        let self = this;
        let {items} = this.props;
        if(!items){
            return "";
        }

        return items.map((val, index)=>{
            let notlastOneCN=" "; //不是最后一个的元素，则右侧添加分隔线
            let commonClassName = "";
            let area;
            if(index != items.length - 1){
                notlastOneCN = " border-right";
            }

            if(typeof val == "object"){
                //获取生成带图标的按钮
                if(val.src){
                    area = self.getIconButton(val, index);
                }else{
                    area = self.getTextButton(val, index);
                }

                //公共样式处理
                if(val.flex){
                    commonClassName += " flex"
                }
                //背景色
                if(val.bg){
                    commonClassName += " " + val.bg;
                    notlastOneCN = ""; //有背景色作为分隔，去除右边的线
                }
            }else{
                area = self.getTextButton({title: val}, index);
            }

            return <div key={index} className={commonClassName+notlastOneCN}
                        onClick={this.onItemClickHandle.bind(this, val, index)}>
                {area}
            </div>
        });
    }

    render(){
        return <div className="yc-bet-bar">
            {this.getButtons()}
        </div>
    }
}

BetBar.propTypes = {
    onItemClick: PropTypes.func,
    items: PropTypes.array,
}

BetBar.defaultProps = {
    onItemClick: null, //点击按钮的回调事件包含两个参数item：当前按钮的配置, index：第几个按钮
    items: [],       //菜单项
                     //   [
                     //         //图标按钮
                     //         {src: require("../../img/component/icon_shake@2x.png"), title: "摇一注"},
                     //         //文字自定义图标按钮
                     //         {src: require("../../img/component/icon_period@2x.png"), title: <span>追<em>{1}</em>期</span>},
                     //         //文本按钮，占布局的剩余位置，背景色配置为橙色  onMarkClick 按钮上数字的点击事件
                     //         {title: "加入号码篮", bg: "orange", flex: 1, onMarkClick: function(){}},
                     //         //文本按钮，含副标题，占布局的剩余位置，背景色配置为红色
                     //         {title: "立即投注", subTitle: "01:40:56后截止", bg: "red", flex: 1},
                     //   ];
}
