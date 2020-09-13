<template>
	<view class="content">
		<view class="resume_item" v-for="(item,index) in meetList" :key="item.id">
			<view class="resume_content">
				<view class="gift_name">
					{{item.description}} {{item.name}}
				</view>
				<view class="gift_img_box">
					<image v-for="(list,index) in item.resources" :key=list.id class="gift_img_img" :src="list.resFileName?imageBaseUrl+list.resFileName:'../../../../../static/index/Rectangle%2012%20Copy%202.jpg'"
					 mode="" @click="previewImage(item.resources,index)"></image>
				</view>
				<view class="checked_for_weet">
					<view :class="item.checked?'checked_box is_active':'checked_box'" @click="choose_weet(item,index)">
						<image v-if="item.checked" src="../../../../../static/index/Group4.png" mode=""></image>
					</view>
					<view class="tips_text">
						设为名片见证
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
				metaId: '',
				meetList: [],
				catalogId: '',
				currPage: {},
				prevPage: {},
				prevTwoPage: {},
				contentMeta:{}
			}
		},
		onLoad(e) {
			this.metaId = +e.id
		},
		onReady() {
			this.$api.sdkReady()
			this.getMeetByMetaId()
			this.getContentMeta()
		},
		onShow() {
			let pages = getCurrentPages();
			this.currPage = pages[pages.length - 1]; //当前页面
			this.prevPage = pages[pages.length - 2]; //上一个页面
			this.prevTwoPage = pages[pages.length - 3]; //上上一个页面
			// this.getCatalogId('YJMH')
		},
		computed: {
			...mapState({
				checkedMeet:state=>state.checkedMeet,
				user: state => state.user,
				imageBaseUrl:state=>state.imageBaseUrl
			})
		},
		methods: {
			// 提交
			formSubmit() {
				let checkedMeet=[]
				let metaArray=JSON.parse(JSON.stringify(this.checkedMeet))
				if(this.meetList.length!==0){
					this.meetList.forEach(item=>{
						if(item.checked){
							checkedMeet.push(item)
						}
					})
					// 如果有选中
					if(checkedMeet.length){
						let flag=true
						// contentMeta父目录
						if(metaArray.length){
							metaArray.forEach((item,index)=>{
								if(item.id==this.metaId){
									item.contents=this.meetList
									// 如果父目录已经存在本地
									flag=false
								}
							})
						}
							if(flag){
								let metaObj=JSON.parse(JSON.stringify(this.contentMeta))
								
								this.$set(metaObj,'checked',false)
								this.$set(metaObj,'contents',this.meetList)
								metaArray.push(metaObj)
							}
					}else{
						// 没有任何选中
						let metaIndex=''
						// contentMeta父目录
						if(metaArray.length!==0){
							metaArray.forEach((item,index)=>{
								if(item.id==this.metaId){
									// item.contents=this.meetList
									// 如果父目录已经存在本地
									metaIndex=index
								}
							})
							if(metaIndex!==''){
								metaArray.splice(metaIndex,1)
							}
						}
						
					}
					
					// 设置上一级页面的checkedMeet
					// this.prevTwoPage.checkedMeet=this.checkedMeet
					this.$store.dispatch({
						type: 'saveCheckedMeet',
						checkedMeet: metaArray
					})
				}
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
			// 取消并返回上一级目录
			backTo() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取contentMeta对象
			getContentMeta(){
				this.$api.get({
					url: `contentMeta/${this.metaId}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.contentMeta=data
						}
					}
				})
			},
			// 按metaId查询,并过滤已删除的内容
			getMeetByMetaId(){
				this.$api.get({
					url: `content/byMeta/${this.metaId}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let dataList=[]
							if(data.length!==0){
								dataList=data.filter(item=>{
									this.$set(item, "checked", false)
									return !item.delFlag
								})
								
							}
							if(this.checkedMeet.length){
								let checkedMeet= this.checkedMeet.filter(item=>{
									return item.id==this.metaId
								})
								if(checkedMeet.length&&checkedMeet[0].contents.length&&dataList.length){
									checkedMeet[0].contents.forEach(item=>{
										dataList.forEach(list=>{
											if(item.id===list.id&&item.checked){
												this.$set(list, "checked", true)
											}
										})
									})
								}
							}
							console.log("=========")
							console.log(dataList)
							this.meetList=dataList
						}
					}
				})
			},
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
			// 
			getAllbyQuery(id) {
				let data1 = {
					query: `delFlag=0,catalog.id=${id},user=${this.user.id}`,
					pi: 1,
					ps: 10000
				};
				// ,contentMeta=${this.metaId}
				console.log(data1)
				console.log(this.metaId)
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

							let content = []
							if (data.totalElements !== 0) {
								data.content.forEach(item => {
									if (item.contentMeta.id == this.metaId) {
										this.$set(item, "checked", false)
										content.push(item)
									}
								})
							}
							this.meetList = content
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 选择见证美好
			choose_weet(item, index) {
				// if (!this[url][index].checked) {
				// 	this[url].forEach((item, i) => {
				// 		if (index != i) {
				// 			item.checked = false
				// 		}
				// 	})
				// }
				// this[url][index].checked = !this[url][index].checked
				// if (this[url][index].checked) {
				// 	this.checkedMeet = this[url][index]
				// } else {
				// 	this.checkedMeet = {}
				// }
				item.checked=!item.checked
			},
			// 预览图片
			previewImage(list, index) {
				let imgArr = []
				if (list.length === 0) {
					uni.showToast({
						title: "获取图片错误",
						icon: "none",mask:true
					});
					return
				}
				list.forEach(item => {
					if (item.resFileName) {
						imgArr.push(this.imageBaseUrl + item.resFileName)
					}
				})
				console.log(imgArr)
				// 预览图片
				uni.previewImage({
					urls: imgArr,
					current: index,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
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

	.content {
		width: 100%;

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
