<template>
	<view class="content">
		<view class="card_head">
			<view class="card_head_box">
				<view class="card_image" @click="previewOnce(imageBaseUrl+cardData.image)">
					<image :src="imageBaseUrl+cardData.image" mode=""></image>
				</view>
				<view class="card_title_msg">
					<view class="card_title">
						<view class="card_name">
							{{cardData.name}}
						</view>
						<view class="card_title_name">
							{{cardData.title}}
						</view>
					</view>
					<view class="card_mobile"  @longpress="copyToClipboard(cardData.user.mobile)">
						<view class="card_mobile_icon">
							<image src="../../../../static/card/card_phone.png" mode=""></image>
						</view>
						<view class="card_mobile_number">
							{{cardData.user.mobile||'未保存电话号码'}}
						</view>
					</view>
					<view class="QDcode_box" v-if="cardData.user.qrCode">
						<view class="QDcode_img_box" @click="previewOnce(imageBaseUrl+cardData.user.qrCode)">
							<image class="QDcode_img" :src="imageBaseUrl+cardData.user.qrCode" mode=""></image>
						</view>
						<text class="QDcode_box_msg">请加微信</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="individual_resume">
			<view class="individual_msg" v-show="status.description.isOpen">
				{{cardData.description}}
			</view>
			<view class="open_msg_box" @click="status.description.isOpen=!status.description.isOpen">
				<text class="button_msg is_open is_close" >{{status.description.isOpen?status.description.openMsg:status.description.closeMsg}}</text>
				<view class="open_msg_icon_box " :class="status.description.isOpen?'open_msg_icon_is_up':''">
				</view>
			</view>
		</view>
		<view class="background_line"></view>
    <view class="individual_resume" v-if="cardData.user.vcr">
        <video :src="videoBaseUrl+cardData.user.vcr" class="open_msg_box"></video>
    </view>
    <view class="background_line"></view>
		<view class="individual_resume new_meet_box" v-if="meetList.length">
			<view class="new_meet_title">
				<view class="new_meet_title_icon">
					<image class="new_meet_title_icon_img" src="../../../../static/card/card_meet.png" mode=""></image>
				</view>
				<text class="new_meet_title_text">见证</text>
			</view>
			<view class="meet_content">
				<view class="meet_item" v-for="item in meetList.slice(0,1)" :key="item.id">
					<view class="meet_item_head">
						<view class="meet_item_head_icon">
						</view>
						<view class="meet_item_head_title">
							{{item.createTime.slice(0,10)}}
						</view>
					</view>
					<view class="meet_item_body">
						<view class="meet_item_body_content">
							<view class="meet_item_body_content_title">
								{{item.name}}
							</view>
							<view class="meet_item_body_content_imglist" v-if="item.resources.length">
								<view class="meet_item_body_content_img" v-for="(list,index) in item.resources" :key="list.id" @click="previewImage(item.resources,index)">
									<image :src="imageBaseUrl+list.resFileName" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="meet_item" v-if="status.meet.isOpen" v-for="item in meetList.slice(1)" :key="item.id">
					<view class="meet_item_head">
						<view class="meet_item_head_icon">
						</view>
						<view class="meet_item_head_title">
							{{item.createTime.slice(0,10)}}
						</view>
					</view>
					<view class="meet_item_body">
						<view class="meet_item_body_content">
							<view class="meet_item_body_content_title">
								{{item.name}}
							</view>
							<view class="meet_item_body_content_imglist" v-if="item.resources.length">
								<view class="meet_item_body_content_img" v-for="(list,index) in item.resources" :key="list.id" @click="previewImage(item.resources,index)">
									<image :src="imageBaseUrl+list.resFileName" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="open_msg_box" v-if="meetList.length>1" @click="status.meet.isOpen=!status.meet.isOpen">
				<text class="button_msg" >{{!status.meet.isOpen?status.meet.closeMsg:status.meet.openMsg}}</text>
				<view class="open_msg_icon_box" :class="!status.meet.isOpen?'':'open_msg_icon_is_up'">
				</view>
			</view>
		</view>
		<view class="background_line" v-if="meetList.length">
		</view>
		<view class="article_video" v-if="contentList.length">
			<view class="article_item" v-for="item in contentList" :key="item.id" @click.stop="navigateTo(item)">
				<view class="article_name">
					{{item.name}}
				</view>
				<view class="article_banner" v-if="item.banner||item.thumbnail">
					<video v-if="!item.thumbnail&&item.banner&&item.catalog.parentId===parentId.SP" class="article_banner_img" id="video" :direction="90" :src="videoBaseUrl+item.banner"
					 :controls="false" :show-center-play-btn="false"></video>
					<image class="article_banner_img" v-else-if="item.banner&&item.catalog.parentId===parentId.WZ" :src="imageBaseUrl+item.banner" mode=""></image>
					<image class="article_banner_img" v-else-if="item.thumbnail" :src="imageBaseUrl+item.thumbnail" mode=""></image>
					<view class="model_mask">
						
					</view>
				</view>
			</view>
		</view>
		<view class="QDcode_box_bottom">
			<view class="QDcode_bottom">
				<view class="QDcode_bottom_img_box">
					<image class="QDcode_bottom_img" src="../../../../static/qrcode.jpeg" mode=""></image>
				</view>
				<text class="QDcode_bottom_msg">关注我们公众号</text>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="popup_box">
				<text class="iconfont icon-guanbi popup_close" @click="close"></text>
				<view class="popup_text">
					名片已生成，在我的名片可查看。
				</view>
				<view class="popup_button_box">
					<button type="primary" class="popup_button button_share" @click="toShare">分享名片</button>
					<button type="primary" class="popup_button button_commonly" @click="commonlyUsed">设为常用</button>
				</view>
				<text class="flag_number">{{flag}}</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import wx from '@/utils/jsWeiXin.js'
	export default {
		data() {
			return {
				id: 2, // 名片id
				showToast: false, //是否显示分享提示弹框
				cardData: { // 名片内容
					user: {
						qrCode: '',
            vcr:''
					}
				},
				flag: 9,
				meetList: [],
				contentList: [],
				status:{
					description:{
						isOpen:false,
						openMsg:'收起简介',
						closeMsg:'点击查看个人简介'
					},
					meet:{
						isOpen:false,
						openMsg:'收起',
						closeMsg:'展开更多'
					}
				},
				parentId:{
					SP:0,
					WZ:0,
					YJMH:0
				}
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl
			})
		},
		components: {
			uniPopup
		},
		onLoad(e) {
			this.id = e.id
			if (e.showToast == 1) {
				this.showToast = true
			}
		},
		onShow() {
			this.getJZMH()
		},
		onReady() {
			// this.getCardData(this.id)
			this.getParentId()
			// 初始化sdk
			this.$api.sdkReady({
				url: window.location.href.split('#')[0],
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'scanQRCode', 'previewImage'],
				ready: () => {
					let data = JSON.parse(JSON.stringify(this.cardData))
					let href = window.location.href
					let index = href.indexOf('&showToast')
					if (index !== -1) {
						href = href.replace(href.slice(index), '')
					}
					wx.updateAppMessageShareData({
						title: this.cardData.name, // 分享标题
						desc: this.cardData.description, // 分享描述
						link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: this.imageBaseUrl + this.cardData.image, // 分享图标
						success: function() {
							// 设置成功
						}
					});
					wx.updateTimelineShareData({
						title: this.cardData.name, // 分享标题
						link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: this.imageBaseUrl + this.cardData.image, // 分享图标
						success: function() {
							// 设置成功
						}
					})
				}
			})

			if (this.showToast) {
				this.open()
				let timeId = setInterval(() => {
					this.flag--;
					if (this.flag === 0) {
						clearInterval(timeId)
						this.close()
					}
				}, 1000)

			}
		},
		methods: {
			// 获取见证美好的目录id
			getJZMH(){
				this.$common.getCatalog('YJMH').then(res=>{
					let {meta,data}=res
					if(meta.success){
						this.parentId.YJMH=data[0].id
						this.getCardData(this.id)
					}
				})
			},
			// 获取名片详情
			getCardData(id) {
				this.$api.get({
					url: `user/bizCard/${id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.cardData = data
							
							if (data.contents.length !== 0) {
								let meetList = []
								let contentList = []
								data.contents.forEach(item => {
									if (item.catalog.id===this.parentId.YJMH) {
										meetList.push(JSON.parse(JSON.stringify(item)))
									} else {
										contentList.push(JSON.parse(JSON.stringify(item)))
									}
								})
								this.meetList = meetList
								this.contentList = contentList
								console.log('=======================')
								console.log(meetList)
								console.log(contentList)
							}

						}
					}
				})
			},
			open() {
				this.$refs.popup.open()
			},
			toShare() {
				this.close()
				uni.showToast({
					title: "请点击右上角分享",
					icon: "none",
					mask: true
				});
			},
			commonlyUsed() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.post({
					url: `user/bizCard/type?cardId=${this.id}&userId=${this.cardData.user.id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.close()
							setTimeout(() => {
								uni.hideLoading()
								uni.showToast({
									title: '设置成功',
									icon: "none",
									mask: true
								});
							}, 1000)

						}
					}
				})
			},
			close() {
				this.$refs.popup.close()
			},
			// 开启预览
			previewImage(list, index) {
				let arr = JSON.parse(JSON.stringify(list))
				let img_arr = arr.map(item => {
					return this.imageBaseUrl + item.resFileName
				})
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
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
			// 拨打电话
			makePhoneCall(phone) {
				if (!phone) {
					return
				}
				uni.makePhoneCall({
					phoneNumber: phone //仅为示例
				})
			},
			getParentId(){
				this.$common.getCatalog('JKML-SP').then(res=>{
					console.log(res)
					let {meta,data}=res
					if(meta.success){
						this.parentId.SP=data[0].id
					}
				})
				this.$common.getCatalog('JKML-WZ').then(res=>{
					let {meta,data}=res
					if(meta.success){
						this.parentId.WZ=data[0].id
					}
				})
				
			},
			navigateTo(item){
				if(item.catalog.parentId===this.parentId.WZ){
					uni.navigateTo({
						url:`/pages/articleDetail/articleDetail?id=${item.id}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/videoDetail/videoDetail?id=${item.id}`
					})
				}
			},
			copyToClipboard(mobile){
				if(!mobile){
					return
				}
				uni.setClipboardData({
				    data: mobile,
				    success: function () {
				        uni.showToast({
				            title: '已复制到剪贴板',
				            duration: 2000,
							icon:'none',
							mask:true
				        });
				    }
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #e0e0e0;
		width: 100%;
		min-height: 100%;
		background-color: #FFFFFF;
	}

	.content {
		width: 100%;
		min-height: 100%;
		overflow: hidden;
		background-color: #FFFFFF;
		.card_head{
			padding: 30upx 27upx 0 27upx;
		}
		.card_head_box {
			border-radius: 8upx;
			box-shadow: 0 10upx 10upx #f2f2f2;
			box-sizing: border-box;
			overflow: hidden;
			.card_image {
				width: 100%;
				height: 394upx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				image {
					width: 100%;
					height: 100%;
				}
			}

			.card_title_msg {
				position: relative;
				box-sizing: border-box;
				padding: 29upx 27upx 40upx 27upx;

				.card_title {
					display: flex;
					align-items: flex-end;
					flex-wrap: wrap;
					padding-right: 172upx;
					.card_name {
						font-size: 48upx;
						line-height: 60upx;
						margin-right: 20upx;
					}

					.card_title_name {
						font-size: 28upx;
						color: rgb(153, 153, 153);
					}
				}

				.card_mobile {
					margin-top: 40upx;
					display: flex;
					align-items: center;

					.card_mobile_icon {
						width: 16upx;
						height: 24upx;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 8upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.card_mobile_number {
						font-size: 22upx;
						color: #4a4a4a;
					}
				}

				.QDcode_box {
					text-align: center;
					position: absolute;
					right: 28upx;
					top: -72upx;
					padding: 12upx;
					background-color: #FFFFFF;
					border-radius: 12upx;
					box-shadow: 2upx 2upx 10upx #CCCCCC;
					.QDcode_img_box {
						width: 148upx;
						height: 148upx;

						.QDcode_img {
							width: 100%;
							height: 100%;
						}
					}
				}

				.QDcode_box_msg {
					margin-top: 23upx;
					font-size: 24upx;
					color: #53d121;
				}
			}
		}
		.individual_resume{
			padding: 20upx 57upx 20upx 70upx;
			box-sizing: border-box;
			.individual_msg{
				font-size: 28upx;
				color: rgb(74 74 74);
			}
			.open_msg_box{
				margin-top: 10upx;
				font-size: 28upx;
				color: #999999;
				display: flex;
				align-items: center;
				justify-content: center;
				.open_msg_icon_box{
					margin-left: 8upx;
					margin-top: 10upx;
					width: 30upx;
					height: 28upx;
					background: url(../../../../static/card/arrow_downup.png);
					background-size: 30upx;
				}
				.open_msg_icon_is_up{
					margin-top: unset;
					background-position: 0 28upx;
					margin-bottom: 10upx;
				}
			}
		}
		.background_line{
			width: 100%;
			height: 8upx;
			background-color: #e0e0e0;
		}
		.new_meet_box{
			padding: 27upx;
			box-sizing: border-box;
			.new_meet_title{
				display: flex;
				align-items: center;
				.new_meet_title_icon{
					width: 32upx;
					height: 32upx;
					margin-right: 8upx;
					display: flex;
					.new_meet_title_icon_img{
						width: 100%;
						height: 100%;
					}
				}
				.new_meet_title_text{
					font-size: 40upx;
					line-height: 40upx;
					color: #000000;
				}
			}
			.meet_content{
				margin-top: 28upx;
				.meet_item{
					margin-top: 8upx;
					.meet_item_head{
						display: flex;
						align-items: center;
						.meet_item_head_icon{
							width: 20upx;
							height: 20upx;
							border-radius: 50%;
							background-color: #f19b39;
							border: 4upx solid #fcebd7;
							margin-right: 8upx;
						}
						.meet_item_head_title{
							font-size: 24upx;
							color: #777777;
						}
					}
					.meet_item_body{
						margin-top: 8upx;
						display: flex;
						.meet_item_body_line{
							width: 2upx;
							height: 100%;
							height: 229upx;
							background-color: #e0e0e0;
							margin:0 20upx 0 13upx;
						}
						.meet_item_body_content{
							flex: 1;
							height: 100%;
							border-left: 2upx solid #e0e0e0;
							margin-left: 13upx;
							padding: 0 0 8upx 20upx;
							.meet_item_body_content_title{
								margin-top: -2upx;
								font-size: 32upx;
								line-height: 36upx;
								color: #4a4a4a;
								word-break: break-all;
								text-align: left;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;/*自适应盒子*/
								-webkit-line-clamp: 2;/*此处为1行,如果是两行就改成2*/
								-webkit-box-orient: vertical;
							}
							.meet_item_body_content_imglist{
								margin-top: 19upx;
								display: flex;
								flex-wrap: wrap;
								.meet_item_body_content_img{
									width: 210upx;
									height: 140upx;
									margin-right: 14upx;
									border-radius: 6upx;
									overflow: hidden;
									border: 2upx solid #CCCCCC;
									box-sizing: border-box;
									margin-bottom: 14upx;
									image{
										width: 100%;
										height: 100%;
									}
									&:nth-child(3n){
										margin-right: 0;
									}
								}
							}
						}
					}
				}
			}
			
			
		}
		.article_video{
			padding: 32upx 27upx 0 27upx;
			background-color: #FFFFFF;
			box-sizing: border-box;
			.article_item{
				margin-bottom: 8upx;
				padding: 28upx;
				box-sizing: border-box;
				background-color: #f3f4f6;
				border-radius: 8upx;
				display: flex;
				align-items: center;
				&:nth-last-child{
					margin-bottom: 0;
				}
				.article_name{
					flex: 1;
					height: 100%;
					font-size: 36upx;
					color: rgb(74,74,74);
					word-break: break-all;
					text-align: left;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;/*自适应盒子*/
					-webkit-line-clamp: 2;/*此处为1行,如果是两行就改成2*/
					-webkit-box-orient: vertical;
				}
				.article_banner{
					margin-left: 28upx;
					width: 176upx;
					height: 110upx;
					position: relative;
					.model_mask{
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 99;
					}
					.article_banner_img{
						width: 100%;
						height: 100%;
					}
					.bofang_botton_box{
						width: 40upx;
						height: 40upx;
						position: absolute;
						top: 50%;
						left: 50%;
						margin-top: -20upx;
						margin-left: -20upx;
						display: flex;
						z-index: 1;
						.bofang_botton{
							font-size: 36upx;
							line-height: 40upx;
						}
					}
					
				}
			}
		}
		.QDcode_box_bottom{
			margin-top: 100upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
			text-align: center;
			.QDcode_bottom_img_box{
				background-color: #FFFFFF;
				border: 2upx solid #CCCCCC;
				border-radius: 8upx;
				padding: 10upx;
				box-sizing: border-box;
				display: flex;
				.QDcode_bottom_img{
					width: 162upx;
					height: 162upx;
				}
			}
			.QDcode_bottom_msg{
				
				font-size: 24upx;
				color: rgb(170,170,170);
			}
		}
		.card {
			margin-top: 16upx;
			width: 100%;
			background-color: #FFFFFF;

			.card_header {
				width: 100%;
				height: 182upx;
				position: relative;

				.card_header_img {
					width: 100%;
					height: 182upx;
				}

				.card_usericon {
					position: absolute;
					left: 50%;
					top: 40upx;
					transform: translateX(-50%);
					z-index: 1;
					width: 200upx;
					height: 200upx;
					border-radius: 50%;
					background-color: #999999;
					border: 5px solid #FFFFFF;
					overflow: hidden;

					.user_icon_img {
						width: 100%;
						height: 100%;
					}
				}
			}

			.card_content {
				margin-top: 100upx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.user_name {
					font-size: 40upx;
					color: #333333;
					font-weight: 550;
				}

				.phonenumber {
					margin: 16upx 0;
					font-size: 36upx;
					color: #333333;
				}

				.intro {
					font-size: 28upx;
					color: #999999;
				}

				.intro_text {
					margin: 20upx 0;
					font-size: 32upx;
					color: #333333;
				}

				.call_me {
					margin: 20upx 0;
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: center;

					.call_to_phonenumber {
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						width: 276upx;
						height: 119upx;
						background: #EE4F16;
						border: 1px solid #EE4F16;
						border-radius: 14upx;
						font-size: 28upx;
						color: #FFFFFF;

						.call_to_text {
							margin-bottom: 10upx;
						}
					}

					.call_to_phonenumber_active {
						background: #ee6d46;
						border: 1px solid #ee6d46;
					}

				}

				.meet_box {
					width: 100%;
					text-align: center;

					.meet {
						font-size: 28upx;
						color: #999999;
					}

					.meet_name {
						font-size: 28upx;
						color: #333333;
					}

					.meet_list {
						margin: 20upx 0 30upx 0;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;

						.meet_img_box {
							height: 160upx;
							margin-left: 40upx;

							&:nth-child(1) {
								margin-left: 0;
							}

							.meet_img {
								width: 190upx;
								height: 160upx;
							}

						}
					}

					.content_list_box {
						width: 100%;
						height: 160upx;
						display: flex;
						align-items: center;
						box-sizing: border-box;
						border-bottom: 2upx solid #F2F2F2;
						margin-bottom: 10upx;
						padding: 0 16upx;

						// flex-wrap: wrap;
						.content_image {
							width: 190upx;
							height: 100%;
							margin-right: 40upx;
							box-sizing: border-box;
							overflow: hidden;

							image {
								display: block;
								width: 100%;
								height: 100%;
							}
						}

						.content_message {
							padding: 10upx;
							box-sizing: border-box;
							flex: 1;
							height: 100%;
							text-align: left;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							.content_message_name {
								font-size: 32upx;
								// margin-bottom: 40upx;
								color: #333333;
								word-break: break-all;
								text-align: left;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								/*自适应盒子*/
								-webkit-line-clamp: 2;
								/*此处为1行,如果是两行就改成2*/
								-webkit-box-orient: vertical;
							}

							.content_message_createtime {
								font-size: 20upx;
								color: #999999;
							}
						}

					}
				}


				.qrcode_img {
					font-size: 28upx;
					color: #999999;
					text-align: center;
				}

				.qrcode_ps {
					margin-bottom: 32upx;
				}

				.meet_img_big {
					width: 366upx;
					height: 366upx;
				}
			}

		}

		.popup_box {
			// width: 646upx;
			// height: 324upx;
			position: relative;
			// box-sizing: border-box;
			overflow: hidden;
			padding-bottom: 40upx;

			.popup_close {
				top: 0;
				right: 0;
				font-size: 30upx;
				font-weight: 600;
				color: #979797;
				position: absolute;
			}

			.flag_number {
				bottom: 40upx;
				right: 0;
				font-size: 30upx;
				font-weight: 600;
				color: #979797;
				position: absolute;
			}

			.popup_text {
				font-size: 28upx;
				color: #333333;
				margin: 60upx 0 100upx 0;
			}

			.popup_button_box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				padding-right: 40upx;

				.popup_button {
					width: 40%;
					height: 84upx;
					box-sizing: border-box;
					background: #FFFFFF;
					border: 2upx solid #979797;
					border-radius: 10upx;
					font-size: 24upx;
					color: #333333;
					margin: 0;
					line-height: 84upx;
					padding: 0 10upx;
					box-shadow: 6upx 10upx 10upx #CCCCCC;
				}

				.button_commonly {
					background: #EE4F16;
					color: #FFFFFF;
					border: none;
				}
			}

		}
	}
</style>
