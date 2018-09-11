/*
 * @Author: yubei
 * @Date: 2017-04-17 21:32:51
 * @Desc: fetch 请求方法
 */

import App from '../app';
import Promise from 'promise';
import http from './request';

export default function Fetch(url, params, { method, mode, credentials, headers } = { method: 'post', mode: 'cors', credentials: 'include' }) {
	return new Promise((resolve, reject) => {
		if(method == "get" || method == "GET"){
			method = "get";
			let paramsArray = [];
			//encodeURIComponent
			Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
			if(paramsArray.length>0){
				if (url.search(/\?/) === -1) {
					url += '?' + paramsArray.join('&')
				} else {
					url += '&' + paramsArray.join('&')
				}
			}
		}else{
			method = "post"
		}

		// let nowTime = new Date().getTime();
		// if(url.indexOf("?")>=0){
		// 	url = url + "&timestamp=" + nowTime;
		// }else{
		// 	url = url + "?timestamp=" + nowTime;
		// }


		http[method](url, params).then(res => {
			resolve(res);
        })
        .then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				reject({ status: response.status })
			}
		})
		.then((response) => {
			resolve(response);
		})
		.catch(err => {
			reject(err);
        })
	});

};