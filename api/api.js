import constant from '../utils/constant.js'
import wx from '../utils/jsWeiXin.js'
import {API_HOST, RES_HOST, UPLOAD_URL} from "./config";
export default {
	port: API_HOST, //全局域名
	//全局提示
	// myToast(massage) {
	// 	uni.showToast({
	// 		title: massage,
	// 		icon: 'none',
	// 		mask: true
	// 	})
	// 	},
	//全局提示
	myToast(massage) {
		uni.showToast({
			title: massage,
			icon: 'none',
			mask: true
		})
	},
	//检测token是否过期如果过期则重新登录
	checkToken(setting) {
		var that = this;
		let token = that.getToken()
		if (!token) {
			that.init()
		} else {
			uni.request({
				url: that.port + 'passport/expire',
				method: "POST",
				data: 'Bearer ' + that.getToken(),
				success(res) {
					// console.log("登录鉴权->过期检查", res)
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
						} else {
							callback()
						}
					}
				},
				fail(err) {
					console.log("登录鉴权->过期检查err:", err)
				}
			})
		}
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
	myRequest(method, setting) {
		var that = this;
		if (!setting.noLoading) {
			uni.showLoading()
		}
		let token = that.getToken()
		if (!token) {
			if (setting &&
				(setting.logBefore != "微信公众号对接->微信用户授权登录" &&
					setting.logBefore != '学习成长->内容资源管理->综合查询' &&
					setting.logBefore != '学习成长->用户下载管理->按用户查询')
			) {
				that.init()
			} else if (process.env.NODE_ENV === 'development') {
				uni.showModal({
					content: 'TOKEN已过期,需要重新设置',
					showCancel: false
				});
				// that.init()	// 清除完TOKEN之后去掉注释执行一次
			}
		}
		// console.log(setting.logBefore + "请求参数:", JSON.stringify(setting)) // 打印请求参数
		uni.request({
			url: that.port + setting.url,
			method: method,
			data: setting.params,
			header: {
				'Authorization': 'Bearer ' + that.getToken(),
				'contentType': setting.contentType || 'application/json'
			},
			success(res) {
				// console.log(method + " 接口返回:" + setting.logBefore, JSON.stringify(res.data)) // 打印返回数据
				setting.callback(res.data);
			},
			fail(err) {
				console.log(setting.logBefore + "err", JSON.stringify(err)) // 打印错误信息
				if (setting.err) {
					setting.error(err.errMsg)
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
	},
	//修改
	put(setting) {
		// this.checkToken(() => {
		// 	this.myRequest('PUT', setting)
		// })
		this.myRequest('PUT', setting);
	},
	//get请求
	get(setting) {
		// this.checkToken(() => {
		// 	this.myRequest('GET', setting)
		// }, setting)
		this.myRequest('GET', setting);
	},
	//post 请求
	post(setting) {
		// this.checkToken(() => {
		// 	this.myRequest('POST', setting)
		// })
		this.myRequest('POST', setting);
	},
	//删除请求
	delete(setting) {
		// this.checkToken(() => {
		// 	this.myRequest('DELETE', setting)
		// })
		this.myRequest('DELETE', setting);
	},
	//获取token
	getToken() {
		const tokenInfo = uni.getStorageSync(constant.token);
		// console.log("获取token",tokenInfo)
		if (tokenInfo) {
			let time = new Date().getTime(); //得到毫秒数
			if (time - tokenInfo.startTime <= 23.9 * 1000 * 69 * 60) { //token的有效期为24个小时
				return tokenInfo.token
			} else {
				uni.removeStorageSync(constant.token)
				return ""
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
	},
	//微信授权登录通用方法
	init(setting) {
		var that = this;
		if (process.env.NODE_ENV === 'development') {
			console.log("登录")
			var res = {
				"meta": {
					"success": true,
					"message": "OK"
				},
				"data": {
					"user": {
						address: null,
						avatar: "http://thirdwx.qlogo.cn/mmopen/vi_32/mXjxRicmKncZtnUicicyiarNYyC8ibMOHc6o6YSicnicXHtTbyD2dgWx74Er4lnicwVDiavzg0VxHd7bX5gm7GewGH2ZApQ/132",
						birthday: null,
						city: "深圳",
						company: {
							createTime: "2019-12-22T10:33:20.000+0000",
							description: "安然齐力",
							id: 1,
							licUser: 0,
							mpAppId: null,
							mpAppSecret: null,
							mpEncodeKey: null,
							mpToken: null,
							name: "安然齐力",
							payApiKey: null,
							payMchId: null,
							payProduct: null,
							paySecret: null,
							paySecretPwd: null,
							qrCode: null,
							status: 1
						},
						createTime: "2020-02-02T05:43:48.000+0000",
						email: null,
						id: 11,
						mobile: null,
						name: null,
						nickName: "hu",
						openId: "osi6It_5s9-GdsyXoKSjZfKKZkVk",
						qrCode: null,
						sex: 1,
						status: 1,
						title: null,
						type: 0,
						unionId: null
					},
					"token": "eyJhbGciOiJIUzI1NiJ9.eyJzZWNyZXQiOiJvc2k2SXRfUkVDdEtjNkN1UWNGVzZBUmJjUTdrIiwiZXhwIjoxNTgzMjUxMDM2LCJpYXQiOjE1ODMxNjQ2MzYsInVzZXJuYW1lIjoiOSJ9.iiQ-PRWdCS9jn9CoyOGjvX-u6UQufPIuzECUN6T8CPY"
				}
			}

			if (res.meta.success) {
				//存储接口调用凭证
				uni.setStorageSync(constant.token, {
					startTime: new Date().getTime(), //token的生效时间
					token: res.data.token
				});
				//存储用户信息
				uni.setStorageSync(constant.userInfo, res.data.user);
			} else {
				this.myToast(res.meta.message)
			}
			//存在回调方法则执行方法
			if (setting && setting.callback && typeof setting.callback == 'function') {
				setting.callback()
			}
		} else {
			console.log(this.getToken())
			if (!this.getToken()) {
				// console.log("url", window.location.href)
				let code = that.getUrlPrams('code');
				console.log("code===", code)
				if (code) {
					var requestSetting_ = {
						logBefore: '微信公众号对接->微信用户授权登录',
						url: 'wx/mp/authLogin/' + code + '/1',
						callback: function(res) {
							if (res.meta.success) {
								uni.setStorageSync(constant.token, {
									startTime: new Date().getTime(),
									token: res.data.token
								});
								//存储用户信息
								uni.setStorageSync(constant.userInfo, res.data.user);
								//存在回调方法则执行方法
								if (setting && setting.callback && typeof setting.callback == 'function') {
									setting.callback()
								}
							} else {
								that.myToast(res.meta.message)
							}
						}
					}
					that.get(requestSetting_)
				} else {
					console.log("没有code")
					var appid = 'wxa9ba54f89a59f741'; //自己公众号的appid
					var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' +
						encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
					window.location.href = url;
				}
			} else {
				//存在回调方法则执行方法
				if (setting && setting.callback && typeof setting.callback == 'function') {
					setting.callback()
				}
			}
		}
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
	// 初始化js-sdk
	sdkReady(setting) {
		var that = this;
		// console.log("=====原url=======")
		// console.log(window.location.href)
		let href = window.location.href.split('#')[0]
		// console.log("href是: "+href)
		let user = uni.getStorageSync(constant.userInfo);
		let shareHref = `${href}?shareId=${user.id}`
		that.get({
			url: 'wx/mp/createSign',
			params: {
				url: setting && setting.url || href
			},
			callback: res => {
				let {
					meta,
					data
				} = res
				let jsApiList = ''
				if (setting && setting.jsApiList) {
					jsApiList = setting.jsApiList
				}
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature.toLowerCase(), // 必填，签名，见附录1
					jsApiList: jsApiList || ['updateAppMessageShareData', 'updateTimelineShareData']
				});
				wx.ready(function() {
					wx.updateAppMessageShareData({
						title: "安然齐力", // 分享标题
						desc: "安然齐力公众号", // 分享描述
						link: shareHref, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: RES_HOST+'/img/PQP821NE-二维码默认占位@3x.jpg', // 分享图标
						success: function() {
							// 设置成功
						}
					});
					wx.updateTimelineShareData({
						title: "安然齐力", // 分享标题
						link: shareHref, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: RES_HOST+'/img/PQP821NE-二维码默认占位@3x.jpg', // 分享图标
						success: function() {
							// 设置成功
						}
					})
					//存在回调方法则执行方法
					if (setting && setting.ready && typeof setting.ready == 'function') {
						setting.ready();
					}
				})
			}
		})
	},
	/**
	 * @param {Object} setting	包括了请求的参数回调等....
	 * 							count 照片单选或者多选
	 * 							sizeType 压缩或者原图
	 * 							sourceType 拍照或者选择照片
	 * 							type 存储的类型
	 * 							callback 请求成功的回调方法
	 */
	// 上传图片
	chooseImage(setting) {
		uni.chooseImage({
			count: setting.count || 1,
			sizeType: setting.sizeType || ['compressed '],
			sourceType: setting.sourceType || ["camera", "album"],
			success: res => {
				let fileImg = res.tempFiles[0]
				// let size2M=fileImg.size/1024/1024<this.fileMax
				// console.log(size2M)
				// if(!size2M){
				// 	uni.showToast({title:`图片大小不能超过${this.fileMax}M!`, icon:"none"});
				// 	return
				// }
				// 上传到服务器
				uni.uploadFile({
					url: UPLOAD_URL,
					filePath: res.tempFilePaths[0],
					name: 'file',
					header: {
						'Authorization': 'Bearer ' + this.getToken()
					},
					formData: {
						'type': setting.type || 'img'
					},
					success: (uploadFileRes) => {
						let uploadFile = JSON.parse(uploadFileRes.data)
						let {
							data,
							meta
						} = uploadFile
						if (meta.success) {
							setting.callback(data)
						} else {
							console.log(res)
						}
					}
				});
			}
		});
	},
}
