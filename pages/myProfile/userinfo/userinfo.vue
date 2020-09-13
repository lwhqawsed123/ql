<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset">
			<view class="my_intro_title">
				昵称
			</view>
			<view class="my_intro">
				<input type="text" value="" v-model="userInfo.nickName" maxlength="10" name="nickName" class="my_intro_input" placeholder="请填写用户昵称"
				 placeholder-style="color: #ccc;font-size: 32upx;" />
			</view>
			<view class="my_intro_title">
				真实姓名
			</view>
			<view class="my_intro">
				<input type="text" value="" v-model="userInfo.name" maxlength="10" name="name" class="my_intro_input" placeholder="请填写真实姓名"
				 placeholder-style="color: #ccc;font-size: 32upx;" />
			</view>
			<view class="my_intro_title">
				选择性别
			</view>
			<view class="card_title_box card_title_box_border">
				<view class="card_title">性别:</view>
				<radio-group class="card_title_radio_box" name="sex">
					<label>
						<radio class="card_radio_icon" color="#EE4F16" :checked="userInfo.sex===1" value="1" />
						<text>男</text>
					</label>
					<label>
						<radio class="card_radio_icon" color="#EE4F16" :checked="userInfo.sex===0" value="0" />
						<text>女</text>
					</label>
				</radio-group>
			</view>
			<view class="my_intro_title">
				选择地址
			</view>
			<view v-if="!userInfo.address" class="choose_address">
				<button class="choose_address_button" type="primary" @click="openAddres">选择地址</button>
			</view>
			<view v-if="userInfo.address" class="my_address">
				<text class="my_address_text">{{userInfo.address}}</text>
				<text v-if="userInfo.address" class="my_address_text reselect_address" @click="openAddres">更改</text>
			</view>
			<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>
			<view class="bottom_btn">
				<button class="from-submit" formType="submit" type="primary">保 存</button>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import constant from '@/utils/constant.js'
	import graceChecker from "@/utils/graceChecker.js";
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				pickerText: '', // 地址
				userInfo: {
					nickName:"",
					name:"",
					sex:"",
					address:""
				},
				rules: [{
						name: "nickName",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请输入昵称"
					},
					{
						name: "name",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请输入真实姓名"
					},
					{
						name: "sex",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择性别"
					}
				]
			}
		},
		components: {
			simpleAddress
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		onReady() {
			this.$api.sdkReady()
			this.getUserInfo()
		},
		methods: {
			// 页面加载时获取用户信息
			getUserInfo() {
				this.$api.get({
					url: `user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							console.log(res)
							let userInfo = data
							if (!userInfo || !userInfo.id) {
								uni.showToast({
									title: "获取用户信息失败,请稍后重试!",
									icon: "none",mask:true
								});
								return
							}
							this.userInfo.nickName=userInfo.nickName
							this.userInfo.name=userInfo.name
							this.userInfo.sex=userInfo.sex
							this.userInfo.address=userInfo.address
						}
					},
				})
			},
			// 提交表单
			formSubmit(e) {
				// 获取用户信息
				this.$api.get({
					url: `user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let userInfo = data
							if (!userInfo || !userInfo.id) {
								uni.showToast({
									title: "获取用户信息失败,请稍后重试!",
									icon: "none",mask:true
								});
								return
							}
							//进行表单检查
							var formData = e.detail.value;
							var checkRes = graceChecker.check(formData, this.rules);
							if (checkRes) {
								if (!this.userInfo.address) {
									uni.showToast({
										title: "请选择地址!",
										icon: "none",mask:true
									});
									return
								}
								uni.showToast({
									title: "验证通过!",
									icon: "none",mask:true
								});
								let data = JSON.parse(JSON.stringify(userInfo))
								data.name = formData.name
								data.nickName = formData.nickName
								data.sex = +formData.sex
								data.address = JSON.parse(JSON.stringify(this.userInfo.address))
								data.city = JSON.parse(JSON.stringify(this.userInfo.address)).split("-")[0]
								this.editUserInfo(data)

							} else {
								uni.showToast({
									title: graceChecker.error,
									icon: "none",mask:true
								});
							}
						}
					}
				})



			},
			// 修改用户信息
			editUserInfo(data) {
				this.$api.put({
					url: 'user/update',
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res
						console.log(res)
						if (meta.success) {
							uni.setStorageSync(constant.userInfo, data);
							uni.showToast({
								title: "修改成功",mask:true,icon:'none'
							});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					}
				})
			},
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.userInfo.address = e.label
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
		}
	}
</script>
<style>
</style>
<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding-top: 24upx;

		.card_name {
			width: 100%;
			height: 96upx;
			box-sizing: border-box;
			border: 1px solid #EEEEEE;
			background-color: #FFFFFF;

			.name_input {
				margin-left: 20upx;
				width: 100%;
				height: 100%;

				.uni-input-placeholder {
					font-size: 32upx;
					color: #CCCCCC;
				}
			}
		}

		.card_title_box_border {
			border: 1px solid #EEEEEE;
		}

		.card_title_box {
			width: 100%;
			height: 96upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;

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
				box-sizing: border-box;
				align-items: center;

				label {
					width: 50%;
					display: flex;
					align-items: center;
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

			.my_intro_input {
				width: 100%;
				height: 76upx;
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
				width: 384upx;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
				font-size: 36upx;
			}

			.choose_witness_close {
				position: absolute;
				top: 20upx;
				right: 20upx;
				font-size: 24upx;
			}
		}

		.choose_address {
			.choose_address_button {
				background-color: #EE4F16;
			}
		}

		.my_address {
			width: 100%;
			background-color: #FFFFFF;
			border: 1px solid #EEEEEE;
			box-sizing: border-box;
			padding: 10upx;
			height: 100upx;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.my_address_text {
				font-size: 32upx;
				color: #333333;
			}

			.reselect_address {
				color: #CCCCCC;
			}
		}


		.bottom_btn {
			overflow: hidden;
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			bottom: 0;
			left: 0;

			.from-submit {
				// margin:38upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
	}
</style>
