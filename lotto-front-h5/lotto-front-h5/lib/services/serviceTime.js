/*
* @Author: liaozhityuan
* @Date:   2017-12-08 18:56:13
* @Last Modified by:   liaozhityuan
* @Last Modified time: 2017-12-08 19:04:06
*/
import storage from './storage';

const SERVICE_TIME_KEY = 'SERVICE_TIME_KEY';

export function getServiceTime() {
	return storage.get('SERVICE_TIME_KEY')
}

export function setServiceTime(timestamp) {
	if (typeof timestamp !== 'number') return undefined;
	return storage.set(SERVICE_TIME_KEY, timestamp)
}