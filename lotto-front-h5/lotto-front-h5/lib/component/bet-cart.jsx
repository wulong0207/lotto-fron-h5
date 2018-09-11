/**
 * Created by YLD
 * date 2017-06-27
 * desc:彩票投注篮
 */

import React,{Component} from 'react';
import "../scss/component/bet-cart.scss";
import {PropTypes} from "prop-types";
import Dialog from '../services/message';


export default class BetCart extends Component {
    constructor(args) {
        super(args);
        this.state = {
            keyboardType: 0,
        };
    }

    componentDidMount(){

    }

    removeItem(item, index, noAlert){
        let removeFunc = () => {
            let {cart} = this.props;
            let {balls} = cart;
            balls.splice(index,1);
            this.updateCartHandler(cart);

            if(cart.balls.length == 0){
                this.show(false);
            }
        };

        if(noAlert === true){
            removeFunc();
        }else{
            Dialog.confirm({
                title: "提示",
                btnFn: [()=>{

                }, removeFunc ],
                children:"您确定删除此条内容？"
            });
        }
    }

    //更新购物篮
    updateCartHandler(cart){
        let {updateCart} = this.props;
        if(updateCart){
            updateCart(cart);
        }
    }

    /**
     * 是否展示弹窗
     * @param  {bool} enable true时则展示弹窗，false则不展示
     */
    show(enable){
        if(enable){
            this.refs.root.style.display = "";
        }else{
            this.refs.root.style.display = "none";
        }
    }

    /**
     * 点击tab栏目的回调事件
     *
     */
    onTabClickHandler(item, index){
        let {onTabClick, cart} = this.props;
        if(item == "投注页选号"){
            this.show(false);
        }
        if(onTabClick){
            onTabClick(item, index);
        }
    }

    //点击投注篮的子项的事件处理
    onCartItemClickHandler(item, index){
        let {onCartItemClick} = this.props;

        this.removeItem(item, index, true);
        this.show();

        if(onCartItemClick){
            onCartItemClick(item, index);
        }
    }

    //点击加减按钮事件
    onAddNum(field, num){
        let {cart, maxZh} = this.props;
        let maxMul = this.getMaxMul();
        let curNum = parseInt(cart[field]) + num;
        if(curNum > 0){
            if(field == "mul" && maxMul > 0 && curNum > maxMul){
                Dialog.alert({
                    title: '哇, 土豪！',
                    btnTxt: ['我知道了'], // 可不传，默认是确定
                    children: (<span>对不起,单个方案最大倍数为<em className="orange">{maxMul}</em>倍！</span>)
                });

                curNum = maxMul;
            }else if(field == "zh" && maxZh > 0 && curNum > maxZh){
                Dialog.alert({
                    title: '提示',
                    btnTxt: ['我知道了'], // 可不传，默认是确定
                    children: (<span>追号最大期数为<em className="orange">{maxZh}</em>期！</span>)
                });

                curNum = maxZh;
            }

            cart[field] = curNum;
            this.updateCartHandler(cart);
        }
    }

    // 0:隐藏键盘
    showKeyBoard(keyboardType){
        this.setState({keyboardType: keyboardType || 0});
    }

    /**
     * 设置最大倍数
     * @param {Number} mul 倍数
     */
    setMaxMul(mul){
        this.maxMul = mul;
    }

    /**
     * 获取最大倍数
     */
    getMaxMul(){
        let {maxMul} = this.props;
        if(this.maxMul != null){
            maxMul = this.maxMul;
        }

        return maxMul;
    }

    /**
     * 设置最大注数
     * @param {Number} betNum 注数
     */
    setMaxBet(betNum){
        this.maxBet = betNum;
    }

    /**
     * 获取最大注数
     */
    getMaxBet(){
        return this.maxBet;
    }

    //键盘上各按钮的点击事件
    onNumClick(type, value, field){
        let {cart, maxZh} = this.props;
        let maxMul = this.getMaxMul();

        switch(type){
            case 1: { //直接赋值
                let numVal = parseInt(value);
                this.onAddNum(field, (numVal - cart[field]));
            }break;
            case 2: { //在值末尾添加字符
                let num = (this.refs.inputk.value)+value;
                if(!this.refs.inputk.value && value == "0"){
                    return;
                }
                let numVal = parseInt(num);
                this.onAddNum(field, (numVal - cart[field]));
            }break;
            case 3: { //删除
                this.refs.inputk.value = this.refs.inputk.value.slice(0, -1);
                let numi =  parseInt(this.refs.inputk.value)
                if(this.refs.inputk.value && !isNaN(numi)){
                    cart[field] = numi;
                    this.updateCartHandler(cart);
                }
            }break;
        }
    }

    //展示键盘 参数setting，设置，包含以下
    //        title: "", 输入栏的标题
    //        field: "", 输入栏的属性名称
    //        type：值为1时展示，投注倍数键盘，值为2时展示追号键盘
    getKeyBoard(setting){
        let topCustomBtns, topCustomBtnsArea; //顶部自定义按钮
        let topArea;
        setting = setting || {};
        let numPad = [1,2,3,4,5,6,7,8,9];
        let {zh, mul} = this.props.cart;
        let inputVal, style;
        let self = this;
        switch(setting.type){
            case 2: {
                topCustomBtns = this.props.mulMenu;

                setting.title = "倍数";
                setting.field = "mul";
                inputVal = mul;
            }break;
            case 1: {
                topCustomBtns = this.props.zhMenu;

                setting.title = "追号";
                setting.field = "zh";
                inputVal = zh;
            }break;
            default: style={display: "none"};break;
        }

        if(topCustomBtns){
            topCustomBtnsArea = <div className="top-area">
            {
                topCustomBtns.map((val, index)=>{
                    val.subColor = val.subColor || "";

                    return <div key={index} className="top-item"
                                onClick={self.onNumClick.bind(self, 1, val.value, setting.field)}>
                        <div className="title">{val.title}</div>
                        <div className={"subtitle "+val.subColor}>{val.subtitle}</div>
                    </div>
                })
            }
            </div>
        }

        return <div style={style} ref="keyboard" className="keyboard">
            <div className="take-position" onClick={this.showKeyBoard.bind(this)}></div>
            <div className="keyboard-area">
                <div className="item-set">
                    <div className="txt">{setting.title}</div>
                    <div className="button-area">
                        <span onClick={this.onAddNum.bind(this, setting.field, -1)} className="btn-set">-</span>
                        <div className="input-ct"><input ref="inputk" type="text" placeholder={inputVal||"1"} value={inputVal||""} readOnly="readonly" /></div>
                        <span onClick={this.onAddNum.bind(this, setting.field, 1)} className="btn-set">+</span>
                    </div>
                </div>
                {topCustomBtnsArea}
                <div className="keyboard-btns">
                    {numPad.map((val, index)=>{
                        return <div key={index} className="btn-item" onClick={self.onNumClick.bind(self, 2, val, setting.field)}>{val}</div>
                    })}
                    <div className="btn-item delete" onClick={self.onNumClick.bind(self, 3, null, setting.field)}>
                        <img width="80" height="80" src={require('../img/public/keyboard_delete@2x.png')} />
                    </div>
                    <div className="btn-item" onClick={self.onNumClick.bind(self, 2, 0, setting.field)}>0</div>
                    <div className="btn-item special" onClick={this.showKeyBoard.bind(this)}>确定</div>
                </div>
            </div>
        </div>
    }

    //点击立即投注按钮触发的事件
    onPayHandler(){
        let {onPayClick} = this.props;
        if(onPayClick){
            onPayClick();
        }
    }

    //点击追加投注
    onAddChaseHandler(){
        let {cart} = this.props;
        cart.addChase = !cart.addChase;
        this.updateCartHandler(cart);
    }

    render() {
        let {tabItems, cart, endTime} = this.props;
        let self = this;
        //购物篮投注内容 追号 倍数 总价 注数
        let {balls, zh, mul, total, betNum, addChase} = cart;
        let {keyboardType} = this.state;
        let keyboardArea;

        let addChaseArea;
        if(this.props.addChase){
            addChaseArea = <div className="add-chase">
                <span onClick={this.onAddChaseHandler.bind(this)}>
                    <span>追加投注</span>
                    <img src={addChase?require("../img/component/icon_radio@2x.png"):require("../img/component/icon_radio2@2x.png")}></img>
                </span>
            </div>
        }

        return (
            <div ref="root" className="yc-bet-cart" style={{display: "none"}}>
                <div className="take-position"></div>
                <div className="dead-line">
                    <div className="txt">
                        投注截止时间：
                        <span className="time">{endTime}</span>
                    </div>
                    <div onClick={this.show.bind(this, false)} className="close"></div>
                </div>
                <div className="cart">
                    <div className="tab">
                        <ul>
                            {tabItems.map((val, index)=>{
                                let cn = "";
                                if(index > 0 && tabItems.length > 1){
                                    cn = "li-line";
                                }
                                return <li onClick={self.onTabClickHandler.bind(this, val, index)} className={cn} key={index}>{val}</li>;
                            })}
                        </ul>
                    </div>
                    <div className="slide">
                        <div className="export"></div>
                        <div className="cart-area">
                            <ul className="cart-all">
                                {balls.map((val, index)=>{
                                    let overBet = "";
                                    let num = parseInt(val.pcs);
                                    if(num > this.getMaxBet()){
                                        overBet = "over-bet";
                                    }
                                    return <li key={index} className={"cart-item "+overBet}>
                                        <ul className="item-info">
                                            <li onClick={self.onCartItemClickHandler.bind(this, val, index)} className="number-ball">
                                                <p className="red-ball">{val.redBall}</p>
                                                <p className="blue-ball">{val.blueBall}</p>
                                                <p className="message">
                                                    <span className="item-type">{val.itemType}</span>
                                                    <span>{val.pcs}</span>
                                                </p>
                                            </li>
                                        </ul>
                                        <div className="item-close" onClick={self.removeItem.bind(self, val, index)}></div>
                                    </li>
                                })}
                            </ul>
                            <div className="bot"></div>
                        </div>
                    </div>
                    <div className="cart-setting">
                        {addChaseArea}
                        <div className="item-set">
                            <div className="txt">追号</div>
                            <div className="button-area">
                                <span onClick={this.onAddNum.bind(this, "zh", -1)} className="btn-set">-</span>
                                <div className="input-ct" onClick={this.showKeyBoard.bind(this, 1)}>{zh}</div>
                                <span onClick={this.onAddNum.bind(this, "zh", 1)} className="btn-set">+</span>
                            </div>
                        </div>
                        <div className="item-set">
                            <div className="txt">倍数</div>
                            <div className="button-area">
                                <span onClick={this.onAddNum.bind(this, "mul", -1)} className="btn-set">-</span>
                                <div className="input-ct" onClick={this.showKeyBoard.bind(this, 2)}>{mul}</div>
                                <span onClick={this.onAddNum.bind(this, "mul", 1)} className="btn-set">+</span>
                            </div>
                        </div>
                    </div>
                    <div className="buy-bar">
                        <div className="msg">
                            共
                            <span className="money">{total}</span>元({betNum}注{" "}{zh>1?zh+"期 ":""}{mul}倍)
                        </div>
                        <div onClick={this.onPayHandler.bind(this)} className="btn-buy">立即投注</div>
                    </div>
                </div>
                {this.getKeyBoard({type: keyboardType})}
            </div>
        );
    }
}

/**
 * BetCart 提供的方法
 *     show(enable) 是否展示弹窗 true时则展示弹窗，false则不展示
 *     showKeyBoard(keyboardType) 是否展现键盘，值为0时隐藏键盘，值为1时展示，投注倍数键盘，值为2时展示追号键盘
 *     setMaxMul(mul) 设置最大倍数
 */

//生成追号键盘按钮
BetCart.createZHMenu = (mul, money)=>{
    mul = mul || "";
    money = money || "";
    let result = [ //投注倍数
        {title: "投10倍", value: 10},
        {title: "投50倍", value: 50},
        {title: "投100倍", value: 100}
    ];

    if(mul){
        let obj = {title: "投"+mul+"倍", value: mul, subColor: "red"};
        if(money){
            obj.subtitle =  `可掏空奖池${money}`;
        }

        result.push();
    }else{
        result.push({title: "投200倍", value: 200});
    }
    return result;
}

BetCart.propTypes = {
    onTabClick: PropTypes.func,
    tabItems: PropTypes.array,
    cart: PropTypes.object,
    updateCart: PropTypes.func,
}

BetCart.defaultProps = {
    tabItems: [
        "投注页选号",
        "机选一注",
        "清空列表",
    ],       //菜单项
    onTabClick: function(item, index){}, //选项卡上的点击事件回调,包含两个参数item：当前按钮的配置, index：第几个按钮
    cart: { //购物篮数据
        balls: [ //投注内容
            {
                redBall: "", //红球,例如:"02 04 13 26 28 31"
                blueBall: "", //篮球，例如："08"
                itemType: "", //投注方式，普通或胆拖，例如：“普通”
                pcs: "" //投注注数内容，例如：“1注”
            }
        ],
        zh: 1, //追号
        mul: 1, //倍数
        total: 0, //总价
        betNum: 0, //注数
    },
    updateCart: function(newCart){}, //更新购物篮的回调方法，参数newCart,新的购物篮数据
    onCartItemClick: function(item, index){}, //点击投注篮子项的回调方法
    mulMenu: BetCart.createZHMenu(), //投注倍数
    zhMenu: [ //追号的期数
        {title: "追一个月", subtitle:"追12期", value: 12},
        {title: "追三个月", subtitle:"追36期", value: 36},
        {title: "追半年", subtitle:"追72期", value: 72},
        {title: "最大", subtitle:"追154期", value: 154},
    ],
    maxZh: 154, //最大期数
    maxMul: -1, //最大倍数
    onPayClick: function(){}, //点击立即投注按钮的事件
    endTime: "", //投注截止时间
}
