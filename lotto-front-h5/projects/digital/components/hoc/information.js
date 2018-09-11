import React from 'react';
import websocket from '@/services/websocket';
import http from '@/utils/request';
import alert from '@/services/alert';
import { isEmpty } from 'lodash';
import Timer from '../../services/timer';
import '../../css/lottery.scss';

// 获取当前服务器的时间
function getServerDateTime(serverTime, requestTime, now) {
  const timeBetweenNowAndRequestTime = now.getTime() - requestTime;
  return serverTime + timeBetweenNowAndRequestTime;
}

// 获取当前时间对应的倍数和注数限制
function getBetMulRule(
  serverTime,
  requestTime,
  lotBetMulList,
  officialEndTime
) {
  return function() {
    const requestServerTime = getServerDateTime(
      serverTime,
      requestTime,
      new Date()
    );
    const leftTime = parseInt((officialEndTime - requestServerTime) / 1000);
    lotBetMulList.sort((a, b) => b.endTime - a.endTime);
    const last = lotBetMulList.slice(-1);
    if (leftTime <= last.endTime) {
      return last;
    }
    for (let i = 0; i < lotBetMulList.length; i++) {
      const current = lotBetMulList[i];
      const prev = lotBetMulList[i - 1];
      if (prev && leftTime < prev.endTime && leftTime >= current.endTime) {
        return current;
      }
    }
    return lotBetMulList[0];
  };
}

/**
 * 数组彩的彩种通用组件，用于获取彩种信息，自动切换彩期等
 *
 * @export
 * @param {string} url 彩种信息请求 url
 * @param {React.Component} WrapperComponent 彩种组件
 * @param {string} socketEventName socket 事件名
 * @returns
 */
export default function information(url, WrapperComponent, socketEventName) {
  return class InformationComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        information: {}
      };
      this.socket = undefined;
      this.issueTimer = new Timer(); // 彩期切换倒计时
      this.drawTimer = new Timer(); // 开奖倒计时
    }

    componentDidMount() {
      this.getLotteryInfo().then(({ issueRemaining, drawRemaining }) => {
        if (drawRemaining) this.drawTimerHandler(drawRemaining);
        if (socketEventName) {
          this.startSocket(issueRemaining);
        } else {
          this.issueTimerHandler(issueRemaining);
          // if (drawRemaining) this.drawTimerHandler(drawRemaining);
        }
      });
    }

    componentWillUnmount() {
      if (socketEventName) this.socket.disconnect();
      this.issueTimer.stop();
      this.drawTimer.stop();
    }

    startSocket(issueRemaining) {
      websocket
        .subscribe(socketEventName)
        .then(updateData => {
          if (
            updateData.lotteryCode !==
            this.state.information.curLottery.lotteryCode
          ) {
            return undefined;
          }
          if (updateData.updateDataType === 1) {
            alert.alert(
              <div>
                <p>
                  当前 {this.state.information.curIssue.issueCode} 期 已截止销售
                </p>
                <p>你可购买下一期</p>
              </div>
            );
          }
          this.refreshInformation();
        })
        .catch(e => {
          console.log('连接错误，使用倒计时刷新彩期');
          // 连接错误时采用倒计时
          this.issueTimerHandler(issueRemaining);
        });
      // this.socket.on(socketEventName, data => {
      //   console.log(data);
      //   const updateData = JSON.parse(decodeURIComponent(data));
      //   if (
      //     updateData.lotteryCode !==
      //     this.state.information.curLottery.lotteryCode
      //   ) {
      //     return undefined;
      //   }
      //   if (updateData.updateDataType === 1) {
      //     alert.alert(
      //       <div>
      //         <p>当前 {this.state.information.curIssue.issueCode} 期 已截止销售</p>
      //         <p>你可购买下一期</p>
      //       </div>
      //     );
      //   }
      //   this.refreshInformation();
      // });
    }

    // 当没有 websocket 彩期推送时，计时提示用户刷新彩期
    issueTimerHandler(remaining, muted = false) {
      this.issueTimer.stop();
      this.issueTimer.start(remaining).then(() => {
        if (!muted) {
          alert.alert(
            <div>
              <p>
                当前 {this.state.information.curIssue.issueCode} 期 已截止销售
              </p>
              <p>你可购买下一期</p>
            </div>
          );
        }
        this.refreshInformation().then(({ isNewIssue, issueRemaining }) => {
          if (!isNewIssue) {
            this.issueTimerHandler(2, true);
          } else {
            this.issueTimerHandler(issueRemaining);
          }
        });
      });
    }

    // 当没有 websocket 开奖推送时，计时获取开奖号码
    drawTimerHandler(remaining) {
      this.drawTimer.stop();
      this.drawTimer.start(remaining).then(() => {
        this.refreshInformation().then(({ drawCode, drawRemaining }) => {
          if (!drawCode) {
            this.drawTimerHandler(10);
          }
        });
      });
    }

    static checkLotterySaleStatus(information) {
      const { saleStatus, platform } = information.curLottery;
      if (saleStatus === 2) {
        return alert.alert(
          <div>
            <h4>该彩种已停止销售</h4>
            <p>由此给你带来的不便，我们深感抱歉。</p>
          </div>
        );
      }
      if (saleStatus === 0) {
        // 有平台限制，但平台不包含 wap
        if (
          platform &&
          platform
            .split(',')
            .map(p => parseInt(p))
            .indexOf(2) < 0
        ) {
          return undefined;
        }
        alert.alert(
          <div>
            <h4>该彩种暂停销售</h4>
            <p>由此给你带来的不便，我们深感抱歉。</p>
          </div>
        );
      }
    }

    // 获取彩种信息并且在没有 websocket 时，倒计时
    refreshInformation() {
      return new Promise((resolve, reject) => {
        this.getLotteryInfo()
          .then(resolve)
          .catch(reject);
      });
    }

    // 获取彩种信息请求
    getLotteryInfo() {
      return new Promise((resolve, reject) => {
        http
          .get(url)
          .then(res => {
            let information;
            if (typeof res.data.lotteryIssueBase !== 'undefined') {
              information = res.data.lotteryIssueBase;
            } else if (typeof res.data.curLottery !== 'undefined') {
              information = res.data;
            } else {
              throw new Error(
                url + '彩种信息格式不对，请联系对应彩种的后端人员'
              );
            }
            const prevIssueCode = this.state.information.curIssue
              ? this.state.information.curIssue.issueCode
              : 0;
            this.setState({ information });
            InformationComponent.checkLotterySaleStatus(information);
            const saleEndTime = new Date(
              information.curIssue.saleEndTime.replace(/-/g, '/')
            ).getTime();
            const serverTime = new Date(
              information.curIssue.currentDateTime.replace(/-/g, '/')
            ).getTime();
            const lastOfficialEndTime = new Date(
              information.latestIssue.officialEndTime.replace(/-/g, '/')
            ).getTime();
            const issueRemaining = parseInt((saleEndTime - serverTime) / 1000);
            const drawRemaining =
              serverTime > lastOfficialEndTime
                ? 0
                : parseInt((lastOfficialEndTime - serverTime) / 1000);
            const drawCode = information.latestIssue.drawCode;
            const isNewIssue = information.curIssue.issueCode !== prevIssueCode;
            if (drawRemaining > 0) {
              this.drawTimerHandler(drawRemaining);
            }
            if (issueRemaining <= 0) {
              // 开发环境可能无人维护, 会出现数据错误
              if (process.env.NODE_ENV === 'production') {
                setTimeout(this.refreshInformation.bind(this), 1000);
              } // 如果请求到的数据刚好是切换彩期的截至时间，则延时一秒再请求一次
            } else {
              resolve({ issueRemaining, drawRemaining, drawCode, isNewIssue });
            }
          })
          .catch(reject);
      });
    }

    getLotteryIssue() {
      return () => {
        if (!this.state.information) throw new Error('无法获取彩期');
        return this.state.information.curIssue.issueCode;
      };
    }

    render() {
      if (isEmpty(this.state.information)) {
        return <div />;
      }
      const { information } = this.state;
      const issueCode = information.curIssue.issueCode;
      const saleEndTime = new Date(
        information.curIssue.saleEndTime.replace(/-/g, '/')
      ).getTime();
      const serverTime = new Date(
        information.curIssue.currentDateTime.replace(/-/g, '/')
      ).getTime();
      const lastOfficialEndTime = new Date(
        information.latestIssue.officialEndTime.replace(/-/g, '/')
      ).getTime();
      const remaining = parseInt((saleEndTime - serverTime) / 1000);
      const drawRemaining =
        serverTime >= lastOfficialEndTime
          ? 0
          : parseInt((lastOfficialEndTime - serverTime) / 1000);
      const requestTime = new Date().getTime();
      return (
        <div className="lottery-page">
          <WrapperComponent
            getBetMulRule={ getBetMulRule(
              serverTime,
              requestTime,
              information.lotBetMulList,
              saleEndTime
            ) }
            remaining={ remaining }
            issueCode={ issueCode }
            saleEndTime={ saleEndTime }
            lotteryIssue={ issueCode }
            lotteryCode={ information.curLottery.lotteryCode }
            drawRemaining={ drawRemaining }
            getLotteryIssue={ this.getLotteryIssue().bind(this) }
            { ...this.state.information }
          />
        </div>
      );
    }
  };
}
