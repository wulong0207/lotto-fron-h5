import Cookies from 'js-cookie';

class Storage {
  constructor () {
    this.isLocalStorageEnabled = isLocalStorageEnabled();
  }

  get (key) {
    let value;
    if (this.isLocalStorageEnabled) {
      value = window.localStorage.getItem(key);
    } else {
      value = Cookies.get(key);
    }
    if (!value) return null;
    try {
      value = JSON.parse(value);
    } catch (e) {}
    return value;
  }

  set (key, value) {
    if (this.isLocalStorageEnabled) {
      if (typeof value === 'undefined') return undefined;
      if (typeof value === 'number' || typeof value === 'string') {
        window.localStorage.setItem(key, value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } else {
      if (typeof value === 'undefined') return undefined;
      if (JSON.stringify(value).length > 4000) {
        throw new Error('due to localstorage unavailable, we have to save data to cookie, but the data is too large(bigger than 4000 bytes), cannot save it into cookie');
      }
      if (typeof value === 'number' || typeof value === 'string') {
        Cookies.set(key, value);
      } else {
        Cookies.set(key, JSON.stringify(value));
      }
    }
  }

  clear (key) {
    if (this.isLocalStorageEnabled) {
      window.localStorage.removeItem(key);
    } else {
      Cookies.remove(key);
    }
  }
}

// 用于判断是否支持 sessionStrage, 在 safari 隐身模式下不支持 sessionStorage 和 localstorage
function isLocalStorageEnabled() {
  try {
    window.localStorage.setItem('__testItem__', '_test');
    window.localStorage.removeItem('__testItem__');
    return true;
  } catch (e) {
    return false;
  }
}

export default new Storage();
