<template>
    <div class="physic-step-box">
        <navbar :backVisible="false" :title="'体质测评'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <div class="bg">
            <img src="../../../static/images/cp-bg.jpg" alt="">
             <p class="one">已完成</p>
            <p class="two">已完成</p>
            <p class="three">获取结果</p>
            <span class="point"></span>
        </div>
        <div class="content">
            <div class="icon">
                <img src="../../../static/images/yes.png" alt="">
            </div>
            <p class="title">恭喜您，已完成测试。</p>
            <div class="result">
                <p class="tit">测试结果：</p>
                <div class="content">
                    <span v-for="(item,index) in info" :key="index">{{index}}{{item?item+'0分':'0分'}}、</span> 
                </div>
            </div>
            <p class="get-result">针对您的体质，可在线调配适宜食补药物，<a href="../formula/main">点此获取</a></p>
            <div class="footer-box">
                <p class="begin-p" @click="finshCP">完成测试</p>
            </div>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import axios from '../../utils/request.js'
import Toast from '../../../static/vant/toast/toast'
export default {
    data(){
        return{
            memberEvaluationId:null,
            info:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        closeSexPopup(){
            this.sexShow = false;
        },
        showSexPopup(){
            this.sexShow = true;
        },
        onConfirm(event) {
            // const { picker, value, index } = event.detail;
            console.log(event.target.value)
            this.sexShow = false;
        },
        onCancel(){
            this.sexShow = false;
        },
        GetInfo(){
            axios({
                url:'api/evaluation/getEvaluationResult?memberEvaluationId='+Number(this.memberEvaluationId),
                method:'get'
            }).then( res => {
                console.log(res)
                if(res.data.code ==1){
                    this.info = res.data.data;
                }
            } )
        },
        finshCP(){
            mpvue.switchTab({ url:'../physicReview/main'});
        }
    },
    onShow(){
        this.GetInfo();
    },
    onLoad(options){
        console.log(options)
        this.memberEvaluationId = options.memberEvaluationId;
    }
}
</script>
<style lang="less" scoped>
.physic-step-box{
    height: 100%;
}
.bg{
    position: relative;
    img{
        display: block;
        width: 100%;
        height: 126px;
    }
    p{
        float: left;
        font-size: 12px;
        position: absolute;
        top: 85px;
        color: #fff;
        &:nth-of-type(1){
            left: 45px;
        }
        &:nth-of-type(2){
            left: 158px;
        }
        &:nth-of-type(3){
            right: 45px;
        }
    }
    .point{
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #4CDBC5;
        top: 66px;
        left: 182px;
        border-radius: 50%;
    }
    &::after{
        content: '';
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #4CDBC5;
        top: 66px;
        right: 65px;
        border-radius: 50%;
    }
    &::before{
        content: '';
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #4CDBC5;
        top: 66px;
        left: 65px;
        border-radius: 50%;
    }
}
.content{
    width: 323px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
    margin-top: -1px;
    overflow: hidden;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding-bottom: 50px;
}
.icon{
    text-align: center;
    margin-top: 20px;
    img{
        width: 76px;
        height: 76px;
    }
}
.title{
    font-size: 14px;
    color: #8D8D8D;
    margin-top: 10px;
    text-align: center;
}
.result{
    margin-top: 30px;
    padding: 0 25px;
    margin-bottom: 12px;
    .tit{
        font-size: 15px;
        color: #000000;
        margin-bottom: 8px;
    }
    .content{
        background-color: #F5F5F5;
        border-radius: 4px;
        padding: 5px 5px 20px 5px;
        width: 260px;
        min-height: 102px;
        p{
            font-size: 14px;
            color: #8D8D8D;
            line-height: 25px;
            height: 25px;
        }
    }
}
.get-result{
    margin:0 10px;
    font-size: 12px;
    color:#868686;
    margin-left: 20px;
    a{
        color: red;
        display: inline;    
    }
}
.footer-box{
    position: fixed;
    bottom: 10px;
    width: 345px;
    height: 45px;
    line-height: 45px;
    left: 15px;
    background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
    background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
    border-radius: 6px;
    p{
        text-align: center;
        font-size: 16px;
        color: #fff;
    }
}
</style>