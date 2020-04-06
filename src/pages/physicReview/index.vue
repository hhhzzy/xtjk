<template>
    <div class="physic-box">
        <navbar :backVisible="false" :title="'体质测评'" ></navbar>
        <p class="tips">
           <img src="../../../static/images/notice.png" alt="">
           <span>
               本测试系统是根据国内著名专家团队多年的实践经验结合国家体质测试标准制定，请如实选择您的真实情况，以便于测试结果的准确性。
            </span> 
           </p>
        <a href="../condition/main" class="see-more">【调理建议】点此查看>></a>
        <div class="content">
            <div class="title-box">
                <p class="con">测评列表</p>
                <p class="add-p" @click="add">
                    添加测评
                </p>
            </div>
            <ul>
                <li v-for="(item,index) in list" :key="index" @longpress="clickLong(item.id)">
                    <p class="img">
                        <img src="" alt="">
                        <span>{{item.evaluationName}}</span>
                    </p>
                    <div class="right">
                        <div class="info">
                            <p class="year">{{item.evaluationAge}}岁</p>
                            <p class="sex">{{item.evaluationSex}}</p>
                        </div>
                        <div class="btn">
                            <p class="one" v-if="item.isFinish">去调理</p>
                            <p class="two" v-if="!item.isFinish" @click="add(item.isFinish,index)">继续测评</p>
                            <p class="two" v-else @click="add">重新评测</p>
                        </div>
                        <p class="clearfix"></p>
                        <p v-if="item.isFinish" class="title"><span v-for="(data,ind) in item.resultList" :key="ind">{{data.bodyTypeName}}{{data.score != '0'?data.score+'0分':'0分'}}、</span> </p>
                        <p v-else class="title">您还未测评完</p>
                    </div>
                </li>
            </ul>
        </div>
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import axios from '../../utils/request.js';
import store from '../../store';
import Toast from '../../../static/vant/toast/toast';
import {imgBaseUrl} from '../../utils/common.js';
import navbar from '../../components/navbar';
import Dialog from '../../../static/vant/dialog/dialog';
export default {
    data(){
        return{
            list:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        getList(){
            axios({
                url: 'api/evaluation/getEvaluationList?memberId='+Number(store.state.user.userInfo.id),
                method: 'get',
            }).then( res => {
                console.log(res.data.data)
                if(res.data.data){
                    this.list = res.data.data.map( item => {
                        if(item.resultList){
                            const temp = item.resultList;
                            for( var i = 0; i < temp.length-1; i++ ){
                                for(var j = 0; j<temp.length-i-1;j++ ){
                                    if(Number(temp[j].score)>Number(temp[j+1].score)){
                                        //把大的数字放到后面
                                        var swap = temp[j];
                                        temp[j] = temp[j+1];
                                        temp[j+1] = swap;
                                    }
                                }
                            }
                            item.resultList = temp;
                        }
                        return item;
                    } );
                    
                }
            })
        },
        // 添加测评
        add(value,index){
            if(value){
                mpvue.navigateTo({ url:'../physicStepOne/main' });
            }else {
                this.list[index].nextQuestion.memberEvaluationId=this.list[index].id;
                wx.setStorageSync('question',this.list[index].nextQuestion);
                mpvue.navigateTo({ url:'../physicStepTwo/main' });
            }
           
        },
        // 长按
        clickLong(id){
            console.log(11111)
            Dialog.confirm({
                title: '提示',
                message: '是否删除该条测评？删除后不可恢复！'
            })
            .then(() => {
                axios({
                    url: 'api/evaluation/deleteEvaluation?memberEvaluationId='+id,
                    method: 'get',
                }).then( res => {
                    console.log(res)
                    this.getList();
                })
            })
        }
    },
    mounted(){
        
    },
    onShow(){
        this.getList();
    }
}
</script>
<style lang="less" scoped>
.physic-box{
    background-color: #fafafa;
    height: 100%;
}
.tips{
    background-color: #ffffff;
    width: 345px;
    margin: 10px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    height: 84px;
    padding-top: 15px;
    padding-right: 10px;
    overflow: hidden;
    img{
        width: 15px;
        height: 15px;
        margin-left: 16px;
        float: left;
        margin-right: 5px;
        margin-top: 3px;
    }
    span{
        width: 294px;
        display: block;
        float: left;
        color: rgba(141, 141, 141, 1);
        font-size: 14px;
    }
}
.see-more{
    color: rgba(235, 1, 1, 1);
    font-size: 14px;
    padding:0 10px ;
    margin: 12px 0;
}
.content{
    background-color: #fff;
    width: 324px;
    margin: 0 auto;
    padding: 0 15px;
    padding-bottom: 17px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    margin-bottom: 20px;
}
.title-box{
    font-size: 17px;
	position: relative;
    height: 56px;
    line-height: 56px;
    position: relative;
    padding-left: 20px;
    color: #000;
    font-weight: bold;
    border-bottom: 1px solid #F5F5F5;
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
        top: 20px;
    }
    .con{
        float: left;
        font-size: 14px;
        color: #333;
    }
    .add-p{
        float: right;
        font-size: 13px;
        color: #fff;
        width: 76px;
        height: 28px;
        margin-top: 15px;
        background-color: #4CDBC5;
        text-align: center;
        line-height: 30px;
    }
}
ul{
    li{
        padding: 10px 0 10px 10px;
        background-color: #fff;
        height: 115px;
        margin-bottom: 5px;
        border-bottom: 1px solid #F5F5F5;
        .img{
            overflow: hidden;
            text-align: center;
            float: left;
            height: 95px;
            padding-right: 10px;
            padding-top: 10px;
            img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: block;
                background-color: red;
                margin-bottom: 5px;
            }
            span{
                font-size: 14px;
                color: #333;
                width: 50px;
                display: block;

            }
        }
        .right{
            float: left;
            width: calc( 100% - 70px );
            padding: 0 0 0 10px;
            .info{
                float: left;
                p{
                    position: relative;
                    padding-left: 40px;
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 10px;
                    &::before{
                        content: '';
                        display: block;
                        background-color: rgba(215, 215, 215, 1);
                        width: 17px;
                        height: 17px;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    &:first-child::before{
                        background-color: #FFEFC8;
                    }
                    &:nth-of-type(2)::before{
                        background-color: #CDF8EE;
                    }
                    &:nth-of-type(3)::before{
                        background-color: #FFDFDF;
                    }
                }
                .year{
                    margin-top: 5px;
                }
            }
            .btn{
                float: right;
                p{
                    width: 52px;
                    height: 25px;
                    text-align: center;
                    line-height: 25px;
                    font-size: 12px;
                    color: #fff;
                }
                .one{
                    background-color: #F6C93C;
                    margin-bottom: 5px;
                }
                .two{
                    background-color: #7ED0F7;
                }
            }
            .clearfix{
                clear: both;
            }
            .title{
                    position: relative;
                    padding-left: 40px;
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 10px;
                    height: 44px;
                    overflow: hidden;
                    &::before{
                        content: '';
                        display: block;
                        background-color: rgba(215, 215, 215, 1);
                        width: 17px;
                        height: 17px;
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
        }
    }
}
</style>