import axios from 'axios';
import loading from '../component/loading';
import { getSpread } from './spread';
import deepAssign from './deep-assign';
import { errCode } from '../const/err-code';
import toast from '../services/toast';
import { setServiceTime } from '../services/serviceTime';
import API_URL from '../../config/api';
import appConfig from '../../config';
import bowser from 'bowser';

const instance = axios.create({
  timeout: 15000
});

class RequestError extends Error {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

instance.interceptors.request.use(
  config => {
    // if(config.method != 'get'){
    //   if(!config.data){
    //     config.data = {};
    //   }
    //   config.data = Object.assign(config.data, {'token': auth.getToken()});
    // }

    // 如果参数没传 loading，默认为显示 loading
    if (
      (typeof config.params !== 'undefined' &&
        (typeof config.params.loading === 'undefined' ||
          config.params.loading)) ||
      (typeof config.data !== 'undefined' &&
        (typeof config.data.loading === 'undefined' || config.data.loading))
    ) {
      loading.show();
    }

    const { channelId, platform } = getSpread();

    config.headers = {
      ...config.headers,
      cId: channelId,
      pId: platform,
      vId: appConfig.appVersion,
      eId: bowser.name.toLocaleLowerCase() + '_' + bowser.version
    };

    // 平台，渠道号等参数传递
    let spread = getSpread();
    if (config.method === 'get') {
      config.params = deepAssign(spread, config.params);
    }
    if (
      config.method === 'post' &&
      (!config.headers['Content-Type'] ||
        config.headers['Content-Type'].toLocaleLowerCase() ===
          'application/json;charset=utf-8')
    ) {
      config.data = deepAssign(spread, config.data);
    }

    // 若是有做鉴权token , 就给头部带上token
    // if(session.get('token')) {
    // 	config.headers.token = session.get('token');
    // }

    config.url = `${API_URL}/${config.version || appConfig.apiVersion}${
      config.url
    }`;
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    loading.hide();
    // if (/^4\d+$/.test(response.data.errorCode)) alert(response.data.message);
    let res = response.data;
    if (typeof res === 'string') {
      try {
        res = JSON.parse(res);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    if (res.serviceTime) {
      setServiceTime(res.serviceTime);
    }

    // 错误码处理
    // if (!res.success) return Promise.reject(new RequestError(response.data.message, response.data.errorCode));
    const config = response.config;
    if (!res.success) {
      let errorDispose = errCode[response.data.errorCode];
      if (errorDispose && !config.muted) {
        for (let item in errorDispose) {
          if (item === 'message') {
            toast.toast(errorDispose[item]);
          }
          if (item === 'logErr') {
            console.error(item);
          }
          if (item === 'func') {
            errorDispose[item] && errorDispose[item]();
          }
        }
        return Promise.reject(
          new RequestError(
            response.data.message,
            response.data.errorCode,
            response.data.data
          )
        );
      } else {
        return Promise.reject(
          new RequestError(
            response.data.message,
            response.data.errorCode,
            response.data.data
          )
        );
      }
    }

    return res;
  },
  error => {
    loading.hide();
    if (!error.response) {
      return Promise.reject(new RequestError('网络错误', 600));
    }
    let errorDispose = errCode[error.response.status];
    for (let item in errorDispose) {
      if (item === 'logErr') {
        console.error(item);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
