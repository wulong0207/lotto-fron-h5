import http from '../utils/request';
import pbkdf2 from 'pbkdf2';
import session from './session';

/**
 * 登录
 * 
 * @export login
 * @param {string} user 用户名，可以是手机号，邮箱等
 * @param {string} password 密码，可以为加密或未加密的密码
 * @param {boolean} [encrypted=false] 密码是否已加密
 * @returns Promise<res.data>
 */
export default function login(user, password, encrypted = false) {
  const encryptedPassword = encrypted ? password : pbkdf2.pbkdf2Sync(password, '2f1e131cc3009026cf8991da3fd4ac38', 50, 64).toString('hex');
  return new Promise((resolve, reject) => {
    http.post('/passport/login', {
      password: encryptedPassword,
      userName: user
    }).then(res => {
      session.set('token', res.data.tk);
      session.set('lastLoginTimeStamp', new Date().getTime());
      resolve(res);
    }).catch(reject);
  });
}
