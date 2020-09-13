<template>
	<view class="content">
		<view class="habit_list">
			{{time_start}} - {{time_end}}
		</view>
		<view class="habit_flower">
			<text>小红花奖（</text>
			<image class="flower_img" src="../../../static/index/红花@2x.png" mode=""></image>
			<text>
				)
				<text class="flower_num">{{' '+((flowerNum-recordNum)<0?0:(flowerNum-recordNum))+' '}}</text>
				个
			</text>
			<text>
				<text style="color: #CCCCCC;margin: 0 10upx">/</text>
				<text class="flower_num" style="color: skyblue">{{' '+(flowerNum)+' '}}</text>
				个
			</text>
		</view>
		<view class="calendar">
			<!-- <view class="calendar_date">
				{{time_start}} - {{time_end}}
			</view> -->
			<view class="calendar_box">
				<button type="primary" class="choose_week" @click="changeWeek('prev')">上一周</button>
				<button type="primary" class="choose_week" @click="changeWeek('now')">本周</button>
				<button type="primary" class="choose_week" v-if="hasNext" @click="changeWeek('next')">下一周</button>
			</view>
		</view>

		<view class="habit_table_box">

			<view class="table_box">
				<view class="table_head table_row">
					<view class="table_first_col">
					</view>
					<view class="table_head_col" v-for="(item,i) in week_now" :key="i">
						<text>{{i+1}}</text>
					</view>
				</view>
				<view class="table_head table_row" v-for="habit in week_array" :key="habit.id">
					<view class=" table_first_col">
						<text>{{habit.name}}</text>
					</view>
					<view class="table_head_col table_col_inner" v-for="(week,index) in habit.children" :key="index">
						<view class="table_col_imgbox" @click="checkFlower(week)">
							<image src="../../../static/index/红花@2x.png" mode="" v-if="week.checked"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="total_flower">
			<view class="total_flower_left">
				<text class="total_flower_sum">共计：</text>
				<text class="total_flower_num">{{(flowerNum-recordNum)<0?0:(flowerNum-recordNum)}}个小红花</text>
			</view>
			<view class="total_flower_right" @click="navigateTo(`../gift/gift?id=${child_id}`)">
				<text class="total_flower_exchange">兑换小礼物</text>
				<image class="total_flower_right_img" src="../../../static/index/Group%209%20Copy%202.jpg" mode=""></image>
			</view>
		</view>
		<view class="bottom_box">
			<button class="bottom_button button_yellow" type="primary" @click="navigateTo(`../record/record?id=${child_id}`)">兑换记录</button>
			<button class="bottom_button button_red" type="primary" @click="navigateTo(`changeHabit/changeHabit?id=${child_id}`)">调整习惯</button>
		</view>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		data() {
			return {
				child_id: 0,
				time_start: '2010-01-01',
				time_end: '2010-01-01',
				week_array: [],
				week_now: [],
				week_prev: '',
				week_next: '',
				habit_list: [{
						id: 1,
						habit: '吃饭',
						flower: true
					},
					{
						id: 2,
						habit: '睡觉',
						flower: false
					},
					{
						id: 3,
						habit: '学习',
						flower: false
					},
					{
						id: 4,
						habit: '打豆豆',
						flower: false
					},
					{
						id: 5,
						habit: '打豆豆',
						flower: false
					}
				],
				like_list: [],
				hasNext: false,
				flowerNum: 0,
				recordNum: 0
			}
		},
		components: {
			uniGrid,
			uniGridItem,
			uniCalendar
		},
		computed: {
			// hasNext(){
			// 	// let week=this.week_now[this.week_now.length-1]
			// 	let time_end=new Date(this.time_end+' 23:59:59').getTime()+1000*24*60*60*2
			// 	let time_start=new Date(this.time_start+' 00:00:00').getTime()
			// 	let date_now=new Date().getTime()
			// 	let flag=false
			// 	if(date_now<=time_start){
			// 		flag=true
			// 	}
			// 	return flag
			// }
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: '习惯养成 (' + e.title + ')'
			});
			this.child_id = +e.id
			console.log(e.id + '====================')
		},
		onReady() {
			this.$api.sdkReady()
		},
		onShow() {
			this.week_now = this.getThisWeek()
			this.getChildHabit()
			this.getFlower()
			this.getRecord()
		},
		methods: {
			// 获取小红花数量
			getFlower() {
				this.$api.get({
					url: `child/like/user/${this.child_id}`,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							this.flowerNum = data.length
							// this.getRecord(data.length)
						}
					}
				})
			},
			// 获取已扣除的点赞数量
			getRecord() {
				this.$api.get({
					url: `child/gift/child/${this.child_id}`,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							let recordNum = 0
							if (data.length.length !== 0) {
								data.forEach(item => {
									recordNum += item.scoreUsed
								})
							}
							this.recordNum = recordNum
							console.log(res)
						}
					}
				})
			},
			// 获取习惯列表
			getChildHabit() {

				let params = {
					pi: 1,
					ps: 99999999,
					query: `userChild.id=${this.child_id}`,
					sortBy: 'ASC',
					sortFiled: "sort"
				}
				this.$api.get({
					url: `child/habit/user/${this.child_id}`,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							console.log(data)
							this.getLike(data)
						}
					}
				})
			},
			getLike(habit_data) {
				let startDate = (this.week_now[0].week || this.week_now[0]) + ' 00:00:00'
				let endDate = (this.week_now[this.week_now.length - 1].week || this.week_now[this.week_now.length - 1]) +
					' 23:59:59'
				let params = {
					pi: 1,
					ps: 99999999,
					query: `userChild.id=${this.child_id},createTime>=${startDate},createTime<=${endDate}`,
					sortBy: 'ASC',
					sortFiled: "createTime"
				}
				this.$api.get({
					url: `child/like/page`,
					params: params,
					callback: res => {
						let {
							data,
							meta
						} = res
						if (meta.success) {
							this.like_list = data.content
							habit_data.forEach(habit => {
								let arr = this.week_now.map(item => {
									let obj = {
										habit: habit,
										week: item,
										like: {},
										checked: false
									}
									data.content.forEach(list => {
										if (list.createTime.slice(0, 10) == item && list.childHabit.id == habit.id) {
											obj.checked = true
											obj.like = JSON.parse(JSON.stringify(list))
										}
									})
									return obj
								})
								this.$set(habit, 'children', arr)
							})
							this.week_array = habit_data
						}
					}
				})
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,

				})
			},
			checkFlower(habit) {
				uni.showLoading({
					mask: true
				})
				if (habit.checked) {
					this.deleteLike(habit.like.id)
				} else {
					this.addLike(habit.habit.id, habit.week)
				}
			},
			addLike(habit_id, week) {
				let params = {
					childHabit: {
						id: habit_id
					},
					userChild: {
						id: this.child_id
					},
					createTime: week + ' 00:00:01'
				}
				this.$api.post({
					url: `child/like/new`,
					params,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getChildHabit()
								this.getFlower()
							}, 1000)

						}
					}
				})
			},
			deleteLike(id) {
				this.$api.delete({
					url: `child/like/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getChildHabit()
								this.getFlower()
							}, 1000)
						}
					}
				})
			},
			changeDate(e) {
				console.log(e)
			},
			changeWeek(current) {
				// uni.showLoading({mask:true})
				if (current === 'next') {
					let date = this.week_now[0] + ' 00:00:01'
					let week = this.getPrevWeek(date, true)
					this.week_now = this.getThisWeek(week[0] + ' 00:00:01')
					this.getChildHabit()
					this.getFlower()
				} else if (current === 'prev') {
					let date = this.week_now[0] + ' 00:00:01'
					let week = this.getPrevWeek(date)
					this.week_now = this.getThisWeek(week[0] + ' 00:00:01')
					this.getChildHabit()
					this.getFlower()
				} else if (current === 'now') {
					this.week_now = this.getThisWeek()
					this.getChildHabit()
					this.getFlower()
				}


			},
			prevWeek() {
				let prevWeek = this.getPrevWeek()
			},
			getPrevWeek(date, compute) {
				var beginTime = '';
				var endTime = '';
				var myDate = date ? new Date(date) : new Date();

				// compute=true 获取下一周
				// compute=不传或者false 获取上一周
				// 获取上一周的开始和结束时间
				if (compute) {
					var weekDate = new Date(myDate.getTime() + 7 * 24 * 3600 * 1000); // 计算开始时间用
					var weekDate2 = new Date(myDate.getTime() + 7 * 24 * 3600 * 1000); // 计算结束时间用
				} else {
					var weekDate = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000); // 计算开始时间用
					var weekDate2 = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000); // 计算结束时间用
				}


				var day = weekDate.getDay();
				var time = weekDate.getDate() - day + (day === 0 ? -6 : 1);

				var startDate = new Date(weekDate.setDate(time));
				beginTime = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
				var endDate = new Date(weekDate2.setDate(time + 6));
				endTime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();


				let arr = []
				arr.push(beginTime)
				arr.push(endTime)
				return arr

			},
			getThisWeek(date_str) {
				// const dateOfToday = Date.now()
				let date_obj = date_str ? new Date(date_str) : new Date()
				const dateOfToday = date_obj.getTime()
				const dayOfToday = (date_obj.getDay() + 7 - 1) % 7
				const daysOfThisWeek = Array.from(new Array(7)).map((_, i) => {
					const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
					return date.getFullYear() +
						'-' +
						String(date.getMonth() + 1).padStart(2, '0') +
						'-' +
						String(date.getDate()).padStart(2, '0')
				})
				let thisWeek = daysOfThisWeek.slice(0, 5)
				this.time_start = thisWeek[0]
				this.time_end = thisWeek[thisWeek.length - 1]
				let time_end = new Date(this.time_end + ' 23:59:59').getTime() + 1000 * 24 * 60 * 60 * 2
				let time_start = new Date(this.time_start + ' 00:00:00').getTime()
				let date_now = new Date().getTime()
				let flag = false
				if (time_end <= date_now) {
					flag = true
				}
				this.hasNext = flag
				return thisWeek
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		box-sizing: border-box;
		padding: 0 24upx;
	}

	.content {
		width: 100%;
		padding-top: 30upx;
		box-sizing: border-box;

		.habit_list {
			font-size: 28upx;
			color: #999999;
		}

		.habit_flower {
			display: flex;
			align-items: center;
			box-sizing: border-box;
			margin-bottom: 18upx;
			font-size: 28upx;
			color: #333333;

			.flower_num {
				color: #FF4683;
			}

			.flower_img {
				width: 58upx;
				height: 66upx;
			}
		}

		.calendar {
			text-align: right;

			.calendar_date {
				box-sizing: border-box;
				padding-right: 20upx;
				font-size: 20upx;
				color: #CCCCCC;
			}
		}

		.calendar_box {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
			padding-right: 10upx;
			height: 56upx;
			width: 100%;

			.choose_week {
				width: 120upx;
				height: 48upx;
				margin-left: 24upx;
				margin-right: unset;
				font-size: 20upx;
				padding: 10upx;
				line-height: 24upx;
				border-radius: 24upx;
				background-color: #CCCCCC;

				&:first-child {
					margin-left: 0;
				}
			}
		}

		.habit_table_box {
			width: 100%;
			// height: 744upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;

			.table_box {
				width: 664upx;
				border-radius: 40upx;
				background: #FFCBDC;
				border: 1px solid #FFA5C3;
				font-size: 26upx;
				color: #FF4683;
				overflow: hidden;
				box-sizing: border-box;

				.table_row {
					width: 100%;
					height: 104upx;
					display: flex;
					box-sizing: border-box;

					.table_head_col {
						flex: 1;
						height: 100%;
						background-color: #FFFFFF;
						border-bottom: 2upx dashed #FFBAD1;
						border-right: 2upx dashed #FFBAD1;
						box-sizing: border-box;
						text-align: center;
						line-height: 104upx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #FFCBDC;

						&:last-child {
							border-right: none;
						}
					}

					.table_first_col {
						width: 110upx;
						height: 104upx;
						background-color: #FFFFFF;
						border-bottom: 2upx dashed #FFBAD1;
						border-right: 2upx dashed #FFBAD1;
						box-sizing: border-box;
						text-align: center;
						padding: 0 10upx;
						overflow: hidden;
						// line-height: 104upx;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #FFCBDC;

						&:last-child {
							border-right: none;
						}

						text {
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
					}

					.table_col_inner {
						.table_col_imgbox {
							width: 94upx;
							height: 94upx;
							background-color: #FFFFFF;
							border-radius: 30upx;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 58upx;
								height: 66upx;
							}
						}
					}
				}

			}
		}

		.total_flower {
			box-sizing: border-box;
			padding: 0 20upx;
			width: 100%;
			height: 136upx;
			background-color: #FFFBE9;
			margin-bottom: 44upx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.total_flower_left {
				font-size: 28upx;
				color: #333333;

				.total_flower_sum {}

				.total_flower_num {
					font-size: 36upx;
				}

			}

			.total_flower_right {
				color: #666666;
				font-size: 28upx;

				.total_flower_exchange {
					margin-right: 10upx;
				}

				.total_flower_right_img {
					width: 12upx;
					height: 22upx;
				}
			}

		}

		.bottom_box {
			width: 100%;
			height: 112upx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.bottom_button {
				width: 336upx;
				height: 84upx;
				line-height: 84upx;
				border-radius: 4upx;
			}

			.button_yellow {
				background-color: #FDA228;
			}

			.button_red {
				background-color: #EE4F16;
			}
		}

	}
</style>
