// fetch请求封装
import URLSearchParams from 'url-search-params'
import saveRouter from '../common/saveRouter'
import { toastShort } from '../widget/Toast'
import { NavigationActions } from 'react-navigation';
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
obj2String = (obj, arr = [], idx = 0) => {
	for (let item in obj) {
		arr[idx++] = [item, obj[item]]
	}
	return new URLSearchParams(arr).toString()
}

/**
 * 真正的请求
 * @param url 请求地址
 * @param method 请求方式
 * @param options 请求参数
 * @param heades 请求的头部
 */
commonFetch = (navigation, url, method = 'GET', options, headers) => {
	let initObj = {}
	if (!headers) {
		headers = new Headers({
			'Authorization': global.user.Authorization
		})
	}
	// console.log(global.user.Authorization)
	if (method === 'POST') {
		initObj = {
			method: method,
			credentials: 'include',
			headers: headers,
			body: options
		}

	} else {
		// 拼接url
		if (options) {
			const searchStr = obj2String(options)
			url += '?' + searchStr
		}
		initObj = {
			method: method,
			headers: headers,
			credentials: 'include'
		}
	}
	return new Promise((resolve, reject) => {
		fetch(url, initObj)
			.then((res) => {
				// console.log(res)
				const code = JSON.parse(res._bodyInit).code || null;
				if (code == 10002 || code == 10019 || code == 10020) {
					// 10002/10019/10020均视为登陆过期，需要重新登陆
					// 删除缓存中的登录信息
					storage.remove({
						key: 'loginInfo'
					});
					global.user = {
						loginState: false,//登录状态 
						Authorization: '' // 接口请求头部签名
					}
					saveRouter.remove(); // 清楚之前保存的页面
					reject(res)
					// 跳转登录页面
					if (global.jumpNum > 0) {
						const resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Login' })]
						});
						navigation.dispatch(resetAction);
						global.jumpNum = 0;
						clearInterval(global.timeID); // 清楚定时器
					}
				} else {
					// 返回请求结果
					resolve(res)
				}
			}).catch((err) => {
				console.log(err)
				toastShort('网络连接失败，请稍候重试～')
			})
	})
}

let Request = {}
/**
* POST请求
* @param navigation 组件的navigation
* @param url 请求地址
* @param options 请求参数
* @param options 请求头部
*/
Request.post = (navigation, url, options, headers) => {
	return commonFetch(navigation, url, 'POST', options, headers)
}
/**
* GET请求
* @param navigation 组件的navigation
* @param url 请求地址
* @param options 请求参数
* @param options 请求头部
*/
Request.get = (navigation, url, options, headers) => {
	return commonFetch(navigation, url, 'GET', options, headers)
}
/**
* PUT请求
* @param navigation 组件的navigation
* @param url 请求地址
* @param options 请求参数
* @param options 请求头部
*/
Request.put = (navigation, url, options, headers) => {
	return commonFetch(navigation, url, 'PUT', options, headers)
}

export default Request
