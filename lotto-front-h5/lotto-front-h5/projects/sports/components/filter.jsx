import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import "../css/filter.scss";
import BoxMenu from "./box-menu";
import {MATCH_TYPE, MODULE_FUC} from '../constants';
import analytics from '@/services/analytics';

export default class Filter extends PureComponent {
    constructor (props) {
        super(props);
        this.state = {
            date: [],
            matchs: [],
            type: 'all',
            lb: [], //让球
            sp: [], //sp值 赔率范围
            at: [], //全部类型
            five: false, //是否设置 属于五大联赛的
            hot: false, //是否设置 热门赛事
            lc: [], //让分
        };
        this.type = 'all';
    }

    componentDidMount(){
        this.pop.open();
    }

    formatShortDateStr(key){
        return key;
    }

    changeType(type) {
        let obj = {};
        if (isFootball(this.lotteryCode) && type === 'five') {
            analytics.send(211115);
        }
        obj[type] = !this.state[type];
        this.setState(obj);
    }

    done() {
        this.props.change(this.state);
        this.pop.close();
    }

    onOpen() {  }
    onClose() {
        this.props.toggle();
    }

    reverse() {
        if (isFootball(this.lotteryCode)) {
            analytics.send(211114);
        }
        let {markObj} = this.props;
        let obj = Object.assign({}, this.state);
        let toggle = (arrA, arrB) => {
            arrB = arrB.concat();
            arrA.map((val)=>{
                let index = arrB.indexOf(val);
                if(index >= 0){
                    arrB.splice(index, 1);
                }
            });

            return arrB;
        }
        obj.at = toggle(obj.at, markObj.state.at);
        obj.date = toggle(obj.date, markObj.state.date);
        obj.lb = toggle(obj.lb, markObj.state.lb);
        obj.matchs = toggle(obj.matchs, markObj.state.matchs);
        obj.sp = toggle(obj.sp, markObj.state.sp);

        this.setState(obj);
    }

    //筛选选择
    choose(field, value){
        let arr = this.state[field].concat(), obj = {};
        let index = arr.indexOf(value);
        if(index >= 0){
            arr.splice(index,1);
        }else{
            arr.push(value);
        }
        obj[field] = arr;
        this.setState(obj);
    }

    /**
     * 热门赛事选择
     */
    selectHot(){
        let hot = !this.state.hot;
        if (hot) {
            analytics.send(211116);
        }
        this.setState({hot});
    }

    /**
     * 赛事选择更改
     */
    hotChange(e){
        let hot = e.target.checked;
        this.setState({hot});
    }

    /**
     * Tab栏目改变的事件
     */
    onTabChange(index){
        if(index == 0){
            this.setState({matchs: []})
        }else{
            let exuMatchs = [];
            for(let i = 0;i < this.props.pageData.length; i++){
                let item = this.props.pageData[i];
                if(!item.f_l && !item.fiveLeague){
                    if(exuMatchs.indexOf(item.m_id.toString()) < 0){
                        exuMatchs.push(item.m_id.toString());
                    }
                }
            }

            this.setState({matchs: exuMatchs});
        }
    }

    /**
     * 初始化菜单
     */
    renderMark(markObj, column, temFunc, sort){
        let data = this.props.pageData;
        let result = [];

        let arrItems = [];
        //添加节点
        let add = (item) => {
        if(arrItems.length == column){
            result.push(<div className="match-row" key={ result.length }>
            {arrItems}
            </div>);

            arrItems = [];
        }

        let cn = (column == 2 ? "match half" : "match");
            arrItems.push(<div className={cn} key={item}>
                {temFunc(item, markObj[item])}
            </div>);
        };

        if(sort){
            let arr = [];
            for(let item in markObj){
                arr.push(item);
            }
            arr = arr.sort((a, b)=>{return a-b});
            for(let i = 0; i< arr.length; i++){
                add(arr[i]);
            }
        }else{
            for(let item in markObj){
                add(item);
            }
        }

        result.push(<div className="match-row" key={ result.length }>
            {arrItems}
        </div>);

        return <div className="matchs">
            {result}
        </div>
    }

    /**
     * 初始化让球菜单
     */
    renderRQ(markObj){
        return this.renderMark(markObj, 2, (key, item)=>
        <div className={cx("match-box", {"active": this.state.lb.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "lb", key)}>
            <h4>让{key}球</h4>
            <span>（{item}场）</span>
        </div>, true);
    }

    /**
     * 获取赔率的筛选条件
     */
    renderSP(markObj){
        let label = { 0: "最小SP值<1.50", 1: "1.50≤最小SP值<2.00", 2: "2.00≤最小SP值"};
        let level = { 0: "难度较小", 1: "难度适中", 2: "难度较大"};
        return this.renderMark(markObj, 2, (key, item)=>
        <div className={cx("match-box noflex", {"active": this.state.sp.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "sp", key)}>
            <h4>{label[key]}</h4>
            <div>{level[key]}（{item}场）</div>
        </div>);
    }

    /**
     * 初始化让分筛选
     */
    renderLC(markObj){
        let label = {0: "主队让分", 1: "客队让分"};
        return this.renderMark(markObj, 2, (key, item)=>
        <div className={cx("match-box", {"active": this.state.lc.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "lc", key)}>
            <h4>{label[key]}</h4>
            <span>（{item}场）</span>
        </div>, true);
    }

    /**
     * 初始化球种类
     */
    renderBallKind(markObj){
        return this.renderMark(markObj, 3, (key, item)=>
        <div className={cx("match-box", {"active": this.state.at.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "at", key)}>
            <h4>{MATCH_TYPE[key]}</h4>
            <span>{item.count}</span>
        </div>);
    }

    /**
     * 初始化各种球类赛事
     */
    renderBallMatch(markObj){
        let result= [];

        for(let key in markObj){
        let sub = [];
        let item = markObj[key];
        result.push(<BoxMenu title={MATCH_TYPE[key]} key={MATCH_TYPE[key]}>
            {this.renderMark(item.matchs, 3, (skey, sitem)=>
            <div className={cx("match-box", {"active": this.state.matchs.indexOf(skey) == -1})}
                onClick={this.choose.bind(this, "matchs", skey)}>
            <h4>{sitem.name}</h4>
            <span>{sitem.count}</span>
            </div>)}
        </BoxMenu>);
        }

        return result;
    }

    /**
     * 初始化所有联赛
     */
    renderMatchs(markObj) {
        return this.renderMark(markObj, 3, (key, item)=>
        <div className={cx("match-box", {"active": this.state.matchs.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "matchs", key)}>
            <h4>{item.name}</h4>
            <span>{item.count}</span>
        </div>);
    }

    /**
     * 初始化日期选择
     */
    renderDate(markObj){
        return this.renderMark(markObj, 2, (key, item)=>
        <div className={cx("match-box", {"active": this.state.date.indexOf(key) == -1})}
            onClick={this.choose.bind(this, "date", key)}>
        <h4>{this.formatShortDateStr(key)}</h4>
        <span>（{item}场）</span>
        </div>);
    }

    /**
     * 渲染选择区域
     */
    renderFilter(){
        let {funcs, markObj} = this.props;

        return <div className="filter-area">
        {funcs.map((value, index)=>{
            switch(value.toString()){
                case MODULE_FUC.ALL:{
                    let child;
                    let fiveLeague = markObj.matchs.filter(d => d.f_l||d.fiveLeague).length;
                    // let haveFive = this.props.funcs.indexOf(parseInt(MODULE_FUC.FIVE)) >= 0;
                    if(fiveLeague){
                        child = <span onClick={this.changeType.bind(this, 'five')}>五大联赛({ fiveLeague })</span>;
                    }
                    return <BoxMenu title={`全部赛事(${markObj.count})`} key={index} child={child}
                                    onTabChange={this.onTabChange.bind(this)}>
                        {this.renderMatchs(markObj.matchMark)}
                    </BoxMenu>
                }
                case MODULE_FUC.DATE:{
                    return <BoxMenu title="日期" key={index}>
                        {this.renderDate(markObj.dateMark)}
                    </BoxMenu>
                }
                case MODULE_FUC.LB:{
                    return <BoxMenu title="让球" key={index}>
                        {this.renderRQ(markObj.rqMark)}
                    </BoxMenu>
                }
                case MODULE_FUC.ODDS:{
                    return <BoxMenu title="赔率" key={index}>
                        {this.renderSP(markObj.spMark)}
                    </BoxMenu>
                }
                case MODULE_FUC.AT:{
                    return <BoxMenu title="全部赛事" key={index}>
                        {this.renderBallKind(markObj.ballMark)}
                    </BoxMenu>
                }
                case MODULE_FUC.BK:{
                    return this.renderBallMatch(markObj.ballMark);
                }
                case MODULE_FUC.LC:{
                    return <BoxMenu title="让分选择" key={index}>
                        {this.renderLC(markObj.lcMark)}
                    </BoxMenu>
                }
            }
        })}
        </div>
    }

    /**
     * 渲染筛选区域
     */
    renderFilterContent(){
        const hot = this.props.funcs.indexOf(MODULE_FUC.HOT) >= 0;
        const opp = this.props.funcs.indexOf(MODULE_FUC.OPP) >= 0;

        return <div className="filter-content">
            <h4 className="filter-title">联赛选择</h4>
            {this.renderFilter()}
            {hot||opp?<div className="shortcuts">
                {hot?<span className="hot-area">
                    <button onClick={this.selectHot.bind(this)}>热门赛事</button>
                    <input ref="hotcb" checked={this.state.hot} type="checkbox" onChange={this.hotChange.bind(this)}></input>
                </span>:''}
                {opp?<button
                    onClick={ this.reverse.bind(this) }
                    className={cx({ 'active': this.state.type === 'reverse'})}
                >反选</button>:""}
            </div>:""
            }
            <button onClick={ this.done.bind(this)} className="btn make-sure-btn">确定</button>
        </div>
    }
}

function isFootball(lotteryCode) {
    return typeof lotteryCode === 'number' && lotteryCode === 300;
}
