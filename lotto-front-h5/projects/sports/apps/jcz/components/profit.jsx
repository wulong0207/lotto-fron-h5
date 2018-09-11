import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { calculateProfitDetail } from '../utils/football';
import { groupArrayByKey } from '../utils';
import Modal from './modal.jsx';
import { generateSinglewinProfitDetail } from '../utils/singlewin';

class ProfitDetailComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      details: []
    };
  }

  open() {
    if (!this.props.betting.maxBonus && !this.props.combinations.length) { return undefined; }
    this.modal.open();
    // 延时计算
    if (this.props.combinations && this.props.combinations.length) {
      const details = generateSinglewinProfitDetail(
        this.props.combinations
      ).reverse();
      this.setState({ details });
    } else {
      setTimeout(() => {
        const details = calculateProfitDetail(this.props.betting);
        this.setState({ details });
      }, 50);
    }
  }

  render() {
    const details = this.state.details;
    const max = groupArrayByKey(this.props.betting.selected, 'id').length;
    return (
      <Modal ref={ modal => (this.modal = modal) }>
        <div className="profit-detail">
          <div className="profit-detail-modal-header">
            <h3>奖金计算器</h3>
            <span>最终奖金以出票为准</span>
          </div>
          <div className="profit-detail-container">
            <table className="profit-detail-table">
              <tbody>
                <tr>
                  <th>命中场数</th>
                  <th>最小奖金</th>
                  <th>最大奖金</th>
                </tr>
                {details.map((d, idx) => {
                  return (
                    <tr key={ idx }>
                      <td>{max - idx}</td>
                      <td>{parseFloat(d.min).toFixed(2)}</td>
                      <td>{parseFloat(d.max).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    );
  }
}

ProfitDetailComponent.propTypes = {
  betting: PropTypes.object.isRequired,
  combinations: PropTypes.array
};

export default ProfitDetailComponent;
