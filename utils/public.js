import constant from '../utils/constant.js'
// 公共部分可以尽可能的提取 看情况而定
export default {
	//解决ios 失去焦点界面上移的问题 
	onBlur(){
		setTimeout(()=>{
			console.log("onBlur")
			console.log(document.activeElement.tagName)
			if(document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA'){
				return
			}
			let result = 'pc';
			if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
					result = 'ios'
			}else if(/(Android)/i.test(navigator.userAgent)) {  //判断Android
					result = 'android'
			}
			if( result = 'ios' ){
				// document.activeElement.scrollIntoViewIfNeeded(true);
				let scrollTop = document.body.scrollTop;
				window.scroll(0 ,scrollTop);
			}
		},100)
	},
}
