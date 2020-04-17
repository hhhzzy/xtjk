<template>
    <div class="health-box">
        <navbar  :title="'健康资讯'"></navbar>
         <ul>
            <li v-for="(item,index) in healthList" :key="index">
                <a :href="'../healthInfo/main?id='+item.id">
                    <p>
                        <span>{{item.title}}</span>
                        <span class="two">{{item.sub_title}}</span>
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
		    imgBaseUrl:imgBaseUrl,
            healthList:[],
            limit:15,
            offset:1,
            total:null
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
                this.total = res.data.total;
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
        this.healthList = [];
        this.offset = 1;
        this.limit = 15;
        this.getNewsList();
    },
    onReachBottom () {
        if(this.total == this.healthList.length) return;
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