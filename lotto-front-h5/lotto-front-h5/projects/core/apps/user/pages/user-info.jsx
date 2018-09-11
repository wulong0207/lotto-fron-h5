/**
 * Created by manaster
 * date 2017-03-09
 * desc:个人中心模块--个人资料子模块
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import session from '@/services/session'; // 工具包
import Reg from '@/utils/reg'; // 工具包
// import App from '../../../app';
import http from '@/utils/request';
import Navigator from '@/utils/navigator';
// import "../../../scss/user/component/user-info.scss";
import Message from '@/services/message';
import Header from '@/component/header';

import '../css/user-info.scss';

export default class SelfInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {} // 用户信息
    };
  }
  componentDidMount() {
    this.getUserInfo();
  }
  getUserInfo() {
    let _this = this;
    http
      .post('/member/info', {
        token: session.get('token')
      })
      .then(res => {
        this.setState({ userInfo: res.data || {} });
        session.set('userInfo', res.data);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  }
  // 判断是否修改一次 修改直接弹窗
  handleModify(id) {
    console.log(id);
    console.log(this.state.userInfo);
    let { is_upd } = this.state.userInfo;
    let _ = this.state.userInfo;
    switch (is_upd) {
      case 0: // 都未修改
        if (id === 1) {
          if (_.mob_sts == '') {
            Message.toast('请先验证手机号再进行个人信息的修改');
            Navigator.goAddr('#/register-phone');
          } else {
            Navigator.goAddr('#/modify-nick-name');
          }
        } else {
          if (_.mob_sts == '') {
            Message.toast('请先验证手机号再进行个人信息的修改');
            Navigator.goAddr('#/register-phone');
          } else {
            Navigator.goAddr('#/modify-user-name');
          }
        }
        break;
      case 1: // 修改账户名
        if (id === 1) {
          if (_.mob_sts == '') {
            Message.toast('请先验证手机号再进行个人信息的修改');
            Navigator.goAddr('#/register-phone');
          } else {
            Navigator.goAddr('#/modify-nick-name');
          }
        } else {
          Message.toast('用户名只能修改一次');
        }
        break;
      case 2: // 修改昵称
        if (id === 1) {
          Message.toast('昵称只能修改一次');
        } else {
          if (_.mob_sts == '') {
            Message.toast('请先验证手机号再进行个人信息的修改');
            Navigator.goAddr('#/register-phone');
          } else {
            Navigator.goAddr('#/modify-user-name');
          }
        }
        break;
      case 3: // 都已修改
        Message.toast('用户名、昵称都已修改过一次了');
        break;
      default:
        break;
    }
  }

  getPhoneText(userInfo) {
    return userInfo.mob
      ? userInfo.mob_sts
        ? Reg.phoneNumberHide(userInfo.mob)
        : '未验证 ' + Reg.phoneNumberHide(userInfo.mob)
      : '90%的用户选择绑定手机来保护账户安全';
  }
  getMailText(userInfo) {
    return userInfo.em
      ? userInfo.em_sts
        ? Reg.mailHide(userInfo.em)
        : '未验证 ' + Reg.mailHide(userInfo.em)
      : '密码找回，大奖通知等服务';
  }
  getRealnameText(userInfo) {
    return userInfo.re_nm && userInfo.id_c
      ? Reg.nameHide(userInfo.re_nm) + ' ' + Reg.idcardHide(userInfo.id_c)
      : '实名认证是领大奖和提款的唯一凭证';
  }
  toRegisterPhone() {
    let { userInfo } = this.state;
    if (userInfo.mob) {
      Navigator.goAddr(
        '#/phone-info/' +
          userInfo.mob +
          '/' +
          userInfo.mob_log +
          '/' +
          userInfo.mob_sts
      );
    } else {
      Navigator.goAddr('#/register-phone');
    }
  }
  toRegisterMail() {
    let { userInfo } = this.state;
    // userInfo.em = "897967662@qq.com";
    if (userInfo.em) {
      Navigator.goAddr(
        '#/mail-info/' +
          encodeURI(userInfo.em) +
          '/' +
          userInfo.em_log +
          '/' +
          userInfo.em_sts
      );
    } else {
      Navigator.goAddr('#/register-mail');
    }
  }
  toRealName() {
    let { userInfo } = this.state;
    userInfo.re_nm && userInfo.id_c ? null : Navigator.goAddr('#/real-name');
  }
  /* 更换头像 
  fileSelected() {
    debugger;
    let oFile = this.refs.oFile.files[0]; // 读取文件
    let rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    let iMaxFilesize = 2097152; // 2M
    if (!rFilter.test(oFile.type)) {
      Message.toast('文件格式必须为图片');
      return;
    }
    if (oFile.size > iMaxFilesize) {
      Message.toast('图片大小不能超过2M');
      return;
    }
    let reader = new FileReader(); // 声明一个FileReader实例
    reader.readAsDataURL(oFile); // 调用readAsDataURL方法来读取选中的图像文件
    reader.onload = function(e) {
      aaa.innerHTML = '<img src="' + this.result + '" alt=""/>';
    };
    http
      .post('/member/uploadHeadPortrait', {
        token: session.get('token'),
        file: formData
      })
      .then(res => {
        Message.toast(result.message);
      })
      .catch(err => {
        Message.toast(err.message);
      });
  } */

  submitImg() {
    let self = this;
    // let url = App.URI + '/h5/userinfo/uploadHeadPortrait';
    let url = '/lotto/h5/v1.0/member/upload/headPortrait';
    var oData = new FormData(document.forms.namedItem('form'));
    console.log(oData, 'oData');
    if (this.refs.file.files[0].size > 1048576) {
      Message.toast('图片大小不能超过1M');
      return false;
    } else {
      console.log(this.refs.file.files[0].size);
    }
    http
      .post('/member/upload/headPortrait', oData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res);
        this.getUserInfo();
      });
    return false;
  }
  render() {
    console.log('最终数据：', this.state);
    let { userInfo } = this.state;
    // userInfo.hd_url = "https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=437161406,3838120455&fm=58";
    // let url = App.URI + '/h5/userinfo/uploadHeadPortrait';
    let url = '/h5/userinfo/uploadHeadPortrait';
    return (
      <div className="pt-header yc-si user-info">
        {/* <Header title="个人资料" back={()=>{ location.href = '/sc.html#/' }}/> */}
        <Header title="个人资料" />
        <section className="sf-section">
          <form
            name="form"
            className="upload"
            method="post"
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="token"
              defaultValue={ session.get('token') }
            />
            <input
              ref="file"
              className="file"
              type="file"
              name="file"
              onChange={ this.submitImg.bind(this) }
            />
          </form>
          <div className="sf-item align-items">
            <div className="flex al tx">头像</div>
            {userInfo.hd_url ? (
              <img className="custom margin" src={ userInfo.hd_url }
                alt="头像" />
            ) : (
              <div className="icon-head-normal" />
            )}
            <div className="icon-arrow-r" />
          </div>

          <div className="sf-item" onClick={ this.handleModify.bind(this, 1) }>
            <span>昵称</span>
            <div className="flex ar gray">{userInfo.nk_nm}</div>
            <div className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.handleModify.bind(this, 2) }>
            <span>用户名</span>
            <div className="flex ar gray">{userInfo.acc}</div>
            <div className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.toRegisterPhone.bind(this) }>
            <span>手机号码</span>
            <div className="flex ar gray">{this.getPhoneText(userInfo)}</div>
            <div className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.toRegisterMail.bind(this) }>
            <span>邮箱地址</span>
            <div className="flex ar gray">{this.getMailText(userInfo)}</div>
            <div className="icon-arrow-r" />
          </div>
          <div className="sf-item" onClick={ this.toRealName.bind(this) }>
            <span>身份认证</span>
            <div className="flex ar gray">{this.getRealnameText(userInfo)}</div>
            <div className="icon-arrow-r" />
          </div>
        </section>
        <section className="sf-section" style={ { display: 'none' } }>
          <div className="sf-item">
            <span>QQ</span>
            <em className="orange">立即绑定</em>
          </div>
          <div className="sf-item">
            <span>微信</span>
            <em className="orange">立即绑定</em>
          </div>
          <div className="sf-item">
            <span>微博</span>
            <em className="orange">立即绑定</em>
          </div>
        </section>
      </div>
    );
  }
}
