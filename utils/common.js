import api from '../api/api.js'
// 日期转字符串 参数为时间格式
const dateToString = (time) => {
	let index = time.indexOf('T')
	console.log(index==-1)
	let str = time.slice(0, index)
	return index==-1?time:str
}
// var dateToString = (date)=> { 
// 	var date=new Date(date)
//     var y = date.getFullYear();  
//     var m = date.getMonth() + 1;  
//     m = m < 10 ? '0' + m : m;  
//     var d = date.getDate();  
//     d = d < 10 ? ('0' + d) : d;  
//     return y + '-' + m + '-' + d;  
// }
// 日期转时间戳 IOS
var dateToTimestamp = (date) => {
	let index = date.indexOf('.')
	let time = time.slice(0, index)
	time = date.replace("T", " ")
	time = time.replace(/-/g, "/")
	var timestamp = new Date(time)
	return timestamp.getTime()
}
// 字符串切割 转完整日期格式 yyyy/MM/dd HH:mm:ss
var strToDate = (date) => {
	let index = date.indexOf('.')
	let time = date.slice(0, index)
	time = time.replace("T", " ")
	time = time.replace(/-/g, "/")
	return time
}
// 判断字符串是否为JSON字符串
var isJSON = (str) => {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
}
// 请求catalog_id
/**post
 * @param {string} identifyName	catalog的identify_name字段
 * 							返回值是  catalog_id
 */
var getCatalog = (identifyName) => {
	return new Promise(function(res,rej){
		api.get({
			url: `content/catalog/identify?companyId=1&name=${identifyName}`,
			callback: backData => {
				res(backData)
			},
			fail:err=>{
				rej(err)
			}
		})
	})
	
}

export default {
	install(Vue) {
		Vue.prototype.$common = {
			dateToString,
			strToDate,
			isJSON,
			getCatalog
		}
	}
}
