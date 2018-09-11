import React, { Component } from 'react';
import { Tabs, TabPanel } from '@/component/tabs';
import AnalyticsComponent from '../../components/analytics';
import Followers from './followers';
import PropTypes from 'prop-types';
import withRouterTab from '@/component/hoc/with-router-tab';
import RebatePage from './rebate';
import Recommend from '../expert/recommend';
import './panels.scss';

class PageTabs extends Component {
  constructor(props) {
    super(props);
    this.rebate = null;
    this.days = props.location.query.days || 3;
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    location: PropTypes.shape({
      query: PropTypes.object
    }),
    router: PropTypes.object
  };

  rebateChangeHandle(index) {
    const days = getDays(index);
    if (!this.rebate) return undefined;
    this.rebate.onChange(days);
    const { location } = this.props;
    const { query } = location;
    this.props.router.replace({ ...location, query: { ...query, days } });
  }

  render() {
    const { id } = this.props;
    const tabs = [
      {
        label: '竞彩足球'
      },
      {
        label: '竞彩篮球'
      },
      {
        label: '返佣情况',
        dropdown: ['近3天', '近7天', '近30天', '近90天'],
        onChange: this.rebateChangeHandle.bind(this),
        index: getIndex(parseInt(this.days))
      },
      {
        label: '我的粉丝'
      }
    ];
    return (
      <Tabs { ...this.props } tabs={ tabs }>
        <TabPanel>
          <AnalyticsComponent lotteryCode={ 300 } id={ id } />
          <Recommend lottery={ 300 } issueUserId={ parseInt(id) }
            queryType={ 4 } />
        </TabPanel>
        <TabPanel>
          <AnalyticsComponent lotteryCode={ 301 } id={ id } />
          <Recommend lottery={ 301 } issueUserId={ parseInt(id) }
            queryType={ 4 } />
        </TabPanel>
        <TabPanel>
          <RebatePage
            ref={ page => (this.rebate = page) }
            days={ parseInt(this.days) }
          />
        </TabPanel>
        <TabPanel>
          <Followers id={ id } />
        </TabPanel>
      </Tabs>
    );
  }
}

export default withRouterTab()(PageTabs);

const DAYS = [3, 7, 30, 90];

function getDays(index) {
  return DAYS[index] || DAYS[0];
}

function getIndex(days) {
  const index = DAYS.indexOf(days);
  return index > -1 ? index : 0;
}
