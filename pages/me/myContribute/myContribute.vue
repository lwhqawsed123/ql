<template>
	<view class='content'>
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
				<view class="main video_list">
					<view class="video_item"  v-for="item in vedioList" :key="item.id" @click="navigateTo(`/pages/videoDetail/videoDetail?id=${item.id}`)">
						<view class="video_item_header">
							<view class="video_item_header_left">
								<image src="../../../static/index/Rectangle%207.jpg" mode=""></image>
								<text>{{item.catalog.name}}</text>
							</view>
							<view class="video_item_header_right">
								<text>{{item.status===0?"待审核":(item.status===1?'审核通过':'审核未通过')}}</text>
								<!-- <image src="../../../static/index/Group%209%20Copy%202.jpg" mode=""></image> -->
							</view>
						</view>
						<view class="article_item">
							<image v-if="item.thumbnail" :src="imageBaseUrl+item.thumbnail" mode="" class="article_img"></image>
							<view class="article_content">
								<text class="article_title">{{item.name}}</text>
								<text class="article_num">阅读量：{{item.sumRead}}</text>
								<view class="article_collect">
									<text class="iconfont icon-xiugai article_collect_icon article_collect_edit" @click.stop="toEdit(item.id,'video')"></text>
									<text class="iconfont icon-shanchu article_collect_icon" @click.stop="showModal(item.id)"></text>
								</view>
							</view>
						</view>
					</view>
					<!-- <uni-swipe-action >
						<uni-swipe-action-item v-for="item in vedioList" :key="item.id" :options="options" @click="onClick(item,$event)" @change="change"  style="margin-top: 24upx;">
							
						</uni-swipe-action-item>
					</uni-swipe-action> -->
					<view class="empty_Data" v-if="vedioList.length===0">
						没有更多数据了!
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="main article_list">
					<view class="video_item"  v-for="item in articleList" :key="item.id" @click="navigateTo(`/pages/articleDetail/articleDetail?id=${item.id}`)">
						<!-- <view class="video_item_header">
							<view class="video_item_header_left">
								<image src="../../../static/index/Rectangle%207.jpg" mode=""></image>
								<text>产品</text>
							</view>
							<view class="video_item_header_right">
							</view>
						</view> -->
						<view class="video_item_header">
							<view class="video_item_header_left">
								<image src="../../../static/index/Rectangle%207.jpg" mode=""></image>
								<text>{{item.catalog.name}}</text>
							</view>
							<view class="video_item_header_right">
								<text>{{item.status===0?"待审核":(item.status===1?'审核通过':'审核未通过')}}</text>
								<!-- <image src="../../../static/index/Group%209%20Copy%202.jpg" mode=""></image> -->
							</view>
						</view>
						<view class="article_item">
							<image v-if="item.thumbnail" :src="imageBaseUrl+item.thumbnail" mode="" class="article_img"></image>
							<view class="article_content">
								<text class="article_title">{{item.name}}</text>
								<text class="article_num">阅读量：{{item.sumRead}}</text>
								<view class="article_collect">
									<text class="iconfont icon-xiugai article_collect_icon article_collect_edit" @click.stop="toEdit(item.id,'article')"></text>
									<text class="iconfont icon-shanchu article_collect_icon" @click.stop="showModal(item.id)"></text>
								</view>
							</view>
						</view>
					</view>
					<view class="empty_Data" v-if="articleList.length===0">
						没有更多数据了!
					</view>
				</view>
			</swiper-item>
		</swiper>

		<view class="cash_button">
			<button type="primary" @click="navigateTo('newContribute/newContribute')">发布</button>
		</view>
		<chunLei-popups v-model="showPopups.type" :x="showPopups.x" :y="showPopups.y" :popData="popupsData" :direction="'row'" @tapPopup="tapPopup">
		</chunLei-popups>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	import wx from '../../../utils/jsWeiXin.js'
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				checked: true,
				listHeight: 0, //内部的高度
				swiperHeight: 0, //外部的高度
				current: 0,
				heightList: '.video_list',
				vedioList: [],
				articleList: [],
				ps: 4,
				video_pi: 1,
				video_total: 0,
				article_pi: 1,
				article_total: 0,
				showPopups:{
					type:false,
					x:0,
					y:0
				},
				popupsData:[
					{
						title:'修改',
						icon:''
					},
					{
						title:'删除',
						icon:''
					}
				],
				checkedItem:{}
			}
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup,
			chunLeiPopups
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl,
				audioBaseUrl: state => state.audioBaseUrl,
				user: state => state.user,
				options: state => state.options,
			})
		},
		onShow() {
			// this.getAllbyQuery(1,5)
			// this.getAllbyQuery(1,6)
		},
		onReady() {
			this.$api.sdkReady()
			this.getAllbyQuery(1, 5)
			this.getAllbyQuery(1, 6)
		},
		onPullDownRefresh() {
			console.log('refresh');
			if (this.current === 0) {
				this.video_pi = 1
				this.getAllbyQuery(1, 5)
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			} else {
				this.video_pi = 1
				this.getAllbyQuery(1, 5)
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			}
		},
		// 上拉加载
		onReachBottom() {
			if (this.current === 0) {
				this.getMoreList('vedioList', 'video_total', 'video_pi', 5)
			} else {
				this.getMoreList('articleList', 'article_total', 'article_pi', 6)
			}

		},
		methods: {
			// 根据搜索条件获取列表
			getAllbyQuery(pi, parentId) {
				let data1 = {
					query: `delFlag=0,user=${this.user.id},catalog.parentId=${parentId}`,
					pi: pi,
					ps: this.ps
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
							if (parentId === 5) {
								this.vedioList = data.content
								this.video_total = data.totalElements
							} else if (parentId === 6) {
								this.articleList = data.content
								this.article_total = data.totalElements
								// this.getAllCollect(data.content)
							}
							console.log(data.content)
							this.$nextTick(() => {
								this.getlistHeight(this.heightList);
							})
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 上拉加载更多
			getMoreList(arrName, totalName, piName, parentId) {
				if (this[arrName].length >= this[totalName]) {
					return false;
				}
				this[piName] = this[arrName].length / this.ps + 1;
				let data = {
					query: `delFlag=0,user=${this.user.id},catalog.parentId=${parentId}`,
					pi: this[piName],
					ps: this.ps
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
							this[totalName] = data.totalElements
							this[arrName] = [...this[arrName], ...data.content]
							this.$nextTick(() => {
								this.getlistHeight(this.heightList)
							})
						}
					}
				})
			},
			// 用户点击分享
			shareTo(item) {
				let url = 'http://qili-mp.selfiot.cn/#/pages/videoDetail/videoDetail?id=' + item.id
				let img = item.thumbnail ? this.imageBaseUrl + item.thumbnail : ''
				let onlineImg = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1133621120,4268989205&fm=15&gp=0.jpg'
				wx.updateAppMessageShareData({
					title: item.name, // 分享标题
					desc: item.name, // 分享描述
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: img || onlineImg, // 分享图标
					success: function() {
						// 设置成功
						uni.showToast({
							title: "分享成功!",
							duration: 2000,mask:true
						});
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
					url: `content/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							console.log(res)
							setTimeout(() => {
								uni.hideLoading()
								this.getAllbyQuery(1, 6)
								uni.showToast({
									title: '删除成功',
									icon: "none",mask:true
								});
							}, 1000)

						}
					}
				})
			},
			toEdit(id, type) {
				let url = ''
				if (type === 'video') {
					url = `./newContribute/video?id=${id}`
				} else if (type === 'article') {
					url = `./newContribute/article?id=${id}`
				}
				uni.navigateTo({
					url: url
				})
			},
			showModal(id) {
				uni.showModal({
					title: '提示',
					content: '是否删除该内容?',
					success: (res) => {
						if (res.confirm) {
							this.deleteCardById(id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// ==============
			navigateTo(url) {
				uni.navigateTo({
					url: url,

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
			// 长按开启菜单
			openMenu(item,e) {
				console.log(e)
				this.showPopups.x=e.touches[0].pageX
				this.showPopups.y=e.touches[0].pageY
				this.checkedItem=item
				this.showPopups.type=true
			},
			tapPopup(e){
				if(e.title==="修改"){
					console.log("修改")
					let url=``
					this.navigateTo()
				}else if(e.title==="删除"){
					console.log("删除")
					console.log(this.checkedItem)
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #F9F9F9;
	}

	.content {
		width: 100%;

		.main {
			padding: 0 24upx;
			box-sizing: border-box;
		}

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}

		.content_tab {
			background: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
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

		.swiper {
			margin-bottom: 112upx;
			min-height: 1000upx;
		}

		.video_list,
		.article_list {
			width: 100%;

			.video_item {
				width: 100%;
				padding-top: 22px;
				box-sizing: border-box;

				.video_item_header {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.video_item_header_left {
						display: flex;
						align-items: center;

						image {
							width: 8upx;
							height: 28upx;
							margin-right: 16upx;
						}

						text {
							font-size: 28upx;
							color: #333333;
						}
					}

					.video_item_header_right {
						display: flex;
						align-items: center;

						image {
							width: 8upx;
							height: 20upx;
							margin-left: 10upx;
						}

						text {
							font-size: 24upx;
							color: #999999;
						}

					}
				}

				.article_item {
					width: 100%;
					height: 280upx;
					background-color: #FFFFFF;
					padding: 0 20upx;
					box-sizing: border-box;
					display: flex;
					align-items: center;

					.article_img {
						width: 342upx;
						height: 218upx;
						margin-right: 20upx;
					}

					.article_content {
						// width: 100%;
						height: 100%;
						flex: 1;
						position: relative;
						.article_title {
							font-size: 32upx;
							color: #333333;
							margin: 30upx 0;
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
							right: 20upx;
							bottom: 46rpx;

							display: flex;
							align-items: center;

							.article_collect_edit {
								margin-right: 15upx;
								margin-top: 6upx;
							}

							.article_collect_icon {
								font-size: 38upx;
								color: #333333;
							}
						}
					}

					&:last-child {
						margin-bottom: 0;
					}
				}
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
				line-height: 84upx;
			}
		}

	}
</style>
