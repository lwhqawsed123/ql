<template>
	<view class="witness_content">
		<!-- <uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="onClick($event,item)" @change="change" v-for="(item,i) in meetList"
			 :key="item.id" style="margin-top: 24upx;background-color: #F9F9F9;"> -->
		<view class="resume_item" v-for="(item) in meetList" :key="item.id" @click="navigateTo(`./chooseMeetImage?id=${item.id}`)" v-if="item.resources.length">
			<view class="resume_content">
				<view class="gift_name">
					{{item.name}}
				</view>
				<view class="gift_img_box" v-if="item.resources.length">
					<image v-for="(list,index) in item.resources" v-if="index<3" :key=list.id class="gift_img_img" :src="list.resFileName?imageBaseUrl+list.resFileName:'../../../static/index/Rectangle%2012%20Copy%202.jpg'"
					 mode=""></image>
				</view>

			</view>
		</view>
		<!-- 
			</uni-swipe-action-item>
		</uni-swipe-action> -->

		<view class="empty_Data" v-if="meetList.length===0">
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
				checked: true,
				metaId: '',
				meetList: [],
				catalogId: ''
			}
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
		onReady() {
			this.$api.sdkReady({
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
			})
		},
		onShow() {
			this.getCatalogId('YJMH')
		},
		methods: {
			// 获取发布美好模块catalog.id
			getCatalogId(identifyName) {
				let params = {
					pi: 1,
					ps: 5,
					query: `identifyName=${identifyName}`
				}
				this.$api.get({
					url: 'content/catalog/page',
					params: params,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let catalogId = data.content[0].id
							this.catalogId = catalogId
							this.getAllbyQuery(catalogId)
						}
					}
				})
			},
			// 获取第一张缩略图
			getAllbyQuery(id) {
				let data1 = {
					query: `delFlag=0,catalog.id=${id},user=${this.user.id}`,
					pi: 1,
					ps: 10000
				};
				this.$api.get({
					url: 'content/page',
					params: data1,
					callback: res => {
						console.log(res)
						let {
							meta,
							data
						} = res;
						if (meta.success) {

							this.meetList = data.content
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			choose_weet(item) {
				item.showPrice = !item.showPrice
				this.$api.put({
					url: 'content/update',
					params: item,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							uni.showToast({
								title: "更新成功",
								icon: "none",
								mask: true
							});
							this.getCatalogId('YJMH')
						} else {
							// this.$message.error(data);
						}
					}
				})
			},
			select_weet(item, meet, i) {
				uni.showLoading({
					mask: true
				})
				console.log(meet.id)
				// 当前已选中
				if (item.selected) {
					item.selected = !item.selected
					this.$api.put({
						url: `content/resource/update?contentId=${meet.id}`,
						params: item,
						noLoading: true,
						callback: res => {
							let {
								meta,
								data
							} = res
							if (meta.success) {
								this.getContentById(meet.id, i)
							}
						}
					})
				} else {
					// 当前未选中
					meet.resources.forEach((list, index) => {
						if (list.id === item.id) {
							list.selected = true
							this.$api.put({
								url: `content/resource/update?contentId=${meet.id}`,
								params: list,
								noLoading: true,
								callback: res => {
									let {
										meta,
										data
									} = res
									if (index === meet.resources.length - 1) {
										this.getContentById(meet.id, i)
									}
								}
							})
						} else {
							list.selected = false
							this.$api.put({
								url: `content/resource/update?contentId=${meet.id}`,
								params: list,
								noLoading: true,
								callback: res => {
									let {
										meta,
										data
									} = res
									if (index === meet.resources.length - 1) {
										this.getContentById(meet.id, i)
									}
								}
							})
						}
					})
				}

			},
			getContentById(id, i) {
				this.$api.get({
					url: `content/resource/content/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.meetList[i]
							this.$set(this.meetList[i], 'resources', data)
							setTimeout(() => {
								uni.hideLoading()
							}, 1000)
						}
					}
				})
			},
			createComparison() {
				console.log('发布对比')
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 开启预览
			previewImage(list, index) {
				let arr = JSON.parse(JSON.stringify(list))
				let img_arr = arr.map(item => {
					return this.imageBaseUrl + item.resFileName
				})
				console.log(img_arr)
				console.log(index)
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
				});
			},
			// 删除
			deleteById(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.delete({
					url: `content/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							console.log(id)
							console.log(res)
							setTimeout(() => {
								uni.hideLoading()
								this.getCatalogId('YJMH')
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
						url: `createMeet/createMeet?id=${item.id}`
					})
				} else if (e.index === 2) {
					this.deleteById(item.id)
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
		width: 100%;
		height: 100%;
	}

	.witness_content {
		width: 100%;
		padding-bottom: 132upx;

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}

		.resume_item {
			margin-top: 24upx;
			box-sizing: border-box;
			padding: 20upx;
			background-color: #FFFFFF;
			width: 100%;
			min-height: 112upx;
			display: flex;
			align-items: center;

			&:first-child {
				margin-top: 10upx;
			}

			.resume_content {
				box-sizing: border-box;
				background-color: #FFFFFF;
				overflow: hidden;

				.gift_name {
					font-size: 28upx;
					color: #333333;
					font-weight: 600;
				}

				.gift_img_box {
					margin-top: 50upx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					.gift_img_img {
						width: 204upx;
						height: 144upx;
						margin-right: 12upx;
						// margin-bottom: 20upx;
						border: 2upx solid #FFFFFF;

						&:nth-child(3n) {
							margin-right: 0;
						}
					}
				}

				.checked_for_weet {
					margin: 16upx 0 32upx 0;
					width: 100%;
					display: flex;
					align-items: center;

					.checked_box {
						width: 30upx;
						height: 30upx;
						box-sizing: border-box;
						margin-right: 10upx;
						border: 1px solid #979797;

						image {
							display: block;
							width: 100%;
							height: 100%;
						}
					}

					.is_active {
						border: none;
					}

					.tips_text {
						font-size: 24upx;
						color: #333333;
					}
				}


			}
		}

		.share_content {
			height: 100upx;
			width: 100%;
			padding: 0 30upx;
			background-color: #FFFFFF;
			opacity: 0.8;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 34upx;
			position: fixed;
			bottom: 0;
			left: 0;

			.share {
				color: #4ad360;
			}

			.collect {
				color: #f26b1d;
			}

			.collectived {
				color: #CCCCCC;
			}

			.line {
				width: 2upx;
				height: 46upx;
				background-color: #e0e0e0;
				margin: 0 115upx;
			}
		}

		.cash_button {
			position: fixed;
			z-index: 1;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 14upx 24upx;
			background-color: #FFFFFF;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;

			button {
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
			}
		}
	}
</style>
