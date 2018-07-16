// 存储全局变量
import './storageUtil'
//用户登录数据 
global.user = {
	loginState: false,//登录状态 
	Authorization: '' // 接口请求头部签名
};

global.amapkey = '7a7ee1202f7116d02d3c5a30b62aa076'; // 高德地图key
global.token = ''; // 设备token
global.jumpNum = 1; // 跳转到Login页面的次数
global.timeID = ''; // 全局定时器
global.msgIsClicked = false; // 信鸽推送过来的消息是否被点击

function initdata(callback) {
	global.storage.load({
		key: 'loginInfo',
		autoSync: true,
		syncInBackground: true
	}).then(ret => {
		global.user = ret
		callback(1)
	}).catch(err => {
		global.user = {
			loginState: false,//登录状态 
			Authorization: '' // 接口请求头部签名
		};
		callback(2)
	})
}

module.exports = {
	initData: initdata
}

