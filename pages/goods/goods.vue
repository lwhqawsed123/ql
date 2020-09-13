<template>
  <view>
    <scroll-view scroll-x
                 style="width: 100%;height: 90rpx;background-color: #f3f4f6;line-height: 90rpx;white-space: nowrap;">
      <view v-for="(item,index) in cataLog" @click="Mhswitch(index)"
            style="display: inline-block;font-size: 30rpx; margin-left: 30rpx;margin-right: 30rpx;text-align: center;">
        <text v-if="current==index" class="active_" style="color: #f26b1d ;">{{item.name}}</text>
        <text style="color: #777777;" v-else>{{item.name}}</text>
      </view>
    </scroll-view>
    <view style="position: absolute;top: 90rpx;bottom: 0;left: 0;right: 0;">
      <scroll-view @scrolltolower="onReachBottom_()" class="content" scroll-y="true" scroll-top="0">
        <view class="goos_list">
          <view class="goods_item" v-for="item in cataLog[current].list">
            <view class="goods_item_header">
              <image class="goods_img" :src="iamgeBaseUrl+item.thumbnail" mode=""></image>
              <view class="goods_item_message">
                <view class="goods_name goods_msg">
                  {{item.name}}
                </view>
                <view class="goods_model goods_msg">
                  <text v-for="list in setTag(item.tag)" :key="list">{{list}}</text>
                </view>
                <view class="goods_price goods_msg">
                  ¥{{item.price}}.00
                </view>
              </view>
            </view>
            <view :class="!item.detailShow?'goods_detail':'goods_detail ellipsis_1'" @click="change_detail_class(item)">
              {{item.detail}}
              <text v-show="!item.detailShow && item.detail.length>=26" class="hide_detail"
                    @click.stop="hide_detail(item)">收起
              </text>
            </view>
          </view>
        </view>
        <view class="empty_Data" v-if="cataLog[current].list && cataLog[current].list.length>=cataLog[current].total">
          没有更多数据了!
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style>
  .active_ {
    display: inline-block;
    position: relative;
    height: 90 rpx;
  }

  .active_:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60 rpx;
    height: 3px;
    background-color: #f26b1d;
  }
</style>
<script>
    import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
    import {RES_HOST} from "../../api/config";

    export default {
        components: {
            uniSegmentedControl
        },
        data() {
            return {
                iamgeBaseUrl: RES_HOST + '/img/',
                count: 0,
                cataLog: [],
                current: 0
            }
        },
        onShow() {
            this.getCataLog();
        },
        onReady() {
            this.$api.sdkReady()
        },
        //下拉刷新
        onPullDownRefresh() {
            console.log('refresh');
            let item = this.cataLog[this.current];
            this.$set(item, 'list', []);
            this.$set(item, 'isRequest', false);
            this.$set(item, 'pi', 0);
            this.getAllGoods()
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        methods: {
            // 上拉加载
            onReachBottom_() {
                let item = this.cataLog[this.current];
                if (item.list.length >= item.total) {
                    console.log("没有更多数据了")
                    return false;
                }
                this.getAllGoods();
            },
            setTag(val) {
                return val.split(',');
            },
            Mhswitch(index) {
                if (this.current == index) {
                    return
                }
                this.current = index;
                let item = this.cataLog[this.current]
                if (!item.list || item.list.length == 0) {
                    this.getAllGoods();
                }
            },
            getCataLog() {
                let data = {
                    query: `parentId=4,company=1`,
                    pi: 1,
                    ps: 999
                }
                let that = this;
                this.$api.get({
                    url: 'content/catalog/page',
                    params: data,
                    callback: res => {
                        let {
                            data,
                            meta
                        } = res
                        if (meta.success) {
                            that.cataLog = data.content;
                            that.getAllGoods()
                        }
                    }
                })
            },
            // 获取商品列表
            getAllGoods() {
                let item = this.cataLog[this.current];
                if (item.isRequest) {
                    console.log("请求中")
                    return
                }
                item.isRequest = true;
                if (!item.pi) {
                    item.pi = 0;
                }
                item.pi++;
                let data = {
                    query: `delFlag=0,catalog.id=` + item.id,
                    pi: item.pi,
                    ps: 4
                }
                this.$api.get({
                    url: 'content/page',
                    params: data,
                    callback: res => {
                        let {
                            data,
                            meta
                        } = res
                        if (meta.success) {
                            if (!item.list) {
                                this.$set(item, 'list', []);
                                this.$set(item, 'total', '0');
                            }
                            this.$set(item, 'isRequest', false);
                            if (data.content == 0) {
                                item.pi--;
                                return;
                            }
                            this.$set(item, 'list', item.list.concat(data.content));
                            this.$set(item, 'total', data.totalElements);
                        }
                    }
                })
            },
            change_detail_class(item) {
                this.$set(item, 'detailShow', false)
            },
            hide_detail(item) {
                this.$set(item, 'detailShow', true)
            }
        }
    }
</script>

<style lang="less">
  page {
    background: #F9F9F9;
    width: 100%;
    height: 100%;
  }

  .content {
    height: 100%;

    .goos_list {
      width: 100%;
      box-sizing: border-box;

      .goods_item {
        background-color: #FFFFFF;
        width: 100%;
        // height: 350upx;
        box-sizing: border-box;
        padding: 30upx;
        margin-bottom: 30;
        overflow: hidden;

        &:last-child {
          margin-bottom: 0;
        }

        .goods_item_header {
          width: 100%;
          height: 156upx;
          margin-bottom: 30upx;
          display: flex;

          .goods_img {
            width: 156upx;
            height: 156upx;
            margin-right: 30upx;
          }

          .goods_item_message {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .goods_msg {
              font-size: 32upx;
              color: #333333;
              word-break: break-all;
              /*允许在单词内换行*/
              text-align: left;
              text-overflow: -o-ellipsis-lastline;
              /*css3中webkit内核提供的一个方法类似ellipsis*/
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              /*自适应盒子*/
              -webkit-line-clamp: 1;
              /*此处为1行,如果是两行就改成2*/
              -webkit-box-orient: vertical;
            }

            .goods_model {
              text {
                margin-right: 30upx;

                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }
        }

        .goods_detail {
          font-size: 24upx;
          color: #666666;

        }

        .ellipsis_1 {
          overflow: hidden;
          word-break: break-all;
          /*允许在单词内换行*/
          text-align: left;
          text-overflow: -o-ellipsis-lastline;
          /*css3中webkit内核提供的一个方法类似ellipsis*/
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          /*自适应盒子*/
          -webkit-line-clamp: 1;
          /*此处为1行,如果是两行就改成2*/
          -webkit-box-orient: vertical;
        }

        .hide_detail {
          margin-left: 10upx;
          font-size: 24upx;
          color: #1c00cf;
        }
      }

    }

    .empty_Data {
      line-height: 100upx;
      font-size: 28upx;
      color: #999999;
      text-align: center;
    }
  }
</style>
