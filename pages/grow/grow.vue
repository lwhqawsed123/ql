<template>
	<view class="content">
		<scroll-view scroll-y style="height: 100%;">
			<view class="font-2">资源下载方式:</br>1:点击复制链接按钮</br>2:打开手机浏览器访问链接下载</view>
			<block v-if="phaseData.length>0 && thisPhaseIndex!=-1">
				<view class="grow_item"  v-for="(item,index) in sortComputed"> <!--  -->
					<view>
						<image src="../../static/index/文档@2x.png" class="grow_img"></image>
						<text class="grow_title">安然产品知识</text>
					</view>
					<!-- 之前阶段的 -->
					<text  :class="'copy-'+thisPhaseIndex+'-'+index" v-if="myPhaseIndex==-1 && thisPhaseIndex==0 && index==0" class="copy-link-1">开始学习</text>
					<text  :class="'copy-'+thisPhaseIndex+'-'+index" v-else-if="myPhaseIndex>thisPhaseIndex || item.isUpload" class="copy-link-1">已学习</text>
					<!-- 当前要学习的阶段:当前节点为学习过 并且下一个节点为没学习过 或者 当前阶段都没有学习过-->
					<text  :class="'copy-'+thisPhaseIndex+'-'+index" class="copy-link-2" v-else-if="myPhaseIndex==thisPhaseIndex && ((index==0 && !item.isUpload) || (!item.isUpload && phaseData[thisPhaseIndex].resources[index-1].isUpload))">继续学习</text>
					<text class="copy-link-3" v-else>
						<!-- 请先把上一个学习完毕 -->
					</text>
				</view>
			</block>
			<view class="font-1">到底了~</view>
		</scroll-view>
	
		<view class="grow_step">
			<view class="grow_step_all"><!-- progress -->
				<view class="grow_step_finished" :style="{width: getProgressComputed+'%'}"> <!--style="width: 20%;" :style="{width:progress+'%'}" -->
					<text class="grow_step_icon"></text>
					<text class="grow_step_now" :style="{right:position_right+'px'}">当前</text>
				</view>
			</view>
			<view class="grow_step_text">
				<text class="grow_step_item" v-if="thisPhaseIndex>0" @click="previous">上一阶段</text>
				<!-- 防止布局异常 -->
				<text class="grow_step_item" v-else></text>
				<text>当前您正在学习第<text style="color: #409eff;">{{thisPhaseIndex+1}}</text>阶段</text>
				<text @click="next" class="grow_step_item" style="text-align: right;" v-if="thisPhaseIndex<phaseData.length-1">下一阶段</text>
				<text class="grow_step_item" v-else></text>
			</view>
		</view>
	</view>
</template>
<script>
	import jsWeiXin from '../../utils/jsWeiXin.js';
	import ClipboardJS from '../../utils/clipboard.min.js'
	export default {
		data() {
			return {
				phaseData:[],//阶段
				thisPhaseIndex:-1,//当前的阶段
				myPhaseIndex:-1,
				//isFinishedLearning:false, //是否学习完成 
				progress:0,
				position_right:-20, //这个参数的作用:根据进度动态调整 当前两个文字的位置 解决样式问题(watch)
				userId:'',
				paymentHistory:[]
			}
		},
		onReady() {
			this.$api.sdkReady()
			this.getPaymentHistory();
		},
		onLoad() {
			this.userId=uni.getStorageSync(this.$constant.userInfo).id;
		},
		// onShow() {
		// 	this.getProgress();
		// }
		computed:{
			sortComputed(){
				let arr=this.phaseData[this.thisPhaseIndex].resources;
				arr.sort(function(a,b){
					return a.sort-b.sort;
				})
				return arr;
			},
			getProgressComputed(){
				if(this.thisPhaseIndex>this.myPhaseIndex){//翻到未学的页
					return 0
				}else if(this.thisPhaseIndex<this.myPhaseIndex){
					return 100;
				}else{
					return this.progress;
				}
			}
		},
		watch:{
			thisPhaseIndex(newVal,oldVal){
				let that=this;
				let host=window.location.host;
				console.log("当前显示的阶段",newVal)
				setTimeout(function(){
					let resources=that.phaseData[newVal].resources
					for(let index=0;index<resources.length;index++){
						console.log("添加复制事件",'.copy-'+that.thisPhaseIndex+'-'+index)
						var clipboard = new ClipboardJS('.copy-'+that.thisPhaseIndex+'-'+index,{
							text: function() {
								let mark=true;
								if(that.phaseData[that.thisPhaseIndex].price==0){
									mark=false;
								}else{
									let id=that.phaseData[newVal].id;
									A:
									for(let i=0;i<that.paymentHistory.length;i++){
										console.log("id",id,that.paymentHistory[i].content.id)
										if(that.paymentHistory[i].content.id==id){
											mark=false;
											break A;
										}
									}
								}
								if(mark){
									uni.showModal({
										  title: '提示',
										  content: '您还未购买此阶段请先购买\r\n购买成功后享受...',
										  success: function(res) {
											if (res.confirm) {
											  that.toPay()
											} else if (res.cancel) {
											  console.log('用户点击取消');
											}
										  }
									});
									return
								}
								return host+'/#/pages/upload/upload?resId='+resources[index].id+'&userId='+that.userId+'&type=learnAndGrow&fileName='+encodeURIComponent(resources[index].resFileName)+"&token="+that.$api.getToken();
							}
						});
						clipboard.on('success', function(e) {
							that.$api.myToast("复制成功")
						});
						
						clipboard.on('error', function(e) {
							that.$api.myToast("复制失败")
						});
					}
				},1000)
			}	
		},
		methods: {
			toPay() {
			  var that = this;
			  let openId = uni.getStorageSync(that.$constant.userInfo).openId;
			  var requestSetting = {
			    logBefore: '微信支付->统一支付下单',
			    url: '/wx/pay/uniPay',
			    params: {
			      amount: that.phaseData[that.thisPhaseIndex].price, //支付金额
			      openId: openId,
			      catalogId: 2,
				  contentId:that.phaseData[that.thisPhaseIndex].id
			    },
			    callback: function(res) {
			      if (res.meta.success) {
			        var payResult = res.data.payResult;
			        jsWeiXin.chooseWXPay({
			          timestamp: payResult.timeStamp, // 支付签名时间戳，
			          nonceStr: payResult.nonceStr, // 支付签名随机串，不长于 32 位
			          package: payResult.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=xxxx）
			          signType: payResult.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			          paySign: payResult.paySign, // 支付签名
			          success: function() {
			            that.$api.myToast('您已购买成功!');
						that.paymentHistory.push({
							content:{
								id:that.phaseData[that.thisPhaseIndex].id
							}
						})
			            var requestSetting_ = {
			              logBefore: '微信支付->支付后处理',
			              url: '/wx/pay/postPay',
			              params: { orderId: res.data.order.orderId },
			              callback: function(res2) {}
			            };
			            that.$api.get(requestSetting_);
			          }
			        });
			      } else {
			        that.$api.myToast('下单失败');
			      }
			    }
			  };
			  that.$api.get(requestSetting);
			},
			getPaymentHistory(){
				let that=this;
				let id = uni.getStorageSync(that.$constant.userInfo).id;
				this.$api.get({
				  logBefore: '用户购买记录->综合查询',
				  url: 'biz/order/page',
				  params: {
				    query: 'user='+id+',catalog=2,status=1',
				    pi: '1',
				    ps: 999,
				    sortBy: 'DESC',
				    sortFiled: 'startTime'
				  },
				  callback: res => {
				    let { meta, data } = res;
				    if (meta.success) {
						that.paymentHistory=data.content;
						that.getPhase()
				    }
				  }
				});
			},
			previous(){
				this.thisPhaseIndex--;
			},
			next(){
				this.thisPhaseIndex++;
			},
			getPhase(){
				this.$api.get({
					logBefore:'学习成长->内容资源管理->综合查询',
					url: 'content/page',
					params: {
						query:'catalog.id=2,delFlag=0',
						pi:'1',
						ps:999,
						sortBy:'ASC',
						sortFiled:'sort'
					},
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.phaseData=data.content;
							this.getProgress();
						}
					}
				});
			},
			getProgress(){
				this.$api.get({
					logBefore:'学习成长->用户下载管理->按用户查询',
					url: 'user/down/user/'+this.userId,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							if(data.length>0){
								//最后一次下载的节点
								let lastNodeId=data[data.length-1].resource.id;
								//找到这个节点属于的阶段
								for(let idx=0;idx<this.phaseData.length;idx++){
									console.log("遍历阶段",idx)
									for(let resource of this.phaseData[idx].resources){
										console.log("遍历节点",resource)
										if(resource.id==lastNodeId){
											console.log("找到最后一次下载的节点",resource.id)
											//判断这个阶段是否已经学习完成
											let completeCount=0
											for(let resource1 of this.phaseData[idx].resources){
												console.log("遍历最后一次下载的节点所属的阶段",resource1)
												ccc:
												for(let resource2 of data){
													console.log("遍历用户下载过的节点",resource2)
													if(resource1.id==resource2.resource.id){
														//已经下载了
														resource1.isUpload=true;
														completeCount++;
														break ccc;
													}
												}
											}
											let len=this.phaseData[idx].resources.length
											console.log("阶段完成情况",completeCount,len)
											if(completeCount<len){
												this.progress=completeCount/len*100;
												this.thisPhaseIndex=idx;
												this.myPhaseIndex=idx;
											}else{
												//已经学习到最后一个了
												if(this.phaseData.length-1<idx+1){
													this.thisPhaseIndex=this.phaseData.length-1;
													this.myPhaseIndex=this.phaseData.length-1;
													// this.isFinishedLearning=true;
													this.progress=100;
													uni.showModal({
													    title: '提示',
													    content: '真棒!您已经完成了所有的学习!',
														showCancel:false
													});
												}else{
													console.log("下个阶段",idx)
													this.thisPhaseIndex=idx+1;
													this.myPhaseIndex=idx+1;
													this.progress=0;
												}
											}
											console.log("thisPhaseIndex",this.thisPhaseIndex)
											console.log("resources",JSON.stringify(this.phaseData[idx].resources))
											return;
										}
									}
								}
							}else{
								this.thisPhaseIndex=0;
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.grow_item >view{
		display: flex;
		align-items: center;
	}
	.copy-link-1{
		color: #409eff;
		font-size: 28rpx;
		text-decoration: underline;
	}
	.copy-link-2{
		font-size: 28rpx;
		color: #67c23a;
	}
	.copy-link-3{
		font-size: 28rpx;
		color: #c0c4cc;
	}
	.font-2{
		font-size: 26rpx;
		line-height: 40rpx;
		color: #34495e;
		border-bottom: 2upx solid #EEEEEE;
		padding-bottom: 20rpx;
	}
	.font-1{
		font-size: 13px;
		color: #c0c4cc;
		text-align: center;
		line-height: 30px;
	}
	page {
		background: #FAFAFA;
	}
	.content {
		background-color: #FFFFFF;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 28upx 24upx 132upx 24upx;
		
		.grow_item {
			width: 100%;
			height: 118upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #EEEEEE;

			.grow_img {
				width: 64upx;
				height: 64upx;
			}

			.grow_title {
				margin-left: 40upx;
				font-size: 36upx;
				color: #333333;
			}
		}

		.grow_step {
			box-sizing: border-box;
			padding: 0 24upx;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			height: 112upx;
			background: #FFFFFF;
			font-size: 24upx;
			color: #333333;
			.grow_step_all {
				margin: 8upx 0;
				width: 100%;
				height: 40upx;
				background: #D5D5D5;
				border-radius: 42upx;
				.grow_step_finished{
					height: 100%;
					background: #EE4F16;
					border-radius: 21px 0 0 21px;
					position: relative;
					.grow_step_now{
						width: 40px;
						text-align: center;
						position: absolute;
						top: -40rpx;
						color: #EE4F16;
					}
					.grow_step_icon{
						width: 4upx;
						height: 56upx;
						background: #EE4F16;
						position: absolute;
						right: -4upx;
						top: 50%;
						transform: translateY(-50%);
					}
				}
					
			}
			.grow_step_text {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 56upx;
			}
			.grow_step_item{
				width: 140rpx;
			}
			// grow_step_start grow_step_end   
		}

		
	}
</style>
