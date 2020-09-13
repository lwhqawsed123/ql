<template>
	<view class="content">
		<view class="activities_item" v-for="item in content.list" :key=item.id @click="navigateTo(item)" >
			<view class="is_new" v-if="item.isNew">
				新
			</view>
			<view class="activities_title">
				{{item.name}}
			</view>
		</view>
		<view>
			<uni-load-more :status="status" :content-text="contentText" :color="color" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import request from "@/utils/request.js"
	import {
		mapState
	} from "vuex"
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				catalog_id:0,
				identifyName: 'HD',
				activities:[
				],
				content: {
					pi: 1,
					ps: 20,
					total: 0,
					list: []
				},
				status: 'more',
				color:'#333333',
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
			};
		},
		computed: {
			...mapState({
				user: state => state.user
			})
		},
		onReady() {
			// this.getCatalog('HD')
			this.$api.sdkReady()
			this.getAll(this.content)
		
		},
		// 上拉加载
		onReachBottom() {
			this.status = 'loading'
			uni.showNavigationBarLoading()
			setTimeout(() => {
				// video未加载完时
				if (this.content.list.length < this.content.total) {
					this.loadMore(this.content)
				} else {
					// 如果全部加载完 显示没有更多数据
					this.status = 'noMore'
					uni.hideNavigationBarLoading()
					return
				}
				this.status = 'more'
				uni.hideNavigationBarLoading()
			}, 2000);
		},
		methods:{
			async getCatalog(msg){
				let res=await this.$common.getCatalog(msg)
				let {meta,data}=res
				this.catalog_id=data[0].id
			},
			getAllActivities(){
				this.$api.get({
					url:`content/identify/${this.identifyName}`,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							console.log(data)
							
							
							if(data.length!==0){
								data.forEach(item=>{
									item.tag=JSON.parse(item.tag)
									let dateNow=new Date().getTime()
									let dateEnd=new Date(item.tag[1]).getTime()
									let isNew=dateEnd-dateNow?true:false
									this.$set(item,'isNew',isNew)
								})
							}
							this.activities=data
						}
					}
				})
			},
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
			// 上拉获取更多
			loadMore(options) {
				if (options.list.length >= options.total) {
					return false;
				}
				options.pi += 1;
				this.getAll(options)
			},
			
			// 获取商品列表
			getAll(options) {
				let data = {
					query: `delFlag=0,catalog.identifyName=${this.identifyName}`,
					pi: options.pi,
					ps: options.ps
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
							// 拼接数组
							if(data.content!==0){
								data.content.forEach(item=>{
									item.tag=JSON.parse(item.tag)
									let dateNow=new Date().getTime()
									let dateEnd=new Date(item.tag[1]).getTime()
									let isNew=dateEnd-dateNow?true:false
									this.$set(item,'isNew',isNew)
								})
							}
							options.list.push.apply(options.list, data.content)
							if(options.list.length>=data.totalElements){
								console.log('================')
								this.status = 'noMore'
								this.color="#cccccc"
							}
						}
					}
				})
			},
			navigateTo(item){
				uni.navigateTo({
					url: `activityDetail/activityDetail?id=${item.id}`,
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
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 10upx 24upx 0 24upx;
		.activities_item{
			box-sizing: border-box;
			border-top:2upx dashed #CCCCCC;
			padding: 0 24upx;
			height: 96upx;
			display: flex;
			align-items: center;
			&:last-child{
				border-bottom:2upx dashed #CCCCCC;
			}
			.is_new{
				width: 32upx;
				height: 32upx;
				background-color: #f26a1d;
				color: #FFFFFF;
				line-height: 32upx;
				font-size: 24upx;
				margin-right: 8upx;
				text-align: center;
				display: inline-block;
			}
			.activities_title{
				color: #333333;
				font-size: 28upx;
				word-break: break-all;
				text-align: left;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;/*自适应盒子*/
				-webkit-line-clamp: 2;/*此处为1行,如果是两行就改成2*/
				-webkit-box-orient: vertical;
			}
		}
		
	}
</style>
