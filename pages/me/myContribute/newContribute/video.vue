<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset" ref='form'>
			<view class="video_out_box">
				<view class="textarea_box" @click="open">
					<view class="ql-container textarea_box_html">
						<rich-text class="ql-editor" v-if="articleDetail.html||articleDetail" :nodes="articleDetail.html||articleDetail"></rich-text>
						<span style="color:#CCCCCC;font-size: 32upx;" v-else>请输入内容...</span>
					</view>
				</view>

				<view v-if="thumbnail_url" class="card_img_box_thumbnail">
					<text class="card_img_box_thumbnail_text">缩略图:</text>
					<view class="card_img_box_view">
						<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('thumbnail_url')"></text>
						<image :src="imageBaseUrl+thumbnail_url" mode="" @click="chooseThumbnail(thumbnail_flag,'thumbnail_url')"></image>
					</view>
				</view>

				<view v-if="!thumbnail_url" class="card_img_box_add" @click="chooseThumbnail(thumbnail_flag,'thumbnail_url')">
					<view class="add_article_text_add">
						+
					</view>
					<view class="add_article_text">
						上传缩略图
					</view>
				</view>
				<view class="text_and_video">
					<view class="card_img_box_left" v-if="video_url">
						<text class="iconfont icon-guanbi card_video_box_close" @click="removeImage('video_url')"></text>
						<video class="myVideo" :src="videoBaseUrl+video_url" :controls="false"></video>
					</view>
					<view v-if="!video_url" class="card_img_box_left" @click="chooseVideo">
						<view class="card_img_add">
							<text>+</text>
						</view>
						<view class="add_video_text">添加视频</view>
					</view>
				</view>
			</view>


			<view class="video_type">
				<view class="video_type_text">视频类型</view>
				<view class="video_type_checkbox">
					<radio-group class="card_title_radio_box" name="type">
						<label v-for="item in video_type_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :checked="item.checked" :value="''+item.id" />
							<text>{{item.name}}</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="video_base_info">
				<view class="video_base_info_text">视频基本信息</view>
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
					<button class="from-submit" formType="submit" type="primary">发布视频</button>
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
				videoBaseUrl: state => state.videoBaseUrl,
				user: state => state.user,
				articleDetail: state => state.articleDetail,
			})
		},
		data() {
			return {
				title: "",
				contentId: '',
				id: 5,
				fileMax: 50,
				form: {
					banner: "",
					catalog: {
						company: {
							id: 1
						},
						id: 0
					},
					thumbnail: '',
					contentType: "VIDEO",
					detail: "",
					name: "",
					resources: [],
					tag: "",
					user: {
						id: null
					}
				},
				video_type_group: [],
				age_radio_group: [],
				sex_radio_group: [],
				title_radio_group: [],
				video_url: '',
				video_flag: false,
				thumbnail_url: '',
				thumbnail_flag: '',
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
				]
			};
		},
		onLoad(e) {
			this.title = e.title;
			this.contentId = e.id
			this.getCard(e.id)
		},
		onReady() {
			this.$api.sdkReady()
		},
		onUnload() {
			this.$store.dispatch({
				type: 'removeArticleDetail'
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
							console.log(data)
							this.form = data
							this.title = data.name
							this.video_url = data.banner
							this.thumbnail_url = data.thumbnail
							this.getVideoType(data)
							this.getAllAudio(data)
							if (this.$common.isJSON(data.detail)) {
								data.detail = JSON.parse(data.detail)
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
				if (!this.articleDetail && !this.articleDetail.html) {
					uni.showToast({
						title: "文章内容不能为空!",
						icon: "none",mask:true
					});
					return
				}
				if (this.video_flag) {
					uni.showToast({
						title: "视频未上传完成!",
						icon: "none",mask:true
					});
					return
				}
				if (!this.video_url) {
					uni.showToast({
						title: "请选择视频!",
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
					data.banner = this.video_url
					data.thumbnail = this.thumbnail_url
					data.catalog.id = +formData.type
					data.detail = JSON.stringify(this.articleDetail)
					data.tag = formData.age + "," + formData.title + "," + formData.gender
					data.user.id = this.user.id
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
						console.log(res)
						let delta=this.contentId?1:2
						if (meta.success) {
							uni.showToast({
								title: "投稿成功!",
								duration: 2000,
								mask: true
							});
							this.$store.dispatch({
								type: 'removeArticleDetail'
							})
							setTimeout(() => {
								uni.hideToast();
								uni.navigateBack({
									delta: delta
								});
							}, 2000)
						}
					}
				})
			},
			// 重置表单
			formReset() {},
			// 选择视频
			chooseVideo() {
				console.log(this.video_flag)
				if (this.video_flag) {
					return
				}
				uni.chooseVideo({
					compressed:true,
					sourceType: ["album","camera"],
					success: res => {
						console.log('选择成功')
						console.log(res)
						this.video_flag = true
						let size20M = res.size / 1024 / 1024 < this.fileMax
						if (!size20M) {
							console.log('视频过大')
							uni.showToast({
								title: `视频大小不能超过${this.fileMax}M!`,
								icon: "none",mask:true
							});
							this.video_flag = false
							return
						}
						// 上传到服务器
						uni.uploadFile({
							url: UPLOAD_URL, //接口地址
							filePath: res.tempFilePath,
							name: 'file',
							header: {
								'Authorization': 'Bearer ' + this.$api.getToken()
							},
							formData: {
								'type': 'video'
							},
							success: (uploadFileRes) => {
								let uploadFile = JSON.parse(uploadFileRes.data)
								let {
									data,
									meta
								} = uploadFile
								console.log(uploadFile)
								if (meta.success) {
									this.video_flag = false
									this.video_url = data
								}
							},
							fail:res=>{

							}
						});
					},
					fail:err=>{
						console.log("上传失败")
						console.log(err)
					},
					complete:res=>{
						console.log("上传错误")
						console.log(res)
					}
				});
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
						let fileImg = res.tempFiles[0]
						// let size2M = fileImg.size / 1024 / 1024 < this.fileMax
						// if (!size2M) {
						// 	uni.showToast({
						// 		title: `图片大小不能超过${this.fileMax}M!`,
						// 		icon: "none"
						// 	});
						// 	image_flag = false
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
			// 获取单选框组
			getAllAudio(content) {
				this.$api.get({
					url: 'biz/setting/all',
					callback: res => {
						if (res.meta.success) {
							let data = res.data
							this.setRadioArray(data, content)
						}
					}
				})
			},
			// 遍历单选框组
			setRadioArray(data, content) {
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
						name: 'JKML-SP'
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
	};
</script>

<style lang="less">
	page {
		background-color: #f9f9f9;
		box-sizing: border-box;
	}

	.content {
		margin-top: 20upx;
		width: 100%;

		.video_out_box {
			width: 100%;
			padding: 0 24upx;
			box-sizing: border-box;

			.textarea_box {
				box-sizing: border-box;
				border: 2upx solid #EEEEEE;
				width: 100%;
				padding: 10upx;
				box-sizing: border-box;
				// overflow: hidden;
				background-color: #FFFFFF;

				.textarea_box_html {
					min-height: 200upx;
					height: auto;
				}
			}

			.text_and_video {
				width: 100%;
				height: 121px;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20upx;
				position: relative;

				.card_video_box_close {
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
					left: 50%;
					margin-left: 117upx;
					z-index: 1;
				}

				.card_img_box_left {
					width: 254upx;
					height: 100%;
					background: #f4fafd;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.myVideo {
						width: 100%;
						height: 100%;
					}

					.card_img_add {
						width: 180upx;
						height: 120upx;
						border: 1px dotted #c0c0c0;
						border-radius: 5px;
						font-size: 96upx;
						color: #979797;
						text-align: center;
						line-height: 110upx;
					}

					.add_video_text {
						margin-top: 12upx;
						font-size: 28upx;
						color: #999999;
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
				box-sizing: border-box;

				.card_img_box_thumbnail_text {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: 10upx;
					font-size: 28upx;
					color: #333333;
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
			}

			.card_img_box_add {
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

				.add_article_text_add {
					font-size: 48upx;
					margin-bottom: 6upx;
				}

				.add_article_text {
					font-size: 28upx;
				}
			}

		}

		.video_type {
			margin-top: 22upx;
			width: 100%;
			font-size: 32upx;
			color: #333333;

			.video_type_text {
				margin: 18upx 0;
				font-size: 32upx;
				color: #333333;
				padding: 0 24upx;
				box-sizing: border-box;
			}

			.video_type_checkbox {
				width: 100%;
				background-color: #ffffff;
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
						width: 33.33%;
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

		.video_base_info {
			font-size: 32upx;
			color: #333333;

			.video_base_info_text {
				margin: 18upx 0;
				padding: 0 24upx;
				box-sizing: border-box;
			}

			.card_title_box_border {
				border-bottom: 1px solid #eeeeee;
			}

			.card_title_box {
				padding: 0 24upx;
				box-sizing: border-box;
				width: 100%;
				background-color: #ffffff;
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
				background-color: #ffffff;
				border: 1px solid #eeeeee;
				box-sizing: border-box;
				padding: 10upx;

				.my_intro_textarea {
					width: 100%;
					height: 130upx;
				}
			}

			.choose_witness {
				margin: 24upx 0;
				background-color: #ffffff;
				width: 100%;
				height: 160upx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;

				.choose_witness_button {
					width: 292upx;
					height: 84upx;
					background: #ee4f16;
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
				background-color: #ffffff;
				padding: 0 24upx;
				box-sizing: border-box;

				.from-submit {
					margin: 38upx 0 14upx 0;
					width: 100%;
					height: 84upx;
					background: #ee4f16;
					border-radius: 2px;
					line-height: 84upx;
				}
			}
		}
	}
</style>
