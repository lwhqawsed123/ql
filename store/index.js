import Vue from "vue"
import Vuex from 'vuex'
import {RES_HOST} from "../api/config";

Vue.use(Vuex)

let checkedMeet = uni.getStorageSync('CHECKEDMEET')
let checkedContent = uni.getStorageSync('CHECKEDCONTENT')
// let getAllCatalog=function (){
// 	api.get({
// 		url:`content/catalog/all`,
// 		callback:res=>{
// 			if(res.meta.success){

// 			}
// 		}
// 	})
// }
let store = new Vuex.Store({
    state: {
        checkedMeet: checkedMeet || [],	// 选择美好见证
        checkedContent: checkedContent || [],	// 选择视频/文章
        imageBaseUrl: RES_HOST + '/img/',
        videoBaseUrl: RES_HOST + '/video/',
        audioBaseUrl: RES_HOST + '/audio/',
        user: uni.getStorageSync("USERINFO"),
        shareImage: RES_HOST + '/img/PQP821NE-二维码默认占位@3x.jpg',
        articleDetail: '',
        options: [{
            text: '取消',
            style: {
                backgroundColor: '#ebb563'
            }
        },
            {
                text: '修改',
                style: {
                    backgroundColor: '#c8c7cc'
                }
            },
            {
                text: '删除',
                style: {
                    backgroundColor: '#fd493a'
                }
            }
        ]
    },
    mutations: {
        saveCheckedMeet: (state, payload) => {
            state.checkedMeet = payload.checkedMeet
        },
        removeCheckedMeet: state => {
            state.checkedMeet = []
        },
        saveCheckedContent: (state, payload) => {
            state.checkedContent = payload.checkedContent
        },
        removeCheckedContent: state => {
            state.checkedContent = []
        },
        saveUserInfo: (state, payload) => {
            state.user = payload.user
        },
        saveArticleDetail: (state, payload) => {
            state.articleDetail = payload.articleDetail
        },
        removeArticleDetail: (state) => {
            state.articleDetail = ''
        }
    },
    actions: {
        saveCheckedMeet: (context, payload) => {
            uni.setStorageSync('CHECKEDMEET', payload.checkedMeet)
            context.commit(payload)
        },
        removeCheckedMeet: (context, payload) => {
            uni.removeStorageSync('CHECKEDMEET')
            context.commit(payload)
        },
        saveCheckedContent: (context, payload) => {
            uni.setStorageSync('CHECKEDCONTENT', payload.checkedContent)
            context.commit(payload)
        },
        removeCheckedContent: (context, payload) => {
            uni.removeStorageSync('CHECKEDCONTENT')
            context.commit(payload)
        },
        saveUserInfo: (context, payload) => {
            uni.setStorageSync('USERINFO', payload.user)
            context.commit(payload)
        },
        saveArticleDetail: (context, payload) => {
            context.commit(payload)
        },
        removeArticleDetail: (context, payload) => {
            context.commit(payload)
        }
    }
})

export default store;
