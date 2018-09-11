import React, { Component } from 'react';

import cx from 'classnames';
import Header from '@/component/header';
import session from '@/services/session';
import http from '@/utils/request';
import Message from '@/services/message';

import '../css/feedback.scss';

export class FeedBack extends Component {
  constructor(props) {
    super(props);
    this.onClear = false;
    this.state = {
      mob: '',
      isShow: false,
      question: '',
      popList: [],
      selected: '',
      code: '',
      procontlen: '0'
    };
  }

  componentWillMount() {
    // 获取子级菜单
    http
      .get('/help/types', {})
      .then(res => {
        // console.log(res.data[0].typeName);
        let name = res.data[0].typeName;
        let typecode = res.data[0].typeCode;
        this.setState({ popList: res.data, selected: name, code: typecode });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  onSelectBug() {
    this.setState({ isShow: !this.state.isShow });
  }
  onListClick(code, name) {
    // console.log(code);
    this.setState({ isShow: !this.state.isShow, selected: name, code: code });
  }
  mobChange(e) {
    this.setState({ mob: e.target.value });
    // console.log(this.state.mob);
  }
  onClearmob(e) {
    this.setState({ mob: '' });
  }
  mobVerify(e) {
    if (this.onClear) return undefined;
    var mobReg = /^1[3456789]\d{9}$/;
    let value = e.target.value;
    if (e.target.value !== '' && !mobReg.test(value)) {
      Message.toast('您输入的手机号不正确！');
    }
  }
  question(e) {
    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    if (regRule.test(e.target.value)) {
      this.setState({ question: '', procontlen: '0' });
      Message.toast('不支持使用表情');
    } else {
      this.setState({
        question: e.target.value,
        procontlen: e.target.value.length
      });
    }
    // console.log(this.state.question);
  }
  submit(e) {
    let mob = this.state.mob;
    let content = this.state.question;
    let code = this.state.code;
    var mobReg = /^1[3456789]\d{9}$/;
    if (mob !== '' && !mobReg.test(mob)) {
      Message.toast('您输入的手机号不正确！');
      return;
    }
    if (!content) {
      Message.toast('相关内容不能为空！');
      return;
    }
    let token = session.get('token');

    if (token) {
      let params = {
        token: token
      };
      http
        .post('/member/token/status', params)
        .then(res => {
          console.log(res);
          if (res.success === 1) {
            this.submitrequest(mob, content, code, token);
          }
        })
        .catch(err => {
          Message.toast(err.message);
        });
    } else {
      let token = '';
      this.submitrequest(mob, content, code, token);
    }
  }
  submitrequest(mob, content, code, token) {
    let params = {
      content: content,
      helpId: '',
      helpTypeCode: code,
      mobile: mob,
      sources: '1',
      token: token,
      type: '2'
    };
    http
      .post('/help/feedback', params)
      .then(res => {
        Message.toast('提交成功，感谢你的反馈！');
        setTimeout(() => {
          window.location.href = '/help.html';
        }, 2000);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  render() {
    let popUpData = this.state.popList || [];
    let mob = this.state.mob;
    let question = this.state.question;
    let name = this.state.selected;
    let proContLen = this.state.procontlen;
    return (
      <div className="feed">
        <Header title="意见反馈" />
        <div className="userinfo">
          <ul className="acc-information">
            <li className="mob">
              <span>手机号码</span>
              <input
                type="tel"
                placeholder="请输入11位的手机号码"
                value={ mob }
                onChange={ event => this.mobChange(event) }
                onBlur={ event => this.mobVerify(event) }
                maxLength="11"
                pattern="\w*"
              />
              <span
                className={ cx(mob.length ? 'clear-part' : 'hide') }
                onMouseEnter={ () => (this.onClear = true) }
                onMouseLeave={ () => (this.onClear = false) }
                onClick={ this.onClearmob.bind(this) }
              >
                <img src={ require('@/img/account/deletegrey@2x.png') } />
              </span>
            </li>
            <li className="question">
              <span>请选择问题分类</span>
              <div className="option">
                <div className="content" onClick={ this.onSelectBug.bind(this) }>
                  {/* <span className="text">{ popUpData[this.state.listIndex] }</span> */}
                  {/* <span className="text">{ popUpData[0] }</span> */}
                  <span className="text">{name}</span>
                  <span className="icon_arrow" />
                </div>
                <div
                  className="listBox"
                  style={ { display: this.state.isShow ? 'block' : 'none' } }
                >
                  <ul className="list">
                    {popUpData ? (
                      popUpData.map((row, ind) => {
                        return (
                          <li
                            className="count"
                            key={ ind }
                            onClick={ this.onListClick.bind(
                              this,
                              row.typeCode,
                              row.typeName
                            ) }
                          >
                            {row.typeName}
                          </li>
                        );
                      })
                    ) : (
                      <div />
                    )}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="question-cont">
          <p className="title">请简要描述你的问题和建议</p>
          <div className="text">
            <textarea
              className="question-text"
              name="feedback"
              type="text"
              placeholder="请在此输入相关内容"
              value={ question }
              maxLength="140"
              onChange={ event => this.question(event) }
            />
            <span className="maxlength">{proContLen}/140</span>
          </div>
        </div>
        <div className="submit-btn">
          <p className="button" onClick={ event => this.submit(event) }>
            提交
          </p>
        </div>
      </div>
    );
  }
}

/**
 * App加载H5页面后应当调用此方法，传入相应的参数初始化H5端
 * @param Json字符串，包括以下内容
 *           token token
 */
window.initializeApp = function(params) {
  // alert(JSON.stringify(params));
  var curParams = {};
  try {
    curParam = JSON.parse(params);
  } catch (e) {
    curParams = params;
  }

  session.set('token', curParams.token);
  console.log('H5-Message: ' + curParams.token);
  Home.submit();
};
