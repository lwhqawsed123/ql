<template>
	<view class="content">
		<view class="bottom_box">
			<button :class="sort=='视频'?'bottom_button button_active':'bottom_button'" type="primary" @click="sort='视频'">视频</button>
			<button :class="sort=='文章'?'bottom_button button_active':'bottom_button'" type="primary" @click="sort='文章'">文章</button>
		</view>
		<view class="textarea_box">
			<textarea placeholder="发布标题" v-model='title' placeholder-style="color:#CCCCCC;font-size: 32upx;" />
			</view>
		<view class="fabu_button">
			<button class="fabu_bottom_button fabu_button_red" type="primary" @click="submitAndNavigateTo">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sort:'视频',
				title:''
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			submitAndNavigateTo(){
				if(this.title.trim()==""){
					uni.showToast({
					    title: '标题不能为空',
					    duration: 3000,
						icon:"none",mask:true
					});
					setTimeout(()=>{
						uni.hideToast();
					},2000)
					return 
				}
				let url=''
				if(this.sort=='视频'){
					url='video?title='
				}else{
					url='article?title='
				}
				uni.navigateTo({
					url:url+this.title,
				})
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
	.content{
		width: 100%;
		.bottom_box{
			width: 100%;
			height: 140upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bottom_button{
				width: 334upx;
				height: 92upx;
				line-height: 92upx;
				border-radius: 4upx;
				background-color: #FFFFFF;
				color: #333333;
			}
			.button_active{
				background-color:  #EE4F16;
				color: #FFFFFF;
			}
		}
		.textarea_box{
			border: 2upx solid #EEEEEE;
			width: 100%;
			height: 242upx;
			padding: 10upx;
			box-sizing: border-box;
			overflow: hidden;
			background-color: #FFFFFF;
			textarea{
				height: 100%;
				width: 100%;
			}
		}
		.fabu_button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 14upx 24upx;
			box-sizing: border-box;
			.fabu_bottom_button {
				width: 100%;
				height: 84upx;
				line-height: 84upx;
				border-radius: 4upx;
			}
		
			.fabu_button_red {
				background-color: #EE4F16;
			}
		}
	}
</style>
