import React, { Component } from 'react';
import Alert from '../../services/message';
import http from '../../utils/request';
import PropTypes from 'prop-types';

/*
各种数字彩的子玩法的通用高阶组件，用于检查销售状态
params
  - lotteryChildCode : int 子彩种 id
  - information: object 大彩种数据
  - omitUrl: string 遗漏/冷热/概率数据的请求 url
  - omitType: int 数据类型，请参考 rap 文档
  - WrapperComponent: React.element 子玩法组件
* */

export default function child(lotteryChildCode, information, omitUrl, omitType, WrapperComponent) {

  return class NumberLotteryChild extends Component {
    constructor(props) {
      super(props);
      this.lottery = information.lotChildList.filter(i => i.lotteryChildCode === parseInt(lotteryChildCode))[0];
      if (!this.lottery) throw new Error('错误的 lotteryChildCode');
      this.state = {
        omitData: []
      }
    }

    static propTypes = {
      onNewOrder: PropTypes.func.isRequired, // 下单方法
      omitFlag: PropTypes.number.isRequired // 遗漏/冷热/概率数据的请求的 qryFlag
    };

    componentDidMount() {
      if (this.lottery.saleStatus === 0) {
        return Alert.alert({msg: '当前玩法暂停销售！'});
      }
      NumberLotteryChild.getOmitData(this.props.omitFlag).then(res => {
        this.setState({ omitData: res.data });
      })
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.omitFlag !== this.props.omitFlag) {
        NumberLotteryChild.getOmitData(nextProps.omitFlag).then(res => {
          this.setState({ omitData: res.data });
        });
      }
    }

    getInstance() {
      return this.component;
    }

    static getOmitData(qryFlag=1) {
      return http.get(omitUrl, { params: { omitType, qryFlag, qryCount: 1 } });
    }

    render() {
      if (this.lottery.saleStatus === 0) {
        return (
          <div style={{
            textAlign: 'center',
            padding: '100px 0',
            color: '#999',
            fontSize: '24px'
          }}>
            当前玩法暂停销售！
          </div>
        )
      }
      const issueCode = information.curIssue.issueCode;
      const saleEndTime = new Date(information.curIssue.saleEndTime.replace(/-/g, '/')).getTime();
      const serverTime = new Date(information.curIssue.currentDateTime.replace(/-/g, '/')).getTime();
      const officialEndTime = new Date(information.curIssue.officialEndTime.replace(/-/g, '/')).getTime();
      const remaining = parseInt((saleEndTime - serverTime) / 1000);
      const requestTime = new Date().getTime();
      if (typeof omitType !== 'undefined' && !this.state.omitData.length) return (<div />);
      return (
        <div>
          <WrapperComponent
            ref={ component => this.component = component }
            { ...this.props }
            issueCode={ issueCode }
            saleEndTime={ saleEndTime }
            lotteryChildCode={ lotteryChildCode }
            lotteryIssue={ information.curIssue.issueCode }
            lotteryCode={ information.curLottery.lotteryCode }
            omitData={ this.state.omitData }
          />
        </div>
      )
    }
  }
}