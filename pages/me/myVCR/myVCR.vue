<template>
  <view class="content">
    <view class="qr_code_img">
      <view class="qr_code_img_box">
        <video v-if="video_url" :src="video_url"></video>
        <image v-else :src="default_img" mode=""></image>
      </view>
    </view>
    <button class="upload_qr" type="primary" @click="upload_cvr">{{ buttonMsg }}</button>
  </view>
</template>

<script>
import wx from '@/utils/jsWeiXin.js';
import { RES_HOST, UPLOAD_URL } from '../../../api/config';

export default {
  data() {
    return {
      videoBaseUrl: RES_HOST + '/video/',
      default_img: '../../../static/index/二维码默认占位@2x.png',
      video_url: '',
      user: uni.getStorageSync('USERINFO'),
      userInfo: {},
      buttonMsg: '上传个人宣传视频',
      restart: '重新上传'
    };
  },
  onReady() {
    // 初始化sdk
    this.$api.sdkReady({
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage']
    });
  },
  onShow() {
    this.getById();
  },
  methods: {
    // 加载时获取二维码图片
    getById() {
      this.$api.get({
        url: `user/${this.user.id}`,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            console.log(data);
            this.userInfo = data;
            if (data.vcr) {
              this.buttonMsg = this.restart;
              this.video_url = this.videoBaseUrl + data.vcr;
            }
          }
        }
      });
    },
    upload_cvr() {
      uni.showLoading({
        title:'上传中...'
      })
      uni.chooseVideo({
        sourceType: ['album'],
        success: res => {
          const tempFilePath = res.tempFilePath;
          console.log('tempFilePath',tempFilePath)
          uni.uploadFile({
            url: UPLOAD_URL, 
            filePath: tempFilePath,
            name: 'file',
            header: {
              Authorization: 'Bearer ' + this.$api.getToken()
            },
            formData: {
              type: 'video'
            },
            success: uploadFileRes => {
              let uploadFile = JSON.parse(uploadFileRes.data);
              let { data, meta } = uploadFile;
              if (meta.success) {
                this.saveVCR(data);
                uni.hideLoading();
              }
            }
          });
        }
      });
    },
    // 保存
    saveVCR(path) {
      let user = JSON.parse(JSON.stringify(this.userInfo));
      user.vcr = path;
      this.$api.put({
        url: 'user/update',
        params: user,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            uni.setStorageSync('USERINFO',data)
            this.getById();
            this.buttonMsg = this.restart;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
page {
  background-color: #f9f9f9;
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
    background-color: #ffffff;

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
        background: rgba(0, 0, 0, 0.6);
        text-align: center;
        line-height: 68 upx;
        font-size: 36 upx;
        color: #ffffff;
      }
    }
  }

  .upload_qr {
    margin-top: 550 upx;
    width: 100%;
    height: 84 upx;
    background: #ee4f16;
    border-radius: 2px;
    line-height: 84 upx;
  }
}
</style>
