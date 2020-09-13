<template>
	<view class="content">
		<view class="meet_add">
			<view class="meet_list_item" v-for="(item,index) in meetList" :key="item.id" @click="navigateTo(`./chooseMeetImage?id=${item.id}`)">
				<image v-if="!item.imageUrl" class="meet_list_item_img" src="../../../../../static/index/二维码默认占位@2x.png" mode=""></image>
				<image v-if="item.imageUrl" class="meet_list_item_img" :src="imageBaseUrl+item.imageUrl" mode=""></image>
				<text>安然事业见证</text>
				<view :class="item.checked?'checked_box is_active':'checked_box'" @click.stop="choose_weet(item,index)">
					<image v-if="item.checked" src="../../../../../static/index/Group4.png" mode=""></image>
				</view>
			</view>
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
				currPage: {},
				prevPage: {},
				meetList: [],
			}
		},
		onShow() {
			let pages = getCurrentPages();
			this.currPage = pages[pages.length - 1]; //当前页面
			this.prevPage = pages[pages.length - 2]; //上一个页面
			this.getCatalogId('YJMH')
		},
		onLoad() {},
		onReady() {
			this.$api.sdkReady()
			console.log(this.checkedMeet)
		},
		computed: {
			...mapState({
				checkedMeet: state => state.checkedMeet,
				user: state => state.user,
				imageBaseUrl: state => state.imageBaseUrl
			})
		},
		methods: {
			// 提交
			formSubmit() {
				let checkedMeet = JSON.parse(JSON.stringify(this.checkedMeet))
				if (this.meetList.length !== 0) {
					this.meetList.forEach(item => {
						let flag = true
						// 本地已储存
						if (this.checkedMeet.length) {
							this.checkedMeet.forEach((list, index) => {
								if (list.id === item.id) {
									// 未被选中,删除
									if (!item.checked) {
										checkedMeet.splice(index, 1)
									}
									flag = false
								}
							})
						}
						// 本地未储存
						if (flag) {
							// 选中
							if (item.checked) {
								// 加入到本地
								checkedMeet.push(item)
							}
						}
					})
				}
				// 设置上一级页面的checkedMeet
				this.$store.dispatch({
					type: 'saveCheckedMeet',
					checkedMeet: checkedMeet
				})
				console.log(checkedMeet)
				// 返回上一级页面
				if (this.prevPage) {
					uni.navigateBack();
				} else {
					history.back()
				}
			},
			// 取消并返回上一级目录
			backTo() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 选择目录
			choose_weet(item, index) {
				// if (!this[url][index].checked) {
				// 	this[url].forEach((item, i) => {
				// 		if (index != i) {
				// 			item.checked = false
				// 		}
				// 	})
				// }
				// this[url][index].checked = !this[url][index].checked
				// if(this[url][index].checked){
				// 	this.checkedMeet=this[url][index].content[0]
				// }else{
				// 	this.checkedMeet={}
				// }
				item.checked = !item.checked
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
							this.getAllbyQuery(catalogId)
						}
					}
				})
			},
			// 获取美好见证目录列表
			getcontentMeta(arr) {
				this.$api.get({
					url: `contentMeta/user/${this.user.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							if (data.length === 0) {
								return
							}
							data.forEach(item => {
								let content = []
								arr.forEach(list => {
									if (item.id === list.contentMeta.id) {
										content.push(list)
									}
								})
								let imageUrl = ''
								if (content.length !== 0 && content[0].resources.length !== 0) {
									imageUrl = content[0].resources[0].resFileName
								}
								this.$set(item, "contents", content)
								this.$set(item, "checked", false)
								this.$set(item, "imageUrl", imageUrl)
							})
							let backData = []
							data.forEach(item => {
								if (item.contents.length !== 0) {
									backData.push(item)
								}
							})
							if (backData.length && this.checkedMeet.length) {
								backData.forEach(item => {
									this.checkedMeet.forEach(list => {
										// if (item.id === list.id && list.contents && list.contents.length) {
										// 	list.contents.forEach(ele => {
										// 		if (ele.checked) {
										// 			this.$set(item, "checked", true)
										// 		}
										// 	})
										// }
										if (item.id === list.id) {
											this.$set(item, "checked", true)
										}
									})
								})
							}
							this.meetList = backData
							console.log("===列表===")
							console.log(backData)
						}
					}
				})
			},
			// 获取用户所有美好见证
			getAllbyQuery(catalogId) {
				let data1 = {
					query: `delFlag=0,catalog.id=${catalogId},user=${this.user.id}`,
					pi: 1,
					ps: 10000
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
							this.getcontentMeta(data.content)
							// let backData = data.content
							// let reminiscence = []
							// backData.forEach(item => {
							// 	if (item.showPrice && item.resources.length !== 0) {
							// 		let flag = true
							// 		// 如果准确设置为拾光机图片,直接获取
							// 		item.resources.forEach(list => {
							// 			if (list.selected) {
							// 				flag = false
							// 				item.resFileName=list.resFileName
							// 				reminiscence.push(item)
							// 			}
							// 		})
							// 		// 如果没有设置 取第一张
							// 		if (flag) {
							// 			item.resFileName=item.resources[0].resFileName
							// 			reminiscence.push(item)
							// 		}
							// 	}
							// })
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 页面跳转
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
		padding: 20upx 24upx 0 24upx;
		width: 100%;
	}

	.content {
		width: 100%;
		position: relative;

		.meet_add {
			width: 100%;
			position: relative;
			background-color: #FFFFFF;
			padding: 20upx 32upx 0 32upx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			.meet_list_item {
				width: 304upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;

				.meet_list_item_img {
					width: 100%;
					height: 220upx;
				}

				text {
					margin-top: 16upx;
					margin-bottom: 40upx;
					font-size: 28upx;
					color: #333333;
				}

				.checked_box {
					width: 30upx;
					height: 30upx;
					box-sizing: border-box;
					margin-right: 10upx;
					border: 1px solid #979797;
					position: absolute;
					top: 18upx;
					right: 6upx;
					background-color: #FFFFFF;

					image {
						display: block;
						width: 100%;
						height: 100%;
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
