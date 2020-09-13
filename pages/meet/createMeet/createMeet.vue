<template>
	<view class="content">
		<view class="meet_date">
			<image class="meet_date_img" src="../../../static/index/日历@2x.png" mode=""></image>
			<picker class="date_picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="date_input">{{date}}</view>
			</picker>
		</view>
		<view class="input_box textarea_box">
			<input type="text" value="" v-model="content.name" placeholder="主题" placeholder-style="color:#CCCCCC;font-size: 32upx;" />
		</view>
		<view class="ps_text">
			一段美好回忆从这里开始...
		</view>
		<view class="bottom_btn">
			<button class="from-submit" formType="submit" type="primary" @click="formSubmit">{{content.id?"保存":"创建见证"}}</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {

		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				date: currentDate,
				catalogId: 0,
				content: {
					catalog: {
						id: 0
					},
					createTime:'',
					contentType: "IMG",
					name: '',
					resources: [],
					user: {}
				}
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapState({
				user: state => state.user
			})
		},
		onReady() {
			this.$api.sdkReady()
			this.getCatalogId('YJMH')
		},
		onLoad(e) {
			if (e.id) {
				this.content.id = +e.id
				// 获取content对象
				this.getbyId()
			}
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
						}
					}
				})
			},
			// 根据id获取content
			getbyId() {
				this.$api.get({
					url: `content/${this.content.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.date=data.createTime.slice(0,10)
							this.content=data
							console.log(data)
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			formSubmit() {
				if (!this.content.name.trim()) {
					uni.showToast({
						title: '标题不能为空',
						icon: "none",
						mask: true
					});
					return
				}
				let params=JSON.parse(JSON.stringify(this.content))
				if(!params.id){
					params.catalog.id=this.catalogId
					params.user.id=this.user.id
				}
				params.createTime=this.date+' 00:00:00'
				console.log(params)
				if(this.content.id){
					this.$api.put({
						url: 'content/update',
						params: params,
						callback: res => {
							let {
								meta,
								data
							} = res
							if (meta.success) {
								console.log(res)
								uni.showToast({
									title: '修改成功',
									icon: "none",
									mask: true
								});
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/meet/meet'
									})
								}, 1000);
							}
						}
					})
				}else{
					this.$api.post({
						url: 'content/new',
						params: params,
						callback: res => {
							let {
								meta,
								data
							} = res
							if (meta.success) {
								console.log(res)
								uni.showToast({
									title: '创建成功',
									icon: "none",
									mask: true
								});
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/meet/meet'
									})
								}, 1000);
							}
						}
					})
				}
				
			},
			bindDateChange: function(e) {
				this.date = e.target.value
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

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 20upx 24upx 24upx;
		width: 100%;
	}

	.content {
		width: 100%;
		background-color: #FFFFFF;
		padding: 24upx 26upx 24upx 24upx;
		box-sizing: border-box;


		.meet_date {
			width: 100%;
			height: 96upx;
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

		.textarea_box {
			border: 2upx solid #EEEEEE;
			width: 100%;
			height: 140upx;
			padding: 10upx;
			box-sizing: border-box;
			overflow: hidden;
		}

		.input_box {
			height: 96upx;
			margin-bottom: 14upx;

			input {
				width: 100%;
				height: 100%;
				padding: 0 10upx;
				line-height: 96upx;
			}
		}

		.ps_text {
			padding: 0 20upx;
			color: #CCCCCC;
			font-size: 24upx;
		}

		.gift_img_box {
			margin: 58upx 0 58upx 0;
			display: flex;
			align-items: center;

			.card_img_box_view {
				width: 208upx;
				height: 208upx;
				border: 2upx solid #CCCCCC;
				box-sizing: border-box;
				position: relative;
				margin-right: 14upx;

				&:nth-child(3) {
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
			}

			.card_img_box_left {
				width: 208upx;
				height: 208upx;
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

		.bottom_btn {
			overflow: hidden;
			width: 100%;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1;

			.from-submit {
				margin: 14upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
	}
</style>
