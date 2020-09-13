<template>
  <view style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;top: 0;">
    <scroll-view scroll-y style="height: 100%;">
      <view class="content">
        <view class="search_box">
          <view class="search_inner_box">
            <view class="search_icon"><text class="iconfont icon-sousuo search_icon_font"></text></view>
            <view class="uni-form-item uni-column search_input_box">
              <input
                class="uni-input search_input"
                confirm-type="search"
                placeholder="输入搜索关键词"
                placeholder-style="color:#999999"
                v-model="search_query"
                @confirm="searchContent"
              />
            </view>
          </view>
          <text class="iconfont icon-erweima1 QDcode_img" @click="open"></text>
        </view>

        <view class="swiper_box_outside">
          <view class="swiper_box_margin"></view>
          <view class="swiper_box_spacing"></view>
          <view class="swiper_box">
            <swiper class="swiper_outside" autoplay :interval="5000" :duration="1000" circular>
              <swiper-item class="swiper_inner" v-for="item in bannerList" :key="item.id">
                <view class="swiper-item swiper_item">
                  <image class="swiper_img" :src="item.resFileName"/>
                </view>
              </swiper-item>
            </swiper>
          </view>
        </view>

        <view class="audio_box_outside">
          <imtAudio :title="audio.name" :src="audio.src" :autoplay="autoplay">   
        </imtAudio></view>
        <view class="3D_swiper" v-if="swiperOptions.show">
          <curry-swiper
            :width="swiperOptions.width"
            :space="swiperOptions.space"
            :inverseScaling="400"
            :border="0"
            :height="swiperOptions.height"
            :perspective="14"
            :count="sceneList.length"
            ref="swiper"
          >
            <curry-slide v-for="(slide, i) in sceneList" :index="i" :key="i">
              <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
                <img
                  :data-index="index"
                  class="swiper_img_3d"
                  :class="{ current: isCurrent, onLeft: leftIndex >= 0, onRight: rightIndex >= 0 }"
                  :src="slide.img"
                  @click="navigateTo(slide)"
                />
              </template>
            </curry-slide>
          </curry-swiper>
        </view>
        <view class="home_study" @click="toGrow">
          <image class="home_study_img" src="../../static/newest/home_stduy.gif" mode=""></image>
        </view>
        <view class="hot_news">
          <view class="hots_information" @click="navigateTo({ url: '/pages/activities/activities' })">
            <view class="hots_box_left">
              <image class="hots_box_title_img" src="../../static/newest/home_activity.png" mode=""></image>
              <view class="hots_box_text">
                <text class="hots_box_text_left">关注活动</text>
                <image class="arrow_right" src="../../static/newest/arrow_right.png" mode=""></image>
              </view>
            </view>
            <view class="hots_box_right"><image class="hots_box_right_img" src="../../static/newest/home_activity_img.jpg" mode=""></image></view>
          </view>
          <view class="ertical_line"></view>
          <view class="hots_information" @click="navigateTo({ url: '/pages/information/infoList/infoList' })">
            <view class="hots_box_left">
              <image class="hots_box_title_img" src="../../static/newest/home_news.png" mode=""></image>
              <view class="hots_box_text">
                <text class="hots_box_text_left">查看更多</text>
                <image class="arrow_right" src="../../static/newest/arrow_right.png" mode=""></image>
              </view>
            </view>
            <view class="hots_box_right"><image class="hots_box_right_img" src="../../static/newest/home_news_img.jpg" mode=""></image></view>
          </view>
        </view>

        <view class="hot-top">
          <view>
            <image class="hot-img" src="../../static/index/home_hot.png"></image>
            <text class="hot-lab">热点关注</text>
          </view>
          <view @click="toHotList">
            <text class="hot-more">查看更多</text>
            <image class="hot-arrow" src="../../static/newest/arrow_right.png"></image>
          </view>
        </view>
        <view class="hot-item" v-for="item in hotList" :key="item.id" @click="toDetails(item)">
          <view>
            <view class="hot-title">{{ item.name }}</view>
            <view class="hot-details">阅读量:{{ item.sumRead }}</view>
          </view>
          <!-- 文章item.catalog.parentId==6 -->
          <video v-if="item.contentType =='VIDEO'" :src="item.banner"></video>
          <image v-else :src="item.thumbnail"></image>
        </view>
        <view style="padding-top: 36rpx;padding-bottom: 60rpx; font-size: 28rpx; text-align: center;color: rgba(204,204,204);">我是有底线的</view>

        <uni-popup ref="popup" type="center">
          <view class="uni-image">
            <image class="image" src="/static/qrcode.jpeg" mode="scaleToFill" />
            <view class="popup_message"><text>扫码关注安然齐力公众号</text></view>
            <view class="uni-image-close" @click="cancel()"><text class="iconfont icon-buoumaotubiao20 icon_close"></text></view>
          </view>
        </uni-popup>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import imtAudio from '@/components/imt-audio/imt-audio.vue';
import currySwiper from '@/components/curry-swiper/curry-swiper.vue';
import currySlide from '@/components/curry-swiper/curry-slide.vue';
import bwSwiper from '@/wxcomponents/bw-swiper/bw-swiper.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniIcon from '@/components/uni-icon/uni-icon.vue';
import {RES_HOST} from '../../api/config.js'

export default {
  data() {
    return {
      title: 'Hello',
      audio: {
        name: '', //致爱丽丝
        src: '' //https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3
      },
      audioAction: {
        method: 'pause'
      },
      autoplay:false,
      hotList: [],
      query: {
        catalog: 7
      },
      resHost : RES_HOST,
      imgBaseUrl: `${RES_HOST}/img/`,
      videoUrl:`${RES_HOST}/video/`,
      bannerList: [],
      // 3d轮播图 图片
      sceneList: [
        {
          img: '../../static/swiper/卡片@2x (1).png',
          url: '/pages/beautiful/beautiful',
          title: '健康美丽'
        },
        {
          img: '../../static/swiper/卡片@2x (2).png',
          url: '/pages/childrenGrow/children',
          title: '孩子成长'
        },
        {
          img: '../../static/swiper/卡片@2x (3).png',
          url: '/pages/meet/meet',
          title: '遇见美好'
        },
        {
          img: '../../static/swiper/卡片@2x (5).png',
          url: '/pages/goods/goods',
          title: '产品介绍'
        },
        {
        	img: '../../static/swiper/卡片@2x (6).png',
        	url: '/pages/culture/culture',
        	title: '企业文化'
        },
      ],
      // 搜索关键字
      search_query: '',
      //
      swiperOptions: {
        width: 207,
        height: 154,
        space: 247,
        show: true
      }
    };
  },
  components: {
    imtAudio,
    currySwiper,
    currySlide,
    bwSwiper,
    uniPopup
  },
  onLoad(options) {
    this.autoplay = false;
    this.getEverydayRead();
    this.getHot();
  },
  onReady() {
    this.getAllbyQuery();
    
    this.$api.sdkReady({ jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseWXPay'] });
  },
  onShow() {
    this.swiperOptions.show = true;
  },
  onHide() {
    this.autoplay = false;
    this.swiperOptions.show = false;
  },
  methods: {
    toDetails(item) {
      let url;
      if (item.catalog.parentId == 6) {
        //文章
        url = '/pages/articleDetail/articleDetail?id=' + item.id;
      } else if (item.catalog.parentId == 5) {
        //视频
        url = '/pages/videoDetail/videoDetail?id=' + item.id;
      }
      uni.navigateTo({
        url: url
      });
    },
    getHot() {
      let that = this;
      this.$api.get({
        url: '/content/getHot',
        params: { cId: 1, pId: 1 },
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            const hots = data.map(item=>{
              if(item.contentType =='VIDEO'){
                item.banner = this.videoUrl + item.banner;
              }else{
                item.thumbnail = this.imgBaseUrl + item.thumbnail;
              }
              return item;
            });
            console.log('hots',hots);
            uni.setStorageSync('hotList', hots);
            that.hotList = hots.slice(0, 3);
          }
        }
      });
    },
    toHotList() {
      uni.navigateTo({
        url: '../hotList/hotList'
      });
    },
    getEverydayRead() {
      let that = this;
      let data1 = {
        query: `catalog.id=8,delFlag=0`,
        pi: 1,
        ps: 1,
        sortBy: 'DESC',
        sortFiled: 'createTime'
      };
      this.$api.get({
        url: 'content/page',
        params: data1,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            // let item = data.content[Math.round(Math.random() * data.content.length)];
            // console.log('item', item);
            let item = data.content[0];
            that.audio = {
              name: item.name,
              src: that.resHost+'/everydayRead/' + item.resources[0].resFileName
            };
          }
        }
      });
    },
    open() {
      this.$refs.popup.open();
    },
    cancel() {
      this.$refs.popup.close();
    },
    //学习成长
    toGrow() {
      let that = this;
      if (!uni.getStorageSync(that.$constant.userInfo).address) {
        uni.showModal({
          title: '提示',
          content: '请先完善个人信息',
          success: function(res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '../myProfile/userinfo/userinfo'
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
        return;
      }else{
		  uni.navigateTo({
		    url: '../grow/grow'
		  });
	  }
    },
    init() {
      var token = uni.getStorageSync('TOKEN');
      // console.log(token)
    },
    scroll(e) {},
    searchContent() {
      uni.navigateTo({
        url: `/pages/searchPage/searchPage?query=${this.search_query}`
      });
    },
    // 获取轮播图列表
    getAllbyQuery() {
      this.$api.get({
        url: 'content/banner/type/0',
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            if (data.length == 0) {
              this.bannerList.push({ resFileName: '/static/banner.jpg' });
            } else {
              let resList = [];
              data.forEach(banner => {
                let resource = banner.resources[0];
                resource.resFileName = this.imgBaseUrl + resource.resFileName;
                resList.push(resource);
              });
              resList.sort(this.ObjArrSort('sort'));
              this.bannerList = resList;
            }
            // console.log('bannerList', this.bannerList);
          } else {
            // this.$message.error(data);
          }
        }
      });
    },
    ObjArrSort(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    navigateTo(item) {
      if (item.title === '学习成长') {
        this.toGrow();
      } else {
        uni.navigateTo({
          url: item.url
        });
      }
    }
  }
};
</script>

<style lang="less">
page {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
}
.hot-item {
  display: flex;
  padding: 16rpx 30rpx;
  background-color: #ffffff;
  .hot-title {
    font-size: 28rpx;
    color: #000000;
    margin-bottom: 12rpx;
  }
  .hot-details {
    font-size: 26rpx;
    color: #cccccc;
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
  image,
  video {
    margin-left: 40rpx;
    height: 128rpx;
    width: 204rpx;
  }
}
.hot-top {
  background-color: #ffffff;
  padding: 32rpx 30rpx 16rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
  > view {
    display: flex;
    align-items: center;
  }
  .hot-img {
    height: 32rpx;
    width: 28rpx;
  }
  .hot-lab {
    font-size: 38rpx;
    color: #000000;
    margin-left: 12rpx;
  }
  .hot-more {
    font-size: 28rpx;
    color: #cccccc;
  }
  .hot-arrow {
    margin-left: 10rpx;
    width: 10rpx;
    height: 16rpx;
  }
}
.content {
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  box-sizing: border-box;

  .hot_news {
    width: 100%;
    box-sizing: border-box;
    padding: 20upx 26upx;
    display: flex;
    height: 160upx;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10upx;
    background-color: #ffffff;
    .hots_information {
      box-sizing: border-box;
      display: flex;
      flex: 1;
      // width: 326upx;
      height: 100%;
      // background-color: pink;
      .hots_box_left {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 16upx 0;
        box-sizing: border-box;
        .hots_box_title_img {
          width: 80upx;
          height: 38upx;
        }
        .hots_box_text {
          display: flex;
          align-items: center;
          .hots_box_text_left {
            font-size: 24upx;
            color: #cccccc;
          }
          .arrow_right {
            margin-left: 12upx;
            width: 12upx;
            height: 20upx;
          }
        }
      }
      .hots_box_right {
        flex: 1;
        height: 100%;
        .hots_box_right_img {
          width: 100%;
          height: 100%;
        }
      }
      //
      //
      //
      //
      // hots_box_right
      //
      image {
        width: 100%;
        height: 100%;
      }
    }
    .ertical_line {
      margin: 0 36upx;
      width: 2upx;
      height: 100%;
      background-color: #cccccc;
    }
  }

  .search_box {
    width: 100%;
    height: 120upx;
    display: flex;
    align-items: center;
    background-color: #f26b1d;
    box-sizing: border-box;
    padding: 0 32upx;

    .search_inner_box {
      width: 100%;
      height: 72upx;
      line-height: 72upx;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      padding: 0 16upx;
      box-sizing: border-box;
      border-radius: 36upx;
      opacity: 0.9;
      .search_icon {
        margin-right: 16upx;

        .search_icon_font {
          font-size: 32upx;
          color: #999999;
        }
      }

      .search_input_box {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .search_input {
          width: 100%;
          color: #333333;
          font-size: 28upx;

          word-break: break-all;
          text-align: left;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          /*自适应盒子*/
          -webkit-line-clamp: 1;
          /*此处为1行,如果是两行就改成2*/
          -webkit-box-orient: vertical;
        }
      }
    }
    .QDcode_img {
      margin-left: 46upx;
      font-size: 36upx;
      color: #ffffff;
      font-weight: 400;
    }
  }

  //
  //
  // audio_progress
  //
  //
  // audio_time_end
  .audio_box_outside {
    width: 100%;
    padding: 30upx;
    box-sizing: border-box;
  }

  .children_box {
    padding: 0 24upx;
    width: 100%;
    height: 218upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .children_box_left,
    .children_box_right {
      width: 342upx;
      height: 100%;
      position: relative;

      .children_box_text {
        position: absolute;
        // font-family: PingFangSC-Regular;
        font-size: 32upx;
        color: #ffffff;
        letter-spacing: -0.39px;
        right: 22upx;
        top: 42upx;
        z-index: 1;
      }

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .list_swiper {
    padding-left: 24upx;
    margin: 30upx 0;
    height: 170upx;
    width: 100%;

    .scroll-view_H {
      width: 100%;
      height: 100%;
      white-space: nowrap;

      .scroll_img {
        display: inline-block;
        height: 170upx;
        width: 260upx;
        margin-right: 16upx;
        position: relative;

        &:last-child {
          margin-right: 0;
        }

        image {
          width: 100%;
          height: 100%;
        }

        .scroll_img_title {
          z-index: 1;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          font-size: 28upx;
          color: #ffffff;
          letter-spacing: -0.34px;
          text-align: center;
          line-height: 170upx;
        }
      }
    }
  }

  .option_list {
    padding: 0 24upx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10upx;

    .list_item {
      margin-top: 16upx;
      width: 100%;
      height: 136upx;
      border-radius: 10px;
      overflow: hidden;
      position: relative;

      .item_bg_img {
        width: 100%;
        height: 100%;
      }

      .item_title_text {
        z-index: 1;
        left: 52upx;
        position: absolute;
        font-size: 32upx;
        color: #ffffff;
        line-height: 136upx;
      }
    }
  }

  .hairdressing {
    padding: 0 24upx;
    box-sizing: border-box;
    width: 100%;
    height: 400upx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.swiper_box_outside {
  box-sizing: border-box;
  position: relative;
  height: 294upx;
  .swiper_box_margin {
    width: 100%;
    height: 100upx;
    background-color: #f26b1d;
  }
  .swiper_box_spacing {
    width: 100%;
    height: 100upx;
    background: url(../../static/newest/home_banner_bg.png) no-repeat;
    background-size: 100%;
  }
}
.swiper_box {
  position: absolute;
  z-index: 1;
  padding: 0 30upx;
  box-sizing: border-box;
  width: 100%;
  height: 294upx;
  box-sizing: border-box;
  border-radius: 16upx;
  overflow: hidden;
  left: 0;
  top: 0;
  .swiper_outside {
    width: 100%;
    height: 100%;

    .swiper_inner {
      width: 100%;
      height: 100%;
      border-radius: 16upx;
      overflow: hidden;

      .swiper_item {
        width: 100%;
        height: 100%;
        line-height: 294upx;
        text-align: center;
      }
    }
  }

  .swiper_img {
    width: 100%;
    height: 100%;
  }
}

.swiper_img_3d {
  width: 100%;
  height: 100%;
}

.home_study {
  height: 161upx;
  width: 100%;
  padding: 0 24upx;
  margin-bottom: 16upx;
  margin-top: -10upx;
  box-sizing: border-box;

  .home_study_img {
    height: 100%;
    width: 100%;
  }
}

.logo {
  height: 200upx;
  width: 200upx;
  margin-top: 200upx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50upx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36upx;
  color: #8f8f94;
}

/* 插屏广告 */
.uni-image {
  position: relative;

  .popup_message {
    text-align: center;
    font-size: 24upx;
    color: #666666;
  }
}

.image {
  width: 200px;
  height: 200px;
}

.uni-image-close {
  margin-top: 20px;
  text-align: center;

  .icon_close {
    font-size: 72upx;
    color: #cccccc;
  }
}
</style>

