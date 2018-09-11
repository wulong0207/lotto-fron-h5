import React, { Component } from 'react';
import { VISIBLE } from '../../constants';
import Slider from '../../lib/react-rangeslider';
import '../../lib/react-rangeslider/index.css';
import api from '../../services/api';
import PropTypes from 'prop-types';
import './create.scss';
import cx from 'classnames';
import { range } from 'lodash';
import page from '@/component/hoc/page';
import alert from '@/services/alert';
import { isLogin, goLogin, getToken } from '@/services/auth';

function Label({ label }) {
  return <div className="page-label">{label}</div>;
}

Label.propTypes = {
  label: PropTypes.string.isRequired
};

class Visible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: VISIBLE[0].value
    };
  }

  selectHandle(value) {
    this.setState({ selected: value });
  }

  getValue() {
    return this.state.selected;
  }

  render() {
    return (
      <div className="visible">
        {VISIBLE.map(option => {
          return (
            <div
              key={ option.value }
              onClick={ () => this.selectHandle(option.value) }
              className={ cx('item', {
                selected: this.state.selected === option.value
              }) }
            >
              {option.label}
            </div>
          );
        })}
      </div>
    );
  }
}

class Commission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 4
    };
  }

  changeHandle(value) {
    this.setState({ value });
  }

  getValue() {
    return this.state.value;
  }

  render() {
    const labels = range(11).reduce((acc, l) => {
      return {
        ...acc,
        [l]: l.toString()
      };
    }, {});
    return (
      <div className="commission">
        <Slider
          min={ 0 }
          max={ 10 }
          labels={ labels }
          value={ this.state.value }
          onChange={ this.changeHandle.bind(this) }
          format={ toolTipFormat }
          keepTooltip={ true }
        />
      </div>
    );
  }
}

function toolTipFormat(value) {
  return `${value}%`;
}

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.visible = null;
    this.commission = null;
    this.reason = null;
    this.state = {
      maxTextLen: 1500,
      curTextLen: 0
    };
    this.curText = '';
  }

  create() {
    if (!isLogin()) return goLogin();
    const data = {
      orderCode: this.props.location.query.order,
      orderVisibleType: this.visible.getValue(),
      recommendReason: this.reason.value,
      commissionRate: this.commission.getValue(),
      token: getToken()
    };
    api
      .createCopy(data)
      .then(res => {
        console.log(res);
        alert.alert('发布成功').then(() => (window.location.href = '/cd/#'));
      })
      .catch(e => {
        alert.alert(e.message);
      });
  }

  textareaChange() {
    if (this.reason.value.length > 1500) {
      this.reason.value = this.reason.value.substr(0, 1500);
      let { maxTextLen, curTextLen } = this.state;
      curTextLen = this.reason.value.length;
      maxTextLen = 1500 - curTextLen;
      this.setState({ curTextLen, maxTextLen });
      return;
    }
    let { maxTextLen, curTextLen } = this.state;
    curTextLen = this.reason.value.length;
    maxTextLen = 1500 - curTextLen;
    this.setState({ curTextLen, maxTextLen });
  }

  render() {
    let { maxTextLen, curTextLen } = this.state;
    return (
      <div>
        <Label label="推荐理由" />
        <div className="recommend">
          <textarea
            ref={ textarea => (this.reason = textarea) }
            className="textarea"
            placeholder="这个人很懒，什么都没有留下"
            onChange={ this.textareaChange.bind(this) }
          />
          <div className="textNum">
            {curTextLen}/{maxTextLen}
          </div>
        </div>
        <Label label="方案可见" />
        <Visible ref={ visible => (this.visible = visible) } />
        <Label label="设置抄单提成" />
        <Commission ref={ commission => (this.commission = commission) } />
        <div className="submit">
          <dl className="submit-tip">
            <dt>温馨提示</dt>
            <dd>1.抄单提成发布后不可更改</dd>
            <dd>2.盈利金额需大于本金1成，方可参考提成计算</dd>
          </dl>
          <button className="submit-button" onClick={ this.create.bind(this) }>
            确认
          </button>
        </div>
      </div>
    );
  }
}

CreatePage.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      order: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default page('抄单设置', true, undefined, true)(CreatePage);
