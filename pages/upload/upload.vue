<template>
  <view class="container">
    <!-- <view></view> -->
    <button @click="downloadFile" type="default" size="mini">下载</button>
    <!-- <a href="http://localhost:8081/static/index/zixun.png" download="">下载图片</a> -->
    <!-- <a href="http://192.168.0.100:8081/static/index/zixun.png" download="">下载图片</a> -->
  </view>
</template>
<script>
    import {RES_HOST} from "../../api/config";

    export default {
        data() {
            return {
                option: {},
                downloadUrl: ''
            }
        },
        onLoad(option) {
            option.fileName = decodeURIComponent(option.fileName)
            this.option = option
            //测试文件名中不含& ？
            //http://res.selfiot.cn/qili/img/H7XHZQP6-frfpRqblqtamohh.png
            // option.type='img';
            // option.fileName='H7XHZQP6-frfpRqblqtamohh.png'
            let s = ''
            for (let i in option) {
                s = s + i + '=' + option[i] + '&'
            }
            let downloadUrl = (this.$api.port + 'download/file?' + s)
            downloadUrl = downloadUrl.substring(0, downloadUrl.length - 1)
            this.downloadUrl = downloadUrl;
            console.log("onload option:", JSON.stringify(option))
            console.log("下载链接", downloadUrl)
        },
        methods: {
            //(方法一)有数据流文件
            download(data) {
                if (!data) {
                    return
                }
                let url = window.URL.createObjectURL(new Blob([data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', this.option.fileName)
                document.body.appendChild(link)
                link.click()
            },
            downloadUrlFun(url) {
                let alink = document.createElement("a");
                alink.download = ""//文件名,大部分浏览器兼容,IE10及以下不兼容
                alink.href = url;//创建 url地址
                alink.click(); //自动点击
            },
            downloadFile() {
                let that = this;
                let url = this.downloadUrl;
                url = url.replace(/\\/g, '/');
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.setRequestHeader('Authorization', 'Bearer ' + that.option.token);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        //that.download(xhr.response)
                        that.downloadUrlFun(RES_HOST + "/learnAndGrow/" + that.option.fileName)
                        //window.location.href="你的url";
                        //window.open("")
                    }
                };
                xhr.send();
            }
        }
    }
</script>

<style>
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
