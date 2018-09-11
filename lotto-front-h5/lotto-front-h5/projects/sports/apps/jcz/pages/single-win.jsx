/*
 * @Author: yubei
 * @Date: 2017-04-01 14:44:16
 * @Desc: 单场致胜
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SinglewinListComponent from '../components/singlewin';
import { getSinglewinMatchs } from '../utils';
// import equal from 'deep-equal';

export default class SingleWin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !equal(nextProps.data, this.props.data);
  // }

  render() {
    const data = getSinglewinMatchs(this.props.data);
    return (
      <div className="singleWin">
        {data.map(d => {
          return (
            <SinglewinListComponent
              date={ d.date }
              matchs={ d.matchs }
              key={ d.date }
            />
          );
        })}
      </div>
    );
  }
}

SingleWin.propTypes = {
  data: PropTypes.array.isRequired
};
