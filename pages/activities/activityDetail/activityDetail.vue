<template>
	<view class="content">
		<view class="activities_title">
			{{content.name}}
		</view>
		<view class="activities_date">
			<text class="activities_date_left">
				开始日期 :
			</text>
			<text class="activities_date_right">
				{{content.tag[0]}}
			</text>
		</view>
		<view class="activities_date margin_left">
			<text class="activities_date_left">
				结束日期 :
			</text>
			<text class="activities_date_right">
				{{content.tag[1]}}
			</text>
		</view>
		<view class="activities_detail" v-html="content.detail">
			
		</view>
		<view class="share_content">
			<text class="share" @click="shareTo">分享</text>
			<text class="line"></text>
			<text :class="collective?'collectived':'collect' " @click="toCollect">{{collective?'已收藏':'收藏'}}</text>
		</view>
	</view>
</template>

<script>
	import shareButton from "@/common/shareButton/shareButton.vue"
	import wx from '@/utils/jsWeiXin.js'
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				id:0,
				content:{
					tag:["",""]
				},
				collective:false,
				collectData:{}
			};
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		components:{
			shareButton
		},
		onLoad(e) {
			this.id=e.id
		},
		onReady() {
			// this.$api.sdkReady()
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
							// data.createTime = this.$common.dateToString(data.createTime)
							data.tag=JSON.parse(data.tag)
							data.tag[0]=this.$common.dateToString(data.tag[0])
							data.tag[1]=this.$common.dateToString(data.tag[1])
							this.content=data
							this.sdkReady()
							this.getCollectiveByid()
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
								console.log("分享成功")
							}
						});
						wx.updateTimelineShareData({
							title: this.content.name, // 分享标题
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: window.location.href.split('#')[0]+"static/index/二维码默认占位@2x.png", // 分享图标
							success: function() {
								// 设置成功
								console.log("分享成功")
							}
						})
					}
				})
			},
			shareTo(){
				uni.showToast({
					title:"点击右上角分享",
					icon:"none",
					mask:true
				})
			},
			
			// 根据用户id和视频内容id查询是否被收藏
			getCollectiveByid() {
				if (!this.user.id) {
					return
				}
				let data = {
					query: `content=${this.content.id},user=${this.user.id}`,
					pi: 1,
					ps: 100
				}
				console.log(data)
				this.$api.get({
					url: `user/collection/page`,
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.collective = data.totalElements === 0 ? false : true
							this.collectData = data.content[0]
							return data
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			// 取消收藏
			removeCollect() {
				if (this.collectData.totalElements !== 0) {
					let id = this.collectData.id
					this.$api.delete({
						url: `/user/collection/del/${id}`,
						callback: res => {
							let {
								meta,
								data
							} = res;
							if (meta.success) {
								this.getCollectiveByid()
							} else {
								// this.$message.error(data);
							}
						}
					})
				} else {
					return
				}
			},
			// 点击收藏
			toCollect() {
				let data = {
					user: {
						id: this.user.id
					},
					content: {
						id: this.content.id
					}
				}
				this.$api.post({
					url: 'user/collection/new',
					params: data,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.getCollectiveByid()
						} else {
							// this.$message.error(data);
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
		box-sizing: border-box;
		padding: 10upx 24upx 24upx 24upx;
		color: #333333;
		position: relative;
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
			display: inline-block;
			font-size: 24upx;
			line-height: 36upx;
			.activities_date_left{
				font-size: 24upx;
				color: #999999;
				margin-right: 20upx;
			}
			.activities_date_right{
				font-size: 24upx;
			}
		}
		.margin_left{
			margin-left: 86upx;
		}
		.activities_detail{
			margin-top: 20upx;
			font-size: 28upx;
			
		}
		.share_content{
			height: 100upx;
			width: 100%;
			padding: 0 30upx;
			background-color: #FFFFFF;
			opacity: 0.8;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 34upx;
			position: fixed;
			bottom: 0;
			left: 0;
			.share{
				color: #4ad360;
			}
			.collect{
				color: #f26b1d;
			}
			.collectived{
				color: #CCCCCC;
			}
			.line{
				width: 2upx;
				height: 46upx;
				background-color: #e0e0e0;
				margin: 0 152upx;
			}
		}
	}
</style>
