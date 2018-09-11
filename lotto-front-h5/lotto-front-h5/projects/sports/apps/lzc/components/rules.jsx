import React, { PureComponent } from 'react';
import http from '@/utils/request';
import alert from '@/services/alert';

export default function withRuleCheck(
  WrapperComponent,
  lotteryCode,
  lotteryChildCode
) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        rules: {},
        saleStatus: undefined
      };
    }

    componentDidMount() {
      http
        .get(`/lottery/betRule/${lotteryCode}`)
        .then(res => {
          if (!this.checkSaleStatus(res.data, lotteryChildCode)) { return undefined; }
          this.setState({ rules: res.data, saleStatus: 'normal' });
        })
        .catch(e => {
          alert.alert(e.message);
        });
    }

    checkSaleStatus(rules, lotteryChildCode) {
      const rule = rules.lotChildList.filter(
        r => r.lotteryChildCode === lotteryChildCode
      )[0];
      if (rules) return;
      if (rule.saleStatus === 0) {
        this.setState({ saleStatus: 'sold-out' });
        return alert.alert('彩期停售');
      }
      return true;
    }

    render() {
      const { saleStatus } = this.state;
      if (saleStatus !== 'normal') {
        return <div>invalid</div>;
      }
      return <WrapperComponent rules={ this.state.rules } { ...this.props } />;
    }
  };
}
