import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

export default function withRouterTab(queryName = 'tab', onChange, props) {
  return function(WrapperComponent) {
    class Tabs extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeIndex: this.getActiveTabIndexFromRouter()
        };
      }

      static propTypes = {
        router: PropTypes.object,
        location: PropTypes.object
      };

      // componentDidMount() {
      //   // this.setActiveTabIndex();
      // }

      getActiveTabIndexFromRouter() {
        const { location } = this.props;
        const index = location.query[queryName];
        return index ? parseInt(index) : 0;
      }

      // setActiveTabIndex() {
      //   const { location } = this.props;
      //   const index = location.query[queryName];
      //   // const index = tabs.map(t => t.toString()).indexOf(value);
      //   if (index && parseInt(index) !== this.state.activeIndex) {
      //     this.setState({ activeIndex: parseInt(index) });
      //   }
      // }

      ChangeHandle(index) {
        const { location, router } = this.props;
        const query = location.query || {};
        // if (tabs.length < index) throw new Error('tabs 数据不正确');
        router.replace({
          ...location,
          query: { ...query, [queryName]: index }
        });
        this.setState({ activeIndex: index });
        onChange && onChange(index);
      }

      render() {
        return (
          <WrapperComponent
            { ...props }
            { ...this.props }
            onChange={ this.ChangeHandle.bind(this) }
            active={ this.state.activeIndex }
          />
        );
      }
    }
    return withRouter(Tabs);
  };
}
