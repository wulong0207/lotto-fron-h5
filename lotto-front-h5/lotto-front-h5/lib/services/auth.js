import session from './session';

const USER_AUTH_TOKEN_KEY = 'token';
const USER_AUTH_USER_DATA_KEY = 'userInfo';

export function isLogin() {
  return Boolean(session.get(USER_AUTH_TOKEN_KEY));
}

export function getToken() {
  return session.get(USER_AUTH_TOKEN_KEY);
}

export function logout() {
  session.clear(USER_AUTH_TOKEN_KEY);
}

export function getUser() {
  if (!isLogin()) return null;
  return session.get(USER_AUTH_USER_DATA_KEY);
}

export function goLogin() {
  const next = isInLoginPage() ? '/sc.html' : window.location.href;
  return window.location.replace(
    '/account.html#/login?next=' + encodeURIComponent(next)
  );
}

function isInLoginPage() {
  if (window.location.pathname !== '/account.html') return false;
  if (!/^#\/login(\w)*/.test(window.location.hash)) return false;
  return true;
}

export function isLoginedUser(userId) {
  if (!isLogin()) return false;
  const user = getUser();
  return parseInt(userId) === user.u_id;
}
