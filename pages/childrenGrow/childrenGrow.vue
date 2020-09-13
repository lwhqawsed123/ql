<template>
	<view class="content">
		<view class="card_item" v-for="item in arr" :key="item.title" @click="navigateTo(item)">
			<image class="card_img" src="../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
			<view class="card_box">
				<text class="card_name">{{item.title_content}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				child_id:0,
				checked:true,
				title:'成长培养',
				arr:[
					{
						title:'成长培养',
						title_content:'成长培养',
						path:'childrenHabit/childrenHabit?title='
					},
					{
						title:'简历素材',
						title_content:'简历素材',
						path:'childrenResume/childrenResume?title='
					},
					// {
					// 	title:'学习目标',
					// 	title_content:'学习目标跟进',
					// 	path:'childrenTarget/childrenTarget?title='
					// }
				]
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		onLoad(e) {
			this.child_id=+e.id
			console.log(this.child_id)
		},
		methods: {
			navigateTo(item){
				uni.navigateTo({
					url:item.path+item.title+`&id=${this.child_id}`
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
		background-color: #F9F9F9;
		box-sizing: border-box;
		overflow: hidden;
		.card_item{
			margin-top: 24upx;
			width: 100%;
			height: 162upx;
			display: flex;
			background-color: #FFFFFF;
			.card_img{
				height: 100%;
				width: 190upx;
				margin-right: 20upx;
			}
			.card_box{
				flex: 1;
				height: 100%;
				display: flex;
				font-size: 32upx;
				color: #333333;
				justify-content: space-between;
				align-items: center;
				padding-right: 20upx;
				.card_name{
					word-break: break-all;
					text-align: left;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;/*自适应盒子*/
					-webkit-line-clamp: 1;/*此处为1行,如果是两行就改成2*/
					-webkit-box-orient: vertical;
				}
				.card_switch{
					// width: 200upx;
					// height: 56upx;
					// uni-switch .uni-switch-input{
					// 	width: 200upx;
					// 	height: 56upx;
					// }
				}
			}
		}
		
	}
	
	
	
	
</style>
