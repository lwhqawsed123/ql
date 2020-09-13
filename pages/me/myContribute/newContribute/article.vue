<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset">
			<view class="text_and_article">
				<view class="textarea_box" @click="open">
					<view class="ql-container textarea_box_html">
						<rich-text class="ql-editor" v-if="articleDetail.html||articleDetail" :nodes="articleDetail.html||articleDetail"></rich-text>
						<span style="color:#CCCCCC;font-size: 32upx;" v-else>请输入内容...</span>
					</view>
				</view>
				<view v-if="!audio_url" class="card_img_box_left" @touchstart="startRecord" @touchend="stopRecord">
					<view class="add_article_text_add">
						+
					</view>
					<view class="add_article_text">
						长按录音
					</view>
				</view>
				<view class="myaudio" v-if="audio_url">
					<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('audio_url')"></text>
					<audio style="text-align: left;" :src="audioBaseUrl+audio_url" :name="audio.name" :action="audioAction" controls
					 class="myaudio_content"></audio>
				</view>
				<view v-if="thumbnail_url" class="card_img_box_thumbnail">
					<text class="card_img_box_thumbnail_text">缩略图:</text>
					<view class="card_img_box_view">
						<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('thumbnail_url')"></text>
						<image :src="imageBaseUrl+thumbnail_url" mode="" @click="chooseThumbnail(thumbnail_flag,'thumbnail_url')"></image>
					</view>
				</view>
				<view v-if="!thumbnail_url" class="card_img_box_left" @click="chooseThumbnail(thumbnail_flag,'thumbnail_url')">
					<view class="add_article_text_add">
						+
					</view>
					<view class="add_article_text">
						上传缩略图
					</view>
				</view>
				<view v-if="banner_url" class="card_img_box_thumbnail">
					<text class="card_img_box_thumbnail_text">文章图片:</text>
					<view class="card_img_box_view">
						<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('banner_url')"></text>
						<image :src="imageBaseUrl+banner_url" mode="" @click="chooseThumbnail(banner_flag,'banner_url')"></image>
					</view>
				</view>
				<view v-if="!banner_url" class="card_img_box_left" @click="chooseThumbnail(banner_flag,'banner_url')">
					<view class="add_article_text_add">
						+
					</view>
					<view class="add_article_text">
						上传文章图片
					</view>
				</view>
				<!-- <view v-if="banner_url.length!==0" class="card_img_box_banner">
				<view class="card_img_box_view" v-for="(item,index) in banner_url" :key="index">
					<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('banner_url',index)"></text>
					<image :src="imageBaseUrl+item" mode=""></image>
				</view>
				<view v-if="banner_url.length<3" class="card_img_box_inner" @click="chooseThumbnail(banner_flag,'banner_url')">
					<view class="add_article_text_add">
						+
					</view>
					<view class="add_article_text">
						上传图片
					</view>
				</view>
			</view>
			<view v-if="banner_url.length===0" class="card_img_box_left" @click="chooseThumbnail(banner_flag,'banner_url')">
				<view class="add_article_text_add">
					+
				</view>
				<view class="add_article_text">
					上传文章图片
				</view>
			</view> -->
			</view>
			<view class="article_type">
				<view class="article_type_text">
					文章类型
				</view>
				<view class="article_type_checkbox">
					<radio-group class="card_title_radio_box" name="type">
						<label v-for="item in video_type_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :checked="item.checked" :value="''+item.id" />
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="article_base_info">
				<view class="article_base_info_text">
					文章基本信息
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">年龄:</view>
					<radio-group class="card_title_radio_box" name="age">
						<label v-for="item in age_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :checked="item.checked" :value="''+item.id" />
							<text>{{item.dictKey}}</text>
						</label>
					</radio-group>
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">职业:</view>
					<radio-group class="card_title_radio_box" name="title">
						<label v-for="item in title_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :checked="item.checked" :value="''+item.id" />
							<text>{{item.dictKey}}</text>
						</label>
					</radio-group>
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">性别:</view>
					<radio-group class="card_title_radio_box" name="gender">
						<label v-for="item in sex_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :checked="item.checked" :value="''+item.id" />
							<text>{{item.dictValue}}</text>
						</label>
					</radio-group>
				</view>
				<view class="bottom_btn">
					<button class="from-submit" formType="submit" type="primary">发布文章</button>
				</view>
			</view>
		</form>
		<uni-popup ref="popup" type="top">
			<myeditor></myeditor>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import myeditor from './editor/editor.vue'
	import graceChecker from "../../../../utils/graceChecker.js";
	import wx from '../../../../utils/jsWeiXin.js'
	import {
		mapState
	} from "vuex"
	import {UPLOAD_URL} from "../../../../api/config";
	export default {
		components: {
			myeditor,
			uniPopup
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				audioBaseUrl: state => state.audioBaseUrl,
				user: state => state.user,
				articleDetail: state => state.articleDetail,
			})
		},
		data() {
			return {
				title: '',
				id: 6,
				contentId: '',
				fileMax: 2,
				detail: '',
				form: {
					banner: "",
					catalog: {
						company: {
							id: 1
						},
						id: 0
					},
					contentType: "AUDIO",
					detail: "",
					name: "",
					thumbnail: '',
					resources: [],
					tag: "",
					user: {
						id: null
					}
				},
				audio: {
					poster: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg',
					name: '录音',
					author: '暂无',
					src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
				},
				audioAction: {
					method: 'pause'
				},
				video_type_group: [],
				age_radio_group: [],
				sex_radio_group: [],
				title_radio_group: [],
				audio_url: '',
				thumbnail_url: '',
				thumbnail_flag: false,
				banner_url: '',
				banner_flag: false,

				rules: [{
						name: "gender",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择性别"
					},
					{
						name: "type",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择类型"
					},
					{
						name: "age",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择年龄"
					},
					{
						name: "title",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择职业"
					}
				],
				record_flag: false,
				resource: {
					redirectUrl: '',
					resFileName: '录音',
					resType: 1,
					selected: true,
					sort: 0,
					title: ""
				},
			}
		},

		onLoad(e) {
			this.title = e.title
			this.contentId = e.id
			this.getCard(e.id)
		},
		onUnload() {
			this.$store.dispatch({
				type: 'removeArticleDetail'
			})
		},
		onReady() {
			// this.getAllAudio()
			// this.getVideoType()
			this.$api.sdkReady({
				url: window.location.href.split('#')[0],
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'startRecord', 'stopRecord',
					'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice',
					'translateVoice'
				]
			})
		},
		methods: {
			// 根据id获取内容
			getCard(id) {
				if (!id) {
					this.getVideoType()
					this.getAllAudio()
					return
				}
				this.$api.get({
					url: `content/${id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							console.log("=====文章content=======")
							console.log(data)
							this.form = data
							this.title = data.name
							this.banner_url = data.banner
							this.thumbnail_url = data.thumbnail
							if(data.resources.length!==0){
								data.resources.forEach(item=>{
									if(item.resFileName){
										this.audio_url=item.resFileName
									}
								})
							}
							this.getVideoType(data)
							this.getAllAudio(data)
							if(this.$common.isJSON(data.detail)){
								data.detail= JSON.parse(data.detail)
							}
							let articleDetail = data.detail
							this.$store.dispatch({
								type: 'saveArticleDetail',
								articleDetail: articleDetail
							})
						}
					}
				})
			},
			// 提交表单
			formSubmit(e) {
				if (this.image_flag) {
					uni.showToast({
						title: "图片未上传完成!",
						icon: "none",mask:true
					});
					return
				}
				if (!this.thumbnail_url && this.banner_url.length === 0) {
					uni.showToast({
						title: "请选择图片或者录音!",
						icon: "none",mask:true
					});
					return
				}
				if (!this.articleDetail && !this.articleDetail.html) {
					uni.showToast({
						title: "内容不能未空!",
						icon: "none",mask:true
					});
					return
				}
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, this.rules);
				if (checkRes) {
					uni.showToast({
						title: "验证通过!",
						icon: "none",mask:true
					});
					let data = JSON.parse(JSON.stringify(this.form))
					data.name = this.title
					data.thumbnail = this.thumbnail_url
					data.banner = this.banner_url
					// data.banner=this.banner_url.join(",")
					data.catalog.id = +formData.type
					data.detail = JSON.stringify(this.articleDetail)
					data.tag = formData.age + "," + formData.title + "," + formData.gender
					data.user.id = this.user.id
					console.log(data)
					this.add_new_video(data)

				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none",mask:true
					});
				}
			},
			// 提交请求
			add_new_video(item) {
				this.$api.post({
					url: "content/new",
					params: item,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							this.saveAudioToResources(data.id)
						}
					}
				})
			},
			// 上传音频文件并保存到content.resources[]
			saveAudioToResources(contentId) {
				let delta=this.contentId?1:2
				if (!this.aduio_url) {
					uni.showToast({
						title: "投稿成功!",
						duration: 2000,
						mask: true
					});
					setTimeout(() => {
						uni.hideToast();
						uni.navigateBack({
							delta: delta
						});
					}, 2000)
					return
				}
				let data = JSON.parse(JSON.stringify(this.resource))
				data.redirectUrl = this.aduio_url
				data.resFileName = "录音"
				data.title = this.user.nickName
				this.$api.post({
					url: `content/resource/new?contentId=${contentId}`,
					params: data,
					callback: res => {
						let {
							data,
							meta
						} = res
						console.log(res)
						if (meta.success) {
							uni.showToast({
								title: "投稿成功!",
								duration: 2000,
								mask: true
							});
							setTimeout(() => {
								uni.hideToast();
								this.$store.dispatch({
									type: 'removeArticleDetail'
								})

								uni.navigateBack({
									delta: delta
								});
							}, 2000)
						} else {
							uni.showToast({
								title: "投稿失败,请稍后再试!",
								duration: 2000,mask:true
							});
						}
					}
				})
			},
			// 选择缩略图
			chooseThumbnail(image_flag, save_url, count) {
				console.log(image_flag)
				if (image_flag) {
					return
				}
				uni.chooseImage({
					count: count || 1,
					sourceType: ["camera", "album"],
					success: res => {
						image_flag = true
						console.log(res)
						let fileImg = res.tempFiles[0]
						// let size2M=fileImg.size/1024/1024<this.fileMax
						// console.log(size2M)
						// if(!size2M){
						// 	uni.showToast({title:`图片大小不能超过${this.fileMax}M!`, icon:"none"});
						// 	image_flag=false
						// 	return
						// }
						// 上传到服务器
						uni.uploadFile({
							url: UPLOAD_URL, //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							header: {
								'Authorization': 'Bearer ' + this.$api.getToken()
							},
							formData: {
								'type': 'img'
							},
							success: (uploadFileRes) => {
								let uploadFile = JSON.parse(uploadFileRes.data)
								let {
									data,
									meta
								} = uploadFile
								if (meta.success) {
									image_flag = false
									this[save_url] = data
									// if(save_url==="banner_url"){
									// 	this[save_url].push(data)
									// }else{
									// 	this[save_url]=data
									// }
								}
							}
						});
					}
				});
			},
			// 删除url
			removeImage(url, index) {
				this[url] = ''
				// if(url==='banner_url'){
				// 	this[url].splice(index,1)
				// }else{
				// 	this[url]=''
				// }
			},
			// 开始录音接口
			startRecord() {
				if (this.record_flag) {
					return
				}
				console.log("长按开始")
				uni.showLoading({
				    title: '请说话...',
					mask:true
				});
				wx.startRecord()
				this.record_flag = true

			},
			// 结束录音接口
			stopRecord() {
				uni.hideLoading();
				// uni.showLoading({
				//     title: '正在保存...',
				// 	mask:true
				// });
				wx.stopRecord({
					success: (res) => {
						var localId = res.localId;
						this.record_flag = false
						console.log("录音结束")
						console.log(res)
						wx.uploadVoice({
							localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: (res) => {
								console.log("上传结束")
								console.log(res)
								var serverId = res.serverId; // 返回音频的服务器端ID
								this.uploadAudio(serverId)
							}
						})
					},
					fail: err => {
						this.record_flag = false
						uni.hideLoading();
						console.log(err)
					}
				})
			},
			// 上传音频文件
			uploadAudio(serverId) {
				let data = {
					mediaId: serverId,
					type: 'audio'
				}
				this.$api.get({
					url: "wx/mp/media",
					params: data,
					// noLoading:true,
					callback: res => {
						console.log("保存到服务器结束")
						console.log(res)
						this.detail = res
						this.audio_url = res.data
						uni.hideLoading();
					},
					err: res => {
						uni.hideLoading();
						uni.showToast({
							title: res,
							icon: "none",mask:true
						});
					}
				})
			},
			// 获取单选框组
			getAllAudio(content) {
				this.$api.get({
					url: 'biz/setting/all',
					callback: res => {
						if (res.meta.success) {
							let data = res.data
							this.setRadioArray(data,content)
						}
					}
				})
			},
			// 遍历单选框组
			setRadioArray(data,content) {
				let age_radio_group = [];
				let sex_radio_group = [];
				let title_radio_group = [];
				if (data.length != 0) {
					data.forEach(item => {
						this.$set(item, "checked", false)
						if (content && content.tag) {
							let tag = content.tag.split(",")
							if (tag.length !== 0) {
								tag.forEach(list => {
									if (item.id == list) {
										this.$set(item, "checked", true)
									}
								})
							}
						}
						if (item.dictType == 'AGE') {
							age_radio_group.push(item);
						} else if (item.dictType == 'TITLE') {
							title_radio_group.push(item);
						} else if (item.dictType == 'SEX') {
							sex_radio_group.push(item);
						}
					});
					this.age_radio_group = age_radio_group;
					this.sex_radio_group = sex_radio_group;
					this.title_radio_group = title_radio_group;
				}
			},
			// 获取视频类型
			getVideoType(content) {
				this.$api.get({
					url: 'content/catalog/identify',
					params: {
						companyId: 1,
						name: 'JKML-WZ'
					},
					callback: res => {
						if (res.meta.success) {
							if (res.data[0].id) {
								this.$api.get({
									url: `content/catalog/parent/${res.data[0].id}`,
									callback: res => {
										let {
											data,
											meta
										} = res
										if (meta.success) {
											if (content) {
												data.forEach(item => {
													this.$set(item, "checked", false)
													if (content.catalog.id === item.id) {
														this.$set(item, "checked", true)
													}
												})
											}
											this.video_type_group = data
										}
									}
								})
							} else {
								console.log("获取视频目录失败")
							}
						}
					}
				})
			},
			// 富文本弹出框打开
			open() {
				this.$refs.popup.open()
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,

				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
	}

	.content {
		margin-top: 20upx;
		width: 100%;

		.text_and_article {
			padding: 0 24upx;
			width: 100%;
			box-sizing: border-box;

			.textarea_box {
				box-sizing: border-box;
				border: 2upx solid #EEEEEE;
				width: 100%;
				padding: 10upx;
				box-sizing: border-box;
				// overflow: hidden;
				background-color: #FFFFFF;

				textarea {
					height: 100%;
					width: 100%;
				}

				.textarea_box_html {
					min-height: 200upx;
					height: auto;
				}
			}

			.myaudio {
				margin-top: 20upx;
				width: 100%;
				height: 88upx;
				background: #F5F5F5;
				border: 1px solid #EEEEEE;
				border-radius: 5px;
				box-sizing: border-box;
				position: relative;

				.card_img_box_close {
					position: absolute;
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
					background-color: #f23a3a;
					text-align: center;
					line-height: 40upx;
					font-size: 20upx;
					color: #FFFFFF;
					top: -10upx;
					right: -10upx;
					z-index: 1;
				}

				.myaudio_content {
					width: 100%;
					height: 100%;
					overflow: hidden;
					box-sizing: border-box;
					background-color: #6db9ff;
				}


			}

			.card_img_box_view {
				height: 180upx;
				width: 180upx;
				border: 2upx solid #333333;
				box-sizing: border-box;
				position: relative;

				.card_img_box_close {
					position: absolute;
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
					background-color: #f23a3a;
					text-align: center;
					line-height: 40upx;
					font-size: 20upx;
					color: #FFFFFF;
					top: -10upx;
					right: -10upx;
					z-index: 1;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}

			.card_img_box_banner {
				margin-top: 20upx;
				width: 100%;
				display: flex;
				align-items: center;
				background: #FFFFFF;

				.card_img_box_view {
					margin-right: 80upx;

					&:nth-child(3) {
						margin-right: 0;
					}
				}
			}

			.card_img_box_thumbnail {
				position: relative;
				margin-top: 20upx;
				width: 100%;
				height: 180upx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #FFFFFF;

				.card_img_box_thumbnail_text {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: 10upx;
					font-size: 28upx;
					color: #333333;
				}
			}

			.card_img_box_inner {
				height: 180upx;
				width: 180upx;
				background: #F4FAFD;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border: 1px dotted #C0C0C0;
				color: #999999;
				box-sizing: border-box;

				.add_article_text_add {
					font-size: 48upx;
					margin-bottom: 6upx;
				}

				.add_article_text {
					font-size: 28upx;
				}
			}

			.card_img_box_left {
				margin-top: 20upx;
				width: 100%;
				height: 96upx;
				background: #F4FAFD;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px dotted #C0C0C0;
				color: #999999;
				box-sizing: border-box;
				&:active{
					background: rgb(161, 214, 240);
				}
				.add_article_text_add {
					font-size: 48upx;
					margin-bottom: 6upx;
				}

				.add_article_text {
					font-size: 28upx;
				}
			}
		}

		.article_type {
			margin-top: 22upx;
			width: 100%;
			font-size: 32upx;
			color: #333333;

			.article_type_text {
				margin: 18upx 0;
				font-size: 32upx;
				color: #333333;
				padding: 0 24upx;
				box-sizing: border-box;
			}

			.article_type_checkbox {
				width: 100%;
				background-color: #FFFFFF;
				padding: 0 24upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;

				.card_title_radio_box {
					width: 100%;
					// height: 100%;
					display: flex;
					flex-wrap: wrap;
					padding-top: 28upx;
					box-sizing: border-box;

					label {
						width: 25%;
						display: flex;
						align-items: center;
						margin-bottom: 40upx;
					}

					.card_radio_icon {
						display: flex;
						align-items: center;
						justify-content: center;

						text {
							font-size: 32upx;
							color: #333333;
						}

						uni-radio .uni-radio-input {
							width: 20upx;
							height: 20upx;
						}
					}
				}
			}
		}

		.article_base_info {
			font-size: 32upx;
			color: #333333;

			.article_base_info_text {
				margin: 18upx 0;
				padding: 0 24upx;
				box-sizing: border-box;
			}

			.card_title_box_border {
				border-bottom: 1px solid #EEEEEE;
				;
			}

			.card_title_box {
				padding: 0 24upx;
				box-sizing: border-box;
				width: 100%;
				background-color: #FFFFFF;
				display: flex;

				.card_title {
					width: 148upx;
					height: 100%;
					font-size: 32upx;
					color: #333333;
					padding-top: 28upx;
					padding-left: 10upx;
					box-sizing: border-box;
					margin-right: 6upx;
				}

				.card_title_radio_box {
					flex: 1;
					height: 100%;
					display: flex;
					flex-wrap: wrap;
					padding-top: 28upx;
					box-sizing: border-box;

					label {
						width: 50%;
						display: flex;
						align-items: center;
						margin-bottom: 44upx;
					}

					.card_radio_icon {
						display: flex;
						align-items: center;
						justify-content: center;

						text {
							font-size: 32upx;
							color: #333333;
						}

						uni-radio .uni-radio-input {
							width: 20upx;
							height: 20upx;
						}
					}
				}
			}

			.my_intro_title {
				font-size: 32upx;
				color: #333333;
				margin: 20upx 0;
			}

			.my_intro {
				width: 100%;
				background-color: #FFFFFF;
				border: 1px solid #EEEEEE;
				box-sizing: border-box;
				padding: 10upx;

				.my_intro_textarea {
					width: 100%;
					height: 130upx;
				}
			}

			.choose_witness {
				margin: 24upx 0;
				background-color: #FFFFFF;
				width: 100%;
				height: 160upx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.choose_witness_button {
					width: 292upx;
					height: 84upx;
					background: #EE4F16;
					border-radius: 2px;
					line-height: 84upx;
				}

				.choose_witness_close {
					width: 24upx;
					height: 24upx;
					position: absolute;
					top: 20upx;
					right: 20upx;
				}
			}

			.bottom_btn {
				overflow: hidden;
				width: 100%;
				// height: 240upx;
				background-color: #FFFFFF;
				padding: 0 24upx;
				box-sizing: border-box;

				.from-submit {
					margin: 38upx 0 14upx 0;
					width: 100%;
					height: 84upx;
					background: #EE4F16;
					border-radius: 2px;
					line-height: 84upx;
				}
			}

		}


	}
</style>
