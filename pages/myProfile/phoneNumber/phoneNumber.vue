<template>
	<view class="content">
		<!-- <view class="tips">
			请完成以下认证
		</view>
		<view class="verification">
			<view class="verification_tip">
				请输入135****5555收到的短信验证码
			</view>
			<view class="verification_code">
				<view class="verification_input">
					<input class="" type="text" value="" maxlength="11" placeholder="请输入验证码" />
				</view>
				<text class="verification_button">获取验证码</text>
			</view>
		</view>
		<view class="next" @click="submit">
			下一步
		</view> -->
		<view class="tips">
			请输入手机号码
		</view>
		<view class="phoneNumber_box">
			<view class="phoneNumber_input">
				<input class="" type="number" v-model="phoneNumber" value="" maxlength="11" placeholder="请输入手机号" />
			</view>
		</view>
		<view class="next" @click="savePhoneNumber">
			保存
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				phoneNumber:"",
			}
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		onReady() {
			this.$api.sdkReady()
			this.getUser()
		},
		methods: {
			submit() {
				uni.navigateTo({
					url: '/pages/myProfile/editPhoneNumber/editPhoneNumber'
				})
			},
			getUser(){
				this.phoneNumber=this.user.mobile||''
			},
			savePhoneNumber() {
				if(!this.phoneNumber.trim()){
					uni.showToast({title:'手机号码不能为空', icon:"none",mask:true});
					return
				}
				let flag=this.isPhoneNumber(this.phoneNumber)
				if(!flag){
					uni.showToast({title:'手机号码格式错误', icon:"none",mask:true});
					return
				}
				console.log(this.phoneNumber,this.user.id)
				this.$api.get({
					url:`user/${this.user.id}`,
					callback:res=>{
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							data.mobile=this.phoneNumber
							console.log("=====")
							console.log(data)
							this.$api.put({
								url:`user/update`,
								params:data,
								callback:res=>{
									let {
										meta,
										data
									} = res;
									if (meta.success) {
										console.log(res)
										this.$store.dispatch({
											type:'saveUserInfo',
											user:data
										})
										uni.showToast({title:'修改成功', icon:"none",mask:true});
										setTimeout(()=> {
											uni.navigateBack({
											    delta: 1
											});
										}, 800);
									} else {
									}
								}
							})
						} else {
						}
					}
				})
			},
			// 手机号校验
			isPhoneNumber(phoneNum) {
				// let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
				/*
			      * 移动号码包括的号段：134/135/136/137,138,139；
			    *                     147/148(物联卡号)；
			    *                     150/151/152/157/158/159；
			    *                     165（虚拟运营商）；
			    *                     1703/1705/1706（虚拟运营商）、178；
			    *                     182/183/184/187/188
			    *                     198
			
			    * 联通号段包括：130/131
			    *               145
			    *               155/156
			    *               166/167(虚拟运营商)
			    *               1704/1707/1708/1709、171
			    *               186/186
			    *
			    * 电信号段包括： 133
			    *                153
			    *                162(虚拟运营商)
			    *                1700/1701/1702(虚拟运营商)
			    *                180/181/189
			    *                191/199
			    * */
				let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
				return reg.test(phoneNum);
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		width: 100%;
		background-color: #F9F9F9;

		.tips {
			width: 100%;
			height: 44upx;
			margin: 42upx 0 14upx 0;
			font-size: 32upx;
			color: #999999;
		}

		.phoneNumber_box {
			background-color: #FFFFFF;
			width: 100%;
			box-sizing: border-box;
			padding: 0 30upx;
			overflow: hidden;
			border: 1px solid #EEEEEE;

			.phoneNumber_input {
				width: 100%;
				height: 84upx;
				box-sizing: border-box;

				input {
					width: 100%;
					height: 100%;

					.uni-input-placeholder {
						font-size: 32upx;
						color: #CCCCCC;
					}
				}
			}
		}


		.verification {
			background-color: #FFFFFF;
			width: 100%;
			height: 300upx;
			box-sizing: border-box;
			padding: 0 30upx;
			overflow: hidden;

			.verification_tip {
				font-size: 32upx;
				color: #333333;
				margin: 40upx 0 60upx 0;
			}

			.verification_code {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.verification_input {
					width: 404upx;
					height: 84upx;
					box-sizing: border-box;
					border: 1px solid #EEEEEE;

					input {
						margin-left: 10px;
						width: 100%;
						height: 100%;

						.uni-input-placeholder {
							font-size: 32upx;
							color: #CCCCCC;
						}
					}

				}

				.verification_button {
					width: 220upx;
					height: 84upx;
					background: #EE4F16;
					border-radius: 2px;
					color: #FFFFFF;
					font-size: 28upx;
					text-align: center;
					line-height: 84upx;
				}
			}
		}

		.next {
			margin-top: 40upx;
			width: 100%;
			height: 84upx;
			background: #EE4F16;
			border-radius: 2px;
			color: #FFFFFF;
			font-size: 36upx;
			text-align: center;
			line-height: 84upx;
		}
	}
</style>
