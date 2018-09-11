import session from '../services/session';

export default {

  login (userName, password) {
    if (!userName.trim()) {
      return Promise.reject(new Error('user name required'));
    }
    if (!password.trim()) {
      return Promise.reject(new Error('password required'));
    }
    return new Promise((resolve, reject) => {

    });
  },

  getUser () {
    return session.get('userInfo');
  },

  getToken () {
    return session.get('token');
  },

  logout (redirect=true) {
    session.clear('userInfo');
    session.clear('token');
    if (redirect) location.href = '/login';
  },

  isLoign() {
    if (this.getUser() && this.getToken()) return true;
    return false;
  }

}