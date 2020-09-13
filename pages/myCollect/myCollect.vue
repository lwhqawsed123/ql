<template>
  <view class='content'>
    <view class="content_tab">
      <view :class="!checked?'tab_button active':'tab_button'" @click="changePage(0)">
        <text>视频</text>
      </view>
      <view :class="checked?'tab_button active':'tab_button'" @click="changePage(1)">
        <text>文章</text>
      </view>
    </view>
    <swiper class="swiper" :current="current" @change="changeTab" :style="{height:swiperHeight+'px'}">
      <swiper-item>
        <view class="main video_list">
          <view class="empty_Data" v-if="vedioList.length===0">
            没有更多数据了!
          </view>
          <view class="video_item" v-for="item in vedioList" :key="item.id">
            <view class="article_item">
              <image :src="iamgeBaseUrl+item.content.thumbnail" mode="" class="article_img"></image>
              <view class="article_content">
                <text class="article_title">{{item.content.name}}</text>
                <text class="article_num">阅读量：{{item.content.sumRead}}</text>
                <!-- <image src="../../static/index/分享%20.png" mode="" class="article_share"></image> -->
                <image src="../../static/index/收藏.png" mode="" class="article_collect"
                       @click="removeCollect(item.id)"></image>

              </view>
            </view>
          </view>
        </view>
      </swiper-item>
      <swiper-item>
        <view class="main article_list">
          <view class="empty_Data" v-if="articleList.length===0">
            没有更多数据了!
          </view>
          <view class="video_item" v-for="item in articleList" :key="item.id">
            <view class="article_item">
              <image :src="iamgeBaseUrl+item.content.thumbnail" mode="" class="article_img"></image>
              <view class="article_content">
                <text class="article_title">{{item.content.name}}</text>
                <text class="article_num">阅读量：{{item.content.sumRead}}</text>
                <!-- <image src="../../static/index/分享%20.png" mode="" class="article_share"></image> -->
                <image src="../../static/index/收藏.png" mode="" class="article_collect"
                       @click="removeCollect(item.id)"></image>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

  </view>
</template>

<script>
    import {RES_HOST} from "../../api/config";

    export default {
        data() {
            return {
                user: uni.getStorageSync("USERINFO"),
                checked: false,
                startData: {},
                listHeight: 0, //内部的高度
                swiperHeight: 0, //外部的高度
                current: 0,
                heightList: '.video_list',
                vedioList: [],
                articleList: [],
                iamgeBaseUrl: RES_HOST + '/img/',
                videoBaseUrl: RES_HOST + '/video/',
            }
        },
        onShow(e) {
            this.getAllbyQuery()
        },
        onReady() {
            this.$api.sdkReady()
        },
        onPullDownRefresh() {
            this.getAllbyQuery()

        },
        methods: {
            // 页面加载时获取收藏列表
            getAllbyQuery() {
                this.$api.get({
                    url: `user/collection/user/${this.user.id}`,
                    callback: res => {
                        let {
                            meta,
                            data
                        } = res;
                        if (meta.success) {
                            if (data.totalElements === 0) {
                                return
                            }
                            let vedioList = []
                            let articleList = []
                            // data.forEach(item => {
                            // 	if (item.content.catalog.id === 5) {
                            // 		vedioList.push(item)
                            // 	} else {
                            // 		articleList.push(item)
                            // 	}
                            // })
                            for (let item in data) {
                                if (data[item].content.catalog.id === 5 || data[item].content.catalog.parentId === 5) {
                                    vedioList.push(data[item])
                                } else {
                                    articleList.push(data[item])
                                }
                            }
                            this.vedioList = vedioList
                            this.articleList = articleList
                            this.$nextTick(() => {
                                this.getlistHeight(this.heightList);
                            })
                            setTimeout(function () {
                                uni.stopPullDownRefresh();
                            }, 500);
                        } else {
                            // this.$message.error(data);
                        }
                    }
                });
            },
            // 取消收藏
            removeCollect(id) {
                this.$api.delete({
                    url: `user/collection/del/${id}`,
                    callback: res => {
                        let {
                            meta,
                            data
                        } = res;
                        if (meta.success) {
                            console.log("===删除成功===")
                            console.log(res)
                            this.getAllbyQuery()
                        } else {
                            // this.$message.error(data);
                        }
                    }
                })
            },
            changePage(target) {
                this.current = target
            },
            getlistHeight(list) {
                let _this = this
                let info = uni.createSelectorQuery().select(list);
                info.boundingClientRect(function (data) {
                    // console.log(data.height)  // 获取元素的各种参数
                    _this.listHeight = data.height; // 获取元素高度
                    _this.getHeight();
                }).exec();
            },
            getHeight() {
                let _this = this;
                _this.swiperHeight = _this.listHeight;
                return _this.swiperHeight;
            },
            changeTab(e) {
                let _this = this;
                this.current = e.target.current
                // 不同的tab不同的高度赋不同的值
                if (e.target.current == 0) {
                    _this.checked = false
                    let list = ".video_list";
                    _this.getlistHeight(list);
                } else if (e.target.current == 1) {
                    _this.checked = true
                    let list = ".article_list";
                    _this.getlistHeight(list);
                }
            },
            navigateTo(url) {
                uni.navigateTo({
                    url: url,

                })
            },

        }
    }
</script>

<style lang="less">
  page {
    background: #F9F9F9;
  }

  .content {
    width: 100%;

    .main {
      padding: 0 24 upx;
      box-sizing: border-box;
    }

    .content_tab {
      background: #FFFFFF;
      padding: 0 24 upx;
      box-sizing: border-box;
      width: 100%;
      height: 84 upx;
      display: flex;
      align-items: center;
      justify-content: center;

      .tab_button {
        width: 72 upx;
        height: 50 upx;
        text-align: center;
        line-height: 50 upx;
        font-size: 36 upx;
        color: #333333;
        border-bottom: 6 upx solid #FFFFFF;

        &:last-child {
          margin-left: 226 upx;
        }
      }

      .active {
        color: #EE4F16;
        border-bottom: 6 upx solid #EE4F16;
      }

    }

    .video_list,
    .article_list {
      width: 100%;

      .empty_Data {
        width: 100%;
        height: 700 upx;
        line-height: 100 upx;
        font-size: 28 upx;
        color: #999999;
        text-align: center;
      }

      .video_item {
        width: 100%;
        height: 344 upx;
        padding-top: 22px;
        box-sizing: border-box;


        .article_item {
          width: 100%;
          height: 280 upx;
          background-color: #FFFFFF;
          padding: 0 20 upx;
          box-sizing: border-box;
          display: flex;
          align-items: center;

          .article_img {
            width: 342 upx;
            height: 218 upx;
            margin-right: 20 upx;
          }

          .article_content {
            // width: 100%;
            height: 100%;
            flex: 1;
            position: relative;

            .article_title {
              font-size: 32 upx;
              color: #333333;
              margin: 30 upx 0;
              word-break: break-all;
              /*允许在单词内换行*/
              text-align: left;
              text-overflow: -o-ellipsis-lastline;
              /*css3中webkit内核提供的一个方法类似ellipsis*/
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              /*自适应盒子*/
              -webkit-line-clamp: 2;
              /*此处为1行,如果是两行就改成2*/
              -webkit-box-orient: vertical;
            }

            .article_num {
              display: block;
              font-size: 24 upx;
              color: #999999;
            }

            .article_share {
              position: absolute;
              right: 80 upx;
              bottom: 16 rpx;
              width: 40 upx;
              height: 40 upx;
            }

            .article_collect {
              position: absolute;
              right: 20 upx;
              bottom: 46 rpx;
              width: 40 upx;
              height: 40 upx;
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }


  }
</style>
