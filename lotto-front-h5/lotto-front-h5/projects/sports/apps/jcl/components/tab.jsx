import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import "../css/component/tab.scss";

import { changePage } from '../redux/actions/basketball';
import { setHistoryState } from '../utils/basketball';
import { connect } from 'react-redux';

class MenuItem extends Component{
    constructor(props){
        super(props);
        this.state = {
            showArea: false,
            des: "",
        };
    }

    componentDidMount(){
        if(!this.state.des){
            this.setState({des: this.props.menu.des});
        }
    }

    onMenuItemClick(item){
        this.setState({des: item.des});
    }

    renderMenu(subMenu){
        let subAreas = [];
        let tds = [];
        for (let i = 0; i < subMenu.length; i++) {
            let item = subMenu[i];
            let td = <td onClick={this.onMenuItemClick.bind(this, item)} key={i}>{item.des}</td>
            tds.push(td);

            if((i + 1) % 3 == 0){
                subAreas.push(<tr key={i}>{tds}</tr>);
                tds = [];
            }
        };

        if(tds.length > 0){
            tds.push(<td key={subMenu.length}></td>);
            subAreas.push(<tr key={subMenu.length}>{tds}</tr>);
        }

        return <table><tbody>
            {subAreas}
        </tbody></table>
    }

    showArea(){
        if(this.props.getParent().state.index != this.props.index){
            return;
        }

        let {menus} = this.props.menu;
        let {showArea} = this.state;
        if(menus && menus.length > 0){
            this.setState({showArea: !showArea});
        }
    }

    render() {
        let {menus} = this.props.menu;
        let {des, showArea} = this.state;
        let show = showArea && menus && menus.length > 0;

        if(this.props.getParent().state.index != this.props.index){
            show = false;
        }

        return (
            <div className="sub-menu" onClick={this.showArea.bind(this)}>
                <div className="des">{des}
                    {menus && menus.length >0?<span className="arrows"></span>:""}
                </div>
                {show?<div className="cover"></div>:""}
                {show?this.renderMenu(menus):""}
            </div>
        );
    }
}

class Tab extends Component{
    constructor(props){
        super(props);
        this.state = {
            index: 0,
        };
    }

    getParent(){
        return this;
    }

    renderMenu(tabs){
        let {index} = this.state;
        let area = [];
        let subArea;

        for (let i = 0; i < tabs.length; i++) {
            let item = tabs[i];
            let active = index == i?"flex active":"flex";

            if(typeof item == "object"){
                area.push(<td onClick={this.onClickHandler.bind(this, i)} className={active} key={i}>
                    <MenuItem menu={item} index={i} getParent={this.getParent.bind(this)}/>
                </td>);
            }else{
                area.push(<td onClick={this.onClickHandler.bind(this, i)} className={active} key={i}>{item}</td>);
            }
        };

        return area;
    }

    onClickHandler(crindex, e){
        let {index} = this.state;
        if(index != crindex){
            this.setState({index: crindex});
        }

        e.stopPropagation();
    }

    render(){
        let tabs = [
            {
                des: "混合过关",
                menus: [
                    {des: "胜负"},
                    {des: "让分胜负"},
                    {des: "大小分"},
                    {des: "胜分差"},
                    {des: "混合过关"},
                ]
            },
            {
                des: "单关投注"
            }
        ];

        return <div className="menu-tab">
            <table cellPadding="0" cellSpacing="0"><tbody>
            <tr className="display-flex">
            {this.renderMenu(tabs)}
            </tr></tbody></table>
        </div>
    }
};


const mapStateToProps = state => {
  return {
      page: state.basketball.page
  }
}

const mapDispatchToProps = dispatch => {
  return {
      change(page) {
          setHistoryState(page);
          return dispatch(changePage(page));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab);
