<template>
	<view class="share_content">
		<text class="share" @click="shareTo">分享</text>
		<text class="line"></text>
		<text :class="collective?'collectived':'collect' " @click="toCollect">{{collective?'已收藏':'收藏'}}</text>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		props:['content'],
		data() {
			return {
				collective:false,
				collectData:{}
			};
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		updated() {
			this.getCollectiveByid()
		},
		methods:{
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
</style>
