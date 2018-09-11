import React, { Component } from 'react';
import analytics from '@/services/analytics';

export default function withAnalytics(
  id,
  handle = nope,
  eventName = 'click',
  WrapperComponent
) {
  return class AnalyticsComponent extends Component {
    constructor(props) {
      super(props);
      this.wrapper = undefined;
      this.analyticsHandle = this.handle.bind(this);
    }

    handle(e) {
      e.preventDefault();
      analytics.send(id, handle);
    }

    componentDidMount() {
      if (typeof this.wrapper.addEventListener !== 'undefined') {
        this.wrapper.addEventListener(eventName, this.analyticsHandle);
      }
    }

    componentWillUnmount() {
      if (typeof this.wrapper.removeEventListener !== 'undefined') {
        this.wrapper.removeEventListener(eventName, this.analyticsHandle);
      }
    }

    render() {
      return <WrapperComponent ref={ wrapper => (this.wrapper = wrapper) } />;
    }
  };
}

function nope() {}
