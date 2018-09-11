import React, { PureComponent } from 'react';
import CountDown from '../../jcz/components/countdown.jsx';
import cx from 'classnames';
import NumberInput from '../../jcz/components/number-input.jsx';

const SubmitOrderButton = ({ leftTime, submit }) => {
  return (
    <div className="submit-button" onClick={ submit }>
      <h5>立即投注</h5>
      <CountDown remaining={ leftTime } />
      <span>后截止</span>
    </div>
  );
};

export default class BettingComponent extends PureComponent {
  renderContent() {
    const { lotteryCode, bettings, times } = this.props;
    if (
      (lotteryCode === 304 && Object.keys(bettings).length === 14) ||
      (lotteryCode === 305 && Object.keys(bettings).length >= 9)
    ) {
      return (
        <div className="betting-times">
          投<em>
            <NumberInput
              number={ times }
              min={ 1 }
              onChange={ this.props.setBettingTimes.bind(this) }
            />
          </em>倍
        </div>
      );
    }
    return (
      <div>
        <p>
          {lotteryCode === 304
            ? '14场比赛至少各选1种比赛结果'
            : '从14场比赛中至少选择9场比赛'}
        </p>
        <span>
          最高奖金 <em>500万</em>元
        </span>
      </div>
    );
  }

  renderAttach() {
    const { lotteryCode, bettings, times, betNum } = this.props;
    const selectedMatchLength = Object.keys(bettings).length;
    if (!selectedMatchLength) return <div />;
    return (
      <div className="betting-attach">
        <div className="clear" onClick={ this.props.reset.bind(this) }>
          <img src={ require('@/img/public/icon_del@2x.png') } />
        </div>
        <div className="attach-tip">
          {(lotteryCode === 304 && selectedMatchLength < 14) ||
          (lotteryCode === 305 && selectedMatchLength < 9) ? (
              <p>
              你已选了{selectedMatchLength}场比赛，还需选<em>
                  {lotteryCode === 304
                    ? 14 - selectedMatchLength
                    : 9 - selectedMatchLength}
                </em>场比赛
              </p>
            ) : (
              <span>
              注数<em>{betNum}</em>注，金额<em>{betNum * times * 2}</em>元
              </span>
            )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={ cx('betting-box', {
          'show-attach': Object.keys(this.props.bettings).length > 0
        }) }
      >
        <div className="betting-container">
          {this.renderAttach()}
          <div className="betting-bar">
            <div className="betting-tip">{this.renderContent()}</div>
            <SubmitOrderButton
              leftTime={ this.props.leftTime }
              submit={ this.props.newOrder.bind(this) }
            />
          </div>
        </div>
      </div>
    );
  }
}
