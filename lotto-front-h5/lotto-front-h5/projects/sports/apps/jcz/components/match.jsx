import React from 'react';
import PropTypes from 'prop-types';

const Match = props => {
  return (
    <div className="jjc-list">
      <div className="match">
        <h4>
          {props.num} {props.m_s_name ? props.m_s_name : m_f_name}{' '}
          {props.saleEndTime}截止
        </h4>
        <p>
          {props.h_s_name ? props.h_s_name : props.h_f_name}
          <sub>[{props.h_order}]</sub>
        </p>
        <p>
          <span>
            {props.g_s_name ? props.g_s_name : props.g_f_name}
            <sub>[{props.g_order}]</sub>
          </span>
          <span className="alter-ico" />
        </p>
      </div>
      <div className="match-detail">{props.children}</div>
    </div>
  );
};

Match.propTypes = {
  children: PropTypes.element.isRequired
};

export default Match;
