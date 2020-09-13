<template>
	<view class="content">
		<scroll-view  scroll-y="true" :style="{height: `${186*cardList.length}upx`}" >
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" @click="onClick($event,item)" @change="change" v-for="item in cardList"
				 :key="item.id" style="margin-top: 24upx;">
					<view class="card_item">
						<image class="card_img" :src="imageBaseUrl+item.image" mode="" @click="navigateTo(`createCard/createCard?id=${item.id}`)"></image>
						<view class="card_box">
							<text class="card_name" @click="navigateTo(`createCard/createCard?id=${item.id}`)">{{item.title}}</text>
							<switch class="card_switch" color='#41CB4D' :checked="item.checked" @change.stop="changeDefaultCard(item.id)" />
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</scroll-view>
		
		<view class="empty_Data" v-if="cardList.length===0">
			你还没有名片哦!
		</view>
		<view class="next" @click="submit">
			添加名片
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
				checked: true,
				cardList: [],
			}
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl,
				user: state => state.user,
				options: state => state.options,
			})
		},
		onShow() {
			this.getAllCard()
		},
		onReady() {
			this.$api.sdkReady()
			// this.getAllCard()
		},
		methods: {
			// 获取所有名片
			getAllCard() {
				this.$api.get({
					url: `user/bizCard/user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							if (data.length === 0) {
								this.cardList = []
								return
							}
							data.forEach(item => {
								if (!item.cardType) {
									this.$set(item, "checked", true)
								} else {
									this.$set(item, "checked", false)
								}
							})
							this.cardList = data
						}
					}
				})
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			changeDefaultCard(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.post({
					url: `user/bizCard/type?cardId=${id}&userId=${this.user.id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getAllCard()
								uni.showToast({
									title: '修改成功',
									icon: "none",
									mask: true
								});
							}, 1000)

						}
					}
				})
			},
			submit() {
				uni.navigateTo({
					url: './newCard/newCard'
				})
			},
			// 删除名片
			deleteCardById(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.delete({
					url: `user/bizCard/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getAllCard()
								uni.showToast({
									title: '删除成功',
									icon: "none",
									mask: true
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
						url: `./newCard/newCard?id=${item.id}`
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
		padding: 0 24upx;
		height: 100%;
	}

	.content {
		background-color: #F9F9F9;
		box-sizing: border-box;
		overflow: hidden;
		padding-bottom: 108upx;

		.card_item {
			// margin-top: 24upx;
			width: 100%;
			height: 162upx;
			display: flex;
			background-color: #FFFFFF;

			.card_img {
				height: 100%;
				width: 190upx;
				margin-right: 20upx;
			}

			.card_box {
				flex: 1;
				height: 100%;
				display: flex;
				font-size: 32upx;
				color: #333333;
				justify-content: space-between;
				align-items: center;
				padding-right: 20upx;

				.card_name {
					word-break: break-all;
					text-align: left;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					/*自适应盒子*/
					-webkit-line-clamp: 1;
					/*此处为1行,如果是两行就改成2*/
					-webkit-box-orient: vertical;
				}

				.card_switch {
					// width: 200upx;
					// height: 56upx;
					// uni-switch .uni-switch-input{
					// 	width: 200upx;
					// 	height: 56upx;
					// }
				}
			}
		}

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}

		.next {
			position: fixed;
			box-sizing: border-box;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 84upx;
			background: #EE4F16;
			border-radius: 2px;
			color: #FFFFFF;
			font-size: 36upx;
			text-align: center;
			line-height: 84upx;
		}
	}
</style>
