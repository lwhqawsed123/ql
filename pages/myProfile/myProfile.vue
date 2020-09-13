<template>
	<view class="content">
		<view class="profile_item" @click="navigateTo('/pages/myProfile/userinfo/userinfo')">
			<text>个人信息</text>
			<image src="../../static/index/Group%209%20Copy%202.jpg" mode=""></image>
		</view>
		<view class="profile_item" @click="navigateTo('/pages/myProfile/phoneNumber/phoneNumber')">
			<text>修改手机号</text>
			<image src="../../static/index/Group%209%20Copy%202.jpg" mode=""></image>
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
			navigateTo(url){
				uni.navigateTo({
					url:url,
					
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 20upx 24upx 0 24upx;
	}

	.content {
		background-color: #FFFFFF;
		width: 100%;
		box-sizing: border-box;
		padding-left: 32upx;
		padding-bottom: 10upx;

		.profile_item {
			width: 100%;
			height: 120upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10upx;
			border-bottom: 2upx solid #EEEEEE;

			text {
				font-size: 32upx;
				color: #333333;
			}

			image {
				width: 22upx;
				height: 38upx;
				margin-right: 18upx;
			}
		}
	}
</style>
