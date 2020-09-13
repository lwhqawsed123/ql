<template>
	<view class="content">
		<uni-swipe-action >
			<uni-swipe-action-item :options="options" @click="onClick($event,item)" @change="change" v-for="item in childrenList" :key="item.id" style="margin-top: 24upx;">
			<view class="card_item" @click="navigateTo(`childrenGrow?id=${item.id}`)">
				<!-- <image class="card_img" src="../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image> -->
				<view class="card_box">
					<view class="card_name">{{item.name}}</view>
					<view class="card_name card_switch">
						<text>生日: {{item.birthday}}</text>
						<text>积分余额: {{item.score}}</text>
					</view>
				</view>
			</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		
		<view class="card_item_add">
			<view class="meet_list_box_left" @click="navigateTo('createChild/createChild')">
				<view class="card_img_add">
					<text>+</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				checked:true,
				title:'3-6岁',
				childrenList:[
				]
			}
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		computed: {
			...mapState({
				user: state => state.user,
				options: state => state.options,
			})
		},
		onShow() {
			this.getChildren()
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			navigateTo(url){
				uni.navigateTo({
					url:url
				})
			},
			getChildren(){
				this.$api.get({
					url:`child/user/${this.user.id}`,
					callback:res=>{
						let {data,meta}=res
						if(meta.success){
							if(data.length.length!==0){
								data.forEach(item=>{
									item.birthday=this.$common.dateToString(item.birthday)
								})
							}
							this.childrenList=data
							console.log(res)
						}
					}
				})
			},
			// 删除名片
			deleteCardById(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.delete({
					url: `child/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getChildren()
								uni.showToast({
									title: '删除成功',
									icon: "none",mask:true
								});
							}, 1000)
			
						}
					}
				})
			},
			onClick(e, item) {
				console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text)
				if (e.index === 1) {
					uni.navigateTo({
						url: `./createChild/createChild?id=${item.id}`
					})
				} else if (e.index === 2) {
					this.deleteCardById(item.id)
				}
			},
			change(open) {
				console.log('当前开启状态：' + open)
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
	}
	.content{
		background-color: #F9F9F9;
		box-sizing: border-box;
		overflow: hidden;
		padding: 0 24upx 0 24upx;
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
				padding: 0 40upx;
				font-size: 32upx;
				color: #333333;
				flex-direction: column;
				justify-content: center;
				// align-items: center;
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
					margin-top: 40upx;
					font-size: 24upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}
		.card_item_add{
			margin-top: 24upx;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 162upx;
			background-color: #FFFFFF;
		}
		.meet_list_box_left {
			width: 100%;
			height: 100%;
			background: #F4FAFD;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20upx;
			box-sizing: border-box;
			.card_img_add {
				width: 100%;
				height: 100%;
				border: 1px dotted #C0C0C0;
				border-radius: 10upx;
				font-size: 80upx;
				color: #979797;
				text-align: center;
				// line-height: 120upx;
			}
		}
	}
	
	
	
	
</style>
