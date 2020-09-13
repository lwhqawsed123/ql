<template>
	<view class="content">
		<view class="tips">
			输入姓名
		</view>
		<view class="input_box textarea_box">
			<input type="text" value="" v-model="form.name" placeholder="姓名" placeholder-style="color:#CCCCCC;font-size: 32upx;" />
		</view>
		<view class="tips">
			选择生日
		</view>
		<view class="meet_date">
			<image class="meet_date_img" src="../../../static/index/日历@2x.png" mode=""></image>
			<picker class="date_picker" mode="date" :value="form.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="date_input">{{form.birthday}}</view>
			</picker>
		</view>
		<view class="bottom_btn">
			<button class="from-submit" formType="submit" type="primary" @click="formSubmit">保存</button>
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
				child_id:0,
				form: {
					user: {
						id: 0
					},
					name: '',
					birthday: currentDate
				}
			};
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
		onLoad(e) {
			this.child_id=e.id
			if(e.id){
				this.getChild(e.id)
			}
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			getChild(id){
				this.$api.get({
					url:`child/${id}`,
					callback:res=>{
						if(res.meta.success){
							res.data.birthday=this.$common.dateToString(res.data.birthday).slice(0,10)
							this.form=res.data
						}else{
							uni.showToast({
								title: "获取信息失败!",
								icon: "none",
								mask: true
							});
						}
					}
				})
			},
			// 提交表单
			formSubmit() {
				if (!this.form.name) {
					uni.showToast({
						title: "姓名不能为空!",
						icon: "none",
						mask: true
					});
					return
				}
				if (!this.form.birthday) {
					uni.showToast({
						title: "生日不能为空!",
						icon: "none",
						mask: true
					});
					return
				}
				let form = JSON.parse(JSON.stringify(this.form))
				form.birthday = form.birthday+' 00:00:00'
				form.user.id = this.user.id
				if(form.id){
					this.editChild(form)
				}else{
					this.addChild(form)
				}

			},
			addChild(form) {
				this.$api.post({
					url: `child/new`,
					params: form,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							uni.showToast({
								title: '提交成功!',
								icon: "none",
								mask: true
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 800);
						} else {
							uni.showToast({
								title: '提交失败!',
								icon: "none",
								mask: true
							});
						}
					}
				})
			},
			editChild(form) {
				this.$api.put({
					url: `child/habit/update`,
					params: form,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							uni.showToast({
								title: '提交成功!',
								icon: "none",
								mask: true
							});
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 800);
						} else {
							uni.showToast({
								title: '提交失败!',
								icon: "none",
								mask: true
							});
						}
					}
				})
			},
			bindDateChange: function(e) {
				this.form.birthday = e.target.value
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
	}

	.content {
		width: 100%;
		background-color: #FFFFFF;
		padding: 24upx 26upx 24upx 24upx;
		box-sizing: border-box;

		.tips {
			font-size: 28upx;
			color: #666666;
		}

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
			padding: 0 18upx;

			textarea {
				width: 100%;
				height: 100%;
			}
		}

		.input_box {
			height: 96upx;
			margin-bottom: 14upx;

			input {
				width: 100%;
				height: 100%;
				line-height: 96upx;
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
