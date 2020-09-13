<template>
	<view class="content">
		<view class="habit_list">
			<view class="habit_item" v-for="(item,index) in habit_list" :key="item.id">
				<text class="habit_name">{{item.habit}}</text>
				<view class="habit_up" @click="habitUp(item,index)">
					<image v-if="index!=0" src="../../../../static/index/Group%205%20Copy%203.jpg" mode=""></image>
				</view>
				<view class="habit_down" @click="habitDown(item,index)">
					<image v-if="index!=habit_list.length-1" src="../../../../static/index/Group%205%20Copy%202.jpg" mode=""></image>
				</view>
				<image class="habit_delete" src="../../../../static/index/删除.png" mode=""></image>
			</view>
		</view>
		<view class="bottom_box">
			<button class="bottom_button button_red" type="primary" >增加计划</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				habit_list:[
					{
						id:1,
						habit:'吃饭'
					},
					{
						id:2,
						habit:'睡觉'
					},
					{
						id:3,
						habit:'学习'
					},
					{
						id:4,
						habit:'打豆豆'
					}
				]
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			habitUp(item,index){
				// console.log(index)
				let arr=this.habit_list
				arr.splice(index-1,1,...arr.splice(index,1,arr[index-1]))
				// this.habit_list.splice(1,1)
				
				// let arr = [1, 2, 3, 4, 5]
				// arr.splice(3,1,arr[2])
				// console.log(arr) /// [1,2,4,3,5]
				// arr.splice(2,1,4)
			},
			habitDown(item,index){
				let arr=this.habit_list
				// let arr = [1, 2, 3, 4, 5]
				arr.splice(index,1,...arr.splice(index+1,1,arr[index]))
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
		margin-top: 20upx;
		.habit_list{
			padding: 10upx;
			width: 100%;
			background-color: #FFFFFF;
			box-sizing: border-box;
			.habit_item{
				margin-top: 10upx;
				width: 100%;
				height: 84upx;
				background: #FFFBE9;
				font-size: 28upx;
				color: #333333;
				padding: 0 24upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				position: relative;
				.habit_up{
					position: absolute;
					left: 354upx;
					top: 50%;
					transform: translateY(-50%);
					width: 48upx;
					height: 48upx;
					
					image{
						width: 48upx;
						height: 48upx;
					}
				}
				.habit_down{
					position: absolute;
					left: 452upx;
					top: 50%;
					transform: translateY(-50%);
					width: 48upx;
					height: 48upx;
					image{
						width: 48upx;
						height: 48upx;
					}
				}
				.habit_delete{
					width: 42upx;
					height: 42upx;
					position: absolute;
					right: 24upx;
					top: 50%;
					transform: translateY(-50%);
					
				}
			}
		}
		
		
		
		
		
		.bottom_box{
			margin-top: 42upx;
			.bottom_button{
				width: 100%;
				height: 84upx;
				line-height: 84upx;
				border-radius: 4upx;
			}
			
			.button_red{
				background-color:  #EE4F16;
			}
		}
	}
	
</style>
