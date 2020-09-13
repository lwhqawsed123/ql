<template>
	<view class="content">
		<uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="onClick($event,item)" v-for="item in record_list"
			 :key="item.id" style="margin-top: 24upx;">
				<view class="record_item">
					<view class="record_date">
						{{item.createTime}}
					</view>
					<view class="record_content">
						<view class="gift_name">
							礼物名称：{{item.giftName}}
						</view>
						<view class="gift_integral">
							使用积分：{{item.scoreUsed}}
						</view>
						<view class="gift_img_box">
							<image class="gift_img_img" :src="imageBaseUrl+pics" mode="" v-for="(pics,index) in item.pics" :key='pics'
							 @click="previewImage(item.pics,index)"></image>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<view class="empty_Data" v-if="record_list.length===0">
			没有更多数据了!
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
				child_id: 0,
				record_list: []
			}
		},
		onReady() {
			this.$api.sdkReady({
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
			})
		},
		onLoad(e) {
			this.child_id = e.id
		},
		onShow() {
			this.getRecord()
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user,
				options: state => state.options,
			})
		},
		methods: {
			getRecord() {
				this.$api.get({
					url: `child/gift/child/${this.child_id}`,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							if (data.length.length !== 0) {
								data.forEach(item => {
									item.createTime = item.createTime.slice(0, 10)
									item.pics = item.pics ? item.pics.split(',') : []
								})
							}
							this.record_list = data
							console.log(res)
						}
					}
				})
			},
			deleteCardById(id){
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.delete({
					url: `child/gift/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getRecord()
								uni.showToast({
									title: '删除成功',
									icon: "none",mask:true
								});
							}, 1000)
				
						}
					}
				})
			},
			// 开启预览
			previewImage(list, index) {
				let arr = JSON.parse(JSON.stringify(list))
				let img_arr = arr.map(item => {
					return this.imageBaseUrl + item
				})
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
				});
			},
			onClick(e, item) {
				console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text)
				if (e.index === 1) {
					uni.navigateTo({
						url: `../gift/gift?id=${this.child_id}&gift_id=${item.id}`
					})
				} else if (e.index === 2) {
					this.deleteCardById(item.id)
				}
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		width: 100%;
		.empty_Data{
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}
		.record_item {
			box-sizing: border-box;
			padding-bottom: 24upx;
			margin-top: 20upx;
			background-color: #FFFFFF;
			width: 100%;

			.record_date {
				box-sizing: border-box;
				padding: 0 26upx;
				font-size: 28upx;
				color: #333333;
				line-height: 72upx;
				width: 100%;
				height: 72upx;
				background: #F3F3F3;
			}

			.record_content {
				box-sizing: border-box;
				padding: 0 26upx;
				background-color: #FFFFFF;

				.gift_name {
					margin-top: 30upx;
					font-size: 28upx;
					color: #333333;
				}

				.gift_integral {
					margin: 24upx 0;
					font-size: 28upx;
					color: #333333;
				}

				.gift_img_box {
					// margin-bottom: 26upx;
					display: flex;
					align-items: center;

					// justify-content: space-between;
					.gift_img_img {
						width: 30%;
						height: 144upx;
						margin-right: 5%;
						box-sizing: border-box;
						border: 2upx solid #CCCCCC;

						&:nth-child(3n) {
							margin-right: 0;
						}
					}
				}
			}
		}







	}
</style>
