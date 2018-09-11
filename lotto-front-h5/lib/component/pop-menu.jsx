/**
 * Created by YLD
 * date 2017-06-27
 * desc:按钮弹出菜单控件，点击一个按钮可对应弹出一个菜单
 */

import React,{Component} from 'react';
import "../scss/component/pop-menu.scss";
import {PropTypes} from "prop-types";

export default class PopMenu extends Component {
    constructor(args) {
        super(args);
        this.state = {
            selectIndex: 0,
            visible: false, //是否展示菜单
        };
        this.bodyClickBind = this.bodyClick.bind(this);
    }

    //改变选项时触发方法
    onChangedHandler(item, index){
        let {onChanged} = this.props;
        this.toggleMenu(false);
        if(onChanged){
            onChanged(item, index)
        }

        this.setState({selectIndex: index});
    }

    componentDidMount(){
        if(("ontouchstart" in window)){
            document.body.addEventListener('touchstart', this.bodyClickBind, false);
        }else{
            document.body.addEventListener('click', this.bodyClickBind, false);
        }
    }

    componentWillUnmount(){
        if(("ontouchstart" in window)){
            document.body.removeEventListener('touchstart', this.bodyClickBind, false);
        }else{
            document.body.removeEventListener('click', this.bodyClickBind, false);
        }
    }

    //点击非本窗体则隐藏本窗体
    bodyClick(e){
        if(!this.state.visible){
            return;
        }

        e = e || window.event;
        let target = e.target || e.srcElement;
        let keyboardBody = this.refs.root;
        let isChild = true;
        if(keyboardBody){
            isChild = keyboardBody.contains(target);
        }
        if(!isChild || target == this.refs.cover){
            this.toggleMenu(false);
        }
    }

    //控制菜单是否展示
    toggleMenu(shouldShow){
        let visible;
        if(shouldShow != null){
            visible = shouldShow;
        }else{
            visible = !this.state.visible;
        }
        this.setState({visible});
    }

    onBtnMenuClick(){
        this.toggleMenu();
    }

    render(){
        let {items, index, btnText, btnClass, highlight} = this.props;
        let {selectIndex, visible} = this.state;
        let curIndex = index;
        if(highlight){
            if(selectIndex != -1){
                curIndex = selectIndex;
            }
        }else{
            curIndex = -1;
        }

        let coverStyle;
        if(!visible){
            coverStyle = {display: "none"}
        }

        return <div ref="root" className="yc-popover-root">
            <div onClick={this.onBtnMenuClick.bind(this)} className={"btn-menu "+btnClass}>{btnText}</div>
            <div style={coverStyle} className="yc-popover">
                  <div className="popover-arrow"></div>
                  <div className="popover-wrapper">
                    <ul className="table-view">
                    {
                        items.map((val, i)=>{
                            let className = "";
                            let liClassName = "";
                            if(curIndex == i){
                                className = "active";
                            }

                            let title, icon;
                            if(typeof val == "object"){
                                title = val.title;
                                if(val.icon){
                                    icon = <i className={val.icon}></i>;
                                }else if(val.src){
                                    icon = <img src={val.src}/>
                                }
                            }else{
                                title = val;
                                liClassName = "li-center";
                            }

                            return <li className={liClassName} key={i} onClick={this.onChangedHandler.bind(this, val, i)}>
                                <a className={className}>
                                    {icon}
                                    {title}
                                </a>
                              </li>
                        })
                    }
                    </ul>
                  </div>
            </div>
        </div>
    }
}

PopMenu.propTypes = {
    onChanged: PropTypes.func,
    items: PropTypes.array,
    btnText: PropTypes.string,
    btnClass: PropTypes.string,
    index: PropTypes.number,
}

PopMenu.defaultProps = {
    onChanged: null, //点击菜单的回调事件
    items: [],       //菜单项
                     //   [
                     //         {icon: "icon_missing", title: "遗漏数据"},
                     //         {icon: "icon_hot", title: "冷热数据"},
                     //         {icon: "icon_probability", title: "概率数据"},
                     //         "数据图表", //直接显示字符串，不带图表
                     //         {src: "../../img/dd.png", title: "概率数据"},// 直接指定图片地址
                     //   ];
    btnText: "",     //按钮文本
    btnClass: "",    //按钮样式
    index: 0,        //默认选中的项
    highlight: true,  //是否高亮选中
}
