<template>
    <div class="health-info-box">
        <navbar  :title="'详情'"></navbar>
        <div class="title-box">
            <p class="title">{{detail.title}}</p>
            <p class="time">{{detail.updateTime}}</p>
        </div>
        <div class="detail-box">
            <wxParse :content="detail.content" :imageProp="imageProp" />
        </div>
        <share></share>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import wxParse from 'mpvue-wxparse'
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
import share from '../../components/share'
export default {
    data(){
        return{
		    imgBaseUrl:imgBaseUrl,
            id:'',
            detail:{},
            imageProp:{
                mode:'widthFix'
            }
        }
    },
    components: {
        wxParse,
        navbar,
        share
    },
    methods:{
        getDetail(){
            axios({
                url:'api/document/getNewsMessageDetail?id='+this.id,
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                   this.detail = res.data.data;
                   this.detail.content = this.detail.content.replace(/<img src="/g,'<img src="'+ this.imgBaseUrl+'api/');
                   this.detail.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(this.detail.imgUrl);
                   console.log(this.detail)
                }
            } )
        },
    },
    onLoad(options){
        console.log(options)
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
}


</style>