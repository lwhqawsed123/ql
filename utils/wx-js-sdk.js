var wx = require('jweixin-module')
import request from "../api/api.js"

 const ready=(url,callback)=> {
	//获取微信公众号的配置
	request.get({
		url: 'wx/mp/createSign',
		params: {
			url: url
		},
		callback: res => {
			var s = JSON.parse(res.data);
			console.log(s.data);
			
	// 		wx.config({
	// 			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	// 			appId: s.data.appId, // 必填，公众号的唯一标识
	// 			timestamp: s.data.timestamp, // 必填，生成签名的时间戳
	// 			nonceStr: s.data.nonceStr, // 必填，生成签名的随机串
	// 			signature: s.data.signature.toLowerCase(), // 必填，签名，见附录1
	// 			jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
	// 				'onMenuShareQZone'
	// 			]
	// 		});
	
	// 		wx.ready(function() {
	// 			callback()
	// 		});
		},
		fail: err => {
			console.log('request fail', err);
		}
	});
}

export default {
  install(Vue) {
    Vue.prototype.$wxReady = {
      ready
    }
  }
}