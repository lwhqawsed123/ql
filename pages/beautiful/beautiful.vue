<template>
	<view class="content">
		<view class="content_tab">
			<view :class="!current?'tab_button active':'tab_button'" @click="changePage(0)">
				<text>视频</text>
			</view>
			<view :class="current?'tab_button active':'tab_button'" @click="changePage(1)">
				<text>文章</text>
			</view>
		</view>
		<swiper class="swiper" :current="current" @change="changeTab" :style="{height:swiperHeight+'px'}">
			<swiper-item>
				<view class="video_list">
					<view class="video_item" v-for="(item,index) in video.list" :key="item.id" @click="navigateTo(`/pages/videoDetail/videoDetail?id=${item.id}`)">
						<view class="video_box">
							<video v-if="!item.thumbnail" class="video_player" id="video" :direction="90" :src="videoBaseUrl+item.banner"
							 :controls="false" :show-center-play-btn="false"></video>
							<view v-if="item.thumbnail" class="video_thumbnail">
								<image class="video_thumbnail_img" :src="imageBaseUrl+item.thumbnail" mode=""></image>
								<image class="video_model" src="../../static/index/播放按钮@2x.png" mode=""></image>
							</view>
							<view class="video_button"></view>
							<image src="../../static/index/标签@2x.png" mode="" class="video_hot_icon" v-if="index<4"></image>
							<!-- <text class="video_time">11:03</text> -->
						</view>
						<text class="video_title">{{item.name}}</text>
					</view>
					<view class="empty_Data" v-if="video.list.length===0">
						没有更多数据了!
					</view>

				</view>
				
			</swiper-item>
			<swiper-item>
				<view class="article_list">
					<view class="article_item" v-for="(item,index) in article.list" :key="index" @click="navigateTo(`/pages/articleDetail/articleDetail?id=${item.id}`)">
						<image :src="imageBaseUrl+item.thumbnail" mode="" class="article_img" v-if="item.thumbnail"></image>
						<view class="article_content">
							<text class="article_title">{{item.name}}</text>
							<text class="article_num">阅读量：{{item.sumRead}}</text>
							<!-- <image src="../../static/index/分享@2x.png" mode="" class="article_share"></image> -->
							<image src="../../static/index/收藏-点亮@2x.png" mode="" class="article_collect" v-show="item.collect" @click.stop="removeCollect(item)"></image>
							<image src="../../static/index/收藏-默认@2x.png" mode="" class="article_collect" v-show="!item.collect" @click.stop="toCollect(item)"></image>
						</view>
					</view>
					<view class="empty_Data" v-if="article.list===0">
						没有更多数据了!
					</view>

				</view>
			</swiper-item>
		</swiper>
		<view >
			<uni-load-more :status="current==0?video.status:article.status" :content-text="contentText" :color="current==0?video.color:article.color" />
		</view>
		<backTop :src="backTop.src" :scrollTop="backTop.scrollTop"></backTop>
	</view>
</template>

<script>
	import backTop from '@/components/back-top/back-top.vue';
	import starEmpty from "../../static/index/收藏-默认@2x.png"
	import starLight from "../../static/index/收藏-点亮@2x.png"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import request from "@/utils/request.js"
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				checked: false,
				startData: {},
				listHeight: 0, //内部的高度
				swiperHeight: 0, //外部的高度
				current: 0,
				vedioList: [],
				articleList: [],
				
				backTop: {
					src: '../../static/back-top/top.png',
					scrollTop: 0
				},
				video: {
					pi: 1,
					ps: 8,
					total: 0,
					parentId: 0,
					list: [],
					heightList: '.video_list',
					color:'#333333',
					status:'more'
				},
				article: {
					pi: 1,
					ps: 8,
					total: 0,
					parentId: 0,
					list: [],
					heightList: '.article_list',
					color:'#333333',
					status:'more'
				},
				scrollTop: 0,
				status: 'more',
				color:'#333333',
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
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl,
				user: state => state.user
			})
		},
		components: {
			backTop,
			uniLoadMore
		},
		onPageScroll(e) {
			this.backTop.scrollTop = e.scrollTop;
		},
		onShow() {

		},
		onReady() {
			this.$api.sdkReady()
			// this.getAllbyQuery(5)
			// this.getAllbyQuery(6)
			this.getCatalogId('JKML-SP', this.video)
			this.getCatalogId('JKML-WZ', this.article)
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading'
			uni.showNavigationBarLoading()
			console.log('reach');
			setTimeout(() => {
				// video未加载完时
				if (this.current == 0) {
					if (this.video.list.length < this.video.total) {
						this.loadMore(this.video)
					} else {
						// 如果全部加载完 显示没有更多数据
						this.video.status = 'noMore'
						uni.hideNavigationBarLoading()
						return
					}
				} else {
					if (this.article.list.length < this.article.total) {
						this.loadMore(this.article)
					} else {
						// 如果全部加载完 显示没有更多数据
						this.article.status = 'noMore'
						uni.hideNavigationBarLoading()
						return
					}
				}
				this.status = 'more'
				uni.hideNavigationBarLoading()
			}, 2000);
		},
		methods: {
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
			// 获取商品列表
			getAll(options) {
				let data = {
					query: `delFlag=0,status=1,catalog.parentId=${options.parentId}`,
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
							console.log(options.list)
							if(options.list.length>=data.totalElements){
								options.status = 'noMore'
								options.color="#cccccc"
							}
							this.$nextTick(() => {
								this.getlistHeight(options.heightList);
							})
						}
					}
				})
			},
			// 上拉获取更多
			loadMore(options) {
				if (options.list.length >= options.total) {
					return false;
				}
				// options.pi = options.list.length / options.ps + 1;
				options.pi += 1;
				this.getAll(options)
			},
			// 根据搜索条件获取列表
			getAllbyQuery(id) {
				let data1 = {
					query: `delFlag=0,catalog.parentId=${id}`,
					pi: 1,
					ps: 100
				};
				this.$api.get({
					url: 'content/page',
					params: data1,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							if (data.totalElements === 0) {
								return
							}
							if (id === 5) {
								this.vedioList = data.content
							} else if (id === 6) {
								this.articleList = data.content
								this.getAllCollect(data.content)
							}
							this.$nextTick(() => {
								this.getlistHeight(this.heightList);
							})
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 获取文章收藏状态
			getAllCollect(content) {
				this.$api.get({
					url: `user/collection/user/${this.user.id}`,
					callback: res => {
						var {
							meta,
							data
						} = res
						if (meta.success) {
							for (var item in content) {
								this.$set(content[item], "collect", false)
								for (var list in data) {
									if (content[item].id === data[list].content.id) {
										this.$set(content[item], "collect", true)
									}
								}
							}
							// content.forEach(item => {
							// 	this.$set(item,"collect",false)
							// 	data.forEach(list => {
							// 		if (item.id === list.content.id) {
							// 			this.$set(item,"collect",true)
							// 		}
							// 	})
							// })
						} else {
							// this.$message.error(data);
						}
					}
				})
			},
			// 取消收藏
			removeCollect(item) {
				let data1 = {
					query: `content=${item.id},user=${this.user.id}`,
					pi: 1,
					ps: 100
				};
				this.$api.get({
					url: 'user/collection/page',
					params: data1,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							console.log(data.content[0].id)
							let collection_id = data.content[0].id
							this.$api.delete({
								url: `user/collection/del/${collection_id}`,
								callback: res => {
									let {
										meta,
										data
									} = res;
									if (meta.success) {
										this.$set(item, 'collect', false)
									} else {
										// this.$message.error(data);
									}
								}
							})
						} else {
							// this.$message.error(data);
						}
					}
				})

			},
			// 点击收藏
			toCollect(item) {
				let data = {
					user: {
						id: this.user.id
					},
					content: {
						id: item.id
					}
				}
				this.$api.post({
					url: 'user/collection/new',
					params: data,
					callback: (res) => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.$set(item, "collect", true)
						} else {
							// this.$message.error(data);
						}
					}
				})
			},
			changePage(target) {
				this.current = target
			},
			getlistHeight(list) {
				let _this = this
				let info = uni.createSelectorQuery().select(list);
				info.boundingClientRect(function(data) {
					// console.log(data.height)  // 获取元素的各种参数
					_this.listHeight = data.height; // 获取元素高度
					_this.getHeight();
				}).exec();
			},
			getHeight() {
				let _this = this;
				_this.swiperHeight = _this.listHeight;
				return _this.swiperHeight;
			},
			changeTab(e) {
				let _this = this;
				this.current = e.target.current
				// 不同的tab不同的高度赋不同的值
				if (e.target.current == 0) {
					_this.checked = false
					let list = ".video_list";
					_this.getlistHeight(list);
				} else if (e.target.current == 1) {
					_this.checked = true
					let list = ".article_list";
					_this.getlistHeight(list);
				}
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,

				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.content {
		box-sizing: border-box;
		padding: 0 24upx;

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}

		.content_tab {
			width: 100%;
			height: 84upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.tab_button {
				width: 72upx;
				height: 50upx;
				text-align: center;
				line-height: 50upx;
				font-size: 36upx;
				color: #333333;
				border-bottom: 6upx solid #FFFFFF;

				&:last-child {
					margin-left: 226upx;
				}
			}

			.active {
				color: #EE4F16;
				border-bottom: 6upx solid #EE4F16;
			}

		}

		.video_list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.video_item {
				width: 342upx;
				margin-bottom: 32upx;

				.video_box {
					width: 100%;
					height: 218upx;
					position: relative;

					.video_player {
						height: 100%;
						width: 100%;
					}

					.video_thumbnail {
						height: 100%;
						width: 100%;
						z-index: 99;
						background-color: #000000;
						text-align: center;
						position: relative;

						.video_thumbnail_img {
							height: 100%;
							width: 100%;
						}

						.video_model {
							position: absolute;
							width: 66upx;
							height: 78upx;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							z-index: 99;
						}
					}

					.video_button {
						position: absolute;
						z-index: 999;
						width: 100%;
						height: 100%;
						left: 0;
						top: 0;
					}

					.video_img {
						width: 100%;
						height: 100%;
					}

					// .video_button {
					// 	position: absolute;
					// 	z-index: 1;
					// 	width: 64upx;
					// 	height: 78upx;
					// 	left: 50%;
					// 	top: 50%;
					// 	transform: translate(-50%, -50%);
					// }

					.video_hot_icon {
						width: 112upx;
						height: 44upx;
						position: absolute;
						z-index: 99;
						left: 0;
						bottom: 10upx;
					}

					.video_time {
						position: absolute;
						color: #FFFFFF;
						font-size: 24upx;
						z-index: 1;
						right: 16upx;
						bottom: 14upx;
					}
				}

				.video_title {
					width: 100%;
					font-size: 32upx;
					color: #333333;
					line-height: 64upx;

					word-break: break-all;
					/*允许在单词内换行*/
					text-align: center;
					text-overflow: -o-ellipsis-lastline;
					/*css3中webkit内核提供的一个方法类似ellipsis*/
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					/*自适应盒子*/
					-webkit-line-clamp: 1;
					/*此处为1行,如果是两行就改成2*/
					-webkit-box-orient: vertical;
				}
			}
		}

		.article_list {
			width: 100%;
			display: flex;
			flex-flow: column;

			.article_item {
				width: 100%;
				height: 184upx;
				background-color: #FFFFFF;
				margin-bottom: 20upx;
				padding: 0 20upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;

				.article_img {
					width: 200upx;
					height: 148upx;
					margin-right: 20upx;
				}

				.article_content {
					width: 100%;
					height: 100%;
					position: relative;

					.article_title {
						font-size: 32upx;
						color: #333333;
						margin: 20upx 0;
						word-break: break-all;
						/*允许在单词内换行*/
						text-align: left;
						text-overflow: -o-ellipsis-lastline;
						/*css3中webkit内核提供的一个方法类似ellipsis*/
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						/*自适应盒子*/
						-webkit-line-clamp: 2;
						/*此处为1行,如果是两行就改成2*/
						-webkit-box-orient: vertical;
					}

					.article_num {
						display: block;
						font-size: 24upx;
						color: #999999;
					}

					.article_share {
						position: absolute;
						right: 80upx;
						bottom: 16rpx;
						width: 40upx;
						height: 40upx;
					}

					.article_collect {
						position: absolute;
						right: 16upx;
						bottom: 16rpx;
						width: 40upx;
						height: 40upx;
					}
				}

				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
