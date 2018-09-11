import React, { PureComponent } from 'react';
import { Tabs, TabPanel } from '@/component/tabs';
import AnalyticsComponent from '../../components/analytics';
import PropTypes from 'prop-types';
import './analytics.scss';
import withRouterTab from '@/component/hoc/with-router-tab';
import Recommend from './recommend';

function AnalyticsTabs(props) {
  const { id } = props;
  const tabs = [
    {
      label: '竞彩足球'
    },
    {
      label: '竞彩篮球'
    }
  ];
  return (
    <Tabs { ...props } tabs={ tabs }>
      <TabPanel>
        <div>
          <AnalyticsComponent lotteryCode={ 300 } id={ id } />
          <Recommend lottery={ 300 } issueUserId={ id } />
        </div>
      </TabPanel>
      <TabPanel>
        <div>
          <AnalyticsComponent lotteryCode={ 301 } id={ id } />
          <Recommend lottery={ 301 } issueUserId={ id } />
        </div>
      </TabPanel>
    </Tabs>
  );
}

AnalyticsTabs.propTypes = {
  id: PropTypes.number.isRequired
};

let AnalyticsTabsContainer;

export default class Analytics extends PureComponent {
  constructor(props) {
    super(props);
    AnalyticsTabsContainer = withRouterTab(undefined, undefined, {
      ...props
    })(AnalyticsTabs);
  }
  render() {
    return (
      <div className="analytics">
        <AnalyticsTabsContainer />
      </div>
    );
  }
}

Analytics.propTypes = {
  id: PropTypes.number.isRequired
};
