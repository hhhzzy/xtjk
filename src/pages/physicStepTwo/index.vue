<template>
    <div class="physic-step-box">
        <navbar :backVisible="true" :title="'体质测评'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <!-- <div class="bg">
            <img src="../../../static/images/cp-bg.jpg" alt="">
            <p class="one">已完成</p>
            <p class="two">{{qIndex}}/{{question.totalCount}}</p>
            <p class="three">获取结果</p>
        </div>
        <div class="content">
            <div class="step-box">
                <p class="title">请根据被测人情况如实回答哟。</p>
            </div>
            <div class="form-box">
                <p class="question-title">{{qIndex}}.{{question.questionTitle}}</p>
                <van-radio-group :value="radio">
                    <van-cell-group v-for="(item,index) in question.optionList" :key="index">
                        <van-cell
                            :title="item.questionOption"
                            clickable
                            :data-name="item.name"
                            @click="onClick"
                        >
                            <van-radio slot="right-icon" :name="item.name" 
                            checked-color="#4CDBC5" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="footer-box">
                <p :class="['begin-p',boolBtn?'current':'']" @click="gotoNext">{{btnText}}</p>
            </div>
        </div> -->
        <div class="question-box">
            <scroll-view>
                <div class="list" v-for="(item,index) in questionList">
                    <div class="question-title">
                        <p class="head-img"><img src="../../../static/images/user.png" alt=""></p>
                        <div class="question">你的性别是什么？</div>
                    </div>
                    <div :class="['answer-list',item.show?'animante-show':'']">
                        <ul>
                            <li @click="clkAnswer(index)">男</li>
                            <li>女</li>
                        </ul>
                    </div>
                    <div :class="['question-answer',item.show?'animante-show':'answer-hide']">
                        <p class="name">
                            <span>男男男男男男男男男男男男男男男男男男男男男男男男男男男男男</span>
                            <van-icon name="edit" @click="closeShow(index)" />
                        </p>
                        <p class="head-img">
                            <img src="../../../static/images/user.png" alt="">
                        </p>
                    </div>
                </div>
            </scroll-view>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import navbar from '../../components/navbar'
import Toast from '../../../static/vant/toast/toast'
export default {
    data(){
        return{
            sex:['男','女'],
            sexShow:false,
            radio: 114,
            qIndex:1,
            question:{},
            boolBtn:false,  // 是否提交
            formData:{},
            btnText:'下一题',
            answerBool:false,
            aaa:false,
            questionList:[
                {
                    show:false
                },
                {
                    show:false
                },
                {
                    show:false
                }
            ]
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
            this.sexShow = false;
        },
        onCancel(){
            this.sexShow = false;
        },
        onClick(event) {
            const { name } = event.mp.currentTarget.dataset;
            this.radio = name;
            this.formData.evaluationOptionId = Number(name);
            this.boolBtn = true;
        },
        gotoNext(){
            this.formData.memberId = store.state.user.userInfo.id;
            this.formData.evaluationQuestionId = this.question.id;
            this.formData.isEnd = this.question.isEnd;
            if(!this.formData.evaluationOptionId){
                Toast.fail('请选择答案');
                return;
            }
            if(!this.boolBtn){
                return;
            }
            axios({
                url:'api/evaluation/addMemberEvaluationAnswer',
                method:'POST',
                data:this.formData
            }).then( res => {
                console.log(res)
                if(res.data.code ==1){
                    if(res.data.msg == '提交成功'){
                        mpvue.navigateTo({ url:'../physicStepThree/main?memberEvaluationId='+ this.formData.memberEvaluationId});
                    } else {
                        this.question = res.data.data;
                        this.question.optionList = this.question.optionList.map(item => {
                            item.name = String(item.id);
                            return item;
                        });
                        this.qIndex++;
                        this.boolBtn = false;
                    }
                } else {
                    Toast.fail(res.data.msg);
                }
            } )

        },
        // 点击答案
        clkAnswer(index){
            this.questionList[index].show = true;
        },
        // 展示答案
        closeShow(index){
            console.log(11)
            this.questionList[index].show = false;
        }
    },
    mounted(){
        console.log(this.question)
    },
    onShow(){
        this.formData.memberEvaluationId = wx.getStorageSync('question').memberEvaluationId;
        this.question = wx.getStorageSync('question');
        this.question.optionList = this.question.optionList.map(item => {
            item.name = String(item.id);
            return item;
        });
        this.qIndex = this.question.nowQuestionNumber?this.question.nowQuestionNumber:1;
    },
}
</script>
<style lang="less" scoped>
.question-box{
    margin: 0 10px;
    height: 80%;
    scroll-view{
        height: 100%;
    }
    .list{
        overflow: hidden;
        margin-bottom: 10px;
    }
    .question-title{
        overflow: hidden;
        width: 100%;
        .head-img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            float: left;
            img{
                width: 50px;
                height: 50px;
            }
        }
        .question{
            float: left;
            margin-left: 10px;;
            width: calc( 100% - 50px - 10px - 20px );
            background-color: #fff;
            padding: 8px 8px;
            border-radius: 15px;
            font-size: 14px;
            margin-top: 8px;
            position: relative;
            &::after{
                content: '';
                display: block;
                position: absolute;
                border-right: 5px solid #fff;
                border-bottom: 5px solid transparent;
                border-top: 5px solid transparent;
                left: -4px;
                top: 14px;

            }
        }
    }
    .answer-list{
       position: relative;
       z-index: 99;
       overflow: hidden;
        ul{
            background-color: #fff;
            margin: 15px auto;
            padding: 10px;
            width: 335px;
            border-radius: 15px;
            opacity: 1;
            position: relative;
            right: 0;
            top: 0;
            min-height: 125px;
            transition: all linear 0.35s;
            overflow: hidden;
            li{
                height: 35px;
                line-height: 35px;
                border-radius: 15px;
                text-align: center;
                border:1px solid red;
                color: red;
                margin: 10px 0;
                font-size: 14px;
            }
        }
        &.animante-show{
            z-index: 98;
            position: absolute;
            ul{
                transform-origin: 300px 0;
                transform: scale(0);
            }
            li{
                display: none;
            }
        }
    }
    .question-answer{
        float: right;
        position: absolute;
        z-index: 98;
        opacity: 0;
        margin-top: 10px;
        transition: all linear 0.3s;
        overflow: hidden;
        display: block;
        .name{
            background-color: rgb(77,200,1);
            width: calc( 100% - 50px - 10px - 20px );
            display: inline-block;
            padding: 8px 10px;
            border-radius: 15px;
            font-size: 14px;
            min-width: 30px;
            float: left;
            margin-right: 10px;
            position: relative;
            margin-top: 8px;
            transition: all linear 0.001s;
            transition-delay: 0.5s;
            transform: scale(0);
            opacity: 0;
            &::after{
                content: '';
                display: block;
                position: absolute;
                border-left: 5px solid rgb(77,200,1);
                border-bottom: 5px solid transparent;
                border-top: 5px solid transparent;
                right: -4px;
                top: 14px;

            }
            /deep/ van-icon{
                font-size: 18px;
                margin-left: 10px;
            }
        }
        .head-img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            float: left;
            transition: all  linear 0.35s;
            transition-delay: 0.1s;
            position: absolute;
            top: 20px;
            right: 0;
            img{
                width: 50px;
                height: 50px;
            }
        }
        &.animante-show{
            z-index: 99;
            position: relative;
            opacity: 1;
            .name{
                opacity: 1;
                transform: scale(1);
                transform-origin: 300px 0;
            }
            .head-img{
                top: 0;
            }
        }
    }
    .answer-hide{
        height: 0;
    }
}



.physic-step-box{
    height: 100%;
    background-color: #f2f2f2;
}
.bg{
    position: relative;
    margin-top: -1px;
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
            left: 42px;
        }
        &:nth-of-type(2){
            left: 172px;
        }
        &:nth-of-type(3){
            right: 42px;
        }
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
    &::after{
        content: '';
        display: block;
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #4CDBC5;
        top: 66px;
        left: 182px;
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
.step-box{
    padding: 0 20px;
    .title{
        font-size: 14px;
        color: rgba(141, 141, 141, 1);
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
.form-box{
    padding: 0 5px;
    .question-title{
        font-size: 15px;
        color: #000000;
        width: 286px;
        margin-left: 15px;
        line-height: 21px;
        padding: 10px 0;
        border-bottom: 1px solid #F5F5F5;
    }
    /deep/ .van-hairline--top-bottom:after {
        border-width:0px;
    }
    /deep/ .van-cell:after{
        right: 15px;
    }

}

.footer-box{
     position: fixed;
    bottom: 10px;
    width: 345px;
    height: 45px;
    line-height: 45px;
    left: 15px;
    background: -webkit-linear-gradient(top,#EBE8E8,#C9C9C9); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(bottom,#EBE8E8,#C9C9C9); /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(bottom,#EBE8E8,#C9C9C9);/* Firefox 3.6-15 */
    background: linear-gradient(to bottom,#EBE8E8,#C9C9C9); /* 标准语法 */
    border-radius: 6px;
    p{
        text-align: center;
        font-size: 16px;
        color: #fff;
    }
    .current{
        background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
    }
}
</style>