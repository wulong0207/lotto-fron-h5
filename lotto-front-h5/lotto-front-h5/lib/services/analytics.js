import axios from 'axios';
import appConfig from '../../config';
import { getSpread } from '../utils/spread';
import { getUser } from './auth';
import storage from './storage';
import uuidv4 from 'uuid/v4';

const VISITOR_UUID_KEY = 'VISITOR_UUID_KEY';

class Analytics {
  constructor() {
    const { channelId, platform } = getSpread();
    this.channelId = channelId;
    this.platform = platform;
    this.appVersion = appConfig.appVersion;
    this.userId = undefined;
    this.visitId = undefined;
    const user = getUser();
    if (user) {
      this.userId = user.uid;
    } else {
      let visitId = storage.get(VISITOR_UUID_KEY);
      if (!visitId) {
        visitId = uuidv4();
        storage.set(VISITOR_UUID_KEY, visitId);
      }
      this.visitId = visitId;
    }
    this.requestUrl = '//point.2ncai.com';
    const runTime = process.env.RUNTIME_ENV;
    if (runTime === 'dev') {
      this.requestUrl = '//devpoint.2ncai.com';
    } else if (runTime === 'sit') {
      this.requestUrl = '//sitpoint.2ncai.com';
    } else if (runTime === 'uat') {
      this.requestUrl = '//uatpoint.2ncai.com';
    }
    this.requestUrl = this.requestUrl + '/lotto-point/h5/v1.0/point';
  }

  /**
   * 发送统计数据 可以通过 send(id, url) | send(id, callback) | send(id).then() 三种方式调用
   * @param {number} id 操作行为id
   * @param {string} url 跳转 url
   * @param {function} callback 回调方法
   * @return { promise }
   */
  send() {
    let ids;
    let url;
    let callback;
    const args = Array.from(arguments);
    ids = Array.isArray(args[0]) ? args[0] : [args[0]];
    if (typeof args[1] === 'string') {
      url = args[1];
    } else if (typeof args[1] === 'function') {
      callback = args[1];
    }
    if (typeof args[2] === 'function') {
      callback = args[2];
    }
    const timestamp = new Date().getTime();
    return new Promise((resolve, reject) => {
      let data = {
        // b: this.appVersion,
        c: this.channelId,
        p: this.platform,
        bs: ids.map(id => {
          return {
            bi: id,
            t: timestamp
          };
        })
      };
      if (this.userId) {
        data = {
          ...data,
          u: this.userId
        };
      } else {
        data = {
          ...data,
          v: this.visitId
        };
      }
      axios
        .post(this.requestUrl, data, { timeout: 1000 })
        .then(res => {
          if (url) {
            return (window.location.href = url);
          } else if (callback) {
            return callback(null);
          }
          resolve();
        })
        .catch(err => {
          if (url) {
            return (window.location.href = url);
          } else if (callback) {
            return callback(err);
          }
          resolve(); // 不论请求是否成功，都需要让 promise 执行下一步
          reject(err);
        });
    });
  }
}

export default new Analytics();
