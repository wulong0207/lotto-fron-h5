/**
 * Created by YLD on 2017/11/02.
 */
import React, { PureComponent } from 'react';
import TicketHeader from './ticket-header.jsx';
import '../css/ticket-item.scss';
import PropTypes from 'prop-types';

export default class Ticket extends PureComponent {
  render() {
    const { items, config, header, ticketStatus, openStatus } = this.props;
    return (
      <section className="ticket-item">
        {header && header.length > 0 ? (
          <TicketHeader config={ config } header={ header } />
        ) : (
          ''
        )}
        <ul>
          {items.map((v, i) => {
            return (
              <li className={ 'flex-column ' + config[i] } key={ i }>
                <div className="flex" />
                <div className="plan-area">{v}</div>
                <div className="flex" />
              </li>
            );
          })}
        </ul>
        <footer>
          <div className="t-status">{ticketStatus}</div>
          <div className="open-tip flex">{openStatus}</div>
        </footer>
      </section>
    );
  }
}

Ticket.propTypes = {
  ticket: PropTypes.any,
  header: PropTypes.any,
  ticketStatus: PropTypes.any,
  config: PropTypes.any,
  items: PropTypes.array,
  openStatus: PropTypes.any
};

Ticket.defaultProps = {
  config: ['play', 'plan', 'mul', 'mul', 'money'],
  // header: [ "玩法", "投注号码", "注数", "倍数", "投注金额"],
  items: [
    // "2串1",
    // "02 05 11 15 08 09 + 02",
    // "10",
    // "1",
    // "￥10"
  ] // 各项数据
  // ticketStatus: "第1张 出票成功",
  // openStatus: "未开奖",
};
