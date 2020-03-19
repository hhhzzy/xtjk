<template>
    <div class="recommend-box">
        <navbar :title="'我的推荐'"></navbar>
        <div class="detail">
            <p><em>我的推广账号：</em><i>{{user.memberPhone}}</i></p>
            <p><em>我的推广链接：</em><i>{{link}}</i><span @click="copy">复制</span> </p>
            <p><em>专属推荐二维码：</em>  <span @click="upload">下载图片</span></p>
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
                <li v-for="(item,index) in info.rows" :key="index">
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
export default {
    data(){
        return{
            info:{},
            user:{},
            link:'这是链接',
            src:"../../../static/images/yzf.png"
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
                console.log(res);
                if(res.data.code == 1){
                    this.info = res.data.data;
                }
            } )
        },
        // 复制
        copy(){
            wx.setClipboardData({
                data: this.link,
                success: function (res) {
                    console.log(res)
                }
            })
        },
        // 下载图片
        upload(){
            // wx.downloadFile({
            //     url: this.src, //仅为示例，并非真实的资源
            //     success: (res) => {
            //         console.log(res)
            //         let image = res.tempFilePath;
            //     }
            // })
        }
    },
    onShow(){
        this.GetInfo();
        this.user = store.state.user.userInfo;
    }
}
</script>
<style lang="less" scoped>
.recommend-box{
    height: 100%;
    background-color: #f2f2f2f2;
    overflow: hidden;
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
            span{
                color: #51DDC2;
                background-color: #E0FEF8;
                display: inline-block;
                padding: 0 3px;
                margin-left: 10px;
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
</style>