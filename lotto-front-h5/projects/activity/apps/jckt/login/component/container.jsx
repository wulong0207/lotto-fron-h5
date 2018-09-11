import React, { Component } from 'react';
import '../css/container.scss';

export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonStyle: true
    };
  }

  close() {
    if (this.props.close) {
      this.props.close();
    }
  }

  render() {
    let buttonStyle = this.props.buttonStyle
      ? 'commitButton'
      : 'commitButton noButton';
    return (
      <div className="templatePage">
        <div className="header">
          <div className="title">{this.props.title}</div>
          <div className="close" onClick={ this.close.bind(this) } />
        </div>
        {this.props.children}
        <div className={ buttonStyle } onClick={ this.props.btnClick }>
          {this.props.commit}
        </div>
        {this.props.btnMessage ? (
          <div
            className="template_message"
            onClick={ this.props.btnMessageClick }
          >
            {this.props.btnMessage}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Template.defaultProps = {
  title: '账号登录', // 弹窗标题
  commit: '确认登录', // 按钮的文字
  buttonStyle: true // button按钮的显示灰色 标识不可按  true是可以按
};
