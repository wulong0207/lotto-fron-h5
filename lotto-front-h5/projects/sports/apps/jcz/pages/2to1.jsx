/*
 * @Author: yubei
 * @Date: 2017-03-30 15:43:22
 * @Desc: 二选一
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getAlternativeMatchs } from '../utils';
import AlternativeListComponent from '../components/alternative';
// import equal from 'deep-equal';
import EmptyComponent from '../components/empty.jsx';

export default class AlternativePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !equal(nextProps.data, this.props.data);
  // }

  render() {
    const data = getAlternativeMatchs(this.props.data);
    if (!data.length) return <EmptyComponent />;
    return (
      <div className="alternative">
        {data.map(d => {
          return (
            <AlternativeListComponent
              key={ d.date }
              date={ d.date }
              matchs={ d.matchs }
            />
          );
        })}
      </div>
    );
  }
}

AlternativePage.propTypes = {
  data: PropTypes.array.isRequired
};
