<template>
	<view class="content">
		<view class="tips">
			输入习惯名称
		</view>
		<view class="input_box textarea_box">
			<input type="text" value="" v-model="form.name" placeholder="习惯名称" placeholder-style="color:#CCCCCC;font-size: 32upx;" />
		</view>
		
		<view class="bottom_btn">
			<button class="from-submit" formType="submit" type="primary" @click="formSubmit">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{
					userChild:{id:0},
					name:'',
					sort:0
				}
			};
		},
		onLoad(e){
			this.form.userChild.id=+e.id
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			// 提交表单
			formSubmit(){
				if(!this.form.name){
					uni.showToast({title:"习惯名称不能为空!", icon:"none",mask:true});
					return
				}
				let form=JSON.parse(JSON.stringify(this.form))
				this.addChild(form)
				
			},
			addChild(form){
				this.$api.post({
					url:`child/habit/new`,
					params:form,
					callback:res=>{
						let {data,meta}=res
						if(meta.success){
							uni.showToast({title:'提交成功!', icon:"none",mask:true});
							setTimeout(()=> {
								uni.navigateBack({
								    delta: 1
								});
							}, 800);
						}else{
							uni.showToast({title:'提交失败!', icon:"none",mask:true});
						}
					}
				})
			},
		
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
		.tips{
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
		.bottom_btn{
			overflow: hidden;
			width: 100%;
			background-color: #FFFFFF;
			padding: 0 24upx;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 1;
			.from-submit{
				margin:14upx 0 14upx 0;
				width: 100%;
				height: 84upx;
				background: #EE4F16;
				border-radius: 2px;
				line-height: 84upx;
			}
		}
	}
</style>
