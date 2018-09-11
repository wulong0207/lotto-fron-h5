/**
 * Created by YLD
 * date 2017-06-27
 * desc:彩票投注篮
 */

import React,{Component} from 'react';
import "../scss/component/bet-order.scss";
import {PropTypes} from "prop-types";
import Dialog from './message';
import BetBar from "./bet-bar.jsx";
import Order, {goPay} from "./order.jsx";

import IconSelectAllAc from "../img/component/icon_uture@2x.png";
import IconSelectAll from "../img/component/icon_uture_normal.png";
import UnIconSelectAll from "../img/component/icon_select@2x.png";
import UnIconSelectAllAc from "../img/component/icon_select_press.png";

import http from '../utils/request';
import Message from "../services/message.js";
import session from "../services/session.js";

export default class BetOrder extends Component {
    constructor(args) {
        super(args);
        this.state = {
            selectAll: true,
        };

        this.lotteryCode = 0; //彩种类型
        this.currentOrder = false;
    }

    componentDidMount(){

    }

    //底部投注栏各子项点击事件
    onBetBarItemClick(item, index, e){
        let orders = this.state.orders || this.props.orders || [];

        switch(index){
            case 0:{
                let selectAll = true;
                for (let i = 0; i < orders.length; i++) {
                    let orderItem = orders[i];
                    orderItem.select = selectAll;
                };

                this.setState({orders, selectAll});
            }break;
            case 1:{
                let selectAll = false;
                for (let i = 0; i < orders.length; i++) {
                    let orderItem = orders[i];
                    orderItem.select = !orderItem.select;
                };

                this.setState({orders, selectAll});
            }break;
            case 2:{
                this.reqDeleteOrder();
            }break;
            case 3:{//
                let {orderCodes, buyTypes} = this.getSelectedOrder();
                if(orderCodes.length == 0){
                    Message.toast("请至少选择一个方案");
                    return;
                }

                goPay(orderCodes.join(','), buyTypes.join(','));
            }break;
        }
    }

    /**
     * 获取已选择的订单号
     */
    getSelectedOrder(){
        let orders = this.state.orders || this.props.orders || [];
        let orderCodes = [];
        let buyTypes = [];
        for (let i = 0; i < orders.length; i++) {
            let orderItem = orders[i];
            if(orderItem.select !== false){
                orderCodes.push(orderItem.orderCode);
                buyTypes.push(orderItem.buyType);
            }
        }

        return {
            orderCodes,
            buyTypes
        };
    }

    //删除订单
    reqDeleteOrder(){
        let {orderCodes} = this.getSelectedOrder();

        if(orderCodes.length == 0){
            Message.toast("请至少选择一个方案");
            return;
        }

        http.post('/order/batchCancelOrderList', {
            lotteryCode: this.lotteryCode,
            orderCodes: orderCodes,
            token: session.get("token"),
        }).then(res => {
            let orders = this.state.orders || this.props.orders || [];
            let result = [];
            for (let i = 0; i < orders.length; i++) {
                let orderItem = orders[i];
                if(orderCodes.indexOf(orderItem.orderCode) < 0){
                    result.push(orderItem);
                }
            };

            this.setState({orders: result});

            if(result.length == 0){
                this.show(false);
            }

            Message.toast(`你已成功删除${orderCodes.length}个方案`);
        }).catch(err => {
            Message.toast(err.message);
        });
    }

    /**
     * 是否展示弹窗
     * @param  {bool} enable true时则展示弹窗，false则不展示
     */
    show(enable){
        let {reduxMode, show} = this.props;
        if(reduxMode){
            if(show) {show();}

            return;
        }

        if(enable){
            this.refs.root.style.display = "";
            this.setState({selectAll: true});
        }else{
            this.refs.root.style.display = "none";
        }
    }

    /**
     * 展示订单信息
     */
    showOrder(orders, currentOrder){
        this.currentOrder = currentOrder;
        this.show(true);
        this.setState({orders});
    }

    //去支付
    pay(item){
        goPay(item.orderCode, item.buyType);
    }

    //获取总金额
    getTotal(){
        let orders = this.state.orders || this.props.orders || [];
        let total = 0;
        for (let i = 0; i < orders.length; i++) {
            let orderItem = orders[i];
            if(orderItem.select !== false){
                total += orderItem.orderAmount;
            }
        };

        return total;
    }

    getItem(items){
        return items.map((val, index)=>{
            let arr = val.betContent.split("|");

            if(val.contentType == 1){
                return <div key={index} className="lo-item">
                    <span className="red">{arr[0].replace(/,/g, " ")}</span>
                    {"  "}<span className="blue">{arr[1].replace(/,/g, " ")}</span>
                    {"  "}<span className="gray">{val.betNum}注</span>
                </div>
            }else{
                return <div key={index} className="lo-item">
                    <div className="red">{arr[0].replace(/,/g, " ")}</div>
                    <div>
                        <span className="blue">{arr[1].replace(/,/g, " ")}</span>
                        {"  "}<span className="gray">{val.betNum}注</span>
                    </div>
                </div>
            }
        });
    }

    onItemClick(val){
        if(val.select !== false){
            val.select = false;
        }else{
            val.select = true;
        }

        this.setState({});
    }

    render(){
        let self = this;
        let {endTime, getItemTemplate, reduxMode, currentOrder} = this.props;
        let {selectAll} = this.state;
        let selectAllSrc = IconSelectAllAc;
        let unSelectSrc = UnIconSelectAll;

        let orders = this.state.orders || this.props.orders || [];

        if(!selectAll){
            selectAllSrc = IconSelectAll;
            unSelectSrc = UnIconSelectAllAc;
        }

        let items = [
            {src: selectAllSrc, title: "全选"},
            {src: unSelectSrc, title: "反选"},
            {src: require("../img/component/icon_double@2x.png"), title: "删除"},
            {title: "立即支付 "+this.getTotal()+"元", bg: "red", flex: 1},
        ];

        let style;
        if(reduxMode){
            console.log(currentOrder);
            self.currentOrder = currentOrder;
            style = {display: ""};
        }else{
            style = {display: "none"};
        }

        return <div ref="root" className="yc-bet-order" style={style}>
                <div className="take-position"></div>
                <div className="dead-line">
                    <div className="txt">
                        投注截止时间：
                        <span className="time">{endTime}</span>
                    </div>
                    <div onClick={this.show.bind(this, false)} className="close"></div>
                </div>
                <div className="cart">
                    <p className="message grey">每个彩期只能保存16个未支付的方案，如需支付当前方案请删除已保存的方案;你也可以选择所有方案合并支付,包括提交的方案。</p>
                    <div className="slide">
                        <div className="cart-area">
                            <ul className="cart-all">
                                {orders.map((val, index)=>{
                                    this.lotteryCode = val.lotteryCode;
                                    let select = "select";
                                    if(val.select === false){
                                        select = "unselect";
                                    }else{
                                        val.select = true;
                                    }

                                    let subItem;
                                    if(getItemTemplate){
                                        subItem = getItemTemplate(val.orderInfoDetailLimitBO);
                                    }else{
                                        subItem = this.getItem(val.orderInfoDetailLimitBO);
                                    }

                                    let currentFA;
                                    if(self.currentOrder == val.orderCode){
                                        currentFA = <div className="current-fa">当前提交方案</div>
                                    }

                                    return <li key={index} className="cart-item">
                                        <div className="buy-info">
                                            <div onClick={this.onItemClick.bind(this, val)} className={select}></div>
                                            <div className="order-code">
                                                {currentFA}
                                                <div>{val.orderCode} <span className="red">￥{val.orderAmount}元</span></div>
                                            </div>
                                            <div onClick={this.pay.bind(this, val)} className="go-pay">去支付</div>
                                        </div>
                                        <div className="content-area">
                                            <div className="tk-p"></div>
                                            <div className="main-area">{subItem}</div>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                    <BetBar items={items} onItemClick={this.onBetBarItemClick.bind(this)}/>
                </div>
            </div>
    }
}
