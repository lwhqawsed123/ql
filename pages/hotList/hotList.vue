<template>
  <view class="content">
    <scroll-view scroll-y style="height: 100%;">
      <view class="hot-item" v-for="item in hotList" :key="item.id"  @click="toDetails(item)">
        <view>
          <view class="hot-title">{{item.name}}</view>
          <view class="hot-details">
            阅读量:{{item.sumRead}}
          </view>
        </view>
        <video v-if="item.contentType =='VIDEO'" :src="item.banner"></video>
        <image v-else :src="item.thumbnail"></image>
      </view>
    </scroll-view>
  </view>
</template>

<script>
    export default {
        data() {
            return {
                hotList: []
            }
        },
        onLoad() {
            this.hotList = uni.getStorageSync("hotList")
        },
        methods: {
            toDetails(item) {
                let url;
                if (item.catalog.parentId == 6) {//文章
                    url = '/pages/articleDetail/articleDetail?id=' + item.id
                } else if (item.catalog.parentId == 5) {//视频
                    url = '/pages/videoDetail/videoDetail?id=' + item.id
                }
                uni.navigateTo({
                    url: url
                })
            }
        }
    }
</script>

<style lang="less">
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .hot-item {
    display: flex;
    padding: 16rpx 30rpx;
    background-color: #FFFFFF;

    .hot-title {
      font-size: 28rpx;
      color: #000000;
      margin-bottom: 12rpx;
    }

    .hot-details {
      font-size: 26rpx;
      color: #CCCCCC;

      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    > view:first-child {
      flex: 1;
    }

    image, video {
      margin-left: 40rpx;
      height: 128rpx;
      width: 204rpx;
    }
  }
</style>
