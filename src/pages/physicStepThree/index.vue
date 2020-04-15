<template>
    <div class="physic-step-box">
        <navbar :backVisible="false" :title="'体质测评'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <div class="one-box">
            <div class="step-con">
                <p class="con">恭喜您，已完成测评！</p>
                <p class="step-p"><span></span></p>
                <p class="title">经过健呗测评，您的的体质主要是</p>
                <p class="main">{{name}}</p>
            </div>
        </div>
        <div class="content">
            <p class="main-title">体质分析得分</p>
            <div class="box">
                <ul v-if="info.length">
                    <li v-for="(item,index) in info" :key="index">
                        <span>{{item.key}}</span>
                        <i :style="{'width':item.value / 100 * 230+'px'}"></i>
                        <em>{{item.value}}</em>
                    </li>
                </ul>
                <p class="box-con" v-else>平和型体质是我们的追求目标，不偏不斜，体质较好，抵抗力充足，可保持现状，适度增强运动。</p>
                <p class="con">*每种偏颇质总分100分，分值越高，偏颇程度越严重！</p>
            </div>
        </div>
        <p class="tips">
            针对您的体质，可在线调配适宜食补药物，
            <a href="javascript:;" @click="gotoGet">点击获取》</a>
        </p>
        <div class="footer-box">
            <p class="begin-p" @click="finshCP">完成测试</p>
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
            info:[],
            name:''
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
                if(res.data.code ==1){
                    this.info = res.data.data;
                    const temp = [];
                    for( var key in this.info ){
                        temp.push({key:key,value:this.info[key]})
                    }
                    for( var i = 0; i < temp.length-1; i++ ){
                        for(var j = 0; j<temp.length-i-1;j++ ){
                            if(Number(temp[j].value)<Number(temp[j+1].value)){
                                //把大的数字放到后面
                                var swap = temp[j];
                                temp[j] = temp[j+1];
                                temp[j+1] = swap;
                            }
                        }
                    }
                    this.info = temp.filter( item => {
                        return Number(item.value) >= 32;
                    } );
                    this.name = this.info.length?this.info[0].key:'平和体质';
                    console.log(this.info)
                }
            } )
        },
        finshCP(){
            mpvue.switchTab({ url:'../physicReview/main'});
        },
        gotoGet(){
           mpvue.switchTab({ url:'../onlineFormulaUser/main'}); 
        }
    },
    onShow(){
        this.GetInfo();
    },
    onLoad(options){
        this.memberEvaluationId = options.memberEvaluationId;
    }
}
</script>
<style lang="less" scoped>
.physic-step-box{
    height: 100%;
}
.one-box{
    width: 345px;
    height: 188px;
    overflow: hidden;
    margin:0 auto;
    margin-top: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    background-color: #fff;
    border-radius: 8px;
    .step-con{
        width: 345px;
        height: 86px;
        border-radius: 8px;
        margin: 10px auto;
        margin-top: 40px;
        .con{
            text-align: center;
            color: #4CDBC5;
            font-size: 14px;
            margin-bottom: 10px;
        }
    }
    .step-p{
        width: 310px;
        height: 10px;
        background-color: rgba(245, 245, 245, 1);
        margin: 0 auto;
        border-radius: 5px;
        position: relative;
        margin-bottom: 20px;
        span{
            display: block;
            position: absolute;
            height: 10px;
            border-radius: 5px;
            background: -webkit-linear-gradient(left,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(right,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(right,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
            background: linear-gradient(to right,#82F4A3,#4CDBC5); /* 标准语法 */
            left: 0;
            top: 0;
            width: 310px;
            &::after{
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #fff;
                border:4px solid rgba(74, 219, 184, 1);
                position: absolute;
                top: -5px;
                right: 0;
            }
        }
    }
    .title{
        color: #606060;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
    }
    .main{
        color: #FCD017;
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        line-height: 42px;
    }
}
.content{
    width: 345px;
    margin: 0 auto;
    background-color: #fff;
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.11);
    margin-top: -1px;
    overflow: hidden;
    margin-top: 10px;
    border-radius: 8px;
    .main-title{
        font-size: 17px;
        position: relative;
        height: 25px;
        line-height: 25px;
        position: relative;
        color: #000;
        font-weight: bold;
        padding: 10px 20px;
        padding-right: 10px;
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
    .box{
        padding: 10px;
        margin-bottom: 10px;
        ul{
            li{
                overflow: hidden;
                line-height: 22px;
                margin-bottom: 14px;
                span{
                    color: #222222;
                    font-size: 15px;
                    float: left;
                }
                i{
                    width: 235px;
                    float: left;
                    display: block;
                    height: 13px;
                    background: -webkit-linear-gradient(top,#F9DA40,#F6C93C); /* Safari 5.1-6.0 */
                    background: -o-linear-gradient(bottom,#F9DA40,#F6C93C); /* Opera 11.1-12.0 */
                    background: -moz-linear-gradient(bottom,#F9DA40,#F6C93C);/* Firefox 3.6-15 */
                    background: linear-gradient(to bottom,#F9DA40,#F6C93C); /* 标准语法 */
                    margin: 0 5px;
                    margin-top: 5px;
                }
                em{
                    font-style: normal;
                    color: #B8B8B8;
                    font-size: 15px;
                    float: left;
                }
            }
        }
        .con{
            font-size: 13px;
            color: #B8B8B8;
            margin-top: 12px;
        }
    }
}
.box-con{
    color: #222222;
    font-size: 15px;
}
.tips{
    text-align: center;
    font-size: 13px;
    color: #606060;
    margin: 10px auto;
    a{
        color: red;
        display: inline;
    }
}

.footer-box{
    margin: 10px auto;
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