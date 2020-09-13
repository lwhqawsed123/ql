<template>
	<view class="navi_top">
		<text class="iconfont icon-xiangzuo navi_back" @click="navi_back"></text>
		<text class="title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			
			};
		},
		props: {
			title: {
				type: String,
				default: '安然齐力'
			}
		},
		methods:{
			navi_back(){
				uni.switchTab({
				    url: '/pages/index/index'
				})
			}
		}

	}
</script>

<style lang="less">
	.navi_top {
		width: 100%;
		height: 88upx;
		background-color: #FFFFFF;
		font-size: 32upx;
		font-weight: 500;
		color: #333333;
		text-align: center;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		.navi_back {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 0;
			font-size: 32upx;
			font-weight: 600;
			
		}

		.title {
			line-height: 40upx;
		}
	}
</style>
