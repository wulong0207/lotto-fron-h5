import React, { PureComponent } from 'react';
import api from '../../services/api';
import ReceiptComponent from '../../components/receipt';
import { RecommendReceipt } from '../../types';
import PropTypes from 'prop-types';
import './recommend.scss';

function RecommendListComponent({ receipts, serviceTime }) {
  if (!receipts.length) return <div className="empty-recommend">暂无推荐</div>;
  return (
    <div className="recommend-receipt-list">
      {receipts.map(receipt => {
        return (
          <ReceiptComponent
            receipt={ receipt }
            key={ receipt.id }
            isEnd={ serviceTime >= receipt.endLocalTime }
          />
        );
      })}
    </div>
  );
}

RecommendListComponent.propTypes = {
  receipts: PropTypes.arrayOf(RecommendReceipt),
  serviceTime: PropTypes.number
};

export default class RecommendList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      receipts: null,
      serviceTime: new Date().getTime()
    };
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    lottery: PropTypes.number.isRequired
  };

  componentDidMount() {
    const { id, lottery } = this.props;
    api.getRecommend(id, lottery, 1, 3, 0).then(res => {
      this.setState({ receipts: res.data, serviceTime: res.serviceTime });
    });
  }

  render() {
    const { receipts } = this.state;
    return (
      <div className="receipt-recommend">
        <h2>更多推荐</h2>
        {receipts && (
          <RecommendListComponent
            receipts={ receipts }
            serviceTime={ this.state.serviceTime }
          />
        )}
      </div>
    );
  }
}
