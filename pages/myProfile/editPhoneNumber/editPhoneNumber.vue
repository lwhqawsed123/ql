<template>
	<view class="content">
		<view class="verification">
			<view class="new_phonenumber">
				绑定新号码
			</view>
			<view class="verification_input">
				<input class="" type="text" value="" maxlength="11" placeholder="请输入手机号" />
			</view>
			<view class="verification_tip">
				短信验证码
			</view>
			<view class="verification_code">
				<view class="verification_input">
					<input class="" type="text" value="" maxlength="11" placeholder="请输入验证码" />
				</view>
				<text class="verification_button">获取验证码</text>
			</view>
		</view>
		<view class="next" @click="submit">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			submit(){}
				
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	
	}
	.content{
		width: 100%;
		background-color: #F9F9F9;
		
		.verification{
			margin-top: 24upx;
			background-color: #FFFFFF;
			width: 100%;
			height: 480upx;
			box-sizing: border-box;
			padding: 0 30upx;
			overflow: hidden;
			.new_phonenumber{
				font-size: 32upx;
				color: #333333;
				margin: 40upx 0 20upx 0;
			}
			.verification_input{
				width: 100%;
				height: 84upx;
				box-sizing: border-box;
				border: 1px solid #EEEEEE;
				input{
					margin-left: 10px;
					width: 100%;
					height: 100%;
					.uni-input-placeholder{
						font-size: 32upx;
						color: #CCCCCC;
					}
				}
				
			}
			.verification_tip{
				font-size: 32upx;
				color: #333333;
				margin: 50upx 0 20upx 0;
			}
			.verification_code{
				width: 100%;
				display: flex;
				justify-content: space-between;
				.verification_input{
					width: 404upx;
					height: 84upx;
					box-sizing: border-box;
					border: 1px solid #EEEEEE;
					input{
						margin-left: 10px;
						width: 100%;
						height: 100%;
						.uni-input-placeholder{
							font-size: 32upx;
							color: #CCCCCC;
						}
					}
					
				}
				.verification_button{
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
		.next{
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
