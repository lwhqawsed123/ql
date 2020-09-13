<template>
	<view class="content">
		<Navitop v-if="cardId" ></Navitop>
		<view class="video_box">
			<view class="video_play">
				<video class="video" id="myVideo" :direction="90" :src="videoBaseUrl+content.banner" @error="videoErrorCallback"
				 controls></video>
			</view>
			<!-- <image src="../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image> -->
		</view>
		<!-- <view class="main_messages">
			<view class="main_title_box">
				<view class="main_title_header">
					<text class="main_title">{{content.name}}</text>
					<view v-if="cardId" class="user_card" @click="toCard">
						查看名片
					</view>
				</view>
				<text class="main_type">视频</text>
				<text class="iconfont icon-fenxiang article_share" @click="toShare"></text>
				<image src="../../static/index/收藏%20copy%202.jpg" mode="" class="article_collect" v-if="!collective" @click="toCollect"></image>
				<image src="../../static/index/收藏.png" mode="" class="article_collect" v-if="collective" @click="removeCollect"></image>
			</view>
			<view class="data_messages">
				<view class="data_messages_author">
					<text>发布者: {{content.user?content.user.name:'安然齐力'}}</text>
				</view>
				<view class="data_messages_time">
					<text>发布时间: {{content.createTime}}</text>
				</view>
				<view class="data_messages_time">
					<text>阅读量: {{content.sumRead}}人次</text>
				</view>
			</view>
		</view> -->
		<view class="article_author">
			<view class="article_author_icon" v-if="content.user&&content.user.avatar">
				<image :src="content.user.avatar" mode=""></image>
			</view>
			<view class="article_author_name_box">
				<view class="article_author_name">
					<text class="article_author_name_text">发布者: {{content.user?content.user.name||content.user.nickName:'安然齐力'}}</text>
					<view class="article_statistics">
						<text class="iconfont icon-yanjing article_statistics_icon"></text>
						<text class="article_sumRead">{{content_statistics.sumRead}}</text>
						<text class="iconfont icon-fenxiang article_statistics_icon"></text>
						<text class="article_share">{{content_statistics.sumShare}}</text>
					</view>
				</view>
				<view class="article_author_message">
					<text class="article_author_time">{{content.createTime}}</text>
					<text class="article_author_line" v-if="authorTitle"></text>
					<text class="article_author_cardname" v-if="authorTitle">{{authorTitle}}</text>
				</view>
			</view>
			<view class="article_author_card_box user_card" v-if="cardId" @click="toCard">
				查看名片
			</view>
		</view>
		<view class="article_content" v-html="content.detail">

		</view>
	</view>
</template>

<script>
	import Navitop from '../../common/navigation.vue'
	import {mapState} from "vuex"
	import wx from '../../utils/jsWeiXin.js'
	export default {
		data() {
			return {
				id: '',
				content: {},	// 视频内容
				collective: false,	// 收藏状态
				collectData: {},	// 收藏
				href:window.location.href,
				card:{},	// 当前用户卡片
				cardId:0,	// 分享者id
				// 阅读记录/分享记录
				content_statistics: {
					sumRead: 0,
					sumShare: 0
				},
			}
		},
		components:{
			Navitop
		},
		computed:{
			...mapState({
				iamgeBaseUrl:state=>state.iamgeBaseUrl,
				videoBaseUrl:state=>state.videoBaseUrl,
				user:state=>state.user,
				shareImage:state=>state.shareImage,
			})
		},
		onLoad(options) {
			console.log("====options===")
			console.log(options)
			this.id = options.id
			this.cardId = options.cardId
		},
		onReady() {
			this.getbyId()
		},
		onShow() {
			// wx.onWindowResize((res) => {
			// 	console.log('onWindowResize:', res);
			// 	this.isLandscape = res.deviceOrientation === 'landscape';

			// 	if (this.isLandscape) {
			// 		if (!this.inPlay) {
			// 			this.videoContext.play();
			// 		}
			// 		this.fullScreen();
			// 	} else {
			// 		this.exitFullScreen();
			// 	}

			// });
		},
		methods: {
			// 初始化sdk
			initsdk() {
				// 初始化sdk
				this.$api.sdkReady({
					url: window.location.href.split('#')[0],
					ready: () => {
						let data = JSON.parse(JSON.stringify(this.content))
						let href = this.card.id ? `${this.href}&cardId=${this.card.id}` : this.href
						let imgUrl = this.content.thumbnail ? this.imageBaseUrl + this.content.thumbnail : this.shareImage
						console.log("=================")
						console.log('card是:'+this.card.id)
						console.log(href)
						wx.updateAppMessageShareData({
							title: this.content.name, // 分享标题
							desc: this.content.description||'安然齐力公众号', // 分享描述
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: imgUrl, // 分享图标
							success: function() {
								// 设置成功
							}
						});
						wx.updateTimelineShareData({
							title: this.content.name, // 分享标题
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: imgUrl, // 分享图标
							success: function() {
								// 设置成功
							}
						})
					}
				})
			},
			// 根据id获取视频信息
			getbyId() {
				this.$api.get({
					url: `content/${this.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							data.createTime = this.$common.dateToString(data.createTime)
							this.content = data
							this.getCollectiveByid()
							this.getUserCard()
							this.createRead(data.id)
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 请求访问次数
			getSumRead(contentId) {
				this.$api.get({
					url: `biz/read/content/${contentId}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						console.log(res)
						if (meta.success) {
							this.content_statistics.sumRead = data.length
						}
					}
				})
			},
			// 请求分享次数
			getSumShare(contentId) {
				this.$api.get({
					url: `biz/share/content/${contentId}`,
					callback: res => {
						
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.content_statistics.sumShare = data.length
						}
					}
				})
			},
			// 监听用户从分享链接进入页面
			beforeCreateShare(content_id,id){
				this.$api.get({
					url: `user/bizCard/${id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let user_id=data.user.id
							this.createShare(content_id,user_id)
						}
					}
				})
			},
			// 增加分享记录
			createShare(content_id,userId){
				let params={
					content:{
						id:content_id
					},
					user:{
						id:userId
					}
				}
				this.$api.post({
					url:'biz/share/new',
					params:params,
					callback:res=>{
					}
				})
			},
			// 增加用户访问记录
			createRead(id){
				let params={
					content:{
						id:id
					},
					user:{
						id:this.user.id
					}
				}
				this.$api.post({
					url:'biz/read/new',
					params:params,
					callback:res=>{}
				})
			},
			// 根据用户id和视频内容id查询是否被收藏
			getCollectiveByid() {
				let data = {
					query: `content=${this.id},user=${this.user.id}`,
					pi: 1,
					ps: 100
				}
				this.$api.get({
					url: `user/collection/page`,
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.collective = data.totalElements === 0 ? false : true
							this.collectData = data.content[0]
							return data
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 取消收藏
			removeCollect() {
				if (this.collectData.totalElements !== 0) {
					let id = this.collectData.id
					console.log(id)
					this.$api.delete({
						url: `/user/collection/del/${id}`,
						callback: res => {
							let {
								meta,
								data
							} = res;
							if (meta.success) {
								this.getCollectiveByid()
							} else {
								// this.$message.error(data);
							}
						}
					})
				} else {
					return
				}
			},
			// 点击收藏
			toCollect() {
				let data = {
					user: {
						id: this.user.id
					},
					content: {
						id: this.content.id
					}
				}
				console.log('user.id==' + this.user.id + '  content.id==' + this.content.id)
				this.$api.post({
					url: 'user/collection/new',
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.getCollectiveByid()
						} else {
							// this.$message.error(data);
						}
					}
				})
			},
			// ====分享=====
			// 点击分享按钮
			toShare(){
				uni.showToast({
					title: '点击右上角分享',
					icon: "none"
				});
			},
			// 加载时获取用户名片
			getUserCard(){
				if (!this.user.id) {
					this.initsdk()
					return
				}
				this.$api.get({
					url:`user/bizCard/user/${this.user.id}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							if (data.length !== 0) {
								data.forEach(item => {
									if (item.cardType === 0) {
										this.card = item
									}
								})
							}
							this.initsdk()
						}
					}
				})
			},
			// 点击分享按钮
			toCard(){
				uni.navigateTo({
					url:`/pages/me/myCard/createCard/createCard?id=${this.cardId}`
				})
			},
			videoErrorCallback(e) {
				console.log("=====没有获取到url=====")
				// uni.showModal({
				// 	content: e.target.errMsg,
				// 	showCancel: false
				// })
			}
		}
	}
</script>

<style lang="less">
	.content {
		width: 100%;
		padding: 10upx 24upx 0 24upx;
		box-sizing: border-box;

		.video_box {
			width: 100%;
			height: 268upx;

			// image {
			// 	width: 100%;
			// 	height: 100%;
			// }
			.video_play {
				width: 100%;
				height: 100%;

				.video {
					width: 100%;
					height: 100%;
				}
			}
		}
		.article_author {
			margin: 20upx 0;
			font-size: 28upx;
			color: #666666;
			display: flex;
			align-items: center;
			height: 80upx;
			width: 100%;
		
			.article_author_icon {
				width: 80upx;
				height: 80upx;
		
				image {
					border-radius: 50%;
					overflow: hidden;
					width: 60upx;
					height: 60upx;
				}
			}
		
			.article_author_name_box {
				flex: 1;
				height: 100%;
		
		
				.article_author_name {
					font-size: 28upx;
					color: #000000;
					display: flex;
					align-items: center;
					justify-content: space-between;
		
					.article_author_name_text {}
		
					.article_statistics {
						font-size: 20upx;
						color: #666666;
						display: flex;
						align-items: center;
		
						.article_statistics_icon {}
		
						.article_sumRead {
							margin: 0 10upx;
						}
		
						.article_statistics_icon {}
		
						.article_share {
							margin-left: 10upx;
						}
					}
				}
		
				.article_author_message {
					color: #919191;
					font-size: 20upx;
					display: flex;
					align-items: center;
		
					.article_author_time {}
		
					.article_author_line {
						display: inline-block;
						width: 2upx;
						height: 20upx;
						margin: 0 20upx;
						background-color: #919191;
					}
		
					.article_author_cardname {}
				}
			}
		
			.article_author_card_box {
				width: 160upx;
				height: 60upx;
				background-color: pink;
			}
		
			.user_card {
				background: #EE4F16;
				border-radius: 10upx;
				width: 164upx;
				height: 64upx;
				color: #FFFFFF;
				font-size: 28upx;
				text-align: center;
				line-height: 64upx;
				margin-left: 10upx;
			}
		
		}
		.main_messages {
			margin-top: 30upx;
			width: 100%;

			.main_title_box {
				width: 100%;
				position: relative;
				.main_title_header{
					width: 100%;
					display: flex;
					align-items: center;
					.main_title {
						flex: 1;
						font-size: 40upx;
						line-height: 64upx;
						color: #333333;
						display: block;
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
					.user_card{
						background: #EE4F16;
						border-radius: 1px;
						width: 164upx;
						height: 64upx;
						color: #FFFFFF;
						font-size: 28upx;
						text-align: center;
						line-height: 64upx;
						margin-left: 10upx;
					}
				}
				

				.main_type {
					font-size: 40upx;
					color: #333333;
				}

				.article_share {
					position: absolute;
					right: 58upx;
					bottom: -16upx;
					// width: 48upx;
					// height: 40upx;
					font-size: 60upx;
				}

				.article_collect {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 40upx;
					height: 40upx;
				}
			}

			.data_messages {
				margin: 20upx 0 36upx 0;
				font-size: 28upx;
				color: #666666;
				line-height: 40upx;
			}
		}

		.article_content {
			font-size: 36upx;
			color: #333333;
			line-height: 31px;
		}
	}
</style>
