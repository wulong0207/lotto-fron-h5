/*
 * @Author: yubei
 * @Date: 2017-08-01 15:27:07
 * Desc: 获取 渠道，平台，代理编码等信息
 */

import storage from '../services/storage';
import { getParameter, browser } from './utils';
import appConfig from '../../config';

// channelId 渠道ID 2、本站PC；4、本站android；5、本站IOS；6、本站WAP；7、未知渠道；运营渠道移动端比较清楚
// clientType 客户端类型	1：Web; 2：Wap；3：Android；4：IOS；5：其他。这个字段主要是针对H5的。
// platform 注册平台 1.web, 2.wap, 3.android, 4.ios
// 如果android和IOS的支付都是跳转到H5，此参数应该传对应的android和ios的编码

// 获取渠道，客户端信息，代理编码等
export function getSpread() {
  let channelId = getChannelId();
  let clientType = getClientType().clientType;
  let platform = getClientType().platform;

  let agentCode = getAgentCode();
  return Object.assign(channelId, { clientType }, { platform }, agentCode);
}

// 获取渠道
export function getChannelId() {
  let channelId =
    getParameter('channelId') ||
    storage.get('channelId') ||
    appConfig.channelId;
  if (storage.get('channelId') !== channelId) {
    storage.set('channelId', channelId);
  }
  return { channelId };
}

// 获取客户端信息
export function getClientType() {
  let clientType = appConfig.platform; // wap
  if (browser.mobile) {
    clientType = 2; // wap
  }
  if (browser.yicaiApp && browser.android) {
    clientType = 3; // android
  }
  if (browser.yicaiApp && browser.ios) {
    clientType = 4; // ios
  }
  return { clientType, platform: clientType };
}

// 获取代理编码
export function getAgentCode() {
  let agentCode = getParameter('agentCode') || storage.get('agentCode') || '';
  if (agentCode !== '') {
    if (storage.get('agentCode') !== agentCode) {
      storage.set('agentCode', agentCode);
    }
  } else {
    return {};
  }
  return { agentCode };
}
