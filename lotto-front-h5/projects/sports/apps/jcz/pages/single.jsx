/*
 * @Author: yubei
 * @Date: 2017-04-04 16:12:50
 * @Desc: 单关
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WDFMixListComponent from './mix/mix.jsx';
import { getSingleMatchs } from '../utils';
// import equal from 'deep-equal';
import EmptyComponent from '../components/empty.jsx';

export default class Single extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !equal(nextProps.data, this.props.data);
  // }

  render() {
    const data = getSingleMatchs(this.props.data);
    if (!data.length) return <EmptyComponent />;
    return (
      <div className="single">
        {data.map(d => {
          return (
            <WDFMixListComponent
              key={ d.date }
              date={ d.date }
              matchs={ d.matchs }
              single={ true }
            />
          );
        })}
      </div>
    );
  }
}

Single.propTypes = {
  data: PropTypes.array.isRequired
};
