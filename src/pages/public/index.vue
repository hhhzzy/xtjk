<template>
    <div class="gzh" :style="{'height':'calc(100% - '+navBarHeight+'px )'}">
        <navbar :backVisible="false" :title="'公众号'"></navbar>
        <img @longpress="saveImg" src="../../../static/images/gzh.png" alt="">
        
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import {imgBaseUrl} from '../../utils/common.js'
export default {
    data () {
        return {
            navBarHeight:null,
		    imgBaseUrl:imgBaseUrl,
            url:'C:/workspace/th_api/source/publicMessage.png'
        }
    },

    components: {
        navbar
    },
    methods:{
        async saveImg() {
            this.url = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(this.url);
            let path = '';
            await new Promise( (resolve,reject) => {
                    wx.downloadFile({
                        url: this.url, 
                        success: (res) => {
                            path =  res.tempFilePath;
                            resolve();
                        }
                    })
            } )
            wx.saveImageToPhotosAlbum({
                filePath: path,
                success: (res) => {
                    wx.showToast({
                        title: '保存成功，请在识别二维码关注公众号',
                        icon: 'none'
                    })
                },
                fail: (res) => {
                    wx.getSetting({
                        success: res => {
                            let authSetting = res.authSetting
                            if (!authSetting['scope.writePhotosAlbum']) {
                                wx.showModal({
                                    title: '提示',
                                    content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
                                    success(res) {
                                    if (res.confirm) {
                                        wx.openSetting()
                                    }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    },
    onShow(){
        const self = this;
        wx.getSystemInfo({
            success(system) {
                let statusBarHeight = system.statusBarHeight;
                let platformReg = /ios/i;
                let titleBarHeight = '';
                if (platformReg.test(system.platform)) {
                    titleBarHeight = 44;
                } else {
                    titleBarHeight = 48;
                }
                self.navBarHeight = statusBarHeight + titleBarHeight;
                console.log(self.navBarHeight)
            }
        });
    }
}
</script>
<style lang="less" scoped>
    img{
        width: 100%;
        height: 100%;
    }
</style>