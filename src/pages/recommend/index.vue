<template>
    <div class="recommend-box">
        <navbar :title="'我的推荐'"></navbar>
        <div class="detail">
            <p><em>我的推广账号：</em><i>{{user.memberPhone}}</i></p>
            <p><em>我的推广链接：</em>
            <!-- <i>{{link}}</i> -->
            <button class="share" open-type="share">立即邀请好友</button></p>
             <!-- <span @click="onShareAppMessage">复制</span>  -->
            <!-- <p><em>专属推荐二维码：</em> <img src="http://47.108.67.109/api/service/upload/getImg?imgUrl=C%3A%5Cworkspace%5Cth_management%5Cupload%5Cimg%5C1584688727161%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%AF%BC%E5%87%BA-20200320-151839.png" alt="">  <span @click="upload">下载图片</span></p> -->
        </div>
        <p class="title">
            团队消费
        </p>
        <div class="table use-table">
            <ul>
                <li class="li-title">
                    <p>年份</p>
                    <p>金额</p>
                </li>
                <li v-for="(item,index) in use" :key="index">
                    <p>{{index}}</p>
                    <p>{{item}}</p>
                </li>
            </ul>
        </div>
        <p class="title">
            推荐用户列表
        </p>
        <div class="table">
            <ul>
                <li class="li-title">
                    <p>序号</p>
                    <p>用户名</p>
                    <p>注册时间</p>
                </li>
                <li v-for="(item,index) in info" :key="index">
                    <p>{{index+1}}</p>
                    <p>{{item.nickName}}</p>
                    <p>{{item.createTime}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import store from '../../store'
import axios from '../../utils/request.js'
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
import { resolve } from 'url'
export default {
    data(){
        return{
            info:{},
            user:{},
            link:'这是链接',
            src:"../../../static/images/yzf.png",
            use:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        GetInfo(){
            axios({
                url: 'api/personal/getChildrenList?memberId='+store.state.user.userInfo.id+'&limit=100&offset=1',
                method: 'get'
            }).then( res => {
                if(res.data.rows){
                    this.info = res.data.rows;
                }
                console.log(res)
            } )
        },
        GetUse(){
            axios({
                url: 'api/personal/getTeamConsumList?memberId='+store.state.user.userInfo.id,
                method: 'get'
            }).then( res => {
                console.log(res);
                if(res.data.code == 1){
                    this.use = res.data.data;
                    console.log(this.use)
                }
            } )
        },
        // 复制
        copy(){
            // wx.setClipboardData({
            //     data: this.link,
            //     success: function (res) {
            //         console.log(res)
            //     }
            // })
        },
        // 下载图片
        async upload(){
            // let path = '';
            // await new Promise( (resolve,reject) => {
            //         wx.downloadFile({
            //             url: 'http://47.108.67.109/api/service/upload/getImg?imgUrl=C%3A%5Cworkspace%5Cth_management%5Cupload%5Cimg%5C1584688727161%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%AF%BC%E5%87%BA-20200320-151839.png', //仅为示例，并非真实的资源
            //             success: (res) => {
            //                 path =  res.tempFilePath;
            //                 resolve();
            //             }
            //         })
            // } )
            // wx.saveImageToPhotosAlbum({
            //     filePath: path,
            //     success: (res) => {
            //         wx.showToast({
            //             title: '保存成功',
            //             icon: 'none'
            //         })
                   
            //     },
            //     fail: (res) => {
            //         wx.getSetting({
            //             success: res => {
            //                 let authSetting = res.authSetting
            //                 if (!authSetting['scope.writePhotosAlbum']) {
            //                     wx.showModal({
            //                         title: '提示',
            //                         content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
            //                         success(res) {
            //                         if (res.confirm) {
            //                             wx.openSetting()
            //                         }
            //                         }
            //                     })
            //                 }
            //             }
            //         })
            //     }
            // })
        }
    },
    onShareAppMessage: (res) => {
        return {
            title: '健呗+',
            imageUrl: '', // 图片 URL
            path: "/pages/index/main?parentMemberId="+store.state.user.userInfo.id
        };
    },
    onShow(){
        this.GetInfo();
        this.GetUse();
        this.user = store.state.user.userInfo;
        console.log(this.user)
    }
}
</script>
<style lang="less" scoped>
.recommend-box{
    background-color: #fafafa;
    margin-bottom: 20px;
    .detail{
        padding: 10px;
        background-color: #fff;
        margin-top: 15px;
        width: 325px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid #F3F3F3;
        margin: 0 auto;
        margin-top: 15px;
        p{
            font-size: 16px;
            color: #B3B3B3;
            margin-bottom: 5px;
            overflow: hidden;
            em{
                float: left;
                font-style: normal;
            }
            span,.share{
                color: #51DDC2;
                background-color: #E0FEF8;
                display: inline-block;
                padding: 0;
                margin-left: 10px;
                display: inline-block;
                border:none;
                width: 102px;
                height: 25px;
                text-align: center;
                line-height: 25px;
                font-size: 14px;
                overflow: hidden;
                &::after{
                    border:none;
                    border-radius: 0;
                }
            }
            i{
                font-style: normal;
                width: 150px;
                overflow: hidden;
                color: #4D4D4D;
                float: left;
                margin-right: 5px;
            }
        }
    }
    .title{
        width: 315px;
        font-size: 17px;
        position: relative;
        height: 25px;
        line-height: 25px;
        position: relative;
        color: #000;
        font-weight: bold;
        padding: 10px 20px;
        padding-right: 10px;
        background-color: #ffffff;
        margin: 0 auto;
        &::before{
            content: '';
            position: absolute;
            display: block;
            width: 5px;
            height: 16px;
            background-color: #0099ff;
            left: 10px;
            background-image: url("../../../static/images/矩形.png");
            background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
            top: 15px;
        }
    }
    .table{
        background-color: #fff;
        padding: 30px 10px;
        width: 325px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        margin: 0 auto;
        ul{
            li{
                overflow: hidden;
                border-bottom: 1px solid #FFF7F7F7;
                border-left: 1px solid #FFF7F7F7;
                border-right: 1px solid #FFF7F7F7;
                height: 45px;
                line-height: 45px;
                &.li-title{
                    background-color: #F7F7F7;
                    p{
                        border: none;
                        color:#868686;
                    }
                }
                p{
                    width: 39%;
                    height: 45px;
                    line-height: 45px;
                    float: left;
                    font-size: 13px;
                    color: #000000;
                    text-align: center;
                    &:first-child{
                        width: 20%;
                    }
                    &:not(:last-child){
                        border-right: 1px solid #FFF7F7F7;
                    }
                }
            }
        }
    }
}
.use-table{
    ul{
        li{
            width: 100%!important;
            & {
                p:first-child{
                    width: 40%!important;
                }
            }
        }
    }
}
</style>