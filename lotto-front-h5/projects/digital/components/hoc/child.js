import React, { Component } from 'react';
import alert from '@/services/alert';
import http from '@/utils/request';
import PropTypes from 'prop-types';

/*
各种数字彩的子玩法的通用高阶组件，用于检查销售状态
params
  - lotteryChildCode : int 子彩种 id
  - information: object 大彩种数据
  - omitUrl: string 遗漏/冷热/概率数据的请求 url
  - omitType:
    - int 数据类型，请参考 rap 文档
    - object 如果有多个参数，则传查询的对象
  - WrapperComponent: React.element 子玩法组件
* */

export default function child(
  lotteryChildCode,
  information,
  omitUrl,
  omitType,
  WrapperComponent
) {
  return class NumberLotteryChild extends Component {
    constructor(props) {
      super(props);
      this.lottery = information.lotChildList.filter(
        i => i.lotteryChildCode === parseInt(lotteryChildCode)
      )[0];
      if (!this.lottery) throw new Error('错误的 lotteryChildCode');
      this.state = {
        omitData: []
      };
      this.getInstanceHandle = undefined;
    }

    static propTypes = {
      omitFlag: PropTypes.number.isRequired // 遗漏/冷热/概率数据的请求的 qryFlag
    };

    componentDidMount() {
      if (this.lottery.saleStatus === 0) {
        alert.alert('当前玩法暂停销售！', '提示');
      }
      NumberLotteryChild.getOmitData(this.props.omitFlag).then(data => {
        this.setState({ omitData: data }, () => {
          if (typeof this.getInstanceHandle === 'function') {
            this.getInstanceHandle(this.component);
          }
        });
      });
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.omitFlag !== this.props.omitFlag) {
        NumberLotteryChild.getOmitData(nextProps.omitFlag).then(data => {
          this.setState({ omitData: data });
        });
      }
    }

    getInstance() {
      if (typeof this.component !== 'undefined') {
        return this.component;
      }
      return new Promise((resolve, reject) => {
        if (typeof this.component !== 'undefined') {
          resolve(this.component);
        } else {
          this.getInstanceHandle = resolve;
        }
      });
    }

    static getOmitData(qryFlag = 1, qryCount = 50) {
      return new Promise((resolve, reject) => {
        let query = {
          qryFlag,
          qryCount
        };
        if (omitType) {
          if (typeof omitType === 'number' || typeof omitType === 'string') {
            query.omitType = omitType;
          } else {
            query = {
              ...query,
              ...omitType
            };
          }
        }
        http
          .get(omitUrl, { params: query })
          .then(res => {
            let data;
            if (Array.isArray(res.data)) {
              data = res.data[0].omits;
            } else if (Array.isArray(res.data.omits)) {
              data = res.data.omits;
            } else {
              data = res.data;
            }
            if (qryFlag === 3 && Array.isArray(data)) {
              resolve(data.map(d => (d / 100).toFixed(2)));
            } else {
              resolve(data);
            }
          })
          .catch(reject);
      });
    }

    render() {
      const issueCode = information.curIssue.issueCode;
      const saleEndTime = new Date(
        information.curIssue.saleEndTime.replace(/-/g, '/')
      ).getTime();
      if (
        typeof omitUrl !== 'undefined' &&
        Array.isArray(this.state.omitData) &&
        !this.state.omitData.length
      ) { return <div />; }
      return (
        <div className="child">
          <WrapperComponent
            ref={ component => (this.component = component) }
            { ...this.props }
            issueCode={ issueCode }
            saleEndTime={ saleEndTime }
            lotteryChildCode={ lotteryChildCode }
            lotteryIssue={ information.curIssue.issueCode }
            lotteryCode={ information.curLottery.lotteryCode }
            omitData={ this.state.omitData }
          />
        </div>
      );
    }
  };
}
