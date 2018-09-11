/*
 * @Author: nearxu
 * @Date: 2017-11-08 11:21:34
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@/utils/utils';
import Navigator from '@/utils/navigator.js';
import http from '@/utils/request';
import session from '@/services/session';
import Message from '@/services/message';
import LoadMore from '../common/load-more';
import '../../css/chase.scss';

function gotoLotteryDetail(resultItem) {
  if (!resultItem.orderCode) {
    return;
  }
  Navigator.goLotteryDetail(resultItem);
}

function Table({ addDetailBOPagingBOData }) {
  return (
    <div>
      {addDetailBOPagingBOData.map((val, i) => {
        console.log(val.addStatus, 'val.addStatus');
        let winningStatus = ['', '等待开奖', '未中奖', '已中奖', '已派奖'];
        let addFAStatus = [
          '',
          '追号成功',
          '追号失败',
          '系统撤单',
          '用户撤单',
          '等待追号',
          '撤单中',
          '停追撤单中',
          '用户撤单中'
        ];
        let ok = val.preBonus != null && val.preBonus != '';
        let message;
        if (!ok) {
          message = winningStatus[val.winningStatus] || '--';
        } else {
          message = <i>{formatMoney(val.preBonus)}</i>;
        }

        return (
          <div key={ i } className="chase-item">
            <span className="citem1">{val.issueCode}</span>
            <span className="citem2">{val.multiple}</span>
            <span className="citem1">&yen;{formatMoney(val.buyAmount)}</span>
            <span className="citem4 red">
              {val.drawCode ? val.drawCode.replace(/,/g, ' ') : '--'}
            </span>
            <span className="citem1">{addFAStatus[val.addStatus]}</span>
            <span className="citem3" onClick={ () => gotoLotteryDetail(val) }>
              {val.addStatus != 5 && ok ? <i>&yen;</i> : ''}
              {message}
            </span>
          </div>
        );
      })}
    </div>
  );
}

class ChaseLottery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addStatus: props.addStatus,
      addDetailBOPagingBOData: props.addDetailBOPagingBO.data
    };
    this.winningStatus = ['', '等待开奖', '未中奖', '已中奖', '已派奖'];
    this.pageIndex = 0;
    console.log(props, 'props');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      addStatus: nextProps.addStatus,
      addDetailBOPagingBOData: nextProps.addDetailBOPagingBO.data
    });
  }
  loadMore() {
    this.pageIndex++;
    http
      .post('/order/queryUserChaseOrderList', {
        token: session.get('token'),
        source: '1',
        pageIndex: this.pageIndex,
        pageSize: 5,
        orderAddCode: this.props.orderCode
      })
      .then(res => {
        let { addDetailBOPagingBOData } = this.state;
        let resultDataList = res.data.data || [];
        addDetailBOPagingBOData = addDetailBOPagingBOData.concat(
          resultDataList
        );
        this.setState({
          addDetailBOPagingBOData
        });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let { addDetailBOPagingBOData, addStatus } = this.state;
    let hasMoreCount = parseInt(
      this.props.addDetailBOPagingBO.total - addDetailBOPagingBOData.length
    );
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
              {addDetailBOPagingBOData ? (
                <Table addDetailBOPagingBOData={ addDetailBOPagingBOData } />
              ) : (
                ''
              )}

              {hasMoreCount > 0 && addStatus !== 4 ? (
                <LoadMore
                  hasMoreCount={ hasMoreCount }
                  loadMore={ this.loadMore.bind(this) }
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

ChaseLottery.propTypes = {
  addDetailBOPagingBO: PropTypes.object,
  orderCode: PropTypes.string
};

export default ChaseLottery;
