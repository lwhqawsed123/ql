<template>
	<view class="content">
		<view class="resume_item" v-for="item in contentList" :key="item.id">
			<view class="resume_content">
				<view class="gift_name">
					{{item.resTime}} {{item.name}}
				</view>
				<view class="gift_img_box">
					<image class="gift_img_img" :src="imageBaseUrl+image.url" v-for="(image,index) in item.fileUrl" :key="index" @click="previewImage(item.fileUrl,index)" mode=""></image>
				</view>
			</view>
		</view>
		<view class="bottom_box">
			<button class="bottom_button button_red" type="primary" @click="navigateTo(`publish/publish?id=${child_id}`)">惊艳发布</button>
		</view>
		<!-- <view class="bottom_box">
			<button class="bottom_button button_yellow" type="primary" @click="navigateTo(`publish/publish?id=${child_id}`)">惊艳发布</button>
			<button class="bottom_button button_red" type="primary" @click="openPopup">导出素材</button>
		</view> -->
		<uni-popup ref="popup" type="bottom" >
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
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				child_id:0,
				contentList:[]
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user
			})
		},
		components: {
			uniPopup
		},
		onReady() {
			this.$api.sdkReady({
				jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
			})
		},
		onLoad(e) {
			this.child_id=e.id
		},
		onShow() {
			this.getPublish()
		},
		methods: {
			getPublish(){
				this.$api.get({
					url:`child/matter/user/${this.child_id}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							if(data.length!==0){
								data.forEach(item=>{
									item.fileUrl=JSON.parse(item.fileUrl)
									item.resTime=item.resTime.slice(0,10)
								})
							}
							this.contentList=data
						}
					}
				})
			},
			// 开启预览
			previewImage(list, index) {
				let arr = JSON.parse(JSON.stringify(list))
				let img_arr = arr.map(item => {
					return this.imageBaseUrl + item.url
				})
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
				});
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,

				})
			},
			openPopup() {
				// 需要在 popup 组件，指定 ref 为 popup
				this.$refs.popup.open()
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
					justify-content: space-between;
					flex-wrap: wrap;

					.gift_img_img {
						width: 204upx;
						height: 144upx;
						margin-bottom: 20upx;
						border: 2upx solid #CCCCCC;
						box-sizing: border-box;
					}
				}
			}
		}
		
		.popup_box{
			// margin: 0 24upx;
			width: 100%;
			height: 266upx;
			
			display: flex;
			align-items: center;
			.upload_image{
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: column;
				text{
					font-size: 28upx;
					color: #666666;
				}
				image{
					width: 100upx;
					height: 100upx;
				}
			}
		}
		
	}

	.bottom_box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 112upx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14upx 24upx;
		box-sizing: border-box;
		.bottom_button {
			width: 100%;
			height: 84upx;
			line-height: 84upx;
			border-radius: 4upx;
		}

		.button_yellow {
			background-color: #FDA228;
		}

		.button_red {
			background-color: #EE4F16;
		}
	}
</style>
