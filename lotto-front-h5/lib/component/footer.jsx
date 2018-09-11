/*
 * @Author: yubei
 * @Date: 2017-05-08 17:09:25
 * @Desc: footer 下单组件
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import '../scss/component/footer.scss';

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                {/*设胆弹层*/}
                <section className="set-courage-layer" style={{display: 'none'}}>
                    <div className="mask"></div>
                    <div className="courage">
                        <div className="bet-endtime">
                            <div className="endtime">
                                投注截止时间：2016-11-08  19:50:00
                            </div>
                            <span className="close">x<span className="vertical-line"></span></span>
                        </div>
                        <section className="oper">
                            <div>继续选比赛<span>（已选5场）</span></div>
                            <div>清空列表</div>
                        </section>
                        <section className="courage-area">
                            <div className="area-header"></div>
                            <div className="area-extender">
                                <div className="area-content">
                                    <div className="mask"></div>
                                    <section className="area-data">
                                        <div className="stop-race">赛事已停止投注   删除本场比赛</div>
                                        <div className="title-sub">
                                            <div>
                                                {/*not-selected*/}
                                                <span className="selected">✔</span>
                                                <span className="set-text">设胆</span>
                                            </div>
                                            <div>
                                                周一 001 天皇杯  东京FC -1  vs  FC本田
                                            </div>
                                            <span className="close">x</span>
                                        </div>
                                        <section className="data-list">
                                            <div className="data-item">
                                                <div>
                                                    <span>胜平负</span>
                                                </div>
                                                <div>
                                                    <span>胜@12.55</span>
                                                    <span>平@12.55</span>
                                                    <span>负@12.55</span>
                                                </div>
                                            </div>
                                            <div className="data-item">
                                                <div>
                                                    <span>让球胜平负[-1]</span>
                                                </div>
                                                <div>
                                                    <span>胜@12.55</span>
                                                    <span>平@12.55</span>
                                                    <span>负@12.55</span>
                                                </div>
                                            </div>
                                            <div className="data-item">
                                                <div>
                                                    <span>比分</span>
                                                </div>
                                                <div>
                                                    <p>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span></p>
                                                    <p>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span>
                                                        <span>1:0@12.55</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="data-item">
                                                <div>
                                                    <span>总进球数</span>
                                                </div>
                                                <div>
                                                    <span>1:0@12.55</span>
                                                    <span>1:0@12.55</span>
                                                    <span>1:0@12.55</span>
                                                    <span>1:0@12.55</span>
                                                </div>
                                            </div>
                                            <div className="data-item">
                                                <div>
                                                    <span>半全场</span>
                                                </div>
                                                <div>
                                                    <span>胜-负@12.55</span>
                                                    <span>胜-负@12.55</span>
                                                    <span>胜-负@12.55</span>
                                                    <span>胜-负@12.55</span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                                    {/*area-content-overdue 过期了*/}
                                <div className="area-content area-content-overdue">
                                    <div className="mask"></div>
                                    <section className="area-data">
                                        {/*赛事停止提示*/}
                                        <div className="stop-race">赛事已停止投注   删除本场比赛</div>
                                        <section className="title-sub">
                                            <div>
                                                {/*not-selected*/}
                                                <span className="not-selected">✔</span>
                                                <span className="set-text">设胆</span>
                                            </div>
                                            <div>
                                                周一 001 天皇杯  东京FC -1  vs  FC本田
                                            </div>
                                            <span className="close">x</span>
                                        </section>
                                        <section className="data-list">
                                            <div className="data-item">
                                                <div>
                                                    <span>胜平负</span>
                                                </div>
                                                <div>
                                                    <span>胜@12.55</span>
                                                    <span>平@12.55</span>
                                                    <span>负@12.55</span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                                <div className="area-content">
                                    <div className="mask"></div>
                                    <section className="area-data">
                                        <div className="stop-race">赛事已停止投注   删除本场比赛</div>
                                        <section className="title-sub">
                                            <div>
                                                {/*not-selected*/}
                                                <span className="selected">✔</span>
                                                <span className="set-text">设胆</span>
                                            </div>
                                            <div>
                                                周一 001 天皇杯  东京FC -1  vs  FC本田
                                            </div>
                                            <span className="close">x</span>
                                        </section>
                                        <section className="data-list">
                                            <div className="data-item">
                                                <div>
                                                    <span>胜平负</span>
                                                </div>
                                                <div>
                                                    <span>胜@12.55</span>
                                                    <span>平@12.55</span>
                                                    <span>负@12.55</span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>
                                </div>
                            </div>
                            <div className="area-footer"></div>
                        </section>
                    </div>
                </section>

                <footer className="footer" style={{display: "none"}}>
                    <div className="bet-info">
                        <section className="no-selbet">
                            <p>请至少选择一场比赛</p>
                            <span>复式截止时间：赛前8分钟</span>
                        </section>
                    </div>
                    <div className="bet-btn">
                        <p>立即投注</p>
                    </div>
                </footer>

                <footer className="footer">
                    <div className="bet-info">
                        <section className="bonu-mult">
                            <section className="bonu-range">
                                <div>
                                    <span>奖金范围</span>
                                    <span><i>12362568</i> 元</span>
                                </div>
                                <div>
                                    <span>99.88~15462945.45元</span>
                                    <span>=1440元x2倍</span>
                                </div>
                            </section>
                            <section className="attach">
                                <div>倍数</div>
                                <div>单倍奖金范围99.88~15462945.45元</div>
                                <div>
                                    <div className="less-add">
                                        <span className="less">-</span>
                                        <input type="text" />
                                        <span className="add">+</span>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                    <div className="bet-btn">
                        <p>立即投注</p>
                    </div>
                </footer>

                <footer className="footer" style={{display: 'none'}}>
                    <div className="bet-info">
                        <section className="bet-opt">
                            <section className="bet-opt-menu">
                                <div>设胆<span className="dot-tips"></span></div>
                                <div>
                                    <span>2串1</span>
                                    <span className="round-num">8</span>
                                </div>
                                <div>
                                    投<em>1</em>倍
                                </div>
                            </section>
                            <section className="attach">
                                <span className="del"><img src={require('../img/public/icon_del@2x.png')}/></span>
                                <span>投注金额<em>38</em>元，最高奖金<em>2342352.25</em></span>
                                <span className="prize-optimize">奖金优化</span>
                            </section>
                            {/*过关方式*/}
                            <section className="pass-way" style={{display: "none"}}>
                                <p>
                                    <span className="grid-nosel">单场致胜</span>
                                    <span>单关</span>
                                    <span>2串1</span>
                                    <span>3串1</span>
                                </p>
                                <p>
                                    <span>4串1</span>
                                    <span className="grid-sel">5串1</span>
                                    <span>6串1</span>
                                    <span>更多<span className="dot-tips"></span></span>
                                </p>
                                <p>
                                    <span>3串3</span>
                                    <span>3串4</span>
                                    <span>4串4</span>
                                    <span>4串5</span>
                                </p>
                                <p>
                                    <span>4串6</span>
                                    <span>4串11</span>
                                    <span>5串5</span>
                                    <span>5串6</span>
                                </p>
                            </section>
                            {/*奖金计算器提示*/}
                            <section className="bonus-calc-tips" style={{display: "none"}}>
                                <span className="close">x</span>
                                <span className="arrows"><span className="arrows"></span></span>
                                <div className="title">
                                    <h2>奖金计算器</h2><span>仅供参考，最终奖金以出票为准:</span>
                                </div>
                                <div className="content">
                                    <p>
                                        <span>命中场次</span>
                                        <span>最小奖金</span>
                                        <span>最大奖金</span>
                                    </p>
                                    <p>
                                        <span>7</span>
                                        <span>12345678.25</span>
                                        <span>12345678.25</span>
                                    </p>
                                    <p>
                                        <span>6</span>
                                        <span>12345678.25</span>
                                        <span>12345678.25</span>
                                    </p>
                                    <p>
                                        <span>5</span>
                                        <span>12345678.25</span>
                                        <span>12345678.25</span>
                                    </p>
                                    <p>
                                        <span>3</span>
                                        <span>12345678.25</span>
                                        <span>12345678.25</span>
                                    </p>
                                </div>
                            </section>
                        </section>
                    </div>
                    <div className="bet-btn">
                        <p>立即投注</p>
                        <p><time>02:00</time>后截止</p>
                    </div>
                </footer>

                <footer className="footer" style={{display: "none"}}>
                    <div className="footer-oper">
                        {/*sel-normal*/}
                        <span className="sel-all">全选</span>
                        <span className="invert">反选</span>
                        <span className="delete">删除</span>
                    </div>
                    <div className="bet-money-btn">
                        立即投注 <span>共<em>1236</em>元</span>
                    </div>
                </footer>

                {/*支付方案*/}
                <section className="pay-scheme" style={{display: "none"}}>
                    <div className="bet-endtime">
                        <div className="endtime">
                            投注截止时间：2016-11-08  19:50:00
                        </div>
                        <span className="close">x<span className="vertical-line"></span></span>
                    </div>
                    <div>
                        <div className="scheme-desc">
                            每个彩期只能保存8个未支付方案，如需支付当前方案请删除已保存的方案；你也可以选择所有方案合并支付，包括提交的方案。
                        </div>
                        <div className="scheme-list">
                            <ul>
                                <li>
                                    <div className="scheme-num">
                                        <p>当前提交方案</p>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="not-selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                                <li>
                                    <div className="scheme-num">
                                        <span className="selected">✔</span>
                                        <span>D4574586578888879</span>
                                    </div>
                                    <div className="scheme-money">￥12345元</div>
                                    <div className="scheme-pay"><span>去支付</span></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}


// ReactDOM.render(<Footer/>, document.getElementById('app'));