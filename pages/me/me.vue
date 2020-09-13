<template>
	<view class="content">
		<view class="user_info">
			<image v-if="user.avatar" :src="user.avatar" mode="" class="user_info_icon"></image>
			<image v-if="!user.avatar" src="../../static/index/Oval%203.jpg" mode="" class="user_info_icon"></image>
			<text class="user_info_nick">{{user.nickName}}</text>
			<!-- <image src="../../static/index/设置@3x.jpg" mode="" class="user_info_setting"></image> -->
		</view>
		<view class="user_list">
			<view class="user_list_content" 
            v-for="item in user_list.slice(0,3)" 
            :key="item.title" 
            @click="navigateTo(item.path)">
				<view class="user_list_content_icon">
					<image :src="item.icon" mode="" :style='"width: "+item.width+";height: "+item.height+";"' class="user_list_content_img"></image>
				</view>
				<view class="user_list_content_right">
					<text class="user_list_content_right_text">{{item.title}}</text>
					<image src="../../static/index/Group%209%20Copy%202.jpg" mode="" class="user_list_content_right_icon"></image>
				</view>
			</view>
		</view>
		<view class="user_list">
			<view class="user_list_content" v-for="item in user_list.slice(3,4)" :key="item.title" @click="navigateTo(item.path)">
				<view class="user_list_content_icon">
					<image :src="item.icon" mode="" :style='"width: "+item.width+";height: "+item.height+";"' class="user_list_content_img"></image>
				</view>
				<view class="user_list_content_right">
					<text class="user_list_content_right_text">{{item.title}}</text>
					<image src="../../static/index/Group%209%20Copy%202.jpg" mode="" class="user_list_content_right_icon"></image>
				</view>
			</view>
		</view>
		<view class="user_list">
			<view class="user_list_content" v-for="item in user_list.slice(4)" :key="item.title" @click="navigateTo(item.path)">
				<view class="user_list_content_icon">
					<image :src="item.icon" mode="" :style='"width: "+item.width+";height: "+item.height+";"' class="user_list_content_img"></image>
				</view>
				<view class="user_list_content_right">
					<text class="user_list_content_right_text">{{item.title}}</text>
					<image src="../../static/index/Group%209%20Copy%202.jpg" mode="" class="user_list_content_right_icon"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:this.$store.state.user,
				imageBaseUrl:this.$store.state.imageBaseUrl,
				title: 'Hello',
				user_list: [
					{
						title: '我的名片',
						icon: '../../static/index/我的名片@2x.png',
						width: '46upx',
						height: '38upx',
						path:'/pages/me/myCard/myCard'
					},
					{
						title: '我的投稿',
						icon: '../../static/index/我的投稿@2x.png',
						width: '44upx',
						height: '48upx',
						path:'/pages/me/myContribute/myContribute'
					},
					
					{
						title: '我的收藏',
						icon: '../../static/index/我的收藏@2x.png',
						width: '48upx',
						height: '46upx',
						path:'/pages/myCollect/myCollect'
					},
					{
						title: '个人资料',
						icon: '../../static/index/个人中心@2x.png',
						width: '48upx',
						height: '48upx',
						path:'/pages/myProfile/myProfile'
					},
					{
						title: '我的微信二维码',
						icon: '../../static/index/微信二维码@2x.png',
						width: '44upx',
						height: '44upx',
						path:'/pages/me/myQRCode/myQRCode'
					},
          {
          	title: '我的个人宣传片',
          	icon: '../../static/index/微信二维码@2x.png',
          	width: '44upx',
          	height: '44upx',
          	path:'/pages/me/myVCR/myVCR'
          },
				]
			}
		},
		onLoad() {

		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
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
		opacity: 0.99;
		background: #F9F9F9;
	}

	.content {
		padding: 22upx 24upx 0 24upx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.user_info {
			width: 100%;
			height: 210upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			position: relative;
			box-sizing: border-box;

			.user_info_icon {
				margin: 0 34upx;
				width: 160upx;
				height: 160upx;
				border-radius: 50%;
			}

			.user_info_nick {
				font-size: 36upx;
				color: #333333;
				letter-spacing: -0.43px;
			}

			.user_info_setting {
				position: absolute;
				width: 52upx;
				height: 52upx;
				top: 16upx;
				right: 16upx;
			}
		}

		.user_list {
			width: 100%;
			margin-top: 24upx;
			background-color: #FFFFFF;
			box-sizing: border-box;

			.user_list_content {
				box-sizing: border-box;
				padding: 0 20upx 0 46upx;
				width: 100%;
				height: 128upx;
				display: flex;
				align-items: center;

				.user_list_content_icon {
					margin-right: 56upx;
					width: 60upx;
					height: 60upx;

					.user_list_content_img {
						width: 100%;
						height: 100%;
					}
				}

				.user_list_content_right {
					border-bottom: 1px solid #EEEEEE;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.user_list_content_right_text {
						font-size: 32upx;
						color: #333333;
						letter-spacing: -0.39px;
					}

					.user_list_content_right_icon {
						width: 18upx;
						height: 28upx;
					}
				}

				&:last-child {
					.user_list_content_right {
						border-bottom: none;
					}
				}
			}




		}




	}
</style>
