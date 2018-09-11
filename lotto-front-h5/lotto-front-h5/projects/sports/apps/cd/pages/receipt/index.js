import React, { Component } from 'react';
import User from './user';
import { Receipt } from '../../types';
import page from '@/component/hoc/page';
import api from '../../services/api';
import PropTypes from 'prop-types';
import Order from './order';
import OrderFollowBar from './follow';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import RecommendList from './recommend';
import { mapWinningStatusToLabel } from '../../helpers';
import './receipt.scss';

function Reason({ reason, visible }) {
  if (!visible) return null;
  return (
    <div className="issue-reason">
      <h2 className="reason-header">推荐理由</h2>
      <div className="reason-content">
        {!reason ? (
          <div className="empty">
            <img src={ require('./images/rogue.png') } />
            <p>这个人很懒，什么都没留下</p>
          </div>
        ) : (
          reason
        )}
      </div>
    </div>
  );
}

Reason.propTypes = {
  reason: PropTypes.string,
  visible: PropTypes.string
};

function getStatus(num) {
  let str = '';
  switch (num) {
    case 1:
      str = '开奖后可见';
      break;
    case 2:
      str = '全部可见';
      break;
    case 3:
      str = '仅对抄单人可见';
      break;
    case 4:
      str = '仅对关注人可见';
      break;
  }
  return str;
}

function ReceiptMeta({ receipt }) {
  if (!receipt) return null;
  return (
    <div className="receipt-meta">
      <dl>
        <dt>推荐时间</dt>
        <dd>{dateFormat(new Date(receipt.createTime), 'yyyy-mm-dd')}</dd>
      </dl>
      <dl>
        <dt>订单编号</dt>
        <dd>{receipt.orderFullDetailInfoBO.orderBaseInfoBO.orderCode}</dd>
      </dl>
      <dl>
        <dt>方案提成</dt>
        <dd>{receipt.commissionRate ? receipt.commissionRate : ''}</dd>
      </dl>
      <dl>
        <dt>推荐结果</dt>
        <dd>
          {mapWinningStatusToLabel(
            receipt.orderFullDetailInfoBO.orderBaseInfoBO.winningStatus
          )}
        </dd>
      </dl>
      <dl>
        <dt>状态</dt>
        <dd>{getStatus(receipt.orderVisibleType)}</dd>
      </dl>
    </div>
  );
}

ReceiptMeta.propTypes = {
  receipt: Receipt
};

export function ReceiptComponent({
  receipt,
  follow,
  followed,
  isEnd,
  onFollowChange
}) {
  return (
    <div className="receipt-detail">
      <User
        id={ receipt.userIssueId }
        receipt={ receipt }
        onFollowChange={ onFollowChange }
        followed={ followed }
      />
      <Order
        order={ receipt.orderFullDetailInfoBO }
        isRecommend={ Boolean(receipt.isRecommend) }
        visible={ receipt.orderVisibleType }
        follow={ follow }
        receipt={ receipt }
      />
      <Reason
        reason={ receipt.recommendReason }
        visible={ typeof receipt.isShow }
      />
      <ReceiptMeta receipt={ receipt } />
      <OrderFollowBar
        id={ receipt.id }
        order={ receipt.orderFullDetailInfoBO.orderBaseInfoBO }
        lotteryCode={ receipt.orderFullDetailInfoBO.orderBaseInfoBO.lotteryCode }
        isEnd={ isEnd }
      />
    </div>
  );
}

ReceiptComponent.propTypes = {
  receipt: Receipt,
  follow: PropTypes.func.isRequired,
  followed: PropTypes.bool,
  isEnd: PropTypes.bool,
  onFollowChange: PropTypes.func
};

class ReceiptPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: null,
      followed: undefined,
      isEnd: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id && nextProps.params.id !== this.props.params.id) {
      this.getReceipt(nextProps.params.id);
      window.scrollTo(0, 0);
    }
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.getReceipt(id);
  }

  getReceipt(id = this.props.params.id) {
    if (!id || !/^\d+$/.test(id)) return undefined;
    api.getReceipt(id).then(res => {
      this.setState({
        receipt: res.data,
        isEnd: res.serviceTime >= res.data.endLocalTime
      });
    });
  }

  followChangeHandle(followed) {
    this.setState({ followed });
    this.getReceipt();
  }

  follow() {
    api
      .follow(this.state.receipt.userIssueId)
      .then(() => {
        this.getReceipt();
        this.setState({ followed: true });
      })
      .catch(e => console.log(e));
  }

  render() {
    const { receipt, isEnd } = this.state;
    console.log(isEnd);
    return (
      <div className="receipt-page">
        {receipt && (
          <div>
            <ReceiptComponent
              receipt={ receipt }
              follow={ this.follow.bind(this) }
              followed={ this.state.followed }
              isEnd={ isEnd }
              onFollowChange={ this.followChangeHandle.bind(this) }
            />
            {isEnd && (
              <RecommendList
                id={ receipt.userIssueId }
                lottery={
                  receipt.orderFullDetailInfoBO.orderBaseInfoBO.lotteryCode
                }
              />
            )}
          </div>
        )}
        <div className="receipt-tip">
          以上言论仅代表发布者观点，与平台无关，平台不承担法律责任
        </div>
        {receipt &&
          isEnd && (
            <div className="link-to-expert-page">
              <Link to={ '/experts/' + receipt.userIssueId }>查看TA更多方案</Link>
            </div>
          )}
      </div>
    );
  }
}

ReceiptPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
};

export default page('方案详情')(ReceiptPage);
