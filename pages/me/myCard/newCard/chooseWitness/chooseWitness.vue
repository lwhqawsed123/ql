<template>
	<view class="witness_content">
		
		<view class="resume_item" v-for="(item) in meetList" :key="item.id" v-if="item.resources.length">
			<view class="resume_content">
				<view class="gift_name">
					{{item.name}}
				</view>
				<view class="gift_img_box" v-if="item.resources.length">
					
					 <view class="gift_img_img" v-for="list in item.resources" :key="list.id">
					 	<image  :src="list.resFileName?imageBaseUrl+list.resFileName:'../../../static/index/Rectangle%2012%20Copy%202.jpg'"
					 	 mode=""></image>
						 
					 </view>
					
				</view>
				
			</view>
			<view class="image_checkbox" :class="item.selected?'image_checked':''"  @click="select_weet(item)">
			
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
				meetList: [],
				catalogId: ''
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user,
				checkedMeet:state=>state.checkedMeet
			})
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
			// 获取meet见证
			getAllbyQuery(id) {
				let data1 = {
					query: `delFlag=0,catalog.id=${id},user=${this.user.id}`,
					pi: 1,
					ps: 9999999
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
							this.meetList = data.content.map(item=>{
								this.$set(item,"selected",false)
								this.checkedMeet.forEach(list=>{
									if(list.id===item.id){
										this.$set(item,"selected",true)
									}
								})
								return item
							})
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			select_weet(item) {
				item.selected = !item.selected
				// if (this.chooseWeet.length) {
				// 	let flag = true
				// 	this.chooseWeet.forEach((list, index) => {
				// 		if (list.id === item.id) {
				// 			flag = false
				// 			if (!item.selected) {
				// 				this.chooseWeet.splice(index, 1)
				// 			}
				// 		}
				// 	})
				// 	if (flag && item.selected) {
				// 		this.chooseWeet.push(item)
				// 	}
				// } else {
				// 	if (item.selected) {
				// 		this.chooseWeet.push(item)
				// 	}
				// }
			},
			getContentById(id) {
				this.$api.get({
					url: `content/${id}`,
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
			// 保存至stroe
			formSubmit(){
				let meetList=JSON.parse(JSON.stringify(this.meetList))
				meetList=meetList.filter(item=>{
					return item.selected
				})
				this.$store.dispatch({
					type: 'saveCheckedMeet',
					checkedMeet: meetList
				})
				// 返回上一级页面
				if (this.prevPage) {
					uni.navigateBack({
						delta: 1
					});
				} else {
					uni.redirectTo({
						url: '../newCard'
					});
				}
			},
			// 取消并返回上一级目录
			backTo() {
				uni.navigateBack({
					delta: 1
				})
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
			position: relative;
			&:first-child {
				margin-top: 10upx;
			}
			.image_checkbox {
				width: 30upx;
				height: 30upx;
				opacity: 0.5;
				position: absolute;
				right: 7upx;
				top: 7upx;
				background-image: url(../../../../../static/newest/beauty_checkbox.png);
				background-size: 100%;
				z-index: 10;
			}
			.image_checked {
				opacity: 1;
				background-position: 0 -48upx;
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
						margin-bottom: 20upx;
						border: 2upx solid #FFFFFF;
						image{
							width: 100%;
							height: 100%;
						}
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
