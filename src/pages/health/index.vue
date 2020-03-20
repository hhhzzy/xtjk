<template>
    <div class="health-box">
        <navbar  :title="'健康咨询'"></navbar>
         <ul>
            <li v-for="(item,index) in healthList" :key="index">
                <a :href="'../healthInfo/main?id='+item.id">
                    <p>{{item.title}}</p>
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
		    imgBaseUrl:imgBaseUrl,
            healthList:[],
            limit:15,
            offset:1
        }
    },
  components: {
	navbar
  },
    methods:{
        
        // 获取健康资讯
        getNewsList(){
            axios({
                url:'api/document/getMessageList?messageType=1&limit='+this.limit+'&offset='+this.offset,
                method:'get'
            }).then( res => {
                if(res.data.rows){
                    this.healthList = this.healthList.concat(res.data.rows);
                    this.healthList = this.healthList.map( item => {
                        item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
                        return item;
                    });
                }
            } )
        },
    },
    onShow(){
        this.list = [];
        this.offset = 1;
        this.limit = 15;
        this.getNewsList();
    },
    onReachBottom () {
        this.offset++;
        this.getNewsList();

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
        height: 60px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);
        margin: 10px 0;
        p{
            font-size: 17px;
            color: #222222;
            float: left;
            width: 240px;
            font-weight: bold;
            width: 204px;
        }
        img{
            width: 80px;
            height: 65px;
            display: block;
            float: right;
            background-color: #f2f2f2;
        }
    }
}
</style>