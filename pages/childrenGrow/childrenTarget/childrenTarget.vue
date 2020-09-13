<template>
	<view class="content">
		<view class="target_date">
			2019/11/25-11/29
		</view>
		<view class="target_flower">
			<view class="target_left">
				目标学校: 深圳中学
			</view>
			<view class="target_right">
				已按时完成计划100天
			</view>
			
		</view>
		<view class="target_table_box">
		
			<view class="table_box">
				<view class="table_head table_row">
					<view class="table_head_col">
					</view>
					<view class="table_head_col" v-for="item in 5" :key="item" >
						<text>{{item}}</text>
					</view>
				</view>
				<view class="table_head table_row" v-for="list in 5" :key="list">
					<view class="table_head_col table_head_first">
						<text>英语早读</text>
					</view>
					<view class="table_head_col table_col_inner" v-for="item in 5" :key="item" >
						<view class="table_col_imgbox">
							<image src="../../../static/index/蓝花@2x.png" mode="" v-if="item==1"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="total_flower">
			<view class="total_flower_left">
				<text class="total_flower_sum">共计：</text>
				<text class="total_flower_num">500积分</text>
			</view>
			<view class="total_flower_right" @click="navigateTo('../gift/gift')">
				<text class="total_flower_exchange">兑换小礼物</text>
				<image class="total_flower_right_img" src="../../../static/index/Group%209%20Copy%202.jpg" mode=""></image>
			</view>
		</view>
		<view class="bottom_box">
			<button class="bottom_button button_yellow" type="primary" @click="navigateTo('../record/record')">兑换记录</button>
			<button class="bottom_button button_red" type="primary" @click="navigateTo('changeTarget/changeTarget')">调整计划</button>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		data() {
			return {
				
			}
		},
		components: {uniGrid,uniGridItem},
		onLoad(e){
			// uni.setNavigationBarTitle({
			//     title: '习惯养成 ('+e.title+')'
			// });
		},
		onReady() {
			this.$api.sdkReady()
		},
		methods: {
			navigateTo(url){
				uni.navigateTo({
					url:url,
					
				})
			}
		}
	}
</script>

<style lang="less">
	
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}
	.content{
		width: 100%;
		padding-top: 30upx;
		box-sizing: border-box;
		overflow: hidden;
		.target_date{
			font-size: 28upx;
			color: #999999;
		}
		.target_flower{
			overflow: hidden;
			margin: 20upx 0 36upx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			font-size: 28upx;
			color: #333333;
			.target_left{}
			.target_right{}
		}
		.target_table_box{
			width: 100%;
			height: 744upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
			.table_box{
				width: 664upx;
				border-radius: 40upx;
				background: #CBDEFF;
				border: 1px solid #A5BAFF;
				font-size: 26upx;
				color: #4986EE;
				overflow: hidden;
				box-sizing: border-box;
				.table_row{
					width: 100%;
					height: 104upx;
					display: flex;
					box-sizing: border-box;
					.table_head_col{
						flex: 1;
						height: 100%;
						background-color: #FFFFFF;
						border-bottom: 2upx dashed #A5BAFF;
						border-right: 2upx dashed #A5BAFF;
						box-sizing: border-box;
						text-align: center;
						line-height: 104upx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #CBDEFF;
						
						&:last-child{
							border-right: none;
						}
					}
					.table_head_first{
						box-sizing: border-box;
						overflow: hidden;
						text{
							display: inline-block;
							width: 50%;
							line-height: 26upx;
						}
					}
					.table_col_inner{
						.table_col_imgbox{
							width: 94upx;
							height: 94upx;
							background-color: #FFFFFF;
							border-radius: 30upx;
							display: flex;
							align-items: center;
							justify-content: center;
							image{
								width: 102upx;
								height: 92upx;
							}
						}
					}
				}
				
			}
		}
		.total_flower{
			box-sizing: border-box;
			padding: 0 20upx;
			width: 100%;
			height: 136upx;
			background-color: #FFFBE9;
			margin-bottom: 44upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.total_flower_left{
				font-size: 28upx;
				color: #333333;
				.total_flower_sum{
				}
				.total_flower_num{
					font-size: 36upx;
				}
				
			}
			.total_flower_right{
				color: #666666;
				font-size: 28upx;
				.total_flower_exchange{
					margin-right: 10upx;
				}
				.total_flower_right_img{
					width: 12upx;
					height: 22upx;
				}
			}
			
		}
		.bottom_box{
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bottom_button{
				width: 336upx;
				height: 84upx;
				line-height: 84upx;
				border-radius: 4upx;
			}
			.button_yellow{
				background-color: #FDA228;
			}
			.button_red{
				background-color:  #EE4F16;
			}
		}
		
	}
	
	
	
	
	
	
	
</style>
