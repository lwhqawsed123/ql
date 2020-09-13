<template>
  <view class="witness_content" id="__content">
    <view style="font-size: 32rpx;margin-bottom: 15rpx;">{{ content.name }}</view>
    <view class="meet_item" v-for="(item, i) in meetList" :key="i">
      <view class="meet_item_head">
        <view class="meet_item_head_icon"></view>
        <view class="meet_item_head_title">{{ item.createTime }}</view>
      </view>
      <view class="meet_item_body">
        <view class="meet_item_body_content">
          <view class="meet_item_body_content_imglist" v-if="item.resources.length">
            <view class="meet_item_body_content_img" v-for="(list, index) in item.resources" :key="list.id" @click="previewImage(item.resources, index)">
              <image class="resources_image" :src="imageBaseUrl + list.resFileName" mode=""></image>
              <view class="image_checkbox" :class="list.selected ? 'image_checked' : ''" v-if="comparisonStatus" @click.stop="select_weet(list)"></view>
              <text class="iconfont icon-guanbi card_img_box_close" v-show="editStatus" @click.stop="removeResources(list, index, item.resources, i)"></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty_Data" v-if="meetList.length === 0">没有美好见证图片，请上传图片，展现美好瞬间!</view>
    <view class="share_content" v-if="!shareId">
      <view class="share_button_box" v-if="!editStatus && !comparisonStatus" id="buttom_menu">
        <text class="share_button collect" @click="editStatus = true">编辑见证</text>
        <text class="line"></text>
        <text class="share_button collect" @click="genImg">图片分享</text>
        <text class="line"></text>
        <text class="share_button collect" @click="comparisonStatus = true">创建对比</text>
        <text class="line"></text>
        <text class="share_button collect" @click="navigateTo(`../addMeet/addMeet?contentId=${contentId}`)">
          增加美好
        </text>
      </view>
      <view class="share_button_box" v-if="editStatus">
        <text class="share_button edit_button" @click="cancelEdit">取消</text>
        <text class="line"></text>
        <text class="share_button save_button" @click="saveRemove">保存</text>
      </view>
      <view class="share_button_box" v-if="comparisonStatus">
        <text class="share_button edit_button" @click="cancelComparison">取消</text>
        <text class="line"></text>
        <text class="share_button save_button" @click="createComparison">发布对比</text>
      </view>
    </view>
    <uni-popup ref="popup" type="center" :maskClick="false">
      <view class="create_comparison">
        <view class="input_textarea">
          <textarea class="" v-model="comparisonContent.name" placeholder="请输入对比描述" placeholder-style="color:#cccccc;backgroundColor:#f7f7f7;fontSize:14px" />
        </view>
        <view class="create_comparison_button">
          <button type="primary" class="create_comparison_button_cancel" @click="cancelPopup">取消</button>
          <button
            type="primary"
            class="create_comparison_button_cancel create_comparison_button_submit"
            :class="comparisonContent.name.trim() ? 'button_submit' : ''"
            @click="submitComparisonContent"
          >确定</button>
        </view>
      </view>
    </uni-popup>
    
    <uni-popup ref="popupImg" type="center">
      <view style="text-align: center;">
        <image :src="previewFile" id="myCanvas"  
                :style="{ width: imgWith, height: imgHeight,position:'absolute’,top:‘0px'}"></image>
        <text style="font-size: 30upx;color:#F0AD4E;text-align: center;">提示:长按图片分享给朋友</text>
      </view>
    </uni-popup>
  </view>
</template>

<script>
<<<<<<< HEAD
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		mapState
	} from "vuex"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				checked: true,
				shareId:0,
				contentId: 0,
				content: {},
				meetList: [],
				catalogId: 0,
				removeResourcesIdList: [],	// 选择要删除的图片
				editStatus: false,
				comparisonStatus: false,
				comparisonWeet: [],	// 选中的图片
				comparisonContent:{
					catalog: {
						id: 0
					},
					contentType: "IMG",
					detail: "",
					name: "",
					resources: [],
					user: {
						id: 0
					}
				},
				resourceForm:{
					redirectUrl:'',
					resFileName:'',
					resType:0,
					selected:false,
					sort:'',
					title:''
				},
			}
		},
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniPopup
		},
		computed: {
			...mapState({
				imageBaseUrl: state => state.imageBaseUrl,
				user: state => state.user,
				options: state => state.options
			})
		},
		onLoad(e) {
			this.contentId = +e.id
			this.shareId = +e.shareId
		},
		onReady() {
			this.getCatalogId('YJMH')
		},
		onShow() {
			this.getbyId()
		},
		methods: {
			// 获取发布美好模块catalog.id
			getCatalogId(identifyName) {
				let params = {
					pi: 1,
					ps: 5,
					query: `identifyName=${identifyName}`
				}
				this.$api.get({
					url: 'content/catalog/page',
					params: params,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							let catalogId = data.content[0].id
							this.catalogId = catalogId
							console.log(catalogId)
						}
					}
				})
			},
			// 根据id获取content
			getbyId() {
				this.$api.get({
					url: `content/${this.contentId}`,
					callback: res => {
						let {
							meta,
							data
						} = res;
						if (meta.success) {
							this.content = data
							let resources = JSON.parse(JSON.stringify(data.resources)).map(item => {
								item.create_time = item.resTime.slice(0, 10)
								return item
							})
							console.log(resources)
							let meetList = []
							resources.forEach(item => {
								let flag = true
								meetList.forEach(list => {
									if (item.create_time === list.createTime) {

										list.resources.push(item)
										flag = false
									}
								})
								if (flag) {
									let arr = []
									arr.push(item)
									meetList.push({
										createTime: item.create_time,
										resources: arr
									})
								}
							})
							meetList = meetList.sort((a, b) => {
								let dateA = new Date(a.createTime).getTime()
								let dateB = new Date(b.createTime).getTime()
								return dateB - dateA
							})
							console.log('meetList')
							console.log(meetList)
							this.meetList = meetList
							this.sdkReady()
						} else {
							// this.$message.error(data);
						}
					}
				});
			},
			sdkReady(){
				let meetList = JSON.parse(JSON.stringify(this.meetList))
				let imgUrl=""
				meetList.forEach(item=>{
					if(imgUrl){
						return 
					}
					item.resources.forEach(list=>{
						if(list.resFileName&&!imgUrl){
							imgUrl=this.imageBaseUrl+list.resFileName
						}
					})
				})
				if(!imgUrl){
					imgUrl=window.location.href.split('#')[0]+"static/index/二维码默认占位@2x.png"
				}
				// 初始化sdk
				this.$api.sdkReady({
					url: window.location.href.split('#')[0],
					jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData','previewImage'],
					ready: () => {
						let href = window.location.href+`&shareId=${this.user.id}`
						wx.updateAppMessageShareData({
							title: this.content.name, // 分享标题
							desc: this.content.description, // 分享描述
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: imgUrl, // 分享图标
							success: function() {
								// 设置成功
								console.log("分享成功")
							}
						});
						wx.updateTimelineShareData({
							title: this.content.name, // 分享标题
							link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: imgUrl, // 分享图标
							success: function() {
								// 设置成功
								console.log("分享成功")
							}
						})
					}
				})
			},
			getContentById(id, i) {
				this.$api.get({
					url: `content/resource/content/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							this.meetList[i]
							this.$set(this.meetList[i], 'resources', data)
							setTimeout(() => {
								uni.hideLoading()
							}, 1000)
						}
					}
				})
			},
			removeResources(item, index, resources, meetIndex) {
				this.removeResourcesIdList.push(item)
				resources.splice(index, 1)
				if (resources.length === 0) {
					this.meetList.splice(meetIndex, 1)
				}
			},
			saveRemove() {
				if (this.removeResourcesIdList.length) {
					uni.showLoading({
						mask: true
					})
					this.removeResourcesIdList.forEach((item, index) => {
						this.$api.delete({
							noLoading: true,
							url: `content/resource/del/${item.id}`,
							callback: res => {
								if (index === this.removeResourcesIdList.length - 1) {
									setTimeout(() => {
										uni.hideLoading()
										this.editStatus = false
									}, 1000)
								}
							}
						})
					})
				} else {
					this.editStatus = false
				}
			},
			cancelEdit() {
				if (this.removeResourcesIdList.length) {
					this.getbyId()
				}
				this.removeResourcesIdList = []
				this.editStatus = false
			},
			cancelComparison() {
				if (this.comparisonWeet.length) {
					this.comparisonWeet.forEach(item => {
						this.$set(item, "selected", false)
					})
				}
				this.comparisonWeet = []
				this.comparisonStatus = false
			},
			cancelPopup(){
				this.comparisonContent.name=''
				this.$refs.popup.close()
			},
			submitComparisonContent(){
				if (!this.comparisonContent.name.trim()) {
					return
				}
				uni.showLoading({
					mask:true
				})
				let form= JSON.parse(JSON.stringify(this.comparisonContent))
				form.catalog.id=this.catalogId
				form.user.id=this.user.id
				this.addContent(form)
			},
			addContent(form){
				console.log(form)
				this.$api.post({
					url:'content/new',
					params:form,
					noLoading:true,
					callback:res=>{
						let {meta,data}=res
						if(meta.success){
							console.log('=====content创建完成======')
							console.log(data)
							this.addResources(data.id)
						}
					}
				})
			},
			// 新增发布美好的资源列表
			addResources(contentId){
				this.comparisonWeet.forEach((item,index)=>{
					let resourceForm=JSON.parse(JSON.stringify(this.resourceForm))
					resourceForm.resFileName=item.resFileName
					resourceForm.resTime=item.resTime
					this.$api.post({
						url:`content/resource/new?contentId=${contentId}`,
						params:resourceForm,
						noLoading:true,
						callback:res=>{
							let {meta,data}=res
							if(meta.success){
								console.log('=====Resources创建完成======')
								console.log(data)
								if(index===this.comparisonWeet.length-1){
									this.$refs.popup.close()
									setTimeout(()=> {
										uni.hideLoading()
										uni.showToast({title:'上传成功!', icon:"none",mask:true});
										uni.navigateBack({
										    delta: 1
										});
									}, 800);
								}
							}
						}
					})
				})
			
			},
			createComparison() {
				console.log("发布对比")
				console.log(this.comparisonWeet)
				if (this.comparisonWeet.length < 2) {
					uni.showToast({
						mask: true,
						title: "最少选择两张图片!",
						icon: "none"
					})
					return
				} else {
					this.$refs.popup.open()
				}
			},
			
			select_weet(item) {
				item.selected = !item.selected
				if (this.comparisonWeet.length) {
					let flag = true
					this.comparisonWeet.forEach((list, index) => {
						if (list.id === item.id) {
							flag = false
							if (!item.selected) {
								this.comparisonWeet.splice(index, 1)
							}
						}
					})
					if (flag && item.selected) {
						this.comparisonWeet.push(item)
					}
				} else {
					if (item.selected) {
						this.comparisonWeet.push(item)
					}
				}
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 开启预览
			previewImage(list, index) {
				let arr = JSON.parse(JSON.stringify(list))
				let img_arr = arr.map(item => {
					return this.imageBaseUrl + item.resFileName
				})
				// 预览图片
				wx.previewImage({
					current: img_arr[index],
					urls: img_arr // 需要预览的图片http链接列表
				});
			},
			// 删除
			deleteById(id) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$api.delete({
					url: `content/del/${id}`,
					noLoading: true,
					callback: res => {
						let {
							meta,
							data
						} = res
						if (meta.success) {
							setTimeout(() => {
								uni.hideLoading()
								this.getCatalogId('YJMH')
								uni.showToast({
									title: '删除成功',
									icon: "none",
									mask: true
								});
							}, 1000)

						}
					}
				})
			},
			onClick(e, item) {
				console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text)
				if (e.index === 1) {
					uni.navigateTo({
						url: `../addMeet/addMeet?meetId=${item.id}`
					})
				} else if (e.index === 2) {
					this.deleteById(item.id)
				}
			},
			change(open) {
				console.log('当前开启状态：' + open)
			}
		}
	}
=======
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import { mapState } from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import html2canvas from '@/utils/html2canvas.min.js';
import Canvas2Image from '@/utils/canvas2image.js';

export default {
  data() {
    return {
      checked: true,
      shareId: 0,
      contentId: 0,
      content: {},
      meetList: [],
      catalogId: 0,
      removeResourcesIdList: [], // 选择要删除的图片
      editStatus: false,
      comparisonStatus: false,
      comparisonWeet: [], // 选中的图片
      comparisonContent: {
        catalog: {
          id: 0
        },
        contentType: 'IMG',
        detail: '',
        name: '',
        resources: [],
        user: {
          id: 0
        }
      },
      resourceForm: {
        redirectUrl: '',
        resFileName: '',
        resType: 0,
        selected: false,
        sort: '',
        title: ''
      },
      previewFile: '',
      imgWith:0,
      imgHeight:0
    };
  },
  components: {
    uniSwipeAction,
    uniSwipeActionItem,
    uniPopup
  },
  computed: {
    ...mapState({
      imageBaseUrl: state => state.imageBaseUrl,
      user: state => state.user,
      options: state => state.options
    })
  },
  onLoad(e) {
    this.contentId = +e.id;
    this.shareId = +e.shareId;
  },
  onReady() {
    this.getCatalogId('YJMH');
  },
  onShow() {
    this.getbyId();
  },
  methods: {
    genImg() {
      const self = this;
      uni.showLoading({ title: '图片生成中...' });
    
      const content_html = document.getElementById('__content');
      let width = content_html.offsetWidth;
      let height = content_html.offsetHeight;
    
      let canvas = document.createElement('canvas');
      let scaleBy = 0.95;
      canvas.width = width * scaleBy;
      canvas.height = height * scaleBy;
      canvas.getContext('2d').scale(scaleBy, scaleBy);
      console.log('canvas.width',canvas.width);
      console.log('canvas.height',canvas.height);
      var opts = {
        useCORS: true, //允许加载跨域的图片
        tainttest: true, //检测每张图片都已经加载完成
        scale:scaleBy, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，发布的时候记得改成false
        width: canvas.width, //dom 原始宽度
        height: canvas.height, //dom 原始高度
        ignoreElements:(element)=>{
            if(element.id==='buttom_menu'){
              return true;
            }     
        }
      };
    
      html2canvas(content_html, opts).then(function(canvas) {
        self.imgWith = canvas.width + 'px';
        self.imgHeight = canvas.height + 'px';
        
        const previewFile = canvas.toDataURL('image/png',1.0);
        self.previewFile = previewFile
        uni.hideLoading();
        self.$refs.popupImg.open();
      });
    },
    // 获取发布美好模块catalog.id
    getCatalogId(identifyName) {
      let params = {
        pi: 1,
        ps: 5,
        query: `identifyName=${identifyName}`
      };
      this.$api.get({
        url: 'content/catalog/page',
        params: params,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            let catalogId = data.content[0].id;
            this.catalogId = catalogId;
            console.log(catalogId);
          }
        }
      });
    },
    // 根据id获取content
    getbyId() {
      this.$api.get({
        url: `content/${this.contentId}`,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            this.content = data;
            let resources = JSON.parse(JSON.stringify(data.resources)).map(item => {
              item.create_time = item.resTime.slice(0, 10);
              return item;
            });
            console.log(resources);
            let meetList = [];
            resources.forEach(item => {
              let flag = true;
              meetList.forEach(list => {
                if (item.create_time === list.createTime) {
                  list.resources.push(item);
                  flag = false;
                }
              });
              if (flag) {
                let arr = [];
                arr.push(item);
                meetList.push({
                  createTime: item.create_time,
                  resources: arr
                });
              }
            });
            meetList = meetList.sort((a, b) => {
              let dateA = new Date(a.createTime).getTime();
              let dateB = new Date(b.createTime).getTime();
              return dateB - dateA;
            });
            console.log('meetList');
            console.log(meetList);
            this.meetList = meetList;
            this.sdkReady();
          } else {
            // this.$message.error(data);
          }
        }
      });
    },
    sdkReady() {
      let meetList = JSON.parse(JSON.stringify(this.meetList));
      let imgUrl = '';
      meetList.forEach(item => {
        if (imgUrl) {
          return;
        }
        item.resources.forEach(list => {
          if (list.resFileName && !imgUrl) {
            imgUrl = this.imageBaseUrl + list.resFileName;
          } else {
            return;
          }
        });
      });
      if (!imgUrl) {
        imgUrl = window.location.href.split('#')[0] + 'static/index/二维码默认占位@2x.png';
      }
      // 初始化sdk
      this.$api.sdkReady({
        url: window.location.href.split('#')[0],
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'previewImage'],
        ready: () => {
          let href = window.location.href + `&shareId=${this.user.id}`;
          wx.updateAppMessageShareData({
            title: this.content.name, // 分享标题
            desc: this.content.description, // 分享描述
            link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function() {
              // 设置成功
              console.log('分享成功');
            }
          });
          wx.updateTimelineShareData({
            title: this.content.name, // 分享标题
            link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function() {
              // 设置成功
              console.log('分享成功');
            }
          });
        }
      });
    },
    getContentById(id, i) {
      this.$api.get({
        url: `content/resource/content/${id}`,
        noLoading: true,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            this.meetList[i];
            this.$set(this.meetList[i], 'resources', data);
            setTimeout(() => {
              uni.hideLoading();
            }, 1000);
          }
        }
      });
    },
    removeResources(item, index, resources, meetIndex) {
      this.removeResourcesIdList.push(item);
      resources.splice(index, 1);
      if (resources.length === 0) {
        this.meetList.splice(meetIndex, 1);
      }
    },
    saveRemove() {
      if (this.removeResourcesIdList.length) {
        uni.showLoading({
          mask: true
        });
        this.removeResourcesIdList.forEach((item, index) => {
          this.$api.delete({
            noLoading: true,
            url: `content/resource/del/${item.id}`,
            callback: res => {
              if (index === this.removeResourcesIdList.length - 1) {
                setTimeout(() => {
                  uni.hideLoading();
                  this.editStatus = false;
                }, 1000);
              }
            }
          });
        });
      } else {
        this.editStatus = false;
      }
    },
    cancelEdit() {
      if (this.removeResourcesIdList.length) {
        this.getbyId();
      }
      this.removeResourcesIdList = [];
      this.editStatus = false;
    },
    cancelComparison() {
      if (this.comparisonWeet.length) {
        this.comparisonWeet.forEach(item => {
          this.$set(item, 'selected', false);
        });
      }
      this.comparisonWeet = [];
      this.comparisonStatus = false;
    },
    cancelPopup() {
      this.comparisonContent.name = '';
      this.$refs.popup.close();
    },
    submitComparisonContent() {
      if (!this.comparisonContent.name.trim()) {
        return;
      }
      uni.showLoading({
        mask: true
      });
      let form = JSON.parse(JSON.stringify(this.comparisonContent));
      form.catalog.id = this.catalogId;
      form.user.id = this.user.id;
      this.addContent(form);
    },
    addContent(form) {
      console.log(form);
      this.$api.post({
        url: 'content/new',
        params: form,
        noLoading: true,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            console.log('=====content创建完成======');
            console.log(data);
            this.addResources(data.id);
          }
        }
      });
    },
    // 新增发布美好的资源列表
    addResources(contentId) {
      this.comparisonWeet.forEach((item, index) => {
        let resourceForm = JSON.parse(JSON.stringify(this.resourceForm));
        resourceForm.resFileName = item.resFileName;
        resourceForm.resTime = item.resTime;
        this.$api.post({
          url: `content/resource/new?contentId=${contentId}`,
          params: resourceForm,
          noLoading: true,
          callback: res => {
            let { meta, data } = res;
            if (meta.success) {
              console.log('=====Resources创建完成======');
              console.log(data);
              if (index === this.comparisonWeet.length - 1) {
                this.$refs.popup.close();
                setTimeout(() => {
                  uni.hideLoading();
                  uni.showToast({ title: '上传成功!', icon: 'none', mask: true });
                  uni.navigateBack({
                    delta: 1
                  });
                }, 800);
              }
            }
          }
        });
      });
    },
    createComparison() {
      console.log('发布对比');
      console.log(this.comparisonWeet);
      if (this.comparisonWeet.length < 2) {
        uni.showToast({
          mask: true,
          title: '最少选择两张图片!',
          icon: 'none'
        });
        return;
      } else {
        this.$refs.popup.open();
      }
    },

    select_weet(item) {
      item.selected = !item.selected;
      if (this.comparisonWeet.length) {
        let flag = true;
        this.comparisonWeet.forEach((list, index) => {
          if (list.id === item.id) {
            flag = false;
            if (!item.selected) {
              this.comparisonWeet.splice(index, 1);
            }
          }
        });
        if (flag && item.selected) {
          this.comparisonWeet.push(item);
        }
      } else {
        if (item.selected) {
          this.comparisonWeet.push(item);
        }
      }
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    // 开启预览
    previewImage(list, index) {
      let arr = JSON.parse(JSON.stringify(list));
      let img_arr = arr.map(item => {
        return this.imageBaseUrl + item.resFileName;
      });
      // 预览图片
      wx.previewImage({
        current: img_arr[index],
        urls: img_arr // 需要预览的图片http链接列表
      });
    },
    // 删除
    deleteById(id) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      this.$api.delete({
        url: `content/del/${id}`,
        noLoading: true,
        callback: res => {
          let { meta, data } = res;
          if (meta.success) {
            setTimeout(() => {
              uni.hideLoading();
              this.getCatalogId('YJMH');
              uni.showToast({
                title: '删除成功',
                icon: 'none',
                mask: true
              });
            }, 1000);
          }
        }
      });
    },
    onClick(e, item) {
      console.log('当前点击的是第' + e.index + '个按钮，点击内容是' + e.content.text);
      if (e.index === 1) {
        uni.navigateTo({
          url: `../addMeet/addMeet?meetId=${item.id}`
        });
      } else if (e.index === 2) {
        this.deleteById(item.id);
      }
    },
    change(open) {
      console.log('当前开启状态：' + open);
    }
  }
};
>>>>>>> 61267418c474f6f070e352f52f9dd663a67bbc1f
</script>

<style lang="less">
page {
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 0 24upx;
  width: 100%;
  height: 100%;
}

.witness_content {
  width: 100%;
  padding-bottom: 120upx;

  .empty_Data {
    width: 100%;
    margin-top: 2upx;
    line-height: 100upx;
    font-size: 28upx;
    color: #999999;
    text-align: center;
  }

  .resume_item {
    box-sizing: border-box;
    // padding-bottom: 36upx;
    margin-top: 20upx;
    background-color: #ffffff;
    width: 100%;

    .resume_content {
      box-sizing: border-box;
      padding: 0 26upx;
      background-color: #ffffff;
      overflow: hidden;

      .gift_name {
        margin-top: 18upx;
        margin-bottom: 50upx;
        font-size: 28upx;
        color: #333333;
        font-weight: 600;
      }

      .gift_img_box {
        display: flex;
        align-items: center;
        // justify-content: space-between;
        flex-wrap: wrap;

        .gift_img_img {
          width: 204upx;
          height: 144upx;
          margin-right: 12upx;
          // margin-bottom: 20upx;
          border: 2upx solid #ffffff;

          &:nth-child(3n + 3) {
            margin-right: 0;
          }
        }
      }

      .checked_for_weet {
        margin: 16upx 0 32upx 0;
        width: 100%;
        display: flex;
        align-items: center;

        .checked_box {
          width: 30upx;
          height: 30upx;
          box-sizing: border-box;
          margin-right: 10upx;
          border: 1px solid #979797;

          image {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .is_active {
          border: none;
        }

        .tips_text {
          font-size: 24upx;
          color: #333333;
        }
      }
    }
  }

  .meet_item {
    margin-top: 8upx;

    .meet_item_head {
      display: flex;
      align-items: center;

      .meet_item_head_icon {
        width: 20upx;
        height: 20upx;
        border-radius: 50%;
        background-color: #f19b39;
        border: 4upx solid #fcebd7;
        margin-right: 8upx;
      }

      .meet_item_head_title {
        font-size: 24upx;
        color: #777777;
      }
    }

    .meet_item_body {
      margin-top: 8upx;
      display: flex;

      .meet_item_body_line {
        width: 2upx;
        height: 100%;
        height: 229upx;
        background-color: #e0e0e0;
        margin: 0 20upx 0 13upx;
      }

      .meet_item_body_content {
        flex: 1;
        height: 100%;
        border-left: 2upx solid #e0e0e0;
        margin-left: 13upx;
        padding: 0 0 8upx 20upx;

        .meet_item_body_content_title {
          margin-top: -2upx;
          font-size: 32upx;
          line-height: 36upx;
          color: #4a4a4a;
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

        .meet_item_body_content_imglist {
          margin-top: 19upx;
          display: flex;
          flex-wrap: wrap;

          .meet_item_body_content_img {
            width: 210upx;
            height: 140upx;
            margin-right: 14upx;
            margin-bottom: 20upx;
            border-radius: 6upx;
            // overflow: hidden;
            box-sizing: border-box;
            position: relative;

            .image_checkbox {
              width: 24upx;
              height: 24upx;
              opacity: 0.5;
              position: absolute;
              right: 7upx;
              top: 7upx;
              background-image: url(../../../static/newest/beauty_checkbox.png);
              background-size: 100%;
            }

            .image_checked {
              opacity: 1;
              background-position: 0 -38upx;
            }

            .resources_image {
              width: 100%;
              height: 100%;
            }

            .card_img_box_close {
              position: absolute;
              width: 40upx;
              height: 40upx;
              border-radius: 50%;
              background-color: #f23a3a;
              text-align: center;
              line-height: 40upx;
              font-size: 20upx;
              color: #ffffff;
              top: -10upx;
              right: -10upx;
              z-index: 1;
            }

            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  .share_content {
    height: 100upx;
    width: 100%;
    padding: 0 60upx;
    background-color: #ffffff;
    opacity: 0.8;
    display: flex;
    box-sizing: border-box;
    font-size: 34upx;
    position: fixed;
    bottom: 0;
    left: 0;

    .share_button_box {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;

      .share_button {
        flex: 1;
        line-height: 100upx;
        text-align: center;
      }

      .edit_button {
        color: #333333;
      }

      .save_button {
        color: skyblue;
      }

      .share {
        color: #4ad360;
      }

      .collect {
        color: #f26b1d;
      }

      .collectived {
        color: #cccccc;
      }

      .line {
        width: 2upx;
        height: 46upx;
        background-color: #e0e0e0;
      }
    }
  }

  .cash_button {
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 14upx 24upx;
    background-color: #ffffff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 100%;
      height: 84upx;
      background: #ee4f16;
      border-radius: 2px;
    }
  }
  .create_comparison {
    .input_textarea {
      width: 486upx;
      height: 203upx;
      border: 2upx solid #d9d9d9;
      border-radius: 6upx;
      font-size: 30upx;
      background-color: #f7f7f7;
      box-sizing: border-box;
      padding: 20upx;
      textarea {
        width: 100%;
        height: 100%;
        font-size: 30upx;
      }
    }
    .create_comparison_button {
      margin-top: 36upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100upx;
      box-sizing: border-box;
      .create_comparison_button_cancel {
        flex: 1;

        background-color: #ffffff;
        color: #aaaaaa;
        line-height: 100upx;
      }
      .create_comparison_button_submit {
        margin-left: 30upx;
      }
      .button_submit {
        color: #f36c1e;
      }
    }
  }
}
</style>
