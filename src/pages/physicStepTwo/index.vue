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
        <div class="step">
            <div class="step-con">
                <p class="title">完成进度{{stepOne*10000/100}}%，还有{{stepTwo}}道题。</p>
                <p class="step-p"><span :style="{'width':stepOne*310+'px'}"></span></p>
            </div>
        </div>
        <div class="question-box">
            <scroll-view scroll-y="true" :scroll-into-view="scrollInView"  scroll-with-animation>
                <!-- <div class="list list-show" v-for="(item,index) in oldQuestion" v-if="oldQuestion.length" :key="index">
                    <div class="question-title">
                        <p class="head-img"><img src="../../../static/images/user.png" alt=""></p>
                        <div class="question title-show">
                            <span>{{item.questionTitle}}</span> 
                        </div>
                    </div>
                    <div class="question-content question-content-show">
                        <div class="question-answer animante-show">
                            <p class="name">
                                <span>{{item.questionOption}}</span>
                                <van-icon name="edit" @click="closeShow(index)" />
                            </p>
                            <p class="head-img">
                                <img :src="userInfo.imgUrl" alt="">
                            </p>
                        </div>
                    </div>
                </div> -->
                <div :class="['list',item.opacity == '1'?'list-show':'']" v-for="(item,index) in questionList" :key="index" :id="item.scrollId" >
                    <div :class="[item.scrollId == nowId?'question-container':'']">
                        <div :class="['question-title',item.show?'animante-show':'']">
                            <p class="head-img"><img src="../../../static/images/user.png" alt=""></p>
                            <div :class="['question',index == 0 || !item.loading?'title-show':'']">
                                <span  v-if="index == 0 || !item.loading">{{item.questionTitle}}</span> 
                            </div>
                            <p class="loading" v-if="index != 0 && item.loading"><img src="../../../static/images/loading.gif" alt=""></p>
                        </div>
                        <div :class="['question-content',index == 0 || !item.loading?'question-content-show':'']">
                            <div :class="['answer-list',item.show?'animante-show':'']">
                                <ul>
                                    <li :class="[data.current ? 'current' : '']" @click="clkAnswer(index,data.id,data.questionOption,item)" v-for="(data,ind) in item.optionList"  :key="ind">{{data.questionOption}}</li>
                                </ul>
                            </div> 
                            <div :class="['question-answer',item.show?'animante-show':'answer-hide']">
                                <p class="name">
                                    <span>{{item.answerDetail}}</span>
                                    <van-icon name="edit" @click="closeShow(index)" />
                                </p>
                                <p class="head-img">
                                    <!-- <img src="../../../static/images/user.png" alt=""> -->
                                    <img :src="userInfo.imgUrl" alt="">
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="finsh-box"  id="finsh" v-if="finsh">
                    <img src="../../../static/images/yes.png" alt="">
                    <p class="title">恭喜您，已完成测试</p>
                    <a href="javascript:;" @click="gotoDetail">立即查看结果</a>
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
import { resolve } from 'url'
import { rejects } from 'assert'
export default {
    data(){
        return{
            sex:['男','女'],
            sexShow:false,
            radio: 114,
            qIndex:0, // 当前第几道题
            nowIndex:0, // 数组中第几题了
            question:{},
            boolBtn:false,  // 是否提交
            formData:{},
            btnText:'下一题',
            answerBool:false,
            questionList:[],
            scrollInView:'',
            nowId:'',
            boolNotFir:false,
            a:1,
            scrollTop:0,
            stepOne:1,
            stepTwo:null,
            finsh:false,
            userInfo:{},
            timer1:null,
            timer2:null,
            oldQuestion:[]
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
        async gotoNext(){
            this.a = this.a +1;
            let bool = false;
            bool = await new Promise( (resolve,reject) => {
                this.formData.memberId = store.state.user.userInfo.id;
                this.formData.evaluationQuestionId = this.question.id ? this.question.id : this.question.evaluationQuestionId;
                this.formData.isEnd = this.question.isEnd ? this.question.isEnd : 0;
                if(!this.formData.evaluationOptionId){
                    Toast.fail('请选择答案');
                    return;
                }
                axios({
                    url:'api/evaluation/addMemberEvaluationAnswer',
                    method:'POST',
                    data:this.formData
                }).then( res => {
                    if(res.data.code ==1){
                        if(res.data.data == 1){
                            // 获取测评结果
                            axios({
                                url:'api/evaluation/getEvaluationResult?memberEvaluationId='+ this.formData.memberEvaluationId,
                                method:'get'
                            })
                            this.stepOne = 1;
                            this.finsh = true;
                            this.scrollInView = 'finsh';
                            this.stepTwo = 0;
                        } else {
                            if(res.data.data != '0'){
                                this.question = res.data.data;
                                wx.setStorageSync('question',res.data.data);
                                this.question.optionList = this.question.optionList.map(item => {
                                    item.name = String(item.id);
                                    return item;
                                });
                                this.question.show = false;
                                this.question.scrollId = 'scroll_'+this.question.id;
                                this.question.opacity = '0';
                                this.question.loading = true;
                                // 删除后面的答题，从新开始
                                // this.questionList = this.questionList.filter( (item,index) => {
                                //     return this.nowIndex >= index;
                                // } )
                                this.questionList.push(this.question);

                                // 进度条改变
                                this.stepOne = ((this.qIndex - 1) / this.question.totalCount).toFixed(4);
                                this.stepTwo = this.question.totalCount - this.qIndex + 1;
                                
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                            clearTimeout(this.timer1);
                            clearTimeout(this.timer2);
                        }
                    } else {
                        Toast.fail(res.data.msg);
                    }
                } )
            } )
            return bool;
        },
        // 点击答案
        async clkAnswer(index,evaluationOptionId,detail,item){
            this.nowIndex = index;
            // 调用提交函数
            this.formData.evaluationOptionId = Number(evaluationOptionId);
            // 把答案保存在本地
            this.questionList[index].answerDetail = detail.split('、')[1];
            // 修改当前的题目
            this.question = item;
            this.qIndex++;
            let bool = await this.gotoNext();
            if(index <= this.questionList.length && bool){
                this.questionList[index].show = true;
                this.nowId = !this.boolNotFir ? this.questionList[index+1].scrollId : '';
                this.boolNotFir = this.boolNotFir ? false : false;
                
                this.questionList[index+1].opacity = 1;
                this.timer1 = setTimeout( () => {
                    this.scrollInView = this.questionList[index+1].scrollId;
                }, 1000 )
                this.timer2 = setTimeout( () => {
                    const obj = Object.assign({},this.questionList[index+1]);
                    this.questionList.splice(index+1,1);
                    this.$set(obj,'loading',false)
                    this.questionList[index+1] = obj;
                },1500 )
            } else {
                this.questionList[index].show = true;
                this.questionList = [...this.questionList];
            }
        },
        // 展示答案
        closeShow(index){
            this.questionList[index].show = false;
            this.boolNotFir = true;
            let text = this.questionList[index].answerDetail;
            // 答案高亮
            this.questionList[index].optionList = this.questionList[index].optionList.map( (item,index) => {
                if(item.questionOption.indexOf(text) >= 0){
                    item.current = true;
                } else {
                    item.current = false;
                }
                return item;
            } )
        },
        gotoDetail(){
            mpvue.navigateTo({ url:'../physicStepThree/main?memberEvaluationId='+ this.formData.memberEvaluationId});
        },
        getUserInfo(){
            // 获取用户信息
            axios({
                url: 'api/personal/getMemberInfo?memberId='+store.state.user.userInfo.id,
                method: 'get',
                data:{
                    memberId:store.state.user.userInfo.id
                }
            }).then( data => {
                if(data.data.code == 1){
                    this.userInfo = data.data.data;
                }
            } )
        },
    },
    mounted(){
        console.log(this.question)
    },
    onShow(){
        // 重置
        this.questionList = [];
        this.finsh = false;
        this.oldQuestion = [];

        this.oldQuestion = wx.getStorageSync('oldQuestion') ? wx.getStorageSync('oldQuestion'):[];
        if(this.oldQuestion.length){
            this.oldQuestion = this.oldQuestion.map( item => {
                item.answerDetail = item.questionOption.split('、')[1];

                item.show = true;
                item.scrollId = 'scroll_'+item.evaluationQuestionId;
                item.opacity = '1';
                item.loading = false;
                return item;
            } )
        }
        console.log(this.oldQuestion)
        this.formData.memberEvaluationId = wx.getStorageSync('question').memberEvaluationId;
        this.question = wx.getStorageSync('question');
        this.question.optionList = this.question.optionList.map(item => {
            item.name = String(item.id);
            return item;
        });
        this.qIndex = this.question.nowQuestionNumber?this.question.nowQuestionNumber:1;

        this.question.show = false;
        this.question.scrollId = 'scroll_'+this.question.id;
        this.question.opacity = '1';
        this.question.loading = false;
        
        setTimeout( () => {
            this.scrollInView = 'scroll_'+this.question.id;
        }, 100)
        this.questionList = this.questionList.concat(this.oldQuestion);

        this.questionList.push(this.question);
        console.log(this.questionList)
        // 进度条改变
        this.stepOne = ((this.qIndex - 1) / this.question.totalCount).toFixed(4);
        this.stepTwo = this.qIndex == 1? this.question.totalCount : this.question.totalCount - this.qIndex + 1;
        this.getUserInfo();
    },
}
</script>
<style lang="less" scoped>
.step{
    width: 100%;
    position: fixed;
    top: 70px;
    left: 0;
    z-index: 999;
    background-color: #fafafa;
    .step-con{
        width: 345px;
        height: 86px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        margin: 10px auto;
        overflow: hidden;
        background-color: #fff;
    }
    .title{
        color: rgba(109, 109, 109, 1);
        font-size: 15px;
        text-align: center;
        margin: 15px 0;
    }
    .step-p{
        width: 310px;
        height: 10px;
        background-color: rgba(245, 245, 245, 1);
        margin: 0 auto;
        border-radius: 5px;
        position: relative;
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
            min-width: 10px!important;
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
}
.finsh-box{
    width: 345px;
    height: 255px;
    background-color: #fff;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    overflow: hidden;
    img{
        width: 76px;
        height: 76px;
        display: block;
        margin: 0 auto;
        margin-top: 36px;
    }
    .title{
        text-align: center;
        color: #222222;
        font-size: 15px;
        margin-top: 12px;
        margin-bottom: 30px;
    }
    a{
        width: 320px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
        border-radius: 22px;
        margin: 0 auto;
    }
}
.question-box{
    margin: 10px;
    height: 100%;
    background-color: #FAFAFA;
    margin-top: 110px;
    scroll-view{
        height: 500px;
    }
    .list{
        overflow: hidden;
        margin-bottom: 10px;
        transform: translateY(50px);
        opacity: 0;
        transition: transform ease 0.3s,opacity ease 0.3s;
        transition-delay: 0.2s;
    }
    .list-show{
        transform: translateY(0);
        opacity: 1;
    }
    .loading{
        position: absolute;
        z-index: 100;
        left: 55px;
        top: 0;
        background-color: #FAFAFA;
        width: 100%;
        img{
            width: 50px;
            height: 50px;
        }
    }
    .question-title{
        overflow: hidden;
        width: 100%;
        position: relative;
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
            border-radius: 3px;
            font-size: 14px;
            margin-top: 8px;
            position: relative;
            transition: all linear 0.35s;
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
            &::before{
                content: "";
                display: block;
                background-color: #FAFAFA;
                height: 100%;
                width: 100%;
                position: absolute;
                left: -5px;
                top: 0;
                transition: left ease 0.5s;
                z-index: 99;
            }
            &.title-show::before{
                left: 500px;
            }
        }
    }
    .question-content{
        opacity: 0;
        transform: translateY(400px);
        transition: all ease 0.5s;
    }
    .question-content-show{
        opacity: 1;
        transform: translateY(0);
    }
    .question-container{
        height: 538px;
    }
    .answer-list{
        position: relative;
        z-index: 99;
        overflow: hidden;
        border-radius: 8px;
        ul{
            background-color: #fff;
            margin: 15px auto;
            padding: 10px;
            width: 335px;
            border-radius: 8px;
            opacity: 1;
            position: relative;
            right: 0;
            top: 0;
            min-height: 125px;
            transition: all linear 0.35s;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
            li{
                height: 44px;
                line-height: 44px;
                border-radius: 22px;
                text-align: center;
                background-color: #D7D7D7;
                color: #fff;
                margin: 15px 0;
                font-size: 14px;
                &.current{
                    background: -webkit-linear-gradient(top,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Safari 5.1-6.0 */
                    background: -o-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Opera 11.1-12.0 */
                    background: -moz-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1));/* Firefox 3.6-15 */
                    background: linear-gradient(to bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* 标准语法 */
                }
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
            background: -webkit-linear-gradient(top,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1));/* Firefox 3.6-15 */
            background: linear-gradient(to bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* 标准语法 */
            width: calc( 100% - 50px - 10px - 20px );
            display: inline-block;
            padding: 8px 10px;
            border-radius: 3px;
            font-size: 15px;
            margin-right: 60px;
            position: relative;
            margin-top: 8px;
            transition: all linear 0.001s;
            transition-delay: 0.5s;
            transform: scale(0);
            opacity: 0;
            color: #fff;
            line-height: 21px;
            min-width: 35px;
            display: block;
            white-space: nowrap;
            &::after{
                content: '';
                display: block;
                position: absolute;
                border-left: 5px solid rgba(130, 244, 163, 1);
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
    // height: 100%;
    background-color: #FAFAFA;
    overflow: hidden;
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