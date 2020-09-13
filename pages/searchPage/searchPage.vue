<template>
	<view class="flex_box">
		<view>
			<!-- <block v-for="(item , index) in content.list" :key="item.id">
				<view class="video_item" @click="navigateTo(`/pages/videoDetail/videoDetail?id=${item.id}`)">
					<view class="video_box">
						<video class="video_player" id="video" :direction="90" :src="videoBaseUrl+item.banner" :controls="false"
						 :show-center-play-btn="false"></video>
						<view class="video_button"></view>
					</view>
					<view class="article_content">
						<text class="article_title">{{item.name}}</text>
						<text class="article_num">阅读量：{{item.sumRead}}</text>
						<text class="article_num">#{{item.catalog.name}}</text>
	
					</view>
				</view>
			</block> -->
			<block v-for="(item) in contentList" :key="item.id">
				<view class="article_item" @click="navigateTo(item)">
					<view class="article_img_box" v-if="item.thumbnail&&item.contentType!=='VIDEO'">
						<image :src="imageBaseUrl+item.thumbnail" mode="" class="article_img" ></image>
					</view>
					<view class="video_box" v-if="item.contentType==='VIDEO'">
						<video class="video_player" id="video" :direction="90" :src="videoBaseUrl+item.banner" :controls="false"
						 :show-center-play-btn="false"></video>
						<view class="video_button"></view>
					</view>
					<view class="article_content">
						<text class="article_title">{{item.name}}</text>
						<view class="article_msg">
							<text class="article_num">阅读量：{{item.sumRead}}</text>
							<text class="article_num">{{item.catalog.name}}</text>
						</view>
						
					</view>
				</view>
			</block>
			<view class="empty_Data" v-if="contentList.length===0">
				没有更多数据了!
			</view>
		</view>
		<!-- <view>
			<uni-load-more :status="status" :content-text="contentText" color="#333333" />
		</view> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import empty_img from "@/static/index/二维码默认占位@2x.png"
	import request from "@/utils/request.js"
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				query:'',
				content:{
					list:[],
					pi: 1,
					ps: 5,
					total: 0
				},
				contentList:[],
				catalog:{
					sp:0,
					wz:0
				},
				empty_img: empty_img,
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
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl
			})
		},
		onLoad(e) {
			console.log(e)
			this.query=e.query
		},
		onReady() {
			this.$api.sdkReady()
			let pages = getCurrentPages();
			this.prevPage = pages[pages.length - 1]; //上一个页面
			this.getCatalog()
			this.getAll()
		},
		// 上拉加载
		// onReachBottom() {
		// 	this.status = 'loading'
		// 	uni.showNavigationBarLoading()
		// 	setTimeout(() => {
		// 			// 还加载完,开始加载文章
		// 			if (this.content.list.length < this.content.total) {
		// 				this.loadMore(this.content)
		// 			} else {
		// 				// 如果全部加载完 显示没有更多数据
		// 				this.status = 'noMore'
		// 				uni.hideNavigationBarLoading()
		// 				return
		// 			}
		// 		this.status = 'more'
		// 		uni.hideNavigationBarLoading()
		// 	}, 2000);
		// },
		methods: {
			// 查询CatalogId
			async getCatalog(identifyName) {
				this.$api.get({
					url:'content/catalog/all',
					callback: res => {
						let {
							data,
							meta
						} = res
						console.log(res)
						if (meta.success) {
							data.forEach(item=>{
								if(item.identifyName==='JKML-SP'){
									this.catalog.sp=item.id
								}else if(item.identifyName==='JKML-WZ'){
									this.catalog.wz=item.id
								}
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
			// 根据搜索条件查询列表
			getAll(options) {
				
				this.$api.get({
					url: `content/search?keyword=${this.query}`,
					callback: res => {
						let {
							data,
							meta
						} = res
						console.log(res)
						if (meta.success) {
							this.contentList=data
							// options.total = data.totalElements
							// // 拼接数组
							// options.list.push.apply(options.list, data.content)
						}
					}
				})
			},
			navigateTo(item){
				let url=''
				if(item.contentType==="VIDEO"){
					url=`/pages/videoDetail/videoDetail?id=${item.id}`
				}else if(item.contentType==="TEXT"){
					url=`/pages/articleDetail/articleDetail?id=${item.id}`
				}else{
					url=`/pages/articleDetail/articleDetail?id=${item.id}`
				}
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
		box-sizing: border-box;
		padding-top: 20upx;
		width: 100%;
	}
	
	.flex_box {
		padding: 0 24upx;
		background-color: #FFFFFF;
		.empty_Data {
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}
		.bottom_button_fixed {
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			display: flex;
			align-items: center;
			justify-content: space-between;
	
			.from-submit {
				width: 336upx;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
	
			.from-cancel {
				background: #FDA228;
			}
	
			.from-disabled {
				background: #CCCCCC;
			}
		}
		
	}
	
	.flex_box {
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-bottom: 112upx;
		.video_item {
			width: 100%;
			height: 266upx;
			border-bottom: 2upx solid #EEEEEE;
			display: flex;
			align-items: center;
			padding: 0 20upx;
			box-sizing: border-box;
	
			
	
			.article_content {
				flex: 1;
				height: 100%;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.article_title {
					font-size: 32upx;
					color: #333333;
					// margin: 20upx 0;
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
				.article_msg{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.article_num {
						// display: block;
						// height: 34upx;
						font-size: 24upx;
						color: #999999;
					}
				}
	

			}
		}

		.article_item {
			width: 100%;
			height: 184upx;
			background-color: #FFFFFF;
			margin-bottom: 20upx;
			padding: 0 10upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			border-bottom: 2upx solid #EEEEEE;
	
			.video_box {
				width: 342upx;
				height: 100%;
				position: relative;
				display: flex;
				align-items: center;
				margin-right: 20upx;
				box-sizing: border-box;
				padding: 10upx 6upx;
				.video_player {
					height: 100%;
					width: 100%;
				}
	
				.video_button {
					position: absolute;
					z-index: 9;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
				}
	
				.video_hot_icon {
					width: 112upx;
					height: 44upx;
					position: absolute;
					z-index: 1;
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
	
			.article_img_box {
				width: 200upx;
				height: 148upx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20upx;
	
				.article_img {
					height: 100%;
				}
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
				.article_msg{
					display: flex;
					flex-direction: column;
					.article_num {
						// display: block;
						// height: 34upx;
						font-size: 24upx;
						color: #999999;
					}
				}
	

			}
	
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
	
</style>
