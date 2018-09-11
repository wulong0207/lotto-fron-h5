/*
 * @Author: YLD
 * @Date: 2017-07-04 16:24:00
 * @Desc: 数字彩球面板
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Ball from "./ball.jsx";

import '../../scss/component/number/number-panel.scss';

export default class NumberPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sts: 0, // 0未选择, 1已选择, 2选择并设为胆
            infoData: [],
        }

        this.storeSet = { //面板的设置
            //1:{
            //     danCount: 0,//面板1的设置：胆球总数
            //     ballCount: 0, //球的选择个数
            // }
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        //componentIndex: 当前组件的索引值
        //当前页面的索引值，如果当前组件不在当前页面里，则不更新组件
        if(this.props.currentIndex  != null && this.props.componentIndex != null){
            if(this.props.currentIndex != this.props.componentIndex){
                return false;
            }
        }

        return true;
    }

    componentDidUpdate(){

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.infoData != null && nextProps.infoData.length > 0){
            this.setState({infoData: nextProps.infoData});
        }
    }

    componentDidMount(){
        let infoData = this.props.infoData || [];
        if(infoData.length == 0 && infoData.length == this.state.infoData.length){ return; }
        this.setState({infoData});
    }

    //生成所有的球
    getBalls(setitem, panelIndex){
        let infoData = this.state.infoData || [];
        let currentInfoData = infoData[panelIndex] || [];
        let {count, danCount, ballType, startNum, isZero, pair} = setitem;
        let {ballTextArr} = this.props;

        // 设置默认值
        count = count || 35; //球个数
        danCount = danCount || 0; //是否可设置胆,0为无胆，其他数字则表示可设置几个胆
        ballType = ballType || 1, //球的类型，1：红球，2：篮球
        startNum = startNum == 0? 0: startNum || 1, //生成时开始的号码
        isZero = (typeof isZero == 'undefined' || isZero)? true: false // 个位数时是否显示前面的0
        pair = (typeof pair != 'undefined' || pair)? true: false // 号码是否是双数字

        let storeSet = this.storeSet;
        let result = [];
        let hasBetSetting = false;

        let loopCount = 1; // 循环计数，为号码分行做准备
        let items = [];
        let props;
        if (ballTextArr != null){
           count =  ballTextArr.length - 1;
        }
        for (let i = startNum; i <= count; i++) {
            let num = isZero? ('0' + i).slice(-2): i; // TODO,这里规则有BUG，数字彩9和9位以上才有 01 02 等数字，小或者等于9位时，直接显示1 2
            num = pair? num+','+num:num; // 对子

            let props = {
                type: ballType,
                num: num+"",
                onPureBallClick: this.onBallClick.bind(this),
                panelIndex: panelIndex,
                curIndex: i, //当前索引值
            };

            if (ballTextArr != null && ballTextArr.length > 0) {
                 props.num = ballTextArr[i];
            }
           

            if(currentInfoData[i-startNum]!=null){
                props.deg = currentInfoData[i-startNum];
            }

            items.push(<td key={i}><Ball ref={"ball"+panelIndex+"-"+i} {...props}/></td>);

            let rowCount = setitem.rowCount || 7;
            if(loopCount % rowCount == 0 || count == i){
                //为当前面板添加额外的自定义项
                if(count == i && this.props.children){
                    let addFunc = (item)=>{
                        let props = {};
                        if(item.type != "div" && item.type != "span" && item.type != "em"){
                            props.panelIndex = panelIndex;
                        }
                        for ( let k in item.props){
                            props[k] = item.props[k];
                        }
                        if(props.onClick){
                            let onclick = props.onClick;
                            props.onClick = ()=>{
                                onclick(panelIndex);
                            };
                        }

                        let newChild = React.cloneElement(item, props);

                        if(i % rowCount == 0){
                            items.push(<tr key="last"><td colSpan={rowCount}>{newChild}</td></tr>);
                        }else{
                            items.push(<td colSpan={rowCount-i%rowCount} key="last">{newChild}</td>);
                        }
                    };
                    if(this.props.children instanceof Array){
                        addFunc(this.props.children[panelIndex]);
                    }else{
                        if(this.props.addToIndex == panelIndex
                            || this.props.addToIndex == "all"){
                            addFunc(this.props.children);
                        }
                    }
                }

                result.push(<tr key={i}>{items}</tr>);
                items = [];
            }
            loopCount++;
        };

        return <table className="ball-table"><tbody>{result}</tbody></table>;
    }

    //获取球的ref引用
    getBall(panelIndex, i){
        return this.refs["ball"+panelIndex+"-"+i];
    }

    //球的点击事件
    onBallClick(target, item, panelIndex){
        let {setting, onSelectCountOutLength} = this.props;
        let storeSet = this.storeSet;
        let canSetDan = false;
        let setitem = setting[panelIndex] || setting;
        let danCount = setitem.danCount || 0; //可设置胆球的个数
        storeSet[panelIndex] = storeSet[panelIndex] || { danCount: 0, ballCount: 0};

        //是否设置了面板上可选择的球的个数
        if(item.sts == 0 && setitem.selectCount != null){
            if(storeSet[panelIndex].danCount + storeSet[panelIndex].ballCount == setitem.selectCount){
                target.setSts(0); //设置为未选择球

                //选择个数超出了面板设置的可选择数时调用的方法
                if(onSelectCountOutLength){
                    onSelectCountOutLength(setitem.selectCount);
                }

                return;
            }
        }

        //判断是否可以设置胆
        if(danCount > 0 &&
           (!storeSet[panelIndex] || !storeSet[panelIndex].danCount ||
           storeSet[panelIndex].danCount < danCount)){
            canSetDan = true;
        }

        if(item.sts == 2){ //未点击之前的状态是胆球
            if(storeSet[panelIndex].danCount > 0){
                storeSet[panelIndex].danCount--; //减少胆个个数
            }
            target.setSts(0); //设置为未选择球
        }else if(item.sts == 1){ //点击前的状态为1
            //可以设置胆
            if(canSetDan){
                target.setSts(2); //设置为胆
                storeSet[panelIndex].danCount++; //胆个个数增加
                storeSet[panelIndex].ballCount --;//选择的球个数减少
            }else{
                target.setSts(0); //设置为未选择球
                storeSet[panelIndex].ballCount --;//选择的球个数减少
            }
        }else{
            target.setSts(1); //设置为已选择球
            storeSet[panelIndex].ballCount ++;//选择的球个数增加
        }
        // 判断是否设置了互斥， 互斥条件，例如已经选择了1，再选择2时，1变为未选择
        if(setitem.mutex){
            let j = setitem.startNum != null ? setitem.startNum: 1;
            for (; j <= setitem.count; j++) {
                let ball = this.getBall(panelIndex, j);
                if(ball.getResult().num != item.num){ //判断遍历得到的球不是当前点击的球
                    if(ball.getResult().sts == 1){ //该球已经被选中了，由于互斥则要变更此球为未选择
                        ball.setSts(0); //设置为未选中
                        storeSet[panelIndex].ballCount --;//选择的球个数减少
                    }else if(ball.getResult().sts == 2){
                        ball.setSts(0); //设置为未选中
                        storeSet[panelIndex].danCount --;//减少胆个个数
                    }
                }
            }
        }

        // 判断是否设置了面板互斥， 互斥条件，例如当在第一个面板已经选择了1，则在第二个面板再选择1时，第一个面板的1变为未选择
        if(setitem.mutexPanel && (setting instanceof Array)){
            for (let i = 0; i < setting.length; i++) {
                if(i != panelIndex){
                    let ball = this.getBall(i, item.curIndex);
                    if(ball){
                        if(ball.getResult().sts == 1){ //该球已经被选中了，由于互斥则要变更此球为未选择
                            ball.setSts(0); //设置为未选中
                            storeSet[i].ballCount --;//选择的球个数减少
                        }else if(ball.getResult().sts == 2){
                            ball.setSts(0); //设置为未选中
                            storeSet[i].danCount --;//减少胆个个数
                        }
                    }
                }
            };
        }

        this.onBallChangeHandler();
    }

    //点击球，选择球的更改事件，返回选了多少个球，多少个胆
    onBallChangeHandler(){
      
        if(this.props.onBallChange){
            this.props.onBallChange(this.storeSet);
        }
    }

    //获取投注面板
    getPanels(){
     
        let {setting} = this.props;
        let result;

        if(setting instanceof Array){
            result = [];
            for (let i = 0; i < setting.length; i++) {
                let item = setting[i];
                let style = item.visible !== false ? {display: ""}: {display: "none"};
                result.push(<div key={i} style={style}><div className="panel">
                    { item.title? <h3 className="panel-title">{ item.title }</h3>: '' }
                    {this.getBalls(item, i)}
                </div></div>);

                if(i != setting.length -1){
                    result.push(<div key={"line"+i} style={style} className="line"></div>);
                }
            };

        }else{
            result = <div style={{ display: typeof setting.visible === 'boolean' && !setting.visible  ? 'none' : ''}}><div className="panel" >
                { setting.title? <h3 className="panel-title">{ setting.title }</h3>: '' }
                {this.getBalls(setting, 0)}
            </div></div>
        }

        return result;
    }

    //获取投注内容
    getSelectBet(){
        let betResult = "";
        let {setting} = this.props;
        if(setting instanceof Array){
            for (let i = 0; i < setting.length; i++) {
                let item = setting[i];
                betResult += this.getSingleBet(i, item);

                if(i != setting.length - 1){
                    betResult += "|";
                }
            }
        }else{
            betResult = this.getSingleBet(0, setting);
        }

        return betResult;
    }

    //获取单注投注内容
    getSingleBet(panelIndex, item){
        let dan = "";
        let tuo = "";
        let j = item.startNum != null ? item.startNum: 1;
        for (; j <= item.count; j++) {
            let ballResult = this.getBall(panelIndex, j).getResult();
            if(ballResult.sts == 2){//2选择并设为胆
                if(dan){
                    dan += "," + ballResult.num
                }else{
                    dan += ballResult.num
                }
            }else if(ballResult.sts == 1){ //1已选择
                if(tuo){
                    tuo += "," + ballResult.num
                }else{
                    tuo += ballResult.num
                }
            }
        };

        return dan ? (dan + "#" + tuo) : tuo;
    }

    //获取投注内容
    //获取结果模型为： [
    //                  { dan: [1, 2, 3], tuo: [1, 2, 3]},
    //                  { dan: [1, 2, 3], tuo: [1, 2, 3]},
    //               ]
    getSelectBetArr(){
        let betResult = [];
        let {setting} = this.props;

        if(setting instanceof Array){
            for (let i = 0; i < setting.length; i++) {
                let item = setting[i];
                betResult.push(this.getSingleBetArr(i, item));
            }
        }else{
            betResult.push(this.getSingleBetArr(0, setting));
        }

        return betResult;
    }

    //获取单注投注内容
    //获取结果模型为： { dan: [1, 2, 3], tuo: [1, 2, 3]}
    getSingleBetArr(panelIndex, item){
        let dan = [];
        let tuo = [];
        let j = item.startNum != null ? item.startNum: 1;
        for (; j <= item.count; j++) {
            let ballResult = this.getBall(panelIndex, j).getResult();
            if(ballResult.sts == 2){//2选择并设为胆
                dan.push(ballResult.num);
            }else if(ballResult.sts == 1){ //1已选择
                tuo.push(ballResult.num);
            }
        };

        return {dan, tuo};
    }

    //清除所有的选择
    clear(){
        let {setting} = this.props;
        let storeSet = this.storeSet;

        if(setting instanceof Array){
            for (let i = 0; i < setting.length; i++) {
                this.clearPanel(i);
            }
        }else{
            storeSet[0] = {danCount: 0, ballCount: 0};
            let j = setting.startNum != null ? setting.startNum: 1;
            for (; j <= setting.count; j++) {
                this.getBall(0, j).setSts(0);
            }
        }
    }

    //清除指定面板上的投注信息和选号等
    clearPanel(panelIndex){
        let {setting} = this.props;
        let storeSet = this.storeSet;

        let item = setting[panelIndex] || setting;
        storeSet[panelIndex] = {danCount: 0, ballCount: 0};
        let j = item.startNum != null ? item.startNum: 1;
        for (; j <= item.count; j++) {
            this.getBall(panelIndex, j).setSts(0);
        }
    }

    //设置投注内容， 例如：01,02,03#06,07|01,02 多注使用|隔开
    // pair 是否是对子
    setBetContent(betNum, panelIndex, pair){
      
        if(!betNum){return;}
        let {setting} = this.props;
        let storeSet = this.storeSet;
        //选号 例如：01,02,03#06,07|01,02 多注使用|隔开
        this.betNum = betNum;
        //设置指定面板上的投注内容
        let setPanelBet = (subBet, curIndex) => {
        
            let danStr, tuoStr;
            let setitem = setting[curIndex] || setting;
            storeSet[curIndex] = { danCount: 0, ballCount: 0};
            if(subBet){
                //如果没有胆码，那第一个数组的应该是拖码
                if(subBet.indexOf("#") < 0){
                    danStr = ""; tuoStr = subBet;
                }else{
                    let cArr = subBet.split("#");
                    danStr = cArr[0];
                    tuoStr = cArr[1];
                }
            }

            let checkHasNum = (str, numPros)=> {
                let arrStr = str.split(",");
                for (let i = 0; i < arrStr.length; i++) {
                    let subitem = arrStr[i];
                    let subitemInt = parseInt(subitem);
                    // 如果是对子
                    if(pair) {
                        numPros = parseInt(numPros.split(',')[0]);
                    }
                    //如果是单双的数字 则无法转为数字，则直接判断是否相等
                    if((isNaN(subitemInt) && subitem == numPros) || subitemInt == numPros){
                        return true;
                    }
                };

                return false;
            };

            let j = setitem.startNum != null ? setitem.startNum: 1;
            for (; j <= setitem.count; j++) {
                let ball = this.getBall(curIndex, j);
                if(danStr && checkHasNum(danStr, ball.props.num)){
                    storeSet[curIndex].danCount++; //胆个个数增加
                    ball.setSts(2);
                }else if(checkHasNum(tuoStr, ball.props.num)){
                    storeSet[curIndex].ballCount++; //胆个个数增加
                    ball.setSts(1);
                }else if(ball.state.sts != 0){
                    ball.setSts(0);
                }
            }
        }

        if(panelIndex != null){
            setPanelBet(betNum, panelIndex);
        }else{
            this.clear();
            let arr = this.betNum.split("|");
            for (let i = 0; i < arr.length; i++) {
                setPanelBet(arr[i], i);
            };
        }

        this.onBallChangeHandler();
    }

    render() {
        return (
            <div className="number-panel">
                {this.getPanels()}
            </div>
        );
    }
}

/*****************************该组件公开的方法****************************************
 * 投注数字面板
 * 提供的获取方法有
 *  1. getSelectBet() //获取投注内容,返回的内容，例如：01,02,03#06,07|01,02 多注使用|隔开
 *  2. getSingleBet(panelIndex, settitem) //获取面板中子面板投注内容
 *  3. clear() //清除面板的所有选择
 *  4. clearPanel(panelIndex) //清除子面板
 *  5. setBetContent(betNum, panelIndex, pair) //设置投注内容
 *  6. getBall(panelIndex, i) //获取球的ref引用
 *************************************************************************************/

NumberPanel.propTypes = {
    setting: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    overflow: PropTypes.bool
}

NumberPanel.defaultProps = {
    //面板设置，如果为数组时则可设置多个面板
    // setting: [
    //     {count: 35,dan: false,ballType: 1},{count: 35,dan: false,ballType: 1}
    // ]
    // 默认为对象
    setting: {
        count: 35, //球个数
        danCount: 0, //是否可设置胆,0为无胆，其他数字则表示可设置几个胆
        ballType: 1, //球的类型，1：红球，2：篮球
        visible: true, //是否可显示
        rowCount: 7, //每行显示的球个数
        startNum: 1, //生成时开始的号码
        isZero: true, // 个位数时是否显示前面的0
        pair: false, // 号码是否是对子
        mutex: false,// 互斥条件，例如已经选择了1，再选择2时，1变为未选择
        mutexPanel: false, //互斥条件，例如当在第一个面板已经选择了1，则在第二个面板再选择1时，第一个面板的1变为未选择
        selectCount: null, //面板上可选择的球的个数
    },
    //冷热数据， 每个按钮的底部描述信息
    infoData: [],
    //额外增加的元素，比如11选5的机选位置可设置，当这个值为‘all’时，则为每一个面板添加this.props.children的元素
    addToIndex: 0,

    onBallChange: function (balls) { //点击球，选择球的更改事件，返回选了多少个球，多少个胆

    },

    //选择个数超出了面板设置的可选择数时调用的方法
    onSelectCountOutLength: function (length) {
        // body...
    }
}
