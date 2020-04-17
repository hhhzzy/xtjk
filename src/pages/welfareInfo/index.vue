<template>
    <div class="welfare-info-box">
        <navbar  :title="'详情'"></navbar>
        <div class="title-box">
            <p class="title">{{detail.activityTitle}}</p>
            <p class="time">{{detail.updateTime}}</p>
        </div>
        <div class="content-box">
            <p class="title">公益金支出情况</p>
            <p class="con">支出情况：￥{{detail.activityPrice / 1000}}</p>
            <!-- <p class="con">支出后余额：￥{{detail.afterPublicMoney / 1000}}</p> -->
        </div>
        <div class="detail-box">
            <img :src="detail.imgUrl" alt="">
            <wxParse :content="detail.content" />
        </div>
        <div class="share-box">
            <div class="left"><button open-type='share'>分享让更多人看到</button></div>
            <div class="right">
                <p class="list"><img src="../../../static/images/wx.png" alt=""></p>
                <p class="list"><img src="../../../static/images/pyq.png" alt=""></p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import wxParse from 'mpvue-wxparse'
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
		    imgBaseUrl:imgBaseUrl,
            id:'',
            detail:{}
        }
    },
    components: {
        wxParse,
        navbar
    },
    methods:{
        getDetail(){
            axios({
                url:'api/public/getPublicMessageDetail?id='+this.id,
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    console.log(res.data.data)
                   this.detail = res.data.data;
                //    this.detail.content = this.detail.content.replace(/<img src="/g,'<img src="'+ this.imgBaseUrl+'api/');
                    console.log(this.detail)
                   this.detail.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(this.detail.imgUrl);
                }
            } )
        }
    },
    onLoad(options){
        this.id = options.id;
        // 获取详情
        this.getDetail();
    }
}
</script>
<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.health-info-box{
    background-color: #ffffff;
    padding-bottom: 20px;
}
.title-box{
    padding: 0 10px;
    padding-bottom: 10px;
    .title{
        font-size: 17px;
        color: #000000;
        font-weight: bold;
        margin-bottom: 6px;
        margin-top: 10px;
    }
    .time{
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        margin-bottom: 14px;

    }
}
.content-box{
    padding: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
    width: 325px;
    margin: 0 auto;
    background-color:#cffbe7;
    p{
        font-size: 14px;
        color: #333;
        text-align: center;
        line-height: 25px;
    }
}
.detail-box{
    padding: 10px;
    /deep/ .wxParse{
        font-size: 14px;
        color: #333;
        line-height: 20px;
    }
    img{
        margin: 0 auto;
        width: 345px;
        display: block;
    }
    p{
        font-size: 14px;
        color: #666;
        line-height: 25px;
    }
}.share-box{
    overflow: hidden;
    .left{
        background-image: url("../../../static/images/矩形 2.png");
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
}
</style>