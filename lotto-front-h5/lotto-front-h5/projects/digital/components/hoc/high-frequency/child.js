import React, { Component } from 'react';
import alert from '@/services/alert';
import http from '@/utils/request';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

/**
 * 各种数字彩的子玩法的通用高阶组件，用于检查销售状态
 * 
 * @export
 * @param {int} lotteryChildCode 子彩种 id
 * @param {object} information 大彩种数据
 * @param {string} omitUrl 遗漏/冷热/概率数据的请求 url
 * @param {React.Component} WrapperComponent 子玩法组件
 * @returns React.Component
 */
export default function child(
  lotteryChildCode,
  information,
  omitUrl,
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
      omitQuery: PropTypes.object.isRequired
    };

    componentDidMount() {
      if (this.lottery.saleStatus === 0) {
        alert.alert('当前玩法暂停销售！', '提示');
      }
      this.getOmitData(this.props.omitQuery).then(data => {
        this.setState({ omitData: data }, () => {
          if (typeof this.getInstanceHandle === 'function') {
            this.getInstanceHandle(this.component);
          }
        });
      });
    }

    componentWillReceiveProps(nextProps) {
      if (!isEqual(nextProps.omitQuery, this.props.omitQuery)) {
        this.getOmitData(nextProps.omitQuery).then(data => {
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

    getOmitData(omitQuery) {
      return new Promise((resolve, reject) => {
        http
          .get(omitUrl, { params: omitQuery })
          .then(res => {
            let data;
            if (Array.isArray(res.data)) {
              data = res.data[0].omits;
            } else if (Array.isArray(res.data.omits)) {
              data = res.data.omits;
            } else {
              data = res.data;
            }
            resolve(data);
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
      ) {
        return <div />;
      }
      const limitInfoList = information.limitInfoList
        .reduce((acc, item) => acc.concat(item.limitNumberList), [])
        .filter(i => i.lotteryChildCode === lotteryChildCode);
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
            limitInfoList={ limitInfoList }
            lottery={ information.lottery }
          />
        </div>
      );
    }
  };
}
