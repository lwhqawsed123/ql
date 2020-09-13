import Vue from 'vue'
import App from './App'
import api from './api/api.js'
import public_ from './utils/public.js'
import Vconsole from './utils/vconsole.min.js'
import validate from '@/common/util/ys-validate.js'
import constant from './utils/constant.js'
Vue.prototype.$constant = constant
// 挂载到全局
Vue.prototype.$validate = validate
// 引入iconfont
import './common/iconfont/iconfont.css'
// 引入剪贴板api
import './js_sdk/ican-H5Api/ican-H5Api.js'

// 引入全局方法common.js
import common from './utils/common'
Vue.use(common)
// 引入mixins
// import mixins from 'common/common.vue'

// 引入 vuex
import store from 'store/index.js'
Vue.prototype.$store=store

var vConsole = new Vconsole()
Vue.use(vConsole)
Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$public_ = public_;

// =======解决ios键盘弹起bug========
// (/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener(
//     'blur',
//     event => {
// 			// 当页面没出现滚动条时才执行，因为有滚动条时，不会出现这问题
//             // input textarea 标签才执行，因为 a 等标签也会触发 blur 事件
//         if (
//             document.documentElement.offsetHeight <=
//             document.documentElement.clientHeight &&
//             ['input', 'textarea'].includes(event.target.localName)
//         ) {
//             document.body.scrollIntoView() // 回顶部
//         }
//     },
//     true
// )
// ================================


App.mpType = 'app'

const app = new Vue({
	// mixins:[mixins],
	...App,
	store
})
app.$mount()
