/**
 * Created by YLD on 2017/11/03.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../css/ticket-draw.scss';
import Lottery from '../lottery';

// 开奖
export default class TicketDraw extends PureComponent {
  getDrawStage() {
    return Lottery(this.props.ticket).openArea();
  }

  render() {
    return (
      <section className="ticket-draw display-flex">
        <div className="label">开奖号码</div>
        {this.getDrawStage()}
      </section>
    );
  }
}

TicketDraw.propTypes = {
  ticket: PropTypes.object
};
