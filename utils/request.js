import constant from './constant.js'
import {API_HOST} from "../api/config";
export default {
	port: API_HOST, //全局域名
	//全局提示
	myToast(massage) {
		uni.showToast({
			title: massage,
			icon: 'none',
			mask: true
		})
	},
	//检测token是否过期如果过期则重新登录
	checkToken() {
		var that = this;
		uni.request({
			url: port + '',
			method: "POST",
			data: 'Bearer ' + that.getToken(),
			success(res) {
				console.log("登录鉴权->过期检查", res)
				if (res.data.meta.success) {
					if (res.data.data) { //过期了
						//删除token
						uni.removeStorage({
							key: constant.token,
							success: function(res) {
								//重新登录
								that.init()
							}
						});
					}
				}
			},
			fail(err) {
				console.log("登录鉴权->过期检查err:", err)
			}
		})
	},
	/**post
	 * @param {Object} method	GET POST PUT DELETE
	 * @param {Object} setting	包括了请求的参数路径回调等....
	 * 							noLoading 是否显示loading状态,不填写则默认为有loading框;noLoading:true 代表没有loading框;
	 * 							logBefore 请求接口的中文名 比如 logBefore:'获取用户信息'
	 * 							url 请求的url
	 * 							params 请求的参数
	 * 							callback 请求成功的回调方法
	 * 							error 请求失败的回调方法
	 * 							complete 请求成功或者失败都要执行的方法
	 */
	axios(setting) {
		var that = this;
		if (!setting.noLoading) {
			uni.showLoading()
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: that.port + setting.url,
				method: setting.method||'get',
				data: setting.params,
				header: {
					'Authorization': 'Bearer ' + that.getToken(),
					'contentType': setting.contentType || 'application/json'
				},
				success(res) {
					resolve(res.data)
				},
				fail(err) {
					if (setting.err) {
						reject(err)
					} else {
						that.error(err.errMsg)
					}
				},
				complete(v) {
					if (!setting.noLoading) {
						uni.hideLoading()
					}
					if (setting.complete) {
						setting.complete();
					}
				}
			});
		})
	},
	//修改
	put(setting) {
		this.myRequest('PUT', setting);
	},
	//get请求
	get(setting) {
		this.myRequest('GET', setting);
	},
	//post 请求
	post(setting) {
		this.myRequest('POST', setting);
	},
	//删除请求
	delete(setting) {
		this.myRequest('DELETE', setting);
	},
	//获取token
	getToken() {
		const tokenInfo = uni.getStorageSync(constant.token);
		if (tokenInfo) {
			let time = new Date().getTime(); //得到毫秒数
			if (time - tokenInfo.startTime <= 23.9 * 1000 * 69 * 60) { //token的有效期为24个小时
				return tokenInfo.token
			}
		}
		return '';
	},
	getUrlPrams(key) {
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
		var context = "";
		if (r != null) {
			context = r[2];
		}
		return context;
	}
}
