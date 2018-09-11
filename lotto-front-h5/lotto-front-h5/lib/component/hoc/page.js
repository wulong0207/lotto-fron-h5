import React from 'react';
import Header from '../header';
import { isLogin, goLogin } from '../../services/auth';

const defaultBackAction = () => window.history.go(-1);

export default function create(
  title = '抄单',
  showBack = true,
  backAction = defaultBackAction,
  loginRequired = false,
  className='header'
) {
  return function(WrapperComponent) {
    return function Page(props) {
      if (loginRequired && !isLogin()) {
        goLogin();
        return <div />;
      }
      return (
        <div className="copy-page">
          <Header title={ title } isback={ showBack } className={ className }
            back={ backAction } />
          <WrapperComponent { ...props } />
        </div>
      );
    };
  };
}
