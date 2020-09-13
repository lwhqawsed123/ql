<template>
	<view style="margin-top: 100upx;text-align: center;">
    <image :src="imageUrl" mode="aspectFill"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageUrl:'../../static/index/todo.jpg'
			};
		}
	}
</script>

<style lang="less">

</style>
