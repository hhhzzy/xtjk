<template>
    <div class="team-box">
        <navbar :title="'明星榜'"></navbar>
         <ul>
            <li v-for="(item,index) in teamList" :key="index">
                <a :href="'../teamInfo/main?id='+item.id">
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
            teamList:[],
            limit:8,
            offset:1,
            total:null
        }
    },
    components: {
        navbar
    },
    methods:{
        
        // 获取名医团队
        getTeamList(){
            axios({
                url:'api/document/getMessageList?messageType=2&limit='+this.limit+'&offset='+this.offset,
                method:'get'
            }).then( res => {
                this.total = res.data.total;
                if(res.data.rows){
                    this.teamList = this.teamList.concat(res.data.rows);
                    this.teamList = this.teamList.map( item => {
                        item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
                        return item;
                    });
                }
            } )
        },
    },
    mounted(){
        
    },
    onShow(){
        this.teamList = [];
        this.getTeamList();
    },
    onReachBottom () {
        if(this.total == this.teamList.length) return;
        this.offset++;
        this.getTeamList();

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
        height: 107px;
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
            width: 100px;
            height: 110px;
            display: block;
            float: right;
            background-color: #f2f2f2;
        }
    }
}
</style>