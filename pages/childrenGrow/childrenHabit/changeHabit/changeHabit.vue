<template>
	<view class="content">
		<view class="habit_list">
			<view class="habit_item" v-for="(item,index) in habit_list" :key="item.id">
				<text class="habit_name">{{item.name}}</text>
				<view class="habit_up" @click="habitUp(item,index)">
					<image v-if="index!=0" src="../../../../static/index/Group%205%20Copy%203.jpg" mode=""></image>
				</view>
				<view class="habit_down" @click="habitDown(item,index)">
					<image v-if="index!=habit_list.length-1" src="../../../../static/index/Group%205%20Copy%202.jpg" mode=""></image>
				</view>
				<image class="habit_delete" src="../../../../static/index/删除.png" mode="" @click="removeHabit(item.id)"></image>
			</view>
		</view>
		<view class="bottom_box">
			<button class="bottom_button button_red" type="primary" @click="navigateTo(`createHabit?id=${child_id}`)">增加习惯</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				child_id:0,
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
		onLoad(e){
			this.child_id=e.id
		},
		onShow() {
			this.getChildHabit()
		},
		methods: {
			// 获取习惯列表
			getChildHabit(){
				this.$api.get({
					url:`child/habit/user/${this.child_id}`,
					callback:res=>{
						let {data,meta}=res
						if(meta.success){
							this.habit_list=data
						}
					}
				})
			},
			habitUp(item,index){
				uni.showLoading({mask:true})
				let arr=this.habit_list
				arr.splice(index-1,1,...arr.splice(index,1,arr[index-1]))
				this.changeSort(arr)
			},
			habitDown(item,index){
				uni.showLoading({mask:true})
				let arr=this.habit_list
				arr.splice(index,1,...arr.splice(index+1,1,arr[index]))
				this.changeSort(this.habit_list)
			},
			// 更新sort顺序
			changeSort(arr){
				arr.forEach((item,index)=>{
					this.$api.get({
						url:`child/habit/${item.id}`,
						noLoading:true,
						callback:res=>{
							if(res.meta.success){
								let backData=res.data
								backData.sort=index
								this.$api.put({
									url:`child/habit/update`,
									noLoading:true,
									params:backData,
									callback:res=>{
										if(res.meta.success){
											if(index===arr.length-1){
												setTimeout(()=>{
													uni.hideLoading()
													this.getChildHabit()
												},1000)
											}
										}
									}
								})
							}
							
						}
					})
				})
			},
			// 删除习惯
			removeHabit(id){
				this.$api.delete({
					url:`child/habit/del/${id}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							this.getChildHabit()
						}
					}
				})
			},
			navigateTo(url){
				uni.navigateTo({
					url:url,
				})
			},
		},
		
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
				.habit_name{
					word-break: break-all;
					text-align: left;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;/*自适应盒子*/
					-webkit-line-clamp: 1;/*此处为1行,如果是两行就改成2*/
					-webkit-box-orient: vertical;
				}
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
