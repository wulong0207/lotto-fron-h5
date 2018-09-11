import buildConfig from '../../scripts/config';

export const CLIENT_CODE = 'h5';

// 前缀
export const PREFIX_PATH = `/lotto/${CLIENT_CODE}`;

// 协议 http 或 https
export const PROTOCOL = process.env.RUNTIME_ENV === 'dev' ? 'http' : 'https';

// 端口
export const PORT = process.env.RUNTIME_ENV === 'dev' ? buildConfig.port : 80;

// IP 地址
export const HOST = window.location.hostname;

// 请求 URL
export const API_URL = `${PROTOCOL}://${HOST}${PORT !== 80
  ? ':' + PORT
  : ''}${PREFIX_PATH}`;

export default API_URL;
