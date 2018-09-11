import React from 'react';
import PropTypes from 'prop-types';
import '../css/component/vs-info.scss';

const VsInfo = props => {
  let data = props.data;
  let defaultUrl = require('../img/souye_cai.png');
  let style;
  if (data.color) {
    style = { color: data.color };
  }

  return (
    <div className="vs-info">
      <ul className="display-flex">
        <li>
          <img className="logo" src={ data.g_logo || defaultUrl } />
        </li>
        <li className="flex">
          <h4 className="date">
            <span style={ style }>{data.m_s_name || data.m_f_name}</span>{' '}
            {data.week} {data.num} {data.saleEndTime} 截止
            <i className="zhibo" />
          </h4>
        </li>
        <li>
          <img className="logo" src={ data.h_logo || defaultUrl } />
        </li>
      </ul>
      <div className="sep">
        <div>vs</div>
      </div>
      <ul className="display-flex">
        <li>
          <h3>
            {data.g_order ? <span className="gray">[{data.g_order}]</span> : ''}
            {data.g_s_name || data.g_f_name}
            <span className="gray">[负{data.l || '-'}]</span>
          </h3>
        </li>
        <li className="flex" />
        <li>
          <h3>
            <span className="gray">[胜{data.w || '-'}]</span>
            {data.h_s_name || data.h_f_name}
            {data.h_order ? <span className="gray">[{data.h_order}]</span> : ''}
          </h3>
        </li>
      </ul>
    </div>
  );
};

VsInfo.propTypes = {
  data: PropTypes.object
};

export default VsInfo;
