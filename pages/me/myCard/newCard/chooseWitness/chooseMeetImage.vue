<template>
	<view class="witness_content">
				<view class="meet_item" v-for="(item,i) in meetList"
			 :key="i">
					<view class="meet_item_head">
						<view class="meet_item_head_icon">
						</view>
						<view class="meet_item_head_title">
							{{item.createTime}}
						</view>
					</view>
					<view class="meet_item_body">
						<view class="meet_item_body_content">
							<view class="meet_item_body_content_imglist" v-if="item.resources.length">
								<view class="meet_item_body_content_img" v-for="(list,index) in item.resources" :key="list.id" @click="previewImage(item.resources,index)">
									<image class="resources_image" :src="imageBaseUrl+list.resFileName" mode=""></image>
									<view class="image_checkbox" :class="list.selected?'image_checked':''"  @click.stop="select_weet(list)">

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

		<view class="empty_Data" v-if="meetList.length===0">
			没有更多数据了!
		</view>
		<view class="bottom_btn">
			<button class="from-submit" formType="submit" type="primary" @click="formSubmit">保存</button>
			<button class="from-submit from-cancel" type="primary" @click="backTo">取消</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				checked: true,
				contentId: 0,
				content: {},
				meetList: [],
				catalogId: 0,
				comparisonWeet: [],	// 选中的图片
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user,
				checkedMeet:state=>state.checkedMeet
			})
		},
		onLoad(e) {
			this.contentId = +e.id
		},
		onReady() {
			this.$api.sdkReady({
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
			})
			
		},
		onShow() {
			let pages = getCurrentPages();
			this.currPage = pages[pages.length - 1]; //当前页面
			this.prevPage = pages[pages.length - 2]; //上一个页面
			this.prevTwoPage = pages[pages.length - 3]; //上上一个页面
			this.getbyId()
		},
		methods: {
			// 根据id获取content
			getbyId() {
				this.$api.get({
					url: `content/${this.contentId}`,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.content = data
							let resources = JSON.parse(JSON.stringify(data.resources)).map(item => {
								item.create_time = item.resTime.slice(0, 10)
								return item
							})
							this.checkedMeet.forEach(item=>{
								if(item.id===data.id){
									item.resources.forEach(list=>{
										resources.forEach(resources=>{
											if(list.id===resources.id){
												resources.selected=list.selected
												if(list.selected){
													this.comparisonWeet.push(resources)
												}
											}
										})
									})
								}
							})
							console.log(resources)
							let meetList = []
							resources.forEach(item => {
								let flag = true
								meetList.forEach(list => {
									if (item.create_time === list.createTime) {

										list.resources.push(item)
										flag = false
									}
								})
								if (flag) {
									let arr = []
									arr.push(item)
									meetList.push({
										createTime: item.create_time,
										resources: arr
									})
								}
							})
							meetList = meetList.sort((a, b) => {
								let dateA = new Date(a.createTime).getTime()
								let dateB = new Date(b.createTime).getTime()
								return dateB - dateA
							})
							console.log('meetList')
							console.log(meetList)
							this.meetList = meetList
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			
			select_weet(item) {
				item.selected = !item.selected
				if (this.comparisonWeet.length) {
					let flag = true
					this.comparisonWeet.forEach((list, index) => {
						if (list.id === item.id) {
							flag = false
							if (!item.selected) {
								this.comparisonWeet.splice(index, 1)
							}
						}
					})
					if (flag && item.selected) {
						this.comparisonWeet.push(item)
					}
				} else {
					if (item.selected) {
						this.comparisonWeet.push(item)
					}
				}
			},
			// 保存至stroe
			formSubmit(){
				let checkedMeet=JSON.parse(JSON.stringify(this.checkedMeet))
				let content=JSON.parse(JSON.stringify(this.content))
				content.resources.forEach(item=>{
					let flag=true
					this.comparisonWeet.forEach(list=>{
						if(item.id===list.id){
							flag=false
							item.selected=list.selected
						}
					})
					if(flag){
						item.selected=false
					}
				})
				let flag=true
				this.checkedMeet.forEach((list,index)=>{
					if(list.id===content.id){
						flag=false
						if(this.comparisonWeet.length){
							checkedMeet[index]=content
						}else{
							checkedMeet.splice(index,1)
						}
					}
				})
				if(flag){
					checkedMeet.push(content)
				}
				this.$store.dispatch({
					type: 'saveCheckedMeet',
					checkedMeet: checkedMeet
				})
				// 返回上一级页面
				if (this.prevPage) {
					uni.navigateBack({
						delta: 2
					});
				} else {
					uni.redirectTo({
						url: '../newCard'
					});
				}
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
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
				});
			},
			// 取消并返回上一级目录
			backTo() {
				uni.navigateBack({
					delta: 1
				})
			},
			
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
		padding-bottom: 120upx;

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}

		.resume_item {
			box-sizing: border-box;
			// padding-bottom: 36upx;
			margin-top: 20upx;
			background-color: #FFFFFF;
			width: 100%;

			.resume_content {
				box-sizing: border-box;
				padding: 0 26upx;
				background-color: #FFFFFF;
				overflow: hidden;

				.gift_name {
					margin-top: 18upx;
					margin-bottom: 50upx;
					font-size: 28upx;
					color: #333333;
					font-weight: 600;
				}

				.gift_img_box {
					display: flex;
					align-items: center;
					// justify-content: space-between;
					flex-wrap: wrap;

					.gift_img_img {
						width: 204upx;
						height: 144upx;
						margin-right: 12upx;
						// margin-bottom: 20upx;
						border: 2upx solid #FFFFFF;

						&:nth-child(3n+3) {
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

		.meet_item {
			margin-top: 8upx;

			.meet_item_head {
				display: flex;
				align-items: center;

				.meet_item_head_icon {
					width: 20upx;
					height: 20upx;
					border-radius: 50%;
					background-color: #f19b39;
					border: 4upx solid #fcebd7;
					margin-right: 8upx;
				}

				.meet_item_head_title {
					font-size: 24upx;
					color: #777777;
				}
			}

			.meet_item_body {
				margin-top: 8upx;
				display: flex;

				.meet_item_body_line {
					width: 2upx;
					height: 100%;
					height: 229upx;
					background-color: #e0e0e0;
					margin: 0 20upx 0 13upx;
				}

				.meet_item_body_content {
					flex: 1;
					height: 100%;
					border-left: 2upx solid #e0e0e0;
					margin-left: 13upx;
					padding: 0 0 8upx 20upx;

					.meet_item_body_content_title {
						margin-top: -2upx;
						font-size: 32upx;
						line-height: 36upx;
						color: #4a4a4a;
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

					.meet_item_body_content_imglist {
						margin-top: 19upx;
						display: flex;
						flex-wrap: wrap;

						.meet_item_body_content_img {
							width: 210upx;
							height: 140upx;
							margin-right: 14upx;
							margin-bottom: 20upx;
							border-radius: 6upx;
							// overflow: hidden;
							box-sizing: border-box;
							position: relative;

							.image_checkbox {
								width: 24upx;
								height: 24upx;
								opacity: 0.5;
								position: absolute;
								right: 7upx;
								top: 7upx;
								background-image: url(../../../../../static/newest/beauty_checkbox.png);
								background-size: 100%;
							}

							.image_checked {
								opacity: 1;
								background-position: 0 -38upx;
							}

							.resources_image {
								width: 100%;
								height: 100%;
							}

							.card_img_box_close {
								position: absolute;
								width: 40upx;
								height: 40upx;
								border-radius: 50%;
								background-color: #f23a3a;
								text-align: center;
								line-height: 40upx;
								font-size: 20upx;
								color: #FFFFFF;
								top: -10upx;
								right: -10upx;
								z-index: 1;
							}

							&:nth-child(3n) {
								margin-right: 0;
							}
						}
					}
				}
			}
		}
		.bottom_btn {
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1;
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
</style>
