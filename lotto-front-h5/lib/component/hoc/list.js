import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import Pagination from '../pagination';
import PropTypes from 'prop-types';
import './list.scss';
import { browser } from '@/utils/utils';
import session from '@/services/session';
import toast from '@/services/toast';
import { isEqual } from 'lodash';
import { getServiceTime } from '@/services/serviceTime';

// 浏览器刷新时间
const unLoadEventName =
  browser.iPhone || browser.iPad ? 'pagehide' : 'beforeunload';

// 记录是否用户手动刷新了浏览器
const IS_BROWSER_REFRESH = 'IS_BROWSER_REFRESH';

/**
 * 列表高阶组件, 自带分页组件
 * 
 * @export
 * @param {()=> Promise} onFetch 获取数据的方法，返回 Promise, resolve 必须返回 数据数组 
 * @param {number} [page=1] 初始化页数
 * @param {number} [pageSize=10] 数据个数
 * @param {boolean} [isWithRouter=false] 是否需要把页面映射到路由中, 开启这个必须确保应用已使用 react router 
 * @returns 
 */
export default function list(
  onFetch,
  page = 1,
  pageSize = 10,
  isWithRouter = false,
  onChange,
  emptyNode
) {
  /** 
   * @param {React.Component} WrapperComponent 数据列表组件
  */
  return function(WrapperComponent) {
    class DataList extends PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          data: null,
          page,
          status: 'idle',
          hasNextPage: true
        };
        this.recordRefreshHandle = () => {
          session.set(IS_BROWSER_REFRESH, 1);
        };
      }

      static propTypes = {
        location: PropTypes.shape({
          query: PropTypes.object
        }),
        router: PropTypes.object,
        onChange: PropTypes.func,
        data: PropTypes.array
      };

      componentDidMount() {
        let page = this.state.page;
        if (isWithRouter) {
          page = this.props.location.query.page || page;
          // 如果用户有手动刷新页面时重置加载页面
          if (this.recovery()) {
            page = 1;
          }
          // 在用户手动刷新页面时记录刷新行为
          window.addEventListener(unLoadEventName, this.recordRefreshHandle);
        }
        this.fetch(1, parseInt(pageSize) * page, true);
      }

      componentWillUnmount() {
        window.removeEventListener(unLoadEventName, this.recordRefreshHandle);
      }

      componentWillReceiveProps(nextProps) {
        if (
          Array.isArray(nextProps.data) &&
          !isEqual(this.state.data, nextProps.data)
        ) {
          this.setState({ data: nextProps.data });
        }
      }

      fetch(page, size = pageSize, isInitial = false, refresh = false, params={}) {
        this.setState({ status: 'pending' });
        onFetch(page - 1, size, params)
          .then(data => {
            if (data.length < size) {
              this.setState({ hasNextPage: false });
            }
            if (data.length === size && !this.state.hasNextPage) {
              this.setState({ hasNextPage: true });
            }
            if (!isInitial) {
              this.setState({ page });
            }
            let newData = Array.isArray(this.state.data) && !refresh
              ? this.state.data.concat(data)
              : data.concat();
            this.setState({ data: newData, status: 'success' });
            this.props.onChange && this.props.onChange(newData);
            if (!isInitial && isWithRouter) {
              const { location } = this.props;
              const { query } = location;
              this.props.router.replace({
                ...location,
                query: { ...query, page }
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({ status: 'fail' });
            toast.toast('服务器繁忙，请稍后重试');
          });
      }

      refresh(params) {
        this.fetch(1, undefined, undefined, true, params);
      }

      recovery() {
        if (!session.get(IS_BROWSER_REFRESH)) return false;
        session.remove(IS_BROWSER_REFRESH);
        const { location } = this.props;
        const { query } = location;
        console.log(query);
        this.props.router.replace({
          ...location,
          query: { ...query, page: 1 }
        });
        return true;
      }

      pageChangeHandle(page) {
        this.fetch(page);
      }

      render() {
        const { data } = this.state;
        const serviceTime = getServiceTime();
        if (!data) return null;
        if (Array.isArray(data) && !data.length) {
          return emptyNode || <div className="empty-list">暂无数据</div>;
        }
        return (
          <div className="list-data">
            <WrapperComponent
              page={ this.state.page }
              data={ this.state.data }
              serviceTime={ serviceTime }
              { ...this.props }
            />
            <Pagination
              page={ this.state.page }
              pageSize={ pageSize }
              onChange={ this.pageChangeHandle.bind(this) }
              isPending={ this.state.status === 'pending' }
              hasNextPage={ this.state.hasNextPage }
            />
          </div>
        );
      }
    }
    return isWithRouter ? withRouter(DataList, {withRef: true}) : DataList;
  };
}
