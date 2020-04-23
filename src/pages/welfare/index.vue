<template>
    <div class="welfare-box">
        <navbar :title="'爱心新闻'"></navbar>
        <ul>
            <li v-for="(item,index) in list" :key="index">
                <a :href="'../welfareInfo/main?id='+item.id">
                    <p>
                        <span>{{item.activityTitle}}</span>
                        <span class="two">{{item.subTitle}}</span>
                    </p>
                    <img :src="item.imgUrl" alt="">
                </a>
            </li>
            
        </ul>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            list:[],
            imgBaseUrl:imgBaseUrl,
            limit:8,
            offset:1
        }
    },
    components: {
        navbar
    },
    methods:{
         // 获取健康资讯
        getList(){
            wx.showLoading({
                title: '加载中',
            })
            axios({
                url:'api/public/getPublicMessageList?limit='+this.limit+'&offset='+this.offset,
                method:'get'
            }).then( res => {
                wx.hideLoading();
                if(res.data.rows){
                    this.list = this.list.concat(res.data.rows); 
                    this.list = this.list.map( item => {
                        item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
                        return item;
                    });
                }
            } )
        },
    },
    onShow(){
        this.list = [];
        this.getList();
    },
    onReachBottom () {
        this.offset++;
        this.getList();

    }
}
</script>
<style lang="less" scoped>
ul{
    padding: 10px;
    li{
        overflow: hidden;
        padding: 20px;
        width: 305px;
        height: 90px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
        margin: 10px 0;
        p{
            font-size: 17px;
            color: #222222;
            float: left;
            width: 240px;
            font-weight: bold;
            width: 204px;
            .two{
                font-size: 14px;
                display: block;
                font-weight: initial;
                height: 44px;
                overflow: hidden;
            }
        }
        img{
            width: 80px;
            height: 80px;
            display: block;
            float: right;
            background-color: #f2f2f2;
        }
    }
}
</style>