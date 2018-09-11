/**
 * Created by YLD on 2017/11/03.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TicketHeader extends PureComponent {
  render() {
    const { header, className, config, alone } = this.props;

    let ul = (
      <ul className={ className }>
        {header.map((v, i) => {
          return (
            <li className={ config[i] + ' header' } key={ i }>
              {v}
            </li>
          );
        })}
      </ul>
    );

    return alone ? <div className="ticket-item">{ul}</div> : ul;
  }
}

TicketHeader.propTypes = {
  ticket: PropTypes.any,
  header: PropTypes.any,
  className: PropTypes.any,
  config: PropTypes.any,
  alone: PropTypes.bool
};
