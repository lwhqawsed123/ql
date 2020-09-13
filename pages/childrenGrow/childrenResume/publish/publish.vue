<template>
	<view class="content">
		<view class="publish_box">
			<view class="textarea_box">
				<textarea auto-height placeholder="这一刻的想法…" maxlength="200" v-model="form.name" placeholder-style="color:#CCCCCC;font-size: 28upx;" />
				</view>
				<!-- <view class="gift_img_box">
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<image class="gift_img_img" src="../../../../static/index/Rectangle%2012%20Copy%202.jpg" mode=""></image>
					<view class="card_img_box_left">
						<view class="card_img_add">
							<text>+</text>
						</view>
					</view>
				</view> -->
				<!-- <view class="gift_img_box">
					<view class="gift_item_box" v-for="item in imageList" :key="item">
						<image  class="gift_img_img" :src="item" mode=""></image>
					</view>
					<view v-if="imageList.length<9" class="gift_item_box card_img_box_left" @click="openPopup">
						<view class="card_img_add">
							<text>+</text>
						</view>
					</view>
				</view> -->
				<view class="gift_img_box">
					<view class="card_img_box_view" v-for="(item,index) in imageList" :key="index">
						<text class="iconfont icon-guanbi card_img_box_close" @click="removeImage('imageList',index)"></text>
						<image  class="gift_img_img" :src="imageBaseUrl+item.url" mode=""></image>
					</view>
					<view v-if="imageList.length<9" class="card_img_box_left" @click="chooseImage">
						<view class="card_img_add">
							<text>+</text>
						</view>
					</view>
				</view>
		</view>
		
		<view class="bottom_box">
			<button class="bottom_button button_red" type="primary" @click="submit">发表</button>
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
				form:{
					name:'',
					userChild:{
						id:0
					},
					fileUrl:''
				},
				imageList: [],
				
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user
			})
		},
		onLoad(e) {
			this.form.userChild.id=e.id
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			submit(){
				if(!this.form.name){
					uni.showToast({title:"素材名称不能为空!", icon:"none",mask:true});
					return
				}
				if(this.imageList.length===0){
					uni.showToast({title:"素材图片不能为空!", icon:"none",mask:true});
					return
				}
				uni.showLoading({mask:true})
				let form=JSON.parse(JSON.stringify(this.form))
				form.fileUrl=JSON.stringify(this.imageList)
				console.log(form)
				this.addPublish(form)
			},
			addPublish(form){
				this.$api.post({
					url:`child/matter/new`,
					noLoading:true,
					params:form,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							uni.hideLoading()
							uni.showToast({title:'上传成功!', icon:"none",mask:true});
							setTimeout(()=> {
								uni.navigateBack({
								    delta: 1
								});
							}, 800);
						}else{
							uni.hideLoading()
							uni.showToast({title:'上传失败!', icon:"none",mask:true});
						}
					}
				})
			},
			
			openPopup() {
				// 需要在 popup 组件，指定 ref 为 popup
				// this.$refs.popup.open()
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=> {
						// console.log(JSON.stringify(res.tempFilePaths));
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: (image)=> {
								this.imageList.push(image.path)
							}
						});
					}
				})
			},
			chooseImage(){
				this.$api.chooseImage({
					callback:res=>{
						this.imageList.push({url:res})
					}
				})
			},
			// 删除url
			removeImage(url,index){
				this[url].splice(index,1)
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}
	.content{
		width: 100%;
		
		
			
		.publish_box{
			width: 100%;
			background-color: #FFFFFF;
			margin-top: 20upx;
			padding: 24upx;
			box-sizing: border-box;
			.textarea_box{
				border: 2upx solid #EEEEEE;
				width: 100%;
				height: 140upx;
				padding: 10upx;
				box-sizing: border-box;
				overflow: hidden;
				textarea{
					width: 100%;
					height: 100%;
				}
			}
			.gift_img_box {
				margin: 58upx 0 58upx 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.card_img_box_view{
					width: 208upx;
					height: 208upx;
					border: 2upx solid #CCCCCC;
					box-sizing: border-box;
					position: relative;
					margin-right: 14upx;
					margin-bottom: 24upx;
					&:nth-child(3n){
						margin-right: 0;
					}
					.gift_img_img {
						width: 100%;
						height: 100%;
					}
					.card_img_box_close{
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
					.card_img_box_check{
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
				
				.card_img_box_left{
					width: 208upx;
					height: 208upx;
					background: #F4FAFD;
					display: flex;
					align-items: center;
					justify-content: center;
					.card_img_add{
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
		
			.button_red {
				background-color: #EE4F16;
			}
		}
	}
</style>
