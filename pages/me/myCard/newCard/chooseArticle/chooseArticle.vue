<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="article_base_info">
				<view class="article_base_info_text">
					营销对象基本信息（选择下面属性生成案例）
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">年龄:</view>
					<radio-group class="card_title_radio_box" name="age">
						<label v-for="item in age_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :value="''+item.id" />
							<text>{{item.dictKey}}</text>
						</label>
					</radio-group>
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">职业:</view>
					<radio-group class="card_title_radio_box" name="title">
						<label v-for="item in title_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :value="''+item.id" />
							<text>{{item.dictKey}}</text>
						</label>
					</radio-group>
				</view>
				<view class="card_title_box card_title_box_border">
					<view class="card_title">性别:</view>
					<radio-group class="card_title_radio_box" name="gender">
						<label v-for="item in sex_radio_group" :key="item.id">
							<radio class="card_radio_icon" color="#EE4F16" :value="''+item.id" />
							<text>{{item.dictValue}}</text>
						</label>
					</radio-group>

				</view>
				<view class="bottom_btn">
					<button class="from-submit" formType="submit" type="primary">查询</button>
				</view>
			</view>
			</form>
			<view class="flex_box">
				<view>
					<block v-for="(item , index) in video.list" :key="item.id">
						<view class="video_item" @click="navigateTo(`/pages/videoDetail/videoDetail?id=${item.id}`)">
							<view class="radio_box" @click.stop="chooseArtice(item,index)">
								<view class="radio_box_inner" :class="item.checked?'radio_box_checked':''">
								</view>
							</view>
							<view class="video_box">
								<video class="video_player" id="video" :direction="90" :src="videoBaseUrl+item.banner" :controls="false"
								 :show-center-play-btn="false"></video>
								<view class="video_button"></view>
							</view>
							<view class="article_content">
								<text class="article_title">{{item.name}}</text>
								<text class="article_num">阅读量：{{item.sumRead}}</text>
								<text class="article_num">#{{item.catalog.name}}</text>

							</view>
						</view>
					</block>
					<block v-for="(item , index) in article.list" :key="item.id">
						<view class="article_item">
							<view class="radio_box" @click.stop="chooseArtice(item,index)">
								<view class="radio_box_inner" :class="item.checked?'radio_box_checked':''">
								</view>
							</view>
							<view class="article_img_box" v-if="item.thumbnail">
								<image :src="imageBaseUrl+item.thumbnail" mode="" class="article_img" @click="navigateTo(`/pages/articleDetail/articleDetail?id=${item.id}`)"></image>
							</view>

							<view class="article_content">
								<text class="article_title" @click="navigateTo(`/pages/articleDetail/articleDetail?id=${item.id}`)">{{item.name}}</text>
								<text class="article_num">阅读量：{{item.sumRead}}</text>
								<text class="article_num">#{{item.catalog.name}}</text>

							</view>
						</view>
					</block>
				</view>
				<view>
					<uni-load-more :status="status" :content-text="contentText" color="#333333" />
				</view>
			</view>
			<view class="bottom_button_fixed">
				<button class="from-submit" formType="submit" type="primary" @click.stop="saveChoose">保存</button>
				<button class="from-submit from-cancel" type="primary" @click.stop="backTo">取消</button>
			</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import request from "@/utils/request.js"
	import empty_img from "@/static/index/二维码默认占位@2x.png"
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				prevPage:{},
				age_radio_group: [],
				sex_radio_group: [],
				title_radio_group: [],
				empty_img: empty_img,
				form: {},
				video: {
					pi: 1,
					ps: 5,
					total: 0,
					parentId: '',
					list: [],
					checkedItem: {}
				},
				article: {
					pi: 1,
					ps: 5,
					total: 0,
					parentId: 6,
					list: [],
					checkedItem: {}
				},
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
			}
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				videoBaseUrl: state => state.videoBaseUrl
			})
		},
		onLoad() {

		},
		onReady() {
			this.$api.sdkReady()
			let pages = getCurrentPages();
			this.prevPage = pages[pages.length - 2]; //上一个页面
			this.getAllAudio()
			this.getCatalogId('JKML-SP', this.video)
			this.getCatalogId('JKML-WZ', this.article)
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading'
			uni.showNavigationBarLoading()

			console.log('reach');
			setTimeout(() => {
				// video未加载完时
				if (this.video.list.length < this.video.total) {
					this.loadMore(this.video)
				} else {
					// video 已经加载完,开始加载文章
					if (this.article.list.length < this.article.total) {
						this.loadMore(this.article)
					} else {
						// 如果全部加载完 显示没有更多数据
						this.status = 'noMore'
						uni.hideNavigationBarLoading()
						return
					}
				}
				this.status = 'more'
				uni.hideNavigationBarLoading()
			}, 2000);
		},
		methods: {
			// 查询CatalogId
			async getCatalogId(identifyName, options) {
				let params = {
					pi: 1,
					ps: 5,
					query: `identifyName=${identifyName}`
				}
				let res = await request.axios({
					url: 'content/catalog/page',
					method: 'get',
					params: params
				})
				let {
					data,
					meta
				} = res
				if (meta.success) {
					options.parentId = data.content[0].id
					this.getAll(options)
				}
			},
			// 点击查询按钮
			formSubmit(e) {
				let form = e.detail.value
				this.form = form
				this.video.list=[]
				this.article.list=[]
				// console.log(form)
				this.getCatalogId('JKML-SP', this.video)
				this.getCatalogId('JKML-WZ', this.article)
			},
			// 提交
			saveChoose() {
				let checkedContent=[]
				// if(Object.keys(this.video.checkedItem).length!==0){
				// 	checkedContent.push(this.video.checkedItem)
				// }
				// if(Object.keys(this.article.checkedItem).length!==0){
				// 	checkedContent.push(this.article.checkedItem)
				// }
				if(this.video.list.length!==0){
					this.video.list.forEach(item=>{
						if(item.checked){
							checkedContent.push(item)
						}
					})
				}
				if(this.article.list.length!==0){
					this.article.list.forEach(item=>{
						if(item.checked){
							checkedContent.push(item)
						}
					})
				}
				// 设置上一级页面的checkedContent
				this.$store.dispatch({
					type:'saveCheckedContent',
					checkedContent:checkedContent
				})
				// 返回上一级页面
				if(this.prevPage){
					uni.navigateBack();
				}else{
					history.back()
				}
			},
			// 取消并返回上一级目录
			backTo() {
				// 返回上一级页面
				if(this.prevPage){
					uni.navigateBack();
				}else{
					history.back()
				}
			},
			// 上拉获取更多
			loadMore(options) {
				if (options.list.length >= options.total) {
					return false;
				}
				// options.pi = options.list.length / options.ps + 1;
				options.pi += 1;
				this.getAll(options)
			},

			// 获取商品列表
			getAll(options) {
				let data = {
					query: `delFlag=0,catalog.parentId=${options.parentId}`,
					pi: options.pi,
					ps: options.ps
				}
				// console.log(data)
				let str = ''
				Object.keys(this.form).forEach(item => {
					if (this.form[item]) {
						str += `,tag~=${this.form[item]}`
					}
				})
				data.query += str
				if(str){
					console.log(data)
					return
				}
			
				this.$api.get({
					url: 'content/page',
					params: data,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							options.total = data.totalElements
							data.content.forEach(item => {
								this.$set(item, 'checked', false)
							})
							// 拼接数组
							options.list.push.apply(options.list, data.content)
						}
					}
				})
			},
			// 获取单选框组
			getAllAudio() {
				this.$api.get({
					url: 'biz/setting/all',
					callback: res => {
						if (res.meta.success) {
							let data = res.data
							this.setRadioArray(data)
						}
					}
				})
			},
			// 遍历单选框组
			setRadioArray(data) {
				let age_radio_group = [];
				let sex_radio_group = [];
				let title_radio_group = [];
				if (data.length != 0) {
					data.forEach(item => {
						if (item.dictType == 'AGE') {
							age_radio_group.push(item);
						} else if (item.dictType == 'TITLE') {
							title_radio_group.push(item);
						} else if (item.dictType == 'SEX') {
							sex_radio_group.push(item);
						}
					});
					this.age_radio_group = age_radio_group;
					this.sex_radio_group = sex_radio_group;
					this.title_radio_group = title_radio_group;
				}
			},
			// 选择
			chooseArtice(obj, index) {
				// if (!obj.list[index].checked) {
				// 	obj.list.forEach((item, i) => {
				// 		if (index != i) {
				// 			item.checked = false
				// 		}
				// 	})
				// }
				// obj.list[index].checked = !obj.list[index].checked
				// if (obj.list[index].checked) {
				// 	obj.checkedItem = obj.list[index]
				// } else {
				// 	obj.checkedItem = {}
				// }
				obj.checked=!obj.checked
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,

				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding-top: 20upx;
		width: 100%;
	}

	.content {
		padding: 0 24upx;
		background-color: #FFFFFF;
		.bottom_button_fixed {
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
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

	.flex_box {
		width: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-bottom: 112upx;
		.video_item {
			width: 100%;
			height: 266upx;
			border-bottom: 2upx solid #EEEEEE;
			display: flex;
			align-items: center;
			padding: 0 20upx;
			box-sizing: border-box;

			.video_box {
				width: 342upx;
				height: 218upx;
				position: relative;
				display: flex;
				align-items: center;
				margin-right: 20upx;

				.video_player {
					height: 100%;
					width: 100%;
				}

				.video_button {
					position: absolute;
					z-index: 9;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
				}

				.video_hot_icon {
					width: 112upx;
					height: 44upx;
					position: absolute;
					z-index: 1;
					left: 0;
					bottom: 10upx;
				}

				.video_time {
					position: absolute;
					color: #FFFFFF;
					font-size: 24upx;
					z-index: 1;
					right: 16upx;
					bottom: 14upx;
				}
			}

			.article_content {
				flex: 1;
				height: 100%;
				position: relative;

				.article_title {
					font-size: 32upx;
					color: #333333;
					margin: 20upx 0;
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

				.article_num {
					display: block;
					height: 34upx;
					font-size: 24upx;
					color: #999999;
				}

				.article_share {
					position: absolute;
					right: 80upx;
					bottom: 16rpx;
					width: 40upx;
					height: 40upx;
				}

				.article_collect {
					position: absolute;
					right: 16upx;
					bottom: 16rpx;
					width: 40upx;
					height: 40upx;
				}
			}
		}

		.radio_box {
			height: 100%;
			width: 44upx;
			margin-right: 12upx;
			line-height: 184upx;
			display: flex;
			align-items: center;

			.radio_box_inner {
				width: 44upx;
				height: 44upx;
				border: 4upx solid #CDCDCD;
				border-radius: 50%;
				background-color: #FFFFFF;
				box-sizing: border-box;
			}

			.radio_box_checked {
				border: 14upx solid #EE4F16;
			}
		}

		.article_item {
			width: 100%;
			height: 184upx;
			background-color: #FFFFFF;
			margin-bottom: 20upx;
			padding: 0 20upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			border-bottom: 2upx solid #EEEEEE;



			.article_img_box {
				width: 200upx;
				height: 148upx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20upx;

				.article_img {
					height: 100%;
				}
			}


			.article_content {
				width: 100%;
				height: 100%;
				position: relative;

				.article_title {
					font-size: 32upx;
					color: #333333;
					margin: 20upx 0;
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

				.article_num {
					display: block;
					height: 34upx;
					font-size: 24upx;
					color: #999999;
				}

				.article_share {
					position: absolute;
					right: 80upx;
					bottom: 16rpx;
					width: 40upx;
					height: 40upx;
				}

				.article_collect {
					position: absolute;
					right: 16upx;
					bottom: 16rpx;
					width: 40upx;
					height: 40upx;
				}
			}

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}

	uni-radio-group uni-label {
		padding: 0;
	}

	.uni-list-item__container {
		padding: 24upx 30upx;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list-item__container:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 30upx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.article_base_info {
		font-size: 32upx;
		color: #333333;

		.article_base_info_text {
			margin: 18upx 0;
			padding: 0 24upx;
			box-sizing: border-box;
		}

		.card_title_box_border {
			border-bottom: 1px solid #EEEEEE;
			;
		}

		.card_title_box {
			padding: 0 24upx;
			box-sizing: border-box;
			width: 100%;
			background-color: #FFFFFF;
			display: flex;

			.card_title {
				width: 148upx;
				height: 100%;
				font-size: 32upx;
				color: #333333;
				padding-top: 28upx;
				padding-left: 10upx;
				box-sizing: border-box;
				margin-right: 6upx;
			}

			.card_title_radio_box {
				flex: 1;
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				padding-top: 28upx;
				box-sizing: border-box;

				label {
					width: 50%;
					display: flex;
					align-items: center;
					margin-bottom: 44upx;
				}

				.card_radio_icon {
					display: flex;
					align-items: center;
					justify-content: center;

					text {
						font-size: 32upx;
						color: #333333;
					}

					uni-radio .uni-radio-input {
						width: 20upx;
						height: 20upx;
					}
				}
			}
		}

		.my_intro_title {
			font-size: 32upx;
			color: #333333;
			margin: 20upx 0;
		}

		.my_intro {
			width: 100%;
			background-color: #FFFFFF;
			border: 1px solid #EEEEEE;
			box-sizing: border-box;
			padding: 10upx;

			.my_intro_textarea {
				width: 100%;
				height: 130upx;
			}
		}

		.choose_witness {
			margin: 24upx 0;
			background-color: #FFFFFF;
			width: 100%;
			height: 160upx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.choose_witness_button {
				width: 292upx;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}

			.choose_witness_close {
				width: 24upx;
				height: 24upx;
				position: absolute;
				top: 20upx;
				right: 20upx;
			}
		}

		.bottom_btn {
			overflow: hidden;
			width: 100%;
			// height: 240upx;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;

			.from-submit {
				margin: 38upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
		
	}
</style>
