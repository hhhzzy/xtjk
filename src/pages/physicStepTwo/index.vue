<template>
    <div class="physic-step-box">
        <navbar :backVisible="true" :title="'测评'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <div class="bg">
            <img src="../../../static/images/cp-bg.jpg" alt="">
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
.physic-step-box{
    height: 100%;
}
.bg{
    img{
        display: block;
        width: 100%;
        height: 126px;
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