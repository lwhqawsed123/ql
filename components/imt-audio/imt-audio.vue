<template>
	<view class="imt-audio">
		<view class="audio-wrapper">
			<view class="audio_box_left">
				<view class="audio_title" :class="!paused?'no_play_size':''">
					{{title}}
				</view>
				<view class="audio_progress" v-if="!paused">
					<slider class="audio-slider" :activeColor="color" block-size="16" :value="current" :disabled="disabled" :max="duration" @changing="seek=true,current=$event.detail.value"
					 @change="change"></slider>
				</view>
			</view>
		</view>
		<view class="audio-control-wrapper" :style="{color:color}">
			<image class="play_img" :src="play_img" mode="" @click="operation" v-show="paused"></image>
			<image class="play_img" :src="stop_img" mode="" @click="operation" v-show="!paused"></image>
		</view>
	</view>
</template>

<script>
	const audio = uni.createInnerAudioContext(); //创建音频
	export default {
		data() {
			return {
				currentTime: '', //当前播放时间
				durationTime: '00:00', //总时长
				duration:10,
				current: 0, //slider当前进度
				loading: false, //是否处于读取状态
				paused: true, //是否处于暂停状态
				seek: false, //是否处于拖动状态
				disabled:true,//是否禁用
				play_img:'../../static/newest/home_play.png',
				stop_img:'../../static/newest/home_stop.png'
			}
		},
		props: {
			src: String, //音频链接
			title:String,
			autoplay: Boolean, //是否自动播放
			control: {
				type:Boolean,
				default:true
			}, //是否需要上一曲/下一曲按钮
			continue:Boolean,//播放完成后是否继续播放下一首，需定义@next事件
			color: {
				type:String,
				default:'#f26b1d'
			} //主色调
		},
		methods: {
			//返回prev事件
			prev() {
				this.$emit('prev')
			},
			//返回next事件
			next() {
				this.$emit('next')
			},
			//格式化时长
			format(num) {
				return '0'.repeat(2 - String(Math.floor(num / 60)).length) + Math.floor(num / 60) + ':' + '0'.repeat(2 - String(
					Math.floor(num % 60)).length) + Math.floor(num % 60)
			},
			//播放/暂停操作
			operation() {
				if (audio.paused) {//当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
					audio.play()
					this.loading = true
				} else {
					audio.pause()
				}
			},
			//完成拖动事件
			change(e) {
				audio.seek(e.detail.value)
			}
		},
		created() {
			audio.src = this.src
			this.current = 0
			// this.durationTime = this.format(this.duration)
			audio.obeyMuteSwitch = false
			audio.autoplay = this.autoplay
			//音频进度更新事件
			audio.onTimeUpdate(() => {
				if (!this.seek) {
					this.current = audio.currentTime
				}
			})
			//音频播放事件
			audio.onPlay(() => {
				this.paused = false
				this.loading = false
			})
			//音频暂停事件
			audio.onPause(() => {
				this.paused = true
			})
			//音频结束事件
			audio.onEnded(() => {
				if (this.continue) {
					this.next()
				} else {
					this.paused = true
					this.current = 0
				}
			})
			//音频完成更改进度事件
			audio.onSeeked(() => {
				this.seek = false
			})
			//音频进入可以播放状态，但不保证后面可以流畅播放
			audio.onCanplay((e)=>{
				//向上取整
				this.duration=Math.ceil(audio.duration)||10
				if(audio.duration){
					this.disabled=false
				}
			})
		},
		watch: {
			//监听音频地址更改
			src(e) {
				audio.src = e
				this.current = 0
				// audio.play()
				this.loading = true
			},
			//监听总时长改变
			duration(e) {
				this.durationTime = this.format(e)
			},
			//监听当前进度改变
			current(e) {
				this.currentTime = this.format(e)
			}
		}
	}
</script>

<style lang="less">
	@font-face {
		font-family: 'icon';
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot');
		src: url('//at.alicdn.com/t/font_1104838_fxzimc34xw.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.woff') format('woff'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1104838_fxzimc34xw.svg#iconfont') format('svg');
	}

	.imt-audio {
		padding: 0 28upx;
		height: 100upx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		border-radius: 8upx;
		background-color: #FFFFFF;
		box-shadow: 5upx 5upx 20upx #f7e4d9;
	}

	.audio-wrapper {
		display: flex;
		align-items: center;
	}
	.audio_box_left {
		width: 520upx;
		height: 100%;
		margin-right:20upx ;
		color: #333333;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.audio_progress{
			
		}
		
	}
	.audio_title {
		font-size: 30upx;
		word-break: break-all;
		text-align: left;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;/*自适应盒子*/
		-webkit-line-clamp: 1;/*此处为1行,如果是两行就改成2*/
		-webkit-box-orient: vertical;
	}
	.no_play_size{
		font-size: 20upx;
		color: #cccccc;
	}
	.audio_author {
		font-size: 24rpx;
		color: #999999;
		margin: 16upx 0 12upx 0;
	}
	.audio-slider {
		width: 480upx;
		margin-left: 10upx;
	}
	.audio_time {
		margin-top: 16upx;
		font-size: 24upx;
		color: #999999;
		display: flex;
		justify-content: space-between;
		
	}
	.audio-number {
		font-size: 24upx;
		line-height: 1;
		color: #333;
	}

	

	.imt-audio .audio-control-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		// font-family: "icon" !important;
		.play_img{
			width: 60upx;
			height: 60upx;
		}
	}

	.imt-audio .audio-control {
		/* font-size: 32upx; */
		border: 4upx solid;
		border-radius: 50%;
		padding: 12upx;
	}

	.audio-control-next {
		transform: rotate(180deg);
	}

	.imt-audio .audio-control-switch {
		font-size: 20upx;
		/* margin: 0 80upx; */
	}

	.audioLoading {
		animation: loading 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes loading {
		to {
			transform: rotate(360deg);
		}
	}
</style>