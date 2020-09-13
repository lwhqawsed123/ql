<template>
	<view class="content">
		<Navitop v-if="cardId"></Navitop>
		<view class="article_box">
			<view class="main_title_header">
				<text class="main_title">{{content.name}}</text>
			</view>
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
							<text class="iconfont icon-shoucang article_collect" v-if="!collective" @click="toCollect"></text>
							<text class="iconfont icon-shoucang1 article_collected" v-if="collective" @click="removeCollect"></text>
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
			<!-- <view class="article_author">
				{{content.description}}
			</view> -->
			<view class="article_img" @click="previewOnce(imageBaseUrl+content.banner)">
				<image v-if="content.banner" :src="imageBaseUrl+content.banner" mode=""></image>
			</view>
			<view class="article_content" v-html="content.detail" ref="content_detail">

			</view>
		</view>
		<view class="comment_box">
			<view class="comment_title">
				评论
			</view>
			<view class="comment_content">
				<view class="comment_item" v-for="item in comment.commentList" :key="item.id">
					<view class="comment_item_user">
						<view class="comment_item_user_icon">
							<image :src="item.user.avatar" mode=""></image>
						</view>
					</view>
					<view class="comment_item_content">
						<view class="comment_item_header">
							<view class="comment_item_user_name" @longpress="copyToInput(item.user)">
								{{item.user.nickName}}
							</view>
						</view>
						<view class="comment_item_body">
							<view v-if="item.body" class="comment_item_body_text" :class="item.ellipsis?'text_ellipsis':''">
								{{item.body}}
							</view>
							<view v-if="item.body&&item.ellipsis" class="comment_item_body_more" @click="item.ellipsis=false">
								全文
							</view>
							<view class="comment_resource" v-if="item.resources.length">
								<view class="comment_resource_img_box" v-for="(list,index) in item.resources" :key="list.id">
									<image :src="imageBaseUrl+list.resFileName" mode="" @click="previewImage(index,item.resources)"></image>
								</view>
							</view>
							<view class="comment_item_send_time">
								{{item.send_time}}
							</view>
						</view>
					</view>
				</view>
				<view>
					<uni-load-more :status="status" :content-text="contentText" color="#333333" />
				</view>
			</view>
		</view>
		<view class="comment_input_box">
			<input type="text" value="" maxlength='255' ref="comment_input" placeholder='评论' class="comment_input" @blur="onfocus"
			 v-model="commentInputValue" @confirm="addComment" />
			<!-- <image src="../../static/index/笑脸@2x.png" mode="" class="comment_smile"></image> -->
			<image src="../../static/index/添加@2x.png" mode="" class="comment_add" @click="chooseImage"></image>
			<view class="gift_img_box" v-if="imageList.length!==0">
				<view class="card_img_box_view" v-for="(item,index) in imageList" :key="index" >
					<text class="iconfont icon-htmal5icon19 card_img_box_close" @click="removeImage('imageList',index)"></text>
					<image class="gift_img_img" :src="imageBaseUrl+item" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Navitop from '../../common/navigation.vue'
	import {
		mapState
	} from "vuex"
	import wx from '../../utils/jsWeiXin.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				id: '',
				content: {
					user: {}
				},
				collective: false,
				collectData: {}, // 收藏状态
				authorTitle:'',	// 发布者名片title
				comment: {
					total: 0, // 评论总数
					pi: 1,
					ps: 10,
					commentList: [], // 评论列表
				},
				// 阅读记录/分享记录
				content_statistics: {
					sumRead: 0,
					sumShare: 0
				},
				commentInputValue: '',
				href: window.location.href,
				card: {}, // 当前用户卡片
				cardId: 0, // 分享者id
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
				// 图片预览
				imageList: [],
				resource: {
					"id": 0,
					"redirectUrl": "",
					"resFileName": "",
					"resType": 0,
					"selected": true,
					"sort": 0,
					"title": ""
				}
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl,
				user: state => state.user,
				shareImage: state => state.shareImage,
			})
		},
		onLoad(options) {
			console.log("====options===")
			console.log(options)
			this.id = options.id
			this.cardId = options.cardId
			
		},
		onShow() {

		},
		onReady() {
			this.getbyId() // 获取文章
			this.getAllComment()
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading'
			uni.showNavigationBarLoading()
			setTimeout(() => {
				// video未加载完时
				if (this.comment.commentList.length < this.comment.total) {
					this.loadMore(this.comment)
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
			// 初始化sdk
			initsdk() {
				// 初始化sdk
				this.$api.sdkReady({
					url: window.location.href.split('#')[0],
					jsApiList:['updateAppMessageShareData', 'updateTimelineShareData','previewImage'],
					ready: () => {
						let data = JSON.parse(JSON.stringify(this.content))
						let href = this.card&&this.card.id ? `${this.href}&cardId=${this.card.id}` : this.href
						let imgUrl = this.content.thumbnail ? this.imageBaseUrl + this.content.thumbnail : this.shareImage
						wx.updateAppMessageShareData({
							title: this.content.name, // 分享标题
							desc: this.content.description || '安然齐力公众号', // 分享描述
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
							if(this.$common.isJSON(data.detail)){
								data.detail= JSON.parse(data.detail).html
							}else{
								// data.detail = data.detail.replace(/<img /g, "<img class='content_detail_image '")
							}
							this.content = data
							this.getCollectiveByid()
							this.getUserCard()
							if(this.cardId){
								this.beforeCreateShare(data.id,this.cardId)
							}
							this.createRead(data.id)
							this.getSumRead(data.id)
							this.getSumShare(data.id)
							this.getAuthorTitle(data.user)
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 获取内容发布者名片title
			getAuthorTitle(user){
				let authorTitle=''
				if(!this.user||!this.user.id){
					return 
				}
				this.$api.get({
					url: `user/bizCard/user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let card=''
							if (data.length !== 0) {
								data.forEach(item => {
									if (item.cardType === 0) {
										card = item
									}
								})
							}
							if(card){
								authorTitle=card.title
							}
							this.authorTitle=authorTitle
						}
					}
				})
			},
			// 增加用户访问记录
			createRead(id) {
				let params = {
					content: {
						id: id
					},
					user: {
						id: this.user.id
					}
				}
				this.$api.post({
					url: 'biz/read/new',
					params: params,
					callback:res=>{
						
					}
				})
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
			// 根据用户id和视频内容id查询是否被收藏
			getCollectiveByid() {
				if (!this.user.id) {
					return
				}
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
			// 页面加载时获取评论列表
			getAllComment() {
				let data = {
					query: `content=${this.id}`,
					pi: this.comment.pi,
					ps: this.comment.ps,
					sortBy: 'DESC',
					sortFiled: 'createTime'
				}
				this.$api.get({
					url: `content/comment/page`,
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							if (data.content.length !== 0) {
								data.content.forEach(item => {
									this.$set(item, "ellipsis", false)
									this.$set(item,"send_time",this.$common.strToDate(item.createTime))
									if (item.body.length >= 100) {
										this.$set(item, "ellipsis", true)
									}
								})
							}
							// 拼接数组
							this.comment.commentList.push.apply(this.comment.commentList, data.content)
							this.comment.total = data.totalElements
							if (this.comment.commentList.length === this.comment.total) {
								this.status = 'noMore'
							}
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 上拉获取更多
			loadMore(options) {
				if (options.commentList.length >= options.total) {
					return false;
				}
				options.pi += 1;
				this.getAllComment()
			},
			// 复制用户id到输入框
			copyToInput(user) {
				this.commentInputValue += ` @${user.nickName} `
			},
			// 发表评论
			addComment(e) {
				if (!this.commentInputValue.trim()&&!this.imageList.length) {
					return
				}
				let data1 = {
					body: this.commentInputValue,
					content: {
						id: this.content.id
					},
					user: {
						id: this.user.id
					}
				}
				this.$api.post({
					url: 'content/comment/new',
					params: data1,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.commentInputValue = ''
							this.comment.pi = 1
							this.comment.ps = 10
							this.comment.commentList = []
							this.addCommentResources(data.id)
						} else {

						}
					}
				})
			},
			// 创建评论的图片列表
			addCommentResources(id) {
				let imageList = JSON.parse(JSON.stringify(this.imageList))
				if (imageList.length === 0) {
					this.commentInputValue = ''
					this.comment.pi = 1
					this.comment.ps = 10
					this.comment.commentList = []
					this.getAllComment()
					return
				}
				imageList.forEach((item, index) => {
					let data1 = JSON.parse(JSON.stringify(this.resource))
					data1.resFileName = item
					this.$api.post({
						url: `content/resource/new?commentId=${id}`,
						params: data1,
						callback: res => {
							let {
								meta,
								data
							} = res
							if (meta.success) {
								if (index === this.imageList.length - 1) {
									this.commentInputValue = ''
									this.imageList = []
									this.comment.pi = 1
									this.comment.ps = 10
									this.comment.commentList = []
									this.getAllComment()
								}
							} else {

							}
						}
					})
				})
			},
			// ====分享=====
			// 点击分享按钮
			toShare() {
				uni.showToast({
					title: '点击右上角分享',
					icon: "none",mask:true
					
				});
			},
			// 加载时获取用户名片
			getUserCard() {
				if (!this.user.id) {
					this.initsdk()
					return
				}
				this.$api.get({
					url: `user/bizCard/user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
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
			toCard() {
				uni.navigateTo({
					url: `/pages/me/myCard/createCard/createCard?id=${this.cardId}`
				})
			},
			// 当input被点击
			onfocus(e) {
				this.$public_.onBlur()
				// setTimeout(() => {
				// const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
				// window.scrollTo(0, Math.max(scrollHeight - 1, 0))
				// }, 200)
			},
			// 删除图片url
			removeImage(url, index) {
				this[url].splice(index, 1)
			},
			// 上传图片
			chooseImage() {
				if (this.imageList.length >= 3) {
					uni.showToast({
						title: `最多只能选3张图片`,
						icon: "none"
					});
					return
				}
				this.$api.chooseImage({
					type: "img",
					callback: data => {
						this.imageList.push(data)
					}
				})
			},
			// 开启预览
			previewImage(index,images){
				console.log(images)
				let arr=JSON.parse(JSON.stringify(images))
				let img_list=arr.map(item=>{
					return this.imageBaseUrl+item.resFileName
				})
				 // 预览图片
				  wx.previewImage({
					current:img_list[index],
				    urls:img_list // 需要预览的图片http链接列表
				  });
			},
			// 开启预览
			previewOnce(imgUrl) {
				let imgArr=[]
				imgArr.push(imgUrl)
				wx.previewImage({
				  current: imgUrl, // 当前显示图片的http链接
				  urls: imgArr // 需要预览的图片http链接列表
				})
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F2F2F2;
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		background-color: #FFFFFF;
		position: relative;

		.article_box {
			padding: 0 24upx;

			.main_title_header {
				width: 100%;
				display: flex;
				align-items: center;

				.main_title {
					flex: 1;
					font-size: 40upx;
					line-height: 50upx;
					color: #333333;
					display: block;
					font-weight: 600;
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

				.user_card {
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

			// .article_title {
			// 	font-size: 20px;
			// 	color: #333333;
			// 	line-height: 64upx;
			// 	word-break: break-all;
			// 	/*允许在单词内换行*/
			// 	text-align: left;
			// 	text-overflow: -o-ellipsis-lastline;
			// 	/*css3中webkit内核提供的一个方法类似ellipsis*/
			// 	overflow: hidden;
			// 	text-overflow: ellipsis;
			// 	display: -webkit-box;
			// 	/*自适应盒子*/
			// 	-webkit-line-clamp: 2;
			// 	/*此处为1行,如果是两行就改成2*/
			// 	-webkit-box-orient: vertical;
			// }

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
								margin: 0 10upx;
							}
							.article_collect{
								font-size: 36upx;
							}
							.article_collected{
								font-size: 36upx;
								color: #f0d155;
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

			.article_img {
				width: 100%;
				
				image {
					// width: 100%;
					display: block;
					margin: 0 auto;
					height: 268upx;
				}
			}

			.article_content {
				font-size: 32upx;
				color: #333333;
				line-height: 62upx;

			}

		}

		.comment_box {
			width: 100%;
			background-color: #F2F2F2;
			padding-bottom: 96upx;

			.comment_title {
				font-size: 32upx;
				color: #666666;
				padding-left: 24upx;
				box-sizing: border-box;
				height: 60upx;
				line-height: 60upx;
			}

			.comment_content {
				width: 100%;
				background-color: #FFFFFF;

				.comment_item {
					box-sizing: border-box;
					padding: 0 24upx;
					width: 100%;
					font-size: 32upx;
					line-height: 48upx;
					color: #666666;
					display: flex;
					overflow: hidden;
					margin-bottom: 20upx;

					.comment_item_user {
						width: 80upx;
						height: 100%;
						display: flex;
						justify-content: center;

						.comment_item_user_icon {
							margin-top: 20upx;
							width: 60upx;
							height: 60upx;
							border-radius: 50%;
							overflow: hidden;

							image {
								width: 100%;
								height: 100%;
							}
						}

					}

					.comment_item_content {
						flex: 1;
						height: 100%;

						.comment_item_header {
							height: 50upx;
							line-height: 50upx;
							font-size: 24upx;
							color: #4f73aa;

							.comment_item_user_name {}
						}

						.comment_item_body {
							font-size: 28upx;
							position: relative;

							.comment_item_body_text {
								color: #333333;
								text-align: left;
								font-size: 28upx;
								line-height: 36upx;
								word-break:break-all;
							}

							.text_ellipsis {
								overflow: hidden;
								word-break: break-all;
								text-overflow: -o-ellipsis-lastline;
								text-overflow: ellipsis;
								display: -webkit-box;
								/*自适应盒子*/
								-webkit-line-clamp: 3;
								/*此处为1行,如果是两行就改成2*/
								-webkit-box-orient: vertical;
							}

							.comment_item_body_more {
								color: #4f73aa;
							}

							.comment_resource {
								display: flex;
								align-items: center;
								height: 160upx;
								width: 100%;

								.comment_resource_img_box {
									width: 160upx;
									height: 160upx;
									margin-right: 14upx;
									display: flex;
									align-items: center;
									justify-content: center;

									image {
										width: 100%;
										height: 100%;
									}

									&:nth-last-child {
										margin-right: 0;
									}
								}
							}
							.comment_item_send_time{
								font-size: 20upx;
								color: #999999;
							}
						}
					}

					.comment_item_usernick {
						// width: 214upx;
						color: #4f73aa;
						text-align: left;
					}

					.comment_item_text {
						flex: 1;
						box-sizing: border-box;
						width: 100%;
						border-bottom: 1px dotted #CCCCCC;

						.comment_font {}
					}

					&:last-child {
						.comment_item_text {
							border-bottom: none;
						}
					}
				}
			}

		}

		.comment_input_box {
			width: 100%;
			background-color: #F2F2F2;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			height: 96upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 24upx;
			box-sizing: border-box;

			.comment_input {
				padding: 0 10upx;
				width: 100%;
				height: 76upx;
				background: #FFFFFF;
				border-radius: 10upx;
				box-sizing: border-box;
			}

			.comment_smile {
				width: 54upx;
				height: 54upx;
			}

			.comment_add {
				margin-left: 40upx;
				width: 54upx;
				height: 54upx;
			}

			.gift_img_box {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: -120%;
				display: flex;
				align-items: center;
				border-radius: 10upx;
				background-color: #FFFFFF;
				padding: 10upx;
				border: 2upx solid #CCCCCC;
				box-sizing: border-box;

				.card_img_box_view {
					width: 104upx;
					height: 104upx;
					border: 2upx solid #F2F2F2;
					box-sizing: border-box;
					position: relative;
					margin-right: 18upx;

					&:last-child {
						margin-right: 0;
					}

					.gift_img_img {
						width: 100%;
						height: 100%;
					}

					.card_img_box_close {
						position: absolute;
						font-size: 36upx;
						top: -15upx;
						right: -15upx;
						z-index: 1;
					}
				}


			}
		}




	}
</style>
