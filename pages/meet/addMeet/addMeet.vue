<template>
	<view class="content">
		<view class="meet_date">
			<image class="meet_date_img" src="../../../static/index/日历@2x.png" mode=""></image>
			<picker class="date_picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="date_input">{{date}}</view>
			</picker>
		</view>
		<view class="input_box textarea_box">
			<input type="text" value="" v-model="resourceForm.title" placeholder="描述" placeholder-style="color:#CCCCCC;font-size: 32upx;" />
		</view>

		<view class="gift_img_box">
			<view class="card_img_box_view" v-if="resourceForm.resFileName">
				<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage"></text>
				<image class="gift_img_img" :src="imageBaseUrl+resourceForm.resFileName" mode=""></image>
			</view>
			<view v-if="!resourceForm.resFileName" class="card_img_box_left" @click="chooseImage">
				<view class="card_img_add">
					<text>+</text>
				</view>
			</view>
		</view>
		<view class="bottom_btn">
			<button class="from-submit" formType="submit" type="primary" @click="formSubmit">发布</button>
		</view>
	</view>
</template>

<script>
	import wx from '../../../utils/jsWeiXin.js'
	import {
		mapState
	} from "vuex"
	import {UPLOAD_URL} from "../../../api/config";
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
				imageUrl: '',
				fileMax: 2,
				contentId: 0,
				detail: '',
				name: '',
				resourceForm: {
					redirectUrl: '',
					resFileName: '',
					resType: 0,
					selected: false,
					sort: 0,
					title: ''
				},
				toast: {
					isToast: false,
					current: 0,
					message: '修改成功!',
					success: true
				}
			}
		},
		onLoad(e) {
			this.contentId = +e.contentId
			if (e.contentId) {
				// this.getMeetById(e.meetId)
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user
			})
		},
		methods: {

			chooseImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ["camera", "album"],
					success: res => {
						let fileImg = res.tempFiles[0]
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
									this.resourceForm.resFileName = data
								}
							}
						});
					}
				});
			},
			// 提交表单
			formSubmit() {
				if (!this.resourceForm.resFileName) {
					uni.showToast({
						title: "最少选择一张图片!",
						icon: "none",
						mask: true
					});
					return
				}
				if (!this.date) {
					uni.showToast({
						title: "日期不能为空!",
						icon: "none",
						mask: true
					});
					return
				}
				uni.showLoading({
					mask: true
				})
				let form = JSON.parse(JSON.stringify(this.resourceForm))
				form.resTime = this.date+' 00:00:00'
				console.log(form)
				this.addResources(form)

			},
			// 新增发布美好的资源列表
			addResources(form) {
				this.$api.post({
					url: `content/resource/new?contentId=${this.contentId}`,
					params: form,
					noLoading:true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							console.log('=====Resources创建完成======')
							console.log(data)

							setTimeout(() => {
								uni.hideLoading()
								uni.showToast({
									title: '上传成功!',
									icon: "none",
									mask: true
								});
								uni.navigateBack({
									delta: 1
								});
							}, 800);
						}
					}
				})

			},
			// 上传图片文件
			uploadImage(serverId) {
				let data = {
					mediaId: serverId,
					type: 'img'
				}
				this.$api.get({
					url: "wx/mp/media",
					params: data,
					callback: res => {
						console.log("保存到服务器结束")
						console.log(res)
						uni.showToast({
							title: res,
							icon: "none",
							mask: true
						});
						if (res.meta.success) {
							this.imageList = res.data
						}
					},
					err: res => {
						uni.showToast({
							title: res,
							icon: "none",
							mask: true
						});
					}
				})
			},
			// 删除url
			removeImage() {
				this.resourceForm.resFileName = ''
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}

	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 20upx 24upx 0 24upx;
		width: 100%;
	}

	.content {
		width: 100%;
		background-color: #FFFFFF;
		padding: 24upx 26upx 24upx 24upx;
		box-sizing: border-box;

		.meet_date {
			width: 100%;
			height: 96upx;
			background: #FFFFFF;
			border: 1px solid #EEEEEE;
			box-sizing: border-box;
			padding: 28upx 18upx 28upx 24upx;
			display: flex;
			align-items: center;
			margin-bottom: 14upx;

			.meet_date_img {
				width: 40upx;
				height: 40upx;
				margin: 10upx;
			}

			.date_picker {
				flex: 1;

				.date_input {
					font-size: 32upx;
					color: #333333;
					line-height: 96upx;
				}
			}
		}

		.textarea_box {
			border: 2upx solid #EEEEEE;
			width: 100%;
			height: 140upx;
			padding: 10upx;
			box-sizing: border-box;
			overflow: hidden;
			padding: 0 18upx;

			textarea {
				width: 100%;
				height: 100%;
			}
		}

		.input_box {
			height: 96upx;
			margin-bottom: 14upx;

			input {
				width: 100%;
				height: 100%;
				line-height: 96upx;
			}
		}

		.gift_img_box {
			margin: 58upx 0 58upx 0;
			display: flex;
			align-items: center;

			.card_img_box_view {
				width: 208upx;
				height: 208upx;
				border: 2upx solid #CCCCCC;
				box-sizing: border-box;
				position: relative;
				margin-right: 14upx;

				&:nth-child(3) {
					margin-right: 0;
				}

				.gift_img_img {
					width: 100%;
					height: 100%;
				}

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

				.card_img_box_check {
					position: absolute;
					width: 40upx;
					height: 40upx;
					border-radius: 50%;
					border: 4upx solid #41a863;
					box-sizing: border-box;
					// background-color: #f23a3a;
					text-align: center;
					line-height: 30upx;
					font-size: 20upx;
					color: #41a863;
					left: 10upx;
					top: 10upx;
					z-index: 1;
				}
			}

			.card_img_box_left {
				width: 208upx;
				height: 208upx;
				background: #F4FAFD;
				display: flex;
				align-items: center;
				justify-content: center;

				.card_img_add {
					width: 180upx;
					height: 180upx;
					border: 1px dotted #C0C0C0;
					border-radius: 5px;
					font-size: 96upx;
					color: #979797;
					text-align: center;
					line-height: 160upx;
				}
			}
		}

		.bottom_btn {
			overflow: hidden;
			width: 100%;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1;

			.from-submit {
				margin: 14upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
	}
</style>
