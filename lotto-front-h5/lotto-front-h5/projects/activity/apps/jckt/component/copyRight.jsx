import React, { Component } from 'react';
import '../css/copyRight.scss';

export default class CopyRight extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="copyRight">
        <p className="telPhone">客户热线：{this.props.telPhone} 在线客服</p>
        <p className="copyRight_message">
          © 2017 2ncai.com 版权所有 深圳益彩网络科技有限公司
        </p>
      </div>
    );
  }
}
CopyRight.defaultProps = {
  telPhone: '0755-61988504'
};
