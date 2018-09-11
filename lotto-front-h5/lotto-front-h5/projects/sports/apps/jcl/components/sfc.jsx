import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import "../css/component/sfc.scss";

//胜分差
export default class SFC extends Component{
    constructor(props){
        super(props);
        this.state = {
            select: [

            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.select){
            this.setState({select: nextProps.select});
        }
    }

    componentDidMount(){
        if(this.props.select){
            this.setState({select: this.props.select});
        }
    }

    //点击各子项的事件
    onLiClick(item, ref){
        let {data, onSelect} = this.props;
        let add = false;

        let index = this.state.select.indexOf(item.selectMark);
        if(index < 0){
            add = true;
        }

        if(onSelect){
            onSelect(data, item.selectMark, add);
        }
    }

    renderArea(index, arr){
        let data = this.props.data || {};
        let select = this.state.select || [];

        let result = [];
        let lis = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            let ref = index + "" + i;
            let className = select.indexOf(item.selectMark) >=0? " active": "";

            lis.push(<li ref={ref} onClick={this.onLiClick.bind(this, item, ref)} key={i}
                         className={"subitem flex"+className}>
                    <h4 className="gray">{item.des}</h4>
                    <h3>{data[item.val]}</h3>
                </li>);

            if((i+1) % 3 == 0){
                result.push(<ul key={i} className="ul display-flex">{lis}</ul>);
                lis = [];
            }
        };

        if(lis.length > 0){
            result.push(<ul key={arr.length} className="ul display-flex">{lis}</ul>);
        }

        return result;
    }

    render(){
        let {select} = this.state;
        let data = this.props.data || {};
        let sellMark = this.props.sellMark;
        let config = [
            [
                {des: "1-5", val: "L15", selectMark:"11"},
                {des: "6-10", val: "L610", selectMark:"12"},
                {des: "11-15", val: "L1115", selectMark:"13"},
                {des: "16-20", val: "L1620", selectMark:"14"},
                {des: "21-25", val: "L2125", selectMark:"15"},
                {des: "26+", val: "L26", selectMark:"16"}
            ],
            [
                {des: "1-5", val: "w15", selectMark:"01"},
                {des: "6-10", val: "w610", selectMark:"02"},
                {des: "11-15", val: "w1115", selectMark:"03"},
                {des: "16-20", val: "w1620", selectMark:"04"},
                {des: "21-25", val: "w2125", selectMark:"05"},
                {des: "26+", val: "w26", selectMark:"06"}
            ]
        ]

        let area, isSell = true;
        //是属于单关还是过关  1：单关；2：过关;
        //1：销售单关；2：仅售过关；4：暂停销售
        if(sellMark == 1){
            if(data.statusScoreWf == 2 || data.statusScoreWf == 4){
                isSell = false;
            }
        }else if(sellMark == 2){
            if(data.statusScoreWf == 4){
                isSell = false;
            }
        }


        return <div className="sfc linebox">
            {
                isSell?<ul className="display-flex">
                    <li className="flex">
                        {this.renderArea(0, config[0])}
                    </li>
                    <li className="des-center">
                    </li>
                    <li className="flex">
                        {this.renderArea(1, config[1])}
                    </li>
                </ul> : <div className="no-sell">未开售</div>
            }
        </div>
    }
};

SFC.defaultProps = {
    select: [ //选择情况

    ],
    onSelect: null, //选择事件
    sellMark: 1, //是属于单关还是过关  1：单关；2：过关;
}
