<template>
	<view class="content">
		<view class="card_title">
			<text class="card_title_text">成为安然事业的受益人</text>
			<view class="to_card">
				查看名片
			</view>
		</view>
		<view class="card_header">
			<view class="user_icon_img">
				<image src="../../../../../static/index/二维码默认占位@3x.jpg" mode=""></image>
			</view>
			<view class="card_message">
				<view class="card_name">
					Miss Li
				</view>
				<view class="card_is_Qualified">
					平台已审稿
				</view>
				<view class="card_reading_quantity">
					阅读量：1万+
				</view>
			</view>
			<view class="card_content_text">
				安然事业魅力无穷，争分夺秒，成为安然事业	的受益人，不能尽力而为，只能…
			</view>
			<view class="card_content_img">
				<image src="../../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
			</view>
			<view class="tencent_img">
				<image src="../../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
			</view>
			<view class="tencent_message">
				前往安然齐力公众号，了解更多！
			</view>
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

		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 20upx 24upx 20upx 24upx;
	}
	.content{
		width: 100%;
		background-color: #FFFFFF;
		padding: 18upx 24upx 0 24upx;
		box-sizing: border-box;
		
	}
</style>
