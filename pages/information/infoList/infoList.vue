<template>
	<view class="content">

		<wuc-tab :tab-list="informationList" tabClass="tabClass" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
		<swiper :current="TabCur" duration="300" @change="swiperChange" :style="{height:swiperHeight+'px'}">
			<swiper-item v-for="(item,index) in informationList" :key="index">
				<view :class="'information_'+index">
					<view class="activities_item" v-for="list in item.contents" :key="list.id" @click="navigateTo(list)">
						<view class="activities_title">
							{{list.name}}
						</view>
						<view class="activities_banner">
							<!-- <video v-if="list.id" class="video_player" id="video" :direction="90" :src="videoBaseUrl+item.banner"
							 :controls="false" :show-center-play-btn="false"></video> -->
							<image v-if="list.banner" :src="imageBaseUrl+list.banner" mode=""></image>
							<image v-else src="/static/newest/home_news_video_dealft.jpg" mode=""></image>
						</view>
					</view>
				</view>
				<view class="empty_Data" v-if="item.contents.length===0">
					没有更多数据了!
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				identifyName: 'ZX',
				contentList: [], // 资讯目录
				catalog_id: 0,
				TabCur: 0,
				tabList: [],
				informationList: [],
				listHeight: 0, //内部的高度
				swiperHeight: 0, //外部的高度
			};
		},
		computed: {
			...mapState({
				user: state => state.user,
				imageBaseUrl: state => state.imageBaseUrl,
			})
		},
		onLoad(e) {},
		onReady() {
			this.$api.sdkReady()
			// this.getCatalog('HD')
			this.getAllActivities()

		},
		components: {
			WucTab
		},
		methods: {
			getActivities(id, backData) {
				let data1 = {
					query: `delFlag=0,catalog.parentId=${id}`,
					pi: 1,
					ps: 99999999,
					sortBy: 'DESC',
					sortFiled: 'id'
				}
				this.$api.get({
					url: `content/page`,
					params: data1,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							if (data.content.length !== 0 && backData.length !== 0) {
								let information = backData.map(list => {
									let arr = []
									data.content.forEach(item => {
										item.createTime = this.$common.dateToString(item.createTime)
										if (list.id === item.catalog.id) {
											arr.push(item)
										}
									})
									this.$set(list, 'contents', arr)
									return list
								})
								this.informationList = information
								this.$nextTick(() => {
									this.getlistHeight('.information_0')
								})
								console.log(this.informationList)
							}

						}
					}
				})
			},
			// 获取资讯目录列表
			getAllActivities() {
				this.$api.get({
					url: `content/catalog/identify?companyId=1&name=${this.identifyName}`,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let id = data[0].id
							this.$api.get({
								url: `content/catalog/parent/${id}`,
								callback: res => {
									let {
										meta,
										data
									} = res
									if (meta.success) {
										this.contentList = data
										this.tabList = data
										this.getActivities(id, JSON.parse(JSON.stringify(data)))
									}
								}
							})
						}
					}
				})
			},
			tabChange(index) {
				this.TabCur = index;
				let className=`.information_${index}`
				this.getlistHeight(className);
				console.log(index)
			},
			swiperChange(e) {
				let {
					current
				} = e.target;
				this.TabCur = current;
				let className=`.information_${current}`
				// 不同的tab不同的高度赋不同的值
				this.getlistHeight(className);
			},
			getlistHeight(list) {
				let _this = this
				let info = uni.createSelectorQuery().select(list);
				// console.log(info) // 获取元素的各种参数
				info.boundingClientRect(function(data) {
					console.log(data.height)  // 获取元素的各种参数
					_this.listHeight = data.height; // 获取元素高度
					_this.getHeight();
				}).exec();
			},
			getHeight() {
				let _this = this;
				_this.swiperHeight = _this.listHeight;
				return _this.swiperHeight;
			},
			navigateTo(item) {
				uni.navigateTo({
					url: `../informationDetail/informationDetail?id=${item.id}`,
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		min-height: 100%;
		background-color: #F9F9F9;
		box-sizing: border-box;

		.activities_item {
			box-sizing: border-box;
			padding: 30upx 28upx;
			// border-bottom: 2upx dashed #CCCCCC;
			border-bottom: 10upx solid #CCCCCC;
			// border-top:2upx dashed #CCCCCC;
			&:last-child {
				// border-bottom: 2upx dashed #CCCCCC;
			}

			.activities_title {
				color: #333333;
				font-size: 34upx;
				word-break: break-all;
				text-align: left;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				/*自适应盒子*/
				-webkit-line-clamp: 2;
				/*此处为1行,如果是两行就改成2*/
				-webkit-box-orient: vertical;
			}

			.activities_banner {
				margin-top: 22upx;
				width: 100%;
				height: 394upx;
				display: flex;
				align-items: center;
				justify-content: center;
				image {
					// width: 100%;
					height: 100%;
				}
			}

		}

		.tabClass {
			background-color: #f3f5f6;
			color: #787878;
		}

		.selectClass {
			color: #f26b1e;
		}

		.empty_Data {
			width: 100%;
			margin-top: 2upx;
			line-height: 100upx;
			font-size: 28upx;
			color: #999999;
			text-align: center;
		}
	}
</style>
