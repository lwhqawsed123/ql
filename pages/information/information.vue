<template>
	<view class="content">
		<view class="meet_add">
			<view class="meet_list_item" v-for="item in content.list" :key="item.id" @click="navigateTo(`infoList/infoList?id=${item.id}&identifyName=${item.identifyName}`)">
				<text>{{item.name}}</text>
			</view>
		</view>
		<view>
			<uni-load-more :status="status" :content-text="contentText" color="#333333" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import request from "@/utils/request.js"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				identifyName: 'ZX',
				content: {
					pi: 1,
					ps: 20,
					total: 0,
					parentId: 0,
					list: []
				},
				status: 'more',
				statusTypes: [{
					value: 'more',
					text: '加载前'
				}, {
					value: 'loading',
					text: '加载中'
				}, {
					value: 'noMore',
					text: '没有更多数据了'
				}],
				contentText: {
					contentdown: '查看更多>>',
					contentrefresh: '加载中',
					contentnomore: '没有更多数据了'
				},
			};
		},
		onReady() {
			this.$api.sdkReady()
			this.getCatalogId(this.identifyName, this.content)
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading'
			uni.showNavigationBarLoading()
			console.log('reach');
			setTimeout(() => {
				// video未加载完时
				if (this.content.list.length < this.content.total) {
					this.loadMore(this.content)
				} else {
					// 如果全部加载完 显示没有更多数据
					this.status = 'noMore'
					uni.hideNavigationBarLoading()
					return
				}
				this.status = 'more'
				uni.hideNavigationBarLoading()
			}, 2000);
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 查询CatalogId
			async getCatalogId(identifyName, options) {
				let params = {
					pi: 1,
					ps: 5,
					query: `identifyName=${identifyName}`
				}
				let res = await request.axios({
					url: 'content/catalog/page',
					method: 'get',
					params: params
				})
				let {
					data,
					meta
				} = res
				if (meta.success) {
					options.parentId = data.content[0].id
					this.getAll(options)
				}
			},
			// 上拉获取更多
			loadMore(options) {
				if (options.list.length >= options.total) {
					return false;
				}
				options.pi += 1;
				this.getAll(options)
			},
			
			// 获取商品列表
			getAll(options) {
				let data = {
					query: `delFlag=0,catalog.parentId=${options.parentId}`,
					pi: options.pi,
					ps: options.ps
				}
				this.$api.get({
					url: 'content/page',
					params: data,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							options.total = data.totalElements
							// 拼接数组
							options.list.push.apply(options.list, data.content)
						}
					}
				})
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
	}

	.content {
		width: 100%;
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 26upx 0 24upx;

		.meet_add {
			width: 100%;
			position: relative;
			background-color: #FFFFFF;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 26upx;

			.meet_list_item {
				border: 2upx solid #CCCCCC;
				border-radius: 10upx;
				width: 210upx;
				height: 210upx;
				background-color: #f8f8f8;
				box-sizing: border-box;
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
				word-break: break-all;
				padding: 10upx;
				margin-right: 35upx;
				margin-top: 26upx;

				&:nth-child(3n) {
					margin-right: 0;
				}

				text {
					font-size: 28upx;
					color: #333333;
				}
			}
		}
	}
</style>
