/*
 * @Author: yubei
 * @Date: 2017-03-30 11:19:59
 * @Desc: 混合过关
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MixPageContent from './content.jsx';
import equal from 'deep-equal';

export default class FootballMixPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedData: []
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !equal(nextProps.data, this.props.data);
  // }

  render() {
    const { page, data } = this.props;
    return (
      <div>
        <MixPageContent data={ data } />
      </div>
    );
  }
}

FootballMixPage.propTypes = {
  data: PropTypes.array.isRequired
};
