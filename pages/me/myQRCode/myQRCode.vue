<template>
  <view class="content">
    <view class="qr_code_img">
      <view class="qr_code_img_box">
        <image v-if="image_url" :src="image_url" mode="" @click="previewImage"></image>
        <image v-if="!image_url" :src="default_img" mode=""></image>
        <!-- <text v-if="true" class="model">重新上传</text> -->
      </view>
    </view>
    <button class="upload_qr" type="primary" @click="upload_QR">{{buttonMsg}}</button>
    <!-- <button v-if="false" class="upload_qr" type="primary">重新上传</button> -->
  </view>
</template>

<script>
    import wx from '@/utils/jsWeiXin.js'
    import {RES_HOST, UPLOAD_URL} from "../../../api/config";

    export default {
        data() {
            return {
                iamgeBaseUrl: RES_HOST + '/img/',
                default_img: '../../../static/index/二维码默认占位@2x.png',
                image_url: '',
                user: uni.getStorageSync("USERINFO"),
                userInfo: {},
                buttonMsg: "上传微信二维码",
                restart: "重新上传"
            }
        },
        onReady() {
            // 初始化sdk
            this.$api.sdkReady({
                jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
            })
        },
        onShow() {
            this.getQRCodeById()
        },
        methods: {
            // 加载时获取二维码图片
            getQRCodeById() {
                this.$api.get({
                    url: `user/${this.user.id}`,
                    callback: res => {
                        let {
                            meta,
                            data
                        } = res
                        if (meta.success) {
                            console.log(data)
                            this.userInfo = data
                            if (data.qrCode) {
                                this.buttonMsg = this.restart
                                this.image_url = this.iamgeBaseUrl + data.qrCode
                            }
                        }
                    }
                })
            },
            upload_QR() {
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'],
                    success: (res) => {
                        const tempFilePaths = res.tempFilePaths;
                        uni.uploadFile({
                            url: UPLOAD_URL, //仅为示例，非真实的接口地址
                            filePath: tempFilePaths[0],
                            name: 'file',
                            header: {
                                'Authorization': 'Bearer ' + this.$api.getToken()
                            },
                            formData: {
                                'type': 'img'
                            },
                            success: (uploadFileRes) => {
                                let uploadFile = JSON.parse(uploadFileRes.data)
                                let {data, meta} = uploadFile
                                if (meta.success) {
                                    this.saveQRCode(data)
                                }
                            }
                        });
                        uni.getImageInfo({
                            src: res.tempFilePaths[0],
                            success: (image) => {
                                this.image_url = image.path
                            }
                        });

                    }
                })

                // wx.chooseImage({
                // 	count: 1, // 默认9
                // 	sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                // 	sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                // 	success: res => {
                // 		var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                // 		// this.image_url = localIds[0]
                // 		console.log(res)
                // 		// wx.uploadImage({
                // 		//   localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                // 		//   isShowProgressTips: 1, // 默认为1，显示进度提示
                // 		//   success: res=> {
                // 		//     var serverId = res.serverId; // 返回图片的服务器端ID
                // 		// 	console.log(res)
                // 		//   }
                // 		// })

                // 		wx.getLocalImgData({
                // 			localId: localIds[0], // 图片的localID
                // 			success: function(res) {
                // 				var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                // 				this.uni_uploadImage(localData)
                // 			}
                // 		});

                // 		// uni.uploadFile({
                // 		// 	url: `${this.$api.port}upload/file`, //仅为示例，非真实的接口地址
                // 		// 	filePath: localIds[0],
                // 		// 	name: 'file',
                // 		// 	header: {
                // 		// 		'Authorization': 'Bearer ' + this.$api.getToken()
                // 		// 	},
                // 		// 	formData: {
                // 		// 		'type': 'img'
                // 		// 	},
                // 		// 	success: (uploadFileRes) => {
                // 		// 		let uploadFile = JSON.parse(uploadFileRes.data)
                // 		// 		console.log(uploadFile)
                // 		// 		let {
                // 		// 			data,
                // 		// 			meta
                // 		// 		} = uploadFile
                // 		// 		if (meta.success) {
                // 		// 			this.saveQRCode(data)
                // 		// 		}
                // 		// 	}
                // 		// });


                // 	}
                // })
            },
            // uniapp上传图片
            uni_uploadImage(file) {
                let formData = new formData()
                formData.append('file', file)
                formData.append('type', img)
                this.$api.post({
                    url: 'upload/file',
                    data: formData,
                    callback: res => {
                        let {
                            data,
                            meta
                        } = res
                        log
                        if (meta.success) {
                            this.saveQRCode(data)
                        }
                    }
                })
            },
            // 保存二维码到用户id
            saveQRCode(path) {
                let user = JSON.parse(JSON.stringify(this.userInfo))
                user.qrCode = path
                this.$api.put({
                    url: 'user/update',
                    params: user,
                    callback: res => {
                        let {
                            meta,
                            data
                        } = res
                        if (meta.success) {
                            uni.hideLoading()
                            uni.showToast({
                                title: '上传成功',
                                duration: 2000, mask: true
                            });
                            this.getQRCodeById()
                            this.buttonMsg = this.restart
                            setTimeout(function () {
                                uni.hideToast();
                            }, 2000)
                        }
                    }
                })
            },
            // 开启预览
            previewImage() {
                let arr = []
                arr[0] = this.image_url
                console.log(arr)
                // 预览图片
                wx.previewImage({
                    current: arr[0],
                    urls: arr // 需要预览的图片http链接列表
                });
            }
        }
    }
</script>

<style lang="less">
  page {
    background-color: #F9F9F9;
    box-sizing: border-box;
    padding: 20 upx 24 upx 0 24 upx;

  }

  .content {
    width: 100%;

    .qr_code_img {
      width: 100%;
      height: 470 upx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;

      .qr_code_img_box {
        width: 320 upx;
        height: 320 upx;
        position: relative;

        image {
          width: 100%;
          height: 100%;
        }

        .model {
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 68 upx;
          background: rgba(0, 0, 0, 0.60);
          text-align: center;
          line-height: 68 upx;
          font-size: 36 upx;
          color: #FFFFFF;
        }
      }
    }

    .upload_qr {
      margin-top: 50 upx;
      width: 100%;
      height: 84 upx;
      background: #EE4F16;
      border-radius: 2px;
      line-height: 84 upx;
    }
  }
</style>
