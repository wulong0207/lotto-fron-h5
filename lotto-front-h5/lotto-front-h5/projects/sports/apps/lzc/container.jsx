import React, { PureComponent } from 'react';
import alert from '@/services/alert';
import http from '@/utils/request';
import { mapPageToLotteryCode } from './utils/utils';

export default class LZCApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rules: {},
      saleStatus: undefined
    };
  }

  componentDidMount() {
    const { page } = this.props.params;
    const lotteryCode = mapPageToLotteryCode(page);
    const lotteryChildCode = lotteryCode === 304 ? 30401 : 30502;
    http.get(`/lottery/betRule/${lotteryCode}`).then(res => {
      if (!this.checkSaleStatus(res.data, lotteryChildCode)) return undefined;
      this.setState({ rules: res.data, saleStatus: 'normal' });
    });
  }

  checkSaleStatus(rules, lotteryChildCode) {
    const rule = rules.lotChildList.filter(
      r => r.lotteryChildCode === lotteryChildCode
    )[0];
    if (!rule) return false;
    if (rule.saleStatus === 0) {
      this.setState({ saleStatus: 'sold-out' });
      return alert.alert('彩期停售');
    }
    this.setState({ saleStatus: 'normal' });
    return true;
  }

  render() {
    const { saleStatus } = this.state;
    if (saleStatus !== 'normal') {
      return <div />;
    }
    return this.props.children;
  }
}
