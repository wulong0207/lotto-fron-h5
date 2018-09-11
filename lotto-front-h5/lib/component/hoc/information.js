import React, { PureComponent } from 'react';
import http from '../../utils/request';
import { isEmpty } from 'lodash';
import Alert from '../../component/message.jsx';

/*
 各种数字彩的彩种的通用高阶组件，用于检查销售状态
 params
 - url: string 彩种信息请求的 url
 - WrapperComponent: React.element 彩种组件
 * */

// 获取当前服务器的时间
function getServerDateTime(serverTime, requestTime, now) {
  const timeBetweenNowAndRequestTime = now.getTime() - requestTime;
  return serverTime + timeBetweenNowAndRequestTime;
}

// 获取当前时间对应的倍数和注数限制
function getBetMulRule(serverTime, requestTime, lotBetMulList, officialEndTime) {
  return function() {
    const serverTime = getServerDateTime(serverTime, requestTime, new Date());
    const leftTime = officialEndTime - serverTime;
    lotBetMulList.sort((a, b) => b.endTime - a.endTime);
    const last = lotBetMulList.slice(-1);
    if (leftTime <= last.endTime) {
      return last;
    }
    for (let i=0; i<lotBetMulList.length; i++) {
      const current = lotBetMulList[i];
      const next = lotBetMulList[i + 1];
      if (next && leftTime < current.endTime && leftTime > next.endTime) {
        return current;
      }
    }
    return lotBetMulList[0];
  }
}

export default function information(url, Component) {
  return class InfoComponent extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        information: {}
      };
      this.countDown = null;
      this.remaining = 0;
    }

    componentDidMount() {
      http.get(url).then(res => {
        this.setState({ information: res.data });
        InfoComponent.checkLotterySaleStatus(res.data);
        const saleEndTime = new Date(res.data.curIssue.saleEndTime.replace(/-/g, '/')).getTime();
        const serverTime = new Date(res.data.curIssue.currentDateTime.replace(/-/g, '/')).getTime();
        this.remaining = parseInt((saleEndTime - serverTime) / 1000);
        this.tick();
      })
    }

    componentWillUnmount() {
      if (this.countDown) clearInterval(this.countDown);
    }

    tick() {
      this.countDown = setInterval(() => {
        if (this.remaining < 1) {
          clearInterval(this.countDown);
          return Alert.alert({
            children: (
              <div>
                <p>当前 ${ this.state.information.curIssue.issueCode } 期 已截止销售</p>
                <p>你可购买下一期</p>
              </div>
            ),
            btnFn: [location.reload]
          })
        }
        this.remaining --;
      }, 1000);
    }

    static checkLotterySaleStatus(information) {
      if (information.curLottery.saleStatus === 0) {
        Alert.alert({
          children: (
            <div>
              <h4>该彩种暂停销售</h4>
              <p>由此给你带来的不便，我们深感抱歉，望你谅解</p>
              <p>你可访问：<a href="/dlt.html">大乐透</a><a href="/jczq.html">竞彩足球</a><a href="http://m.13322.com">即时比分</a></p>
            </div>
          )
        });
      }
    }

    render() {
      if (isEmpty(this.state.information)) {
        return (<div />)
      }
      if (this.state.information.curLottery.saleStatus === 0) {
        return (
          <div style={{
            textAlign: 'center',
            padding: '100px 0',
            color: '#999',
            fontSize: '24px'
          }}>
            该彩种已暂停销售
          </div>
        )
      }
      const { information } = this.state;
      const issueCode = information.curIssue.issueCode;
      const saleEndTime = new Date(information.curIssue.saleEndTime.replace(/-/g, '/')).getTime();
      const serverTime = new Date(information.curIssue.currentDateTime.replace(/-/g, '/')).getTime();
      const officialEndTime = new Date(information.curIssue.officialEndTime.replace(/-/g, '/')).getTime();
      const remaining = parseInt((saleEndTime - serverTime) / 1000);
      const requestTime = new Date().getTime();
      return (
        <Component
          getBetMulRule={ getBetMulRule(serverTime, requestTime, information.lotBetMulList, officialEndTime) }
          remaining={ remaining }
          issueCode={ issueCode }
          saleEndTime={ saleEndTime }
          lotteryIssue={ issueCode }
          lotteryCode={ information.curLottery.lotteryCode }
          { ...this.state.information }
        />
      )
    }
  }
}