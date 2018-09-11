/*
  * @Author: nearxu
  * @Date: 2017-09-30 17:43:09
  * 追号 表格
  */
import React, { Component } from 'react';
import NumberHelper from './number-helper';
import { formatMoney } from '@/utils/utils.js';
export default class ChaseContent extends Component {
  constructor(props) {
    super(props);
    this.winningStatus = ['', '等待开奖', '未中奖', '已中奖', '已派奖'];
  }
  generateZhuiHao(addDetailBOPagingBO) {
    let result = [];
    let self = this;
    if (addDetailBOPagingBO) {
      result = addDetailBOPagingBO.map((val, i) => {
        let ok = val.preBonus != null && val.preBonus != '';
        let message;
        if (!ok) {
          message = self.winningStatus[val.winningStatus] || '--';
        } else {
          message = <i>{formatMoney(val.preBonus)}</i>;
        }
        return (
          <div key={ i } className="chase-item">
            <span className="citem1">{val.issueCode}</span>
            <span className="citem2">{val.multiple}</span>
            <span className="citem1">&yen;{formatMoney(val.buyAmount)}</span>
            {/* <span className="citem4">
                         <i>{
                             val.drawCode ?
                             OrderHelper.handleCode(val.drawCode,val.lotteryCode)
                             :
                            "--"
                             }
                         </i>
                     </span>
                     <span className="citem1">{NumberHelper.addFAStatus[val.addStatus]}</span>
                     <span className="citem3" onClick={self.gotoLotteryDetail.bind(this, val)}>{(val.addStatus != 5 && ok)?<i>&yen;</i>:""}{message}
                         {val.orderCode?<i className="icon-arrow-r"></i>:""}
                     </span>  */}
            <span className="citem4">{val.drawCode ? val.drawCode : '--'}</span>
            <span className="citem1">
              {NumberHelper.addFAStatus[val.addStatus]}
            </span>
            <span
              className="citem3"
              onClick={ self.gotoLotteryDetail.bind(this, val) }
            >
              {val.addStatus != 5 && ok ? <i>&yen;</i> : ''}
              {message}
            </span>
          </div>
        );
      });
    }
    return result;
  }
  gotoLotteryDetail(resultItem) {
    if (!resultItem.orderCode) {
      return;
    }
    Navigator.goLotteryDetail(resultItem);
  }

  showMoreZh() {
    console.log(this.page, 'this.page');
    let self = this;
    http
      .post('/order/queryUserChaseOrderList', {
        token: session.get('token'),
        source: '1',
        pageIndex: self.page,
        pageSize: 5,
        orderAddCode: this.lotteryItem.orderCode
      })
      .then(res => {
        let { lotteryData } = self.state;
        lotteryData.addDetailBOPagingBO = lotteryData.addDetailBOPagingBO || {};
        lotteryData.addDetailBOPagingBO.data =
          lotteryData.addDetailBOPagingBO.data || [];
        let resultData = (res || {}).data;
        let resultDataList = resultData.data || [];
        lotteryData.addDetailBOPagingBO.data = lotteryData.addDetailBOPagingBO.data.concat(
          resultDataList
        );

        self.setState({ lotteryData: lotteryData });
        self.page++;
        console.log(
          lotteryData.addDetailBOPagingBO.data,
          'lotteryData.addDetailBOPagingBO.data'
        );
        // this.setState({lotteryData: res.data || {}});
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    // let {userNumPage} = this.state;
    let { addDetailBOPagingBO } = this.props;
    console.log(addDetailBOPagingBO, 'this.props.addDetailBOPagingBO');
    return (
      <div className="chase">
        <section className="plan-section margin-t10">
          <div className="plan-list">
            <div className="zhuihao">
              <div className="chase-item">
                <span className="citem1">彩期</span>
                <span className="citem2">倍数</span>
                <span className="citem1">金额</span>
                <span className="citem4">开奖号码</span>
                <span className="citem1">状态</span>
                <span className="citem3">中奖金额</span>
              </div>
              {this.generateZhuiHao(addDetailBOPagingBO)}

              {/* <div onClick={ this.showMoreZh.bind(this)} className="plan-other" style={{display: (hasMoreCount2>0?"":"none")}}>
                             还有{hasMoreCount2}个追号方案
                             <i className="icon-arrow-d-grey"></i>
                         </div> */}
            </div>
          </div>
        </section>
        {/* { this.generateChaseContent.bind(this) } */}
      </div>
    );
  }
}
