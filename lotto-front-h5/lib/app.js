/*
 * @Author: yubei
 * @Date: 2017-04-17 21:36:48
 * @Desc: app 公用函数
 */

/**
 * 开发环境
 * //192.168.74.166:8160/lotto
 *
 * RAP测试地址
 * //192.168.74.164:8189/mockjs/24
 *
 * 测试环境
 * //192.168.74.173:8160/lotto
 */

// let baseURL =
//   location.port == '8080' ? '//192.168.74.166:8160' : `//${location.host}`;

let baseURL = '//m.2ncai.com';

// start
if (process.env.RUN_ENV === 'start') {
  baseURL = '//192.168.74.166:8160';
}

// dev
if (process.env.RUN_ENV === 'dev') {
  baseURL = '//devm.2ncai.com';
}

// sit
if (process.env.RUN_ENV === 'sit') {
  baseURL = '//sitm.2ncai.com';
}

// uat
if (process.env.RUN_ENV === 'uat') {
  baseURL = '//uatm.2ncai.com';
}

// production
if (process.env.RUN_ENV === 'production') {
  baseURL = '//m.2ncai.com';
}

export default {
  URI: `${baseURL}/lotto`
};
