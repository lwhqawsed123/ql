<template>
	<view class="content">
		<view class="activities_title">
			{{content.name}}
		</view>
		<view class="activities_date">
			<text class="activities_date_left">
				日期 :
			</text>
			<text class="activities_date_right">
				{{content.createTime}}
			</text>
		</view>
		<view class="activities_detail" v-html="content.detail">
		</view>
	</view>
</template>

<script>
	import wx from '@/utils/jsWeiXin.js'
	export default {
		data() {
			return {
				id:0,
				content:{}
			};
		},
		onLoad(e) {
			this.id=e.id
		},
		onReady() {
			this.getbyId()
		},
		methods:{
			getbyId() {
				this.$api.get({
					url: `content/${this.id}`,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							data.createTime = this.$common.dateToString(data.createTime)
							this.content=data
							console.log(data)
							this.sdkReady()
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			sdkReady(){
				// 初始化sdk
				this.$api.sdkReady({
					url: window.location.href.split('#')[0],
					jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
					ready: () => {
						let data = JSON.parse(JSON.stringify(this.content))
						let href = window.location.href
						wx.updateAppMessageShareData({
							title: this.content.name, // 分享标题
							desc: this.content.description, // 分享描述
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: window.location.href.split('#')[0]+"static/index/二维码默认占位@2x.png", // 分享图标
							success: function() {
								// 设置成功
							}
						});
						wx.updateTimelineShareData({
							title: this.content.name, // 分享标题
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: window.location.href.split('#')[0]+"static/index/二维码默认占位@2x.png", // 分享图标
							success: function() {
								// 设置成功
							}
						})
					}
				})
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
		box-sizing: border-box;
		padding: 10upx 24upx 24upx 24upx;
		color: #333333;
		.activities_title{
			font-size: 32upx;
			font-weight: 600;
			margin-bottom: 10upx;
			word-break: break-all;
			text-align: left;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;/*自适应盒子*/
			-webkit-line-clamp: 2;/*此处为1行,如果是两行就改成2*/
			-webkit-box-orient: vertical;
		}
		.activities_date{
			font-size: 24upx;
			line-height: 36upx;
			.activities_date_left{
				font-size: 24upx;
				color: #666666;
				margin-right: 20upx;
			}
			.activities_date_right{
				font-size: 24upx;
			}
		}
		.activities_detail{
			margin-top: 20upx;
			font-size: 28upx;
			
		}
	}
</style>
