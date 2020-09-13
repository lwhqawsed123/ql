<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.uni-audio-default {
		max-width: 100%;
		min-width: unset;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1px solid #f7cfcf;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.8);
	}

	.uni-audio-left {
		width: 60upx;
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 20upx;
		
	}
	.uni-audio-right {
		width: 100%;
	    height: 60upx;
	    margin-left: unset;
	    padding: unset;
		padding-right: 20upx;
		display: flex;
		flex-direction:row-reverse;
		justify-content: space-between;
		align-items: center;
	}
	.uni-audio-info{
		display: flex;
		/* align-items: center; */
		flex-direction:column;
		justify-content: space-between;
		margin-right: unset;
	}
	.uni-audio-name{
		margin-bottom: 0;
		line-height: unset;
		height: 37upx;
	}
	.uni-audio-author{
		text-align: left;
		font-size: 20upx;
	}
		
	.uni-audio-button{
		
		width: 48upx;
		height: 48upx;
		margin: unset;
	}
	uni-radio .uni-radio-input.uni-radio-input-checked:before{
		content:'';
		display: block;
		width: 16upx;
		height: 16upx;
		background-color: #FFFFFF;
		border-radius: 50%;
	}
	uni-radio .uni-radio-input{
		width: 40upx;
		height: 40upx;
	}
	.uni-grid-item__box.border-top[data-v-53c9b598] {
	    border-top: 1px #d0dee5 dotted;
	}
	.uni-grid-item__box.border[data-v-53c9b598] {
	    border-bottom: 1px #d0dee5 dotted;
	    border-right: 1px #d0dee5 dotted;
	}
	.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box[data-v-0730da08]{
		background-color: #F1F1F1;
		background: rgba(255,255,255,0.50);
		border-radius: 13px;
		box-sizing: border-box;
		/* margin: 0 24upx; */
	}
	.content_detail_image{
		display: block;
		margin:0 auto;
	}
	.audio_progress uni-slider{
		margin: 10upx 0 0 0;
	}
	.witness_content .uni-swipe_box {
		background-color:#f9f9f9 !important;
	}
</style>

