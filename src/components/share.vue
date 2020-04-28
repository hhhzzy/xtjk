<template>
    <div class="share-box">
        <div class="left"><button open-type='share'>分享让更多人看到</button></div>
        <div class="right">
            <!-- <p class="list"><img src="../../static/images/wx.png" alt=""></p> -->
            <p class="list"><img src="../../static/images/pyq.png" @click="sharePyq" alt=""></p>
        </div>
        <div>
            <painter :customStyle="customStyle" @imgOK="onImgOk" :palette="imgDraw" />
        </div>
        <div class="share-img" v-if="showBool" @click="CloseImg">
            <img :src="imgUrl" alt="" v-if="imgUrl" style="width:340px;height:340px;"  @longpress="clickLong()">
        </div>
    </div>
</template>
<script>
import {imgBaseUrl} from '../utils/common.js'
export default {
    data(){
        return {
		    imgBaseUrl:imgBaseUrl,
            customStyle: 'position: absolute; top: -9999rpx;',
            imgDraw: {
                width: '680rpx',
                height: '680rpx',
                // background: imgBaseUrl+'api/service/upload/getImg?imgUrl='+'C:/workspace/th_api/source/appletCode.jpg',
                // borderRadius: '10px',
                views: [
                    {
                        type: 'image',
                        url: imgBaseUrl+'api/service/upload/getImg?imgUrl='+'C:/workspace/th_api/source/appletCode.jpg',
                        css: {
                            top: '0',
                            left: '40rpx',
                            width: '600rpx',
                            height: '600rpx'
                        }
                    },
                    {
                        type: 'text',
                        text: '长按保存图片，分享到朋友圈',
                        css: {
                            top: '620rpx',
                            left: '340rpx',
                            align: 'center',
                            fontSize: '28rpx',
                            color: '#3c3c3c'
                        }
                    }
                ]
            },
            imgUrl:'',
            showBool:false
        }
    },
    methods:{
        onImgOk (e) {
            this.imgUrl = e.mp.detail.path;
        },
        sharePyq(){
            this.showBool = true;
        },
        // 长按保存图片
        async clickLong(){
            let path = '';
            await new Promise( (resolve,reject) => {
                    wx.downloadFile({
                        url: this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+'C:/workspace/th_api/source/appletCode.jpg', 
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
                        title: '保存成功，请前往朋友圈分享',
                        icon: 'none'
                    })
                    this.showBool = false;
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
        },
        // 关闭分享图层
        CloseImg(){
            this.showBool = false;
        }
    }
}
</script>
<style lang="less" scoped>
.share-box{
    overflow: hidden;
    .left{
        background-image: url("../../static/images/矩形 2.png");
        background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
        width: 214px;
        height: 45px;
        float: left;
        font-size: 16px;
        color: #36D8A8;
        text-align: center;
        line-height: 45px;
        font-weight: 600;
        button{
            background-color: transparent;
            border:none;
            font-size: 16px;
            line-height: 45px;
            color: #36D8A8;
            text-align: center;
            font-weight: 600;
            &::after{
                border:none;
            }
        }
    }
    .right{
        float: right;
        p{
            height: 36px;
            width: 36px;
            margin-right: 20px;
            float: left;
            img{
                display: block;
                height: 36px;
                width: 36px;
            }
        }
    }
    .share-img{
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        z-index: 999;
        img{
            position: absolute;
            transform: translate(-50%,-50%);
            left: 50%;
            top: 50%;
        }
        .tip{
            text-align: center;
            font-size: 16px;
            color: #fff;
        }
    }
}
</style>