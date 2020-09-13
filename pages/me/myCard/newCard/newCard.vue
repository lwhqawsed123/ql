<template>
	<view class="content">
		<form @submit="formSubmit" @reset="formReset">
			<view class="card_name">
				<input class="name_input" name="name" v-model="card.name" placeholder="请输入名片名称" />
			</view>
			<view class="card_img_box" v-show="img_show">
				<view v-if="!image_url" class="card_img_box_left" @click="chooseThumbnail(image_flag,'image_url')">
					<view class="card_img_add">
						<text>+</text>
					</view>
				</view>
				<view v-if="image_url" class="card_img_box_left">
					<image class="card_img_box_left_img" :src="imageBaseUrl+image_url" mode=""></image>
				</view>
				<text class="iconfont icon-guanbi card_img_box_close" @click="clearAndClose('card_img')"></text>
				<view class="card_img_change" @click="chooseThumbnail(image_flag,'image_url')">
					<text>更换照片</text>
					<image src="../../../../static/index/Group%209%20Copy%202.jpg" mode=""></image>
				</view>
			</view>
			<view class="my_intro_title">
				名片头衔
			</view>
			<view class="my_intro">
				<input type="text" value="" maxlength="20" name="title" class="my_intro_input" v-model="card.title" placeholder="请填写名片头衔"
				 placeholder-style="color: #ccc;font-size: 32upx;" />
			</view>
			<view class="my_intro_title">
				个人简介
			</view>
			<view class="my_intro">
				<textarea class="my_intro_textarea" maxlength="200" value="" name="description" v-model="card.description"
				 placeholder="请填写个人简介" placeholder-style="color: #ccc;font-size: 32upx;" />
				</view>
			<view class="choose_witness" v-if="meet_show">
				<button type="primary" class="choose_witness_button" @click="navigateTo('chooseWitness/chooseWitness')">{{checkedMeet.length===0?'选择美好见证':`已选择 ${checkedMeet.length} 个见证`}}</button>
				<text class="iconfont icon-guanbi choose_witness_close" @click="clearAndClose('meet')"></text>
			</view>
			<view class="choose_witness" v-if="article_show">
				<button type="primary" class="choose_witness_button" @click="navigateTo('chooseArticle/chooseArticle')">{{checkedContent.length===0?'选择案例视频/文章':`已选择 ${checkedContent.length} 个案例`}}</button>
				<text class="iconfont icon-guanbi choose_witness_close" @click="clearAndClose('article')"></text>
			</view>
			<view class="bottom_btn">
				<button class="from-submit" formType="submit" type="primary">生成名片</button>
			</view>
		</form>
	</view>
</template>

<script>
	import{mapState} from 'vuex'
	import graceChecker from "../../../../utils/graceChecker.js";
	import {RES_HOST, UPLOAD_URL} from "../../../../api/config";
	export default {
		data() {
			return {
				id:'',
				catalogId:0,
				card:{
					name:'',
					image:'',
					title:'',
					description:'',
					cardType:1,
					contents:[],
					user:{
						id:0
					}
				},
				form:{
					name:'',
					image:'',
					title:'',
					description:'',
					cardType:1,
					contents:[],
					user:{
						id:0
					}
				},
				img_show:true,
				meet_show:true,
				article_show:true,
				fileMax:2,
				image_flag:false,
				image_url:'',	// 头像路径
				imageBaseUrl: RES_HOST+"/img/",
				rules : [
				       {name:"name", checkType : "notnull", checkRule:"",  errorMsg:"请输入名片名称"},
				       {name:"title", checkType : "notnull", checkRule:"",  errorMsg:"请输入名片头衔"}
				]
			}
		},
		computed:{
			...mapState({
				checkedMeet:state=>state.checkedMeet,
				user:state=>state.user,
				checkedContent:state=>state.checkedContent
			}),
			// checkedMeetResources(){
			// 	let meetResources=0
			// 	if(this.checkedMeet.length){
			// 		this.checkedMeet.forEach(item=>{
			// 			item.resources.forEach(list=>{
			// 				if(list.selected){
			// 					meetResources++
			// 				}
			// 			})
			// 		})
			// 	}
			// 	return meetResources
			// }
		},
		onLoad(e){
			this.id=e.id
			this.getCard()
		},
		onUnload(){
			this.$store.dispatch({
				type:'removeCheckedMeet'
			})
			this.$store.dispatch({
				type:'removeCheckedContent'
			})
		},
		onReady() {
			this.$api.sdkReady()

		},
		methods: {
			getCard(){
				if(!this.id){
					this.$store.dispatch({
						type:'removeCheckedMeet'
					})
					this.$store.dispatch({
						type:'removeCheckedContent'
					})
					return
				}
				this.$api.get({
					url:`user/bizCard/${this.id}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							this.card=data
							this.image_url=data.image
							if(data.contents.length!==0){
								this.getCatalogId(data.contents)
							}
						}
					}
				})
			},
			// 获取发布美好模块catalog.id
			getCatalogId(contents) {
				let params = {
					pi: 1,
					ps: 5,
					query: 'identifyName=YJMH'
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
							let contentList=[]
							let meetList=[]
							contents.forEach(item=>{
								if(item.catalog.id===catalogId){
									// 设置store中的checkedMeet
									meetList.push(item)
								}else{
									contentList.push(item)
								}
							})
							this.$store.dispatch({
								type:'saveCheckedMeet',
								checkedMeet:meetList
							})
							// 设置shore的checkedContent
							this.$store.dispatch({
								type:'saveCheckedContent',
								checkedContent:contentList
							})
						}
					}
				})
			},
			// 提交表单
			formSubmit(e){
				// console.log(e)
				if(this.image_flag){
					uni.showToast({title:"图片未上传完成!", icon:"none",mask:true});
					return
				}
				 //进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, this.rules);
				if(checkRes){
				    uni.showToast({title:"验证通过!", icon:"none",mask:true});
					let data=''
					if(this.id){
						data=JSON.parse(JSON.stringify(this.card))
					}else{
						data=JSON.parse(JSON.stringify(this.form))
					}
					data.name=formData.name
					data.title=formData.title
					data.description=formData.description
					data.image=this.image_url
					data.user.id=this.user.id
					let checkedMeet=this.checkedMeet
					let checkedContent=this.checkedContent
					data.contents=[]
					if(checkedMeet.length!==0){
						data.contents.push.apply(data.contents,checkedMeet)
					}
					if(checkedContent.length!==0){
						data.contents.push.apply(data.contents,checkedContent)
					}
					this.addNewCard(data)

				}else{
				    uni.showToast({ title: graceChecker.error, icon: "none" ,mask:true});
				}

			},
			// 新增名片
			addNewCard(data){
				this.$api.post({
					url:'user/bizCard/new',
					params:data,
					callback:res=>{
						let {meta,data}=res
						console.log(res)
						if(meta.success){
							uni.showToast({ title: "创建名片成功", icon: "none" ,mask:true});
							setTimeout(()=> {
								uni.redirectTo({
								    url: `../createCard/createCard?id=${data.id}&showToast=1`
								})
							}, 1000)
						}
					}
				})
			},
			// 选择头像
			chooseThumbnail(image_flag,save_url) {
				if(image_flag){
					return
				}
			  uni.chooseImage({
			    count: 1,
				sizeType:['compressed'],
			    sourceType: ["camera", "album"],
			    success: res=> {
					image_flag=true
					let fileImg=res.tempFiles[0]
					// let size2M=fileImg.size/1024/1024<this.fileMax
					// if(!size2M){
					// 	uni.showToast({title:`图片大小不能超过${this.fileMax}M!`, icon:"none"});
					// 	image_flag=false
					// 	return
					// }
				  // 上传到服务器
				  uni.uploadFile({
				  	url: UPLOAD_URL, //仅为示例，非真实的接口地址
				  	filePath: res.tempFilePaths[0],
				  	name: 'file',
				  	header: {
				  		'Authorization': 'Bearer ' + this.$api.getToken()
				  	},
				  	formData: {
				  		'type': 'img'
				  	},
				  	success: (uploadFileRes) => {
				  		let uploadFile=JSON.parse(uploadFileRes.data)
				  		let {data,meta}=uploadFile
						console.log(uploadFileRes)
				  		if (meta.success) {
							image_flag=false
							this[save_url]=data
				  		}
				  	}
				  });
			    }
			  });
			},
			// 关闭选择
			clearAndClose(target){
				if(target==="meet"){
					this.meet_show=false
					this.$store.dispatch({
						type:'removeCheckedMeet'
					})
				}else if(target==="article"){
					this.article_show=false
					this.$store.dispatch({
						type:'removeCheckedContent'
					})
				}else if(target==='card_img'){
					this.img_show=false
					this.image_url=""
				}
			},
			navigateTo(url){
				uni.navigateTo({
					url:url
				})
			},
		}
	}
</script>
<style>
</style>
<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding-top: 24upx;
		padding-bottom: 112upx;
		.card_name{
			width: 100%;
			height: 96upx;
			box-sizing: border-box;
			border: 1px solid #EEEEEE;
			background-color: #FFFFFF;
			.name_input{
				margin-left: 20upx;
				width: 100%;
				height: 100%;
				.uni-input-placeholder{
					font-size: 32upx;
					color: #CCCCCC;
				}
			}
		}
		.card_img_box{
			margin: 24upx 0;
			position: relative;
			width: 100%;
			height: 200upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			.card_img_box_left{
				margin-left: 20upx;
				width: 204upx;
				height: 144upx;
				background: #F4FAFD;
				display: flex;
				align-items: center;
				justify-content: center;
				.card_img_box_left_img{
					width: 100%;
					height: 100%;
				}
				.card_img_add{
					width: 180upx;
					height: 120upx;
					border: 1px dotted #C0C0C0;
					border-radius: 10upx;
					font-size: 48upx;
					color: #979797;
					text-align: center;
					line-height: 120upx;
				}
			}
			.card_img_box_close{
				position: absolute;
				top: 20upx;
				right: 20upx;
				font-size: 24upx;
			}
			.card_img_change{
				position: absolute;
				bottom: 22upx;
				right: 20upx;
				display: flex;
				align-items: center;
				text{
					font-size: 32upx;
					color: #333333;
				}
				image{
					margin-left: 6upx;
					width: 16upx;
					height: 28upx;
				}
			}
		}
		.card_title_box_border{
			border-bottom: 1px solid #EEEEEE;;
		}
		.card_title_box{
			width: 100%;
			background-color: #FFFFFF;
			display: flex;
			.card_title{
				width: 148upx;
				height: 100%;
				font-size: 32upx;
				color: #333333;
				padding-top: 28upx;
				padding-left: 10upx;
				box-sizing: border-box;
				margin-right: 6upx;
			}
			.card_title_radio_box{
				flex: 1;
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				padding-top: 28upx;
				box-sizing: border-box;
				label{
					width: 50%;
					display: flex;
					align-items: center;
					margin-bottom: 44upx;
				}
				.card_radio_icon{
					display: flex;
					align-items: center;
					justify-content: center;
					text{
						font-size: 32upx;
						color: #333333;
					}

					uni-radio .uni-radio-input{
						width: 20upx;
						height: 20upx;
					}
				}
			}
		}
		.my_intro_title{
			font-size: 32upx;
			color: #333333;
			margin: 20upx 0;
		}
		.my_intro{
			width: 100%;
			background-color: #FFFFFF;
			border: 1px solid #EEEEEE;
			box-sizing: border-box;
			padding: 10upx;
			.my_intro_textarea{
				width: 100%;
				height: 130upx;
			}
			.my_intro_input{
				width: 100%;
				height: 76upx;
			}
		}
		.choose_witness{
			margin: 24upx 0;
			background-color: #FFFFFF;
			width: 100%;
			height: 160upx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			.choose_witness_button{
				width: 384upx;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
				font-size: 36upx;
			}
			.choose_witness_close{
				position: absolute;
				top: 20upx;
				right: 20upx;
				font-size: 24upx;
			}
		}
		.bottom_btn{
			overflow: hidden;
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			bottom: 0;
			left: 0;
			.from-submit{
				// margin:38upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
	}

</style>
