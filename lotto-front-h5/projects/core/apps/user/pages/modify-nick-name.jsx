import React, { Component } from 'react';
import Message from '@/services/message';
import session from '@/services/session';
import http from '@/utils/request';
import APP_URI from '@/app-const';
import Navigator from '@/utils/navigator';
import Header from '@/component/header'; // 头部

import '../css/modify-user-name.scss';

export default class ModifyNickName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteShow: false,
      canModify: false,
      isLoading: false,
      verifyPwdShow: false, // 验证密码弹窗
      verifyPhoneShow: false, // 验证手机号弹窗
      verifyMailShow: false // 验证邮箱弹窗
    };
    this.oldName = '';
  }
  componentDidMount() {
    this.getUserInfo();
    this.change();
  }
  getUserInfo() {
    let _this = this;
    http
      .post('/member/info', {
        token: session.get('token')
      })
      .then(res => {
        _this.setState(res.data);
        // 修改用户名为空
        // _this.refs.userName.value = _this.state.acc;
        _this.setState({ userInfo: res.data });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  showProgress(sts) {
    this.setState({ isLoading: sts });
  }
  // 区分中英文字符长度，中文按两个字符算
  getFullLength(txt) {
    var len = 0;
    for (var i = 0; i < txt.length; i++) {
      // 10:换行
      // 32：空格
      if (
        txt.charCodeAt(i) > 127 ||
        txt.charCodeAt(i) == 94 ||
        txt.charCodeAt(i) == 10 ||
        txt.charCodeAt(i) == 32
      ) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  }
  confirm(e) {
    let { canModify, isLoading } = this.state;
    let _this = this;
    let numReg = /^[0-9]*$/g;
    let spanReg = /^\S+$/gi;
    const accReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    const len = this.getFullLength(this.refs.userName.value);
    if (canModify && !isLoading) {
      let userName = this.refs.userName.value;
      if (accReg.test(userName)) {
        if (!numReg.test(userName)) {
          if (len >= 4 && len <= 20) {
            Message.alert({
              msg: '你确定修改昵称？',
              btnFn: [
                () => {
                  if (this.state.mob && this.state.mob_sts == 1) {
                    // 修改账户名时 验证手机
                    this.verifyPhone();
                  } else if (
                    (!this.state.mob || this.state.mob_sts == 0) &&
                    this.state.em &&
                    this.state.em_sts == 1
                  ) {
                    // 修改账户名时，验证邮箱
                    this.verifyMail();
                  }
                }
              ],
              children: (
                <p className="msg1">
                  <em>注:昵称只能修改一次</em>
                </p>
              )
            });
            // if(this.state.mob && this.state.mob_sts == 1){
            //     //修改账户名时 验证手机
            //     this.verifyPhone();
            // }else if((!this.state.mob || this.state.mob_sts == 0) && this.state.em && this.state.em_sts == 1){
            //     //修改账户名时，验证邮箱
            //     this.verifyMail();
            // }
          } else {
            Message.toast('昵称请设置4-20个字符，请重新设置');
          }
        } else {
          Message.toast('昵称不支持纯数字');
        }
      } else {
        Message.toast('昵称支持中文、字母、数字、“_”的组合，请重新设置');
      }
    }
  }

  // 修改账户名时，验证手机号-发送手机号验证码
  verifyPhone() {
    // let url =
    //   APP_URI + '/userinfo/sendOldMobileCode?token=' + session.get('token');
    let _this = this;
    this.showProgress(true);
    http
      .post('/member/get/mobile/code', {
        token: session.get('token'),
        sendType: 7
      })
      .then(
        res => {
          _this.showProgress(false);
          if (!res.success) {
            Message.toast(res.message);
            return;
          }
          // 发送手机验证码成功之后验证手机号
          _this.setState({ verifyPhoneShow: true });
          // Mssage 组件弹窗
          if (_this.state.verifyPhoneShow) {
            Message.confirm({
              title: '已发送验证码到您的手机',
              btnTxt: ['取消', '确认'],
              children: (
                <div className="msg3">
                  <input
                    ref={ coverPhoneCode =>
                      (this.coverPhoneCode = coverPhoneCode)
                    }
                    type="tel"
                    maxLength="6"
                  />
                </div>
              ),
              btnFn: [
                () => {
                  _this.cancle('coverPhoneCode');
                },
                () => {
                  _this.verifyPhoneHandle();
                }
              ]
            });
          }
        },
        res => {
          Message.toast(res.message);
          _this.showProgress(false);
        }
      )
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 修改昵称时 验证手机号
  verifyPhoneHandle() {
    let code = this.coverPhoneCode.value;
    let userName = this.refs.userName.value; // input 昵称
    let _this = this;
    http
      .post('/member/validate/mobile', {
        token: session.get('token'),
        code: code,
        sendType: 7 //
      })
      .then(
        res => {
          _this.coverPhoneCode.value = ''; // 清空输入框
          _this.setState({ verifyPhoneShow: false });
          // Message.alert({
          //     msg: '你确定修改昵称？',
          //     btnFn: [() => {_this.updateAccount(userName);}],
          //     children: (<p className="msg1"><em>注:昵称只能修改一次</em></p>)
          // });
          _this.setState({ isLoading: false });
          _this.updateAccount(userName);
        },
        res => {
          _this.coverPhoneCode.value = ''; // 错误的状态码清空
          Message.toast(res.message);
          _this.showProgress(false);
        }
      )
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 修改昵称时，验证邮箱-发送邮箱验证码
  verifyMail() {
    let url = App.URI + '/member/get/email/code?token=' + session.get('token');
    let _this = this;
    _this.showProgress(true);
    http
      .post('/member/get/email/code', {
        token: session.get('token'),
        sendType: 7
      })
      .then(
        res => {
          _this.showProgress(false);
          if (!res.success) {
            Message.toast(res.message);
            return;
          }
          // 发送手机验证码成功之后验证手机号
          _this.setState({ verifyMailShow: true });

          if (_this.state.verifyMailShow) {
            Message.confirm({
              title: '已发送验证码到您的邮箱',
              btnTxt: ['取消', '确认'],
              children: (
                <div className="msg3">
                  <input
                    ref={ coverMailCode =>
                      (this.refs.coverMailCode = coverMailCode)
                    }
                    type="tel"
                    maxLength="6"
                  />
                </div>
              ),
              btnFn: [
                () => {
                  _this.cancle('coverMailCode');
                },
                () => {
                  _this.verifyMailHandle();
                }
              ]
            });
          }
        },
        res => {
          _this.showProgress(false);
          Message.toast(res.message);
        }
      )
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 修改昵称时，验证邮箱
  verifyMailHandle() {
    let code = this.coverMailCode.value;
    let userName = this.refs.userName.value;
    let _this = this;

    http
      .post('/member/validate/email', {
        token: session.get('token'),
        code: code
      })
      .then(res => {
        if (!res.success) {
          Message.toast(res.message);
          return;
        }
        _this.coverMailCode.value = '';
        _this.setState({ verifyMailShow: false });
        _this.updateAccount(userName);
        // Message.alert({
        //     msg: '你确定修改昵称？',
        //     btnFn: [() => {_this.updateAccount(userName);}],
        //     children: (<p className="msg1"><em>注:昵称只能修改一次</em></p>)
        // });
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 修改昵称
  updateAccount(userName) {
    http
      .post('/member/modify/nickname', {
        token: session.get('token'),
        nickname: userName
      })
      .then(res => {
        Message.toast('修改成功！');
        Navigator.goAddr('#/user-info');
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }

  change(e) {
    console.log(this.state.nk_nm);
    // if(this.refs.userName.value == this.state.nk_nm){
    //     Message.toast("昵称不能相同");
    //     return ;
    // }
    if (
      this.refs.userName.value &&
      this.refs.userName.value != this.state.nk_nm
    ) {
      this.setState({ deleteShow: true, canModify: true });
    } else {
      this.setState({ deleteShow: false, canModify: false });
    }
  }
  blur(e) {
    let numReg = /^[0-9]*$/g;
    let spanReg = /^\S+$/gi;
    const accReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    const len = this.getFullLength(this.refs.userName.value);
    if (this.refs.userName.value) {
      // if(this.refs.userName.value == this.state.nk_nm){
      //     Message.toast("昵称不能相同");
      // }else{
      let userName = this.refs.userName.value;
      if (len >= 4 && len <= 20) {
        if (accReg.test(userName)) {
          if (!numReg.test(userName)) {
            console.log('OK2');
          } else {
            Message.toast('昵称不支持纯数字');
          }
        } else {
          Message.toast('昵称支持中文、字母、数字、“_”的组合，4-20个字符');
        }
      } else {
        Message.toast('昵称请设置4-20个字符，请重新设置');
      }
    }
    // }
  }
  goTo() {
    location.href = '#/user-info';
  }
  delete() {
    let userName = this.refs.userName;
    userName.value = '';
    this.setState({ deleteShow: false, canModify: false });
  }
  // 弹出框消失
  cancle(type) {
    if (type === 'coverPhoneCode') {
      this.coverPhoneCode.value = '';
    } else if (type === 'coverPwdCode') {
      this.coverPwdeCode.value = '';
    } else if (type === 'coverMailCode') {
      this.coverMailCode.value = '';
    }
    this.setState({
      verifyPwdShow: false,
      verifyPhoneShow: false,
      verifyMailShow: false
    });
  }

  render() {
    let { isLoading } = this.state;
    let loadStyle;
    if (!isLoading) {
      loadStyle = { visibility: 'hidden' };
    }
    return (
      <div className="pt-Headers yc-mun modify-user-name">
        <Header title="修改昵称" />
        <section className="sf-section">
          <div className="sf-item">
            <span>昵称</span>
            <input
              ref="userName"
              className="ipt"
              type="text"
              minLength="4"
              maxLength="20"
              onBlur={ event => this.blur(event) }
              onChange={ this.change.bind(this) }
            />
            <i
              className={ this.state.deleteShow ? 'icon-delete' : '' }
              onClick={ this.delete.bind(this) }
            />
          </div>
        </section>
        <button
          className={
            !isLoading && this.state.canModify ? 'btn-blue' : 'btn-grey'
          }
          onClick={ event => this.confirm(event) }
        >
          确认
        </button>
        <p className="p-desc">昵称填写须知：</p>
        <p className="p-desc">
          1. 昵称支持中文、字母、数字、“_”的组合，4-20个字符
        </p>
        <p className="p-desc">
          2. 与2N彩票业务或品牌冲突等的账号名，本网站将有可能收回
        </p>
        <p className="p-desc">3. 昵称只能修改一次</p>
      </div>
    );
  }
}
