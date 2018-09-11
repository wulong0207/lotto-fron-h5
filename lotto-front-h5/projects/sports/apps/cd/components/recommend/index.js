import React, { PureComponent } from 'react';
import RecommendReceiptComponent from './recommend';
import PropTypes from 'prop-types';
import { RecommendReceipt } from '../../types';
import api from '../../services/api';
import './index.scss';
import list from '@/component/hoc/list';

function Receipts({ data, serviceTime }) {
  if (!data) return null;
  if (Array.isArray(data) && !data.length) {
    return <div className="recommend-empty">暂无推荐</div>;
  }
  return (
    <div>
      {data.map(receipt => (
        <RecommendReceiptComponent
          receipt={ receipt }
          key={ receipt.id }
          isEnd={ serviceTime >= receipt.endLocalTime }
        />
      ))}
    </div>
  );
}

Receipts.propTypes = {
  data: PropTypes.arrayOf(RecommendReceipt),
  serviceTime: PropTypes.number
};
let RecommendList;

export default class Recommend extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      receipts: {
        [props.lottery]: null
      },
      serviceTime: new Date().getTime()
    };
    RecommendList = list(
      this.getRecommend(this.props.lottery).bind(this),
      1,
      5,
      undefined,
      undefined,
      <div className="recommend-empty">暂无推荐</div>
    )(Receipts);
  }

  static propTypes = {
    lottery: PropTypes.number.isRequired,
    issueUserId: PropTypes.number.isRequired,
    queryType: PropTypes.number
  };

  static defaultProps = {
    queryType: 3
  };

  getRecommend(lottery) {
    return page => {
      return new Promise((resolve, reject) => {
        const { issueUserId } = this.props;
        api
          .getRecommend(issueUserId, lottery, this.props.queryType, 5, page)
          .then(res => {
            // this.setState({ serviceTime: res.serviceTime });
            resolve(res.data);
          });
      });
    };
  }

  render() {
    return (
      <div className="recommend-list">
        <RecommendList
          lottery={ this.props.lottery }
          serviceTime={ this.state.serviceTime }
        />
      </div>
    );
  }
}
