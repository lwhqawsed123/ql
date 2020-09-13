<template>
	<view class="content">
		<view class="cash_gift">
			<view class="cash_row">
				<text class="cash_title">兑换日期：</text>
				<view class="meet_date">
					<image class="meet_date_img" src="../../../static/index/日历@2x.png" mode=""></image>
					<picker class="date_picker" mode="date" :value="form.createTime" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="date_input">{{form.createTime}}</view>
					</picker>
				</view>
			</view>
			<view class="cash_row">
				<text class="cash_title">礼物名称：</text>
				<view class="cash_input_box">
					<input class="cash_input" maxlength="100" v-model="form.giftName" name="giftname" placeholder="请输入礼物名称" />
				</view>
			</view>
			<view class="cash_row">
				<text class="cash_title">使用积分：</text>
				<view class="meet_date">
					<image class="meet_date_img" src="../../../static/index/红花@2x.png" mode=""></image>
					<picker class="date_picker" mode="selector" :value="form.scoreUsed" :range="scoreArray" @change="bindScoreChange">
						<view class="date_input">{{form.scoreUsed}}</view>
					</picker>
				</view>
			</view>
			<view class="gift_img_box">
				<view class="card_img_box_view" v-for="(item,index) in imageList" :key="index">
					<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('imageList',index)"></text>
					<image class="gift_img_img" :src="imageBaseUrl+item" mode=""></image>
				</view>
				<view v-if="imageList.length<3" class="card_img_box_left" @click="chooseImage">
					<view class="card_img_add">
						<text>+</text>
					</view>
				</view>
			</view>

		</view>
		<view class="cash_button">
			<button type="primary" @click="submit">兑换</button>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup_box">
				<view class="upload_image">
					<image src="../../../static/index/选择拍照@2x.png" mode=""></image>
					<text>拍摄照片</text>
				</view>
				<view class="upload_image">
					<image src="../../../static/index/从相册选择@2x.png" mode=""></image>
					<text>从相册选择</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				form: {
					giftName: '',
					scoreUsed: 1,
					userChild: {
						id: 0
					},
					pics: '',
					createTime: currentDate
				},
				scoreArray: Array.from({
					length: 100
				}, (v, k) => k + 1),
				date: currentDate,
				imageList: [],
				scoreUsed:0
			}
		},
		components: {
			uniPopup
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user
			})
		},
		onLoad(e) {
			this.form.userChild.id = +e.id
			if(e.gift_id){
				this.getGiftById(e.gift_id)
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			// 数据回填
			getGiftById(id){
				this.$api.get({
					url:`child/gift/${id}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							data.createTime=data.createTime.slice(0,10)
							this.scoreUsed=data.scoreUsed
							this.form=data
							this.imageList=data.pics?data.pics.split(','):[]
						}
					}
				})
			},
			submit() {
				if (!this.form.giftName) {
					uni.showToast({
						title: "请输入礼物名称!",
						icon: "none",
						mask: true
					});
					return
				}
				if (!this.form.scoreUsed) {
					uni.showToast({
						title: "请输入积分!",
						icon: "none",
						mask: true
					});
					return
				}
				uni.showLoading({
					mask: true
				})
				let form = JSON.parse(JSON.stringify(this.form))
				form.createTime = form.createTime + ' 00:00:01'
				form.pics = this.imageList.join(',')
				this.getFlower(form)
			},
			// 获取小红花数量
			getFlower(form) {
				this.$api.get({
					url: `child/like/user/${this.form.userChild.id}`,
					noLoading: true,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							let flowerNum = data.length
							this.getRecord(form, flowerNum)
						}
					}
				})
			},
			// 获取已扣除的点赞数量
			getRecord(form, flowerNum) {
				this.$api.get({
					url: `child/gift/child/${this.form.userChild.id}`,
					noLoading: true,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							let recordNum = 0
							if (data.length.length !== 0) {
								data.forEach(item => {
									recordNum += item.scoreUsed
								})
							}
							if (form.scoreUsed <= (flowerNum - recordNum+this.scoreUsed)) {
								this.addPublish(form)
							} else {
								uni.hideLoading()
								uni.showToast({
									title: '剩余小红花不足,继续加油哦!',
									icon: "none",
									mask: true
								});
							}
						}
					}
				})
			},
			addPublish(form) {
				this.$api.post({
					url: `child/gift/new`,
					noLoading: true,
					params: form,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							uni.hideLoading()
							uni.showToast({
								title: '兑换成功!',
								icon: "none",
								mask: true
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 800);
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '上传失败!',
								icon: "none",
								mask: true
							});
						}
					}
				})
			},
			onFocus() {

			},
			chooseImage() {
				this.$api.chooseImage({
					callback: res => {
						this.imageList.push(res)
					}
				})
			},
			openPopup() {
				// 需要在 popup 组件，指定 ref 为 popup
				// this.$refs.popup.open()
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						// console.log(JSON.stringify(res.tempFilePaths));
						// this.imageList=res.tempFilePaths
						console.log(this.imageList);
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (image) => {
								this.imageList.push(image.path)
								console.log(image.path);
							}
						});
					}
				})
			},
			bindDateChange(e) {
				this.form.createTime = e.target.value
			},
			bindScoreChange(e) {
				this.form.scoreUsed = e.target.value + 1
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style lang='less'>
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		width: 100%;

		.cash_gift {
			margin-top: 20upx;
			width: 100%;
			background-color: #FFFFFF;
			min-height: 922upx;
			box-sizing: border-box;
			padding: 20upx 40upx 0 30upx;

			.cash_row {
				margin-top: 20upx;
				width: 100%;
				display: flex;
				align-items: center;

				.cash_title {
					font-size: 28upx;
					color: #333333;
				}

				.meet_date {
					width: 482upx;
					height: 84upx;
					background: #FFFFFF;
					border: 1px solid #EEEEEE;
					box-sizing: border-box;
					padding: 28upx 18upx 28upx 24upx;
					display: flex;
					align-items: center;
					margin-bottom: 14upx;

					.meet_date_img {
						width: 40upx;
						height: 40upx;
						margin: 10upx;
					}

					.date_picker {
						flex: 1;

						.date_input {
							font-size: 32upx;
							color: #333333;
							line-height: 96upx;
						}
					}
				}

				.cash_input_box {
					width: 482upx;
					height: 84upx;
					box-sizing: border-box;
					border: 1px solid #EEEEEE;
					background-color: #FFFFFF;

					.cash_input {
						margin-left: 10px;
						width: 100%;
						height: 100%;

						.uni-input-placeholder {
							font-size: 32upx;
							color: #CCCCCC;
						}
					}
				}
			}

			.gift_img_box {
				margin: 58upx 0 58upx 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.card_img_box_view {
					width: 200upx;
					height: 200upx;
					border: 2upx solid #CCCCCC;
					box-sizing: border-box;
					position: relative;
					margin-right: 14upx;
					/* margin-bottom: 24upx; */

					&:nth-child(3n) {
						margin-right: 0;
					}

					.gift_img_img {
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

					.card_img_box_check {
						position: absolute;
						width: 40upx;
						height: 40upx;
						border-radius: 50%;
						border: 4upx solid #41a863;
						box-sizing: border-box;
						// background-color: #f23a3a;
						text-align: center;
						line-height: 30upx;
						font-size: 20upx;
						color: #41a863;
						left: 10upx;
						top: 10upx;
						z-index: 1;
					}
				}

				.card_img_box_left {
					width: 200upx;
					height: 200upx;
					background: #F4FAFD;
					display: flex;
					align-items: center;
					justify-content: center;

					.card_img_add {
						width: 180upx;
						height: 180upx;
						border: 1px dotted #C0C0C0;
						border-radius: 5px;
						font-size: 96upx;
						color: #979797;
						text-align: center;
						line-height: 160upx;
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
			}
		}

		.popup_box {
			// margin: 0 24upx;
			width: 100%;
			height: 266upx;

			display: flex;
			align-items: center;

			.upload_image {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: column;

				text {
					font-size: 28upx;
					color: #666666;
				}

				image {
					width: 100upx;
					height: 100upx;
				}
			}
		}
	}
</style>
