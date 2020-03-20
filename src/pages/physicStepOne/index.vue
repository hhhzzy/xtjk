<template>
    <div class="physic-step-box">
        <navbar :backVisible="true" :title="'体质测评'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <div class="bg">
            <img src="../../../static/images/cp-bg.jpg" alt="">
            <p class="one">信息收集</p>
            <p class="two">体质测评</p>
            <p class="three">获取结果</p>
        </div>
        <div class="content">
            <div class="step-box">
                <p class="title">开始前请先告知我们被测人的基本情况吧！</p>
            </div>
            <div class="form-box">
                <van-cell-group>
                        <van-field
                            label="姓名："
                            v-model="formData.evaluationName"
                            placeholder="请输入姓名"
                            @input="testName"
                        />
                        <van-field
                            label="性别："
                            readonly
                            icon="arrow"
                            v-model="formData.evaluationSex"
                            @click="showSexPopup"
                            placeholder="请选择性别"
                            @input="testSex"
                        />
                        <van-field
                            label="年龄："
                            v-model="formData.evaluationAge"
                            placeholder="请输入年龄"
                            @input="testAge"
                        />
                        <van-field
                            label="关系："
                            readonly
                            icon="arrow"
                            @click="showRelaPopup"
                            v-model="formData.evaluationRelationText"
                            placeholder="请选择关系"
                        />
                    </van-cell-group>
            </div>
        </div>
         <!-- 性别弹窗 -->
        <van-popup  :show="sexShow"  
                    position="bottom" >
            <van-picker :columns="sex"
                        show-toolbar
                        title="选择性别" 
                        @cancel="onCancel"
                        @confirm="onConfirm"  />
        </van-popup>
         <!-- 关系 -->
        <van-popup  :show="relaShow"  
                    position="bottom" >
            <van-picker :columns="relation"
                        show-toolbar
                        title="选择关系" 
                        @cancel="onCancel"
                        @confirm="onConfirmRela"  />
        </van-popup>
        <div class="footer-box">
            <p class="begin-p" @click="gotoNext">开始评测</p>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import Toast from '../../../static/vant/toast/toast';
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            steps: [
                    {
                        text: '信息收集'
                    },
                    {
                        text: '信息收集'
                    },
                    {
                        text: '评测结果'
                    },
                ],
            sex:['男','女'],
            sexShow:false,
            formData:{

            },
            relation:[],
            relationList:[],
            relaShow:false,
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
            this.formData.evaluationSex = event.target.value;
            this.sexShow = false;
        },
        onCancel(){
            this.sexShow = false;
            this.relaShow = false;
        },
        // 关系
        showRelaPopup(){
            this.relaShow = true;
        },
        onConfirmRela(event){
            this.formData.evaluationRelation = this.relationList[event.mp.detail.index].id
            this.formData.evaluationRelationText = event.target.value;
            this.relaShow = false;
        },
        closeRelaPopup(){
            this.relaShow = false;
        },
        testName(value){
            this.formData.evaluationName = value.mp.detail;
        },
        testAge(value){
            this.formData.evaluationAge = value.mp.detail;
        },
        // 添加测评信息
        gotoNext(){
            if(!this.formData.evaluationName || !this.formData.evaluationAge || !this.formData.evaluationRelation || !this.formData.evaluationSex){
                Toast.fail('以上数据必填');
                return;
            }
            this.formData.memberId = store.state.user.userInfo.id;
            axios({
                url:'api/evaluation/addEvaluation',
                method:'POST',
                data:this.formData
            }).then( res => {
                if(res.data.code ==1){
                    Toast({
                        type:'success',
                        message: '提交成功',
                        onClose: () => {
                            wx.setStorageSync('question',res.data.data);
                            mpvue.navigateTo({ url:'../physicStepTwo/main' });
                        }
                    })
                }
            } )
        }
    },
    mounted(){
        // 获取测评关系
        axios({
			url:'api/evaluation/getEvaluationRelation',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
                this.relationList = res.data.data;
                res.data.data.forEach(item => {
                    this.relation.push(item.dictionaryValue);
                });;
            }
		} )
    }
}
</script>
<style lang="less" scoped>
.physic-step-box{
    height: 100%;
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
            left: 158px;
        }
        &:nth-of-type(3){
            right: 42px;
        }
    }
    &::after{
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
.step-box{
    padding: 0 20px;
    border-bottom: 1px solid #f2f2f2;
    .title{
        font-size: 14px;
        color: rgba(141, 141, 141, 1);
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
.form-box{
    padding: 0 5px;
}
/deep/ .van-cell__title{
    font-size: 15px;
    color: rgba(0, 0, 0, 1);
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