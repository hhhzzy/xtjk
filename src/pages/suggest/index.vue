<template>
    <div class="suggest-box">
        <navbar :backVisible="true" :title="'投诉建议'"></navbar>
        <p class="tips">意见反馈   （让我们更好）</p>
        <van-cell-group>
            <van-field
                label="联系人："
                placeholder="请输入联系人"
                v-model="formData.contactName"
                @input="nameTest"
            />
            <van-field
                label="联系方式："
                placeholder="请输入联系方式"
                v-model="formData.contactPhone"
                @input="telTest"
            />
            <p class="title">问题描述:</p>
            <textarea placeholder="请描述您所遇到的问题" 
                v-model="formData.question"></textarea>
        </van-cell-group>
        <div class="foter-box">
            <p class="btn-p" @click="subForm">提交反馈</p>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
import Toast from '../../../static/vant/toast/toast';
export default {
    data(){
        return{
            formData:{}
        }
    },
    components: {
        navbar
    },
    methods:{
        nameTest(event){
            this.formData.contactName = event.mp.detail;
        },
        telTest(event){
            this.formData.contactPhone = event.mp.detail;
        },
        subForm(){
            this.formData.memberId = store.state.user.userInfo.id;
            this.formData.questionType = 2;
            if(!this.formData.contactName){
                Toast.fail('输入联系人');
                return;
            }
            if(!this.formData.contactPhone){
                Toast.fail('输入电话');
                return;
            }
            axios({
                url: 'api/personal/addFeedback',
                method: 'post',
                data:this.formData
            }).then( res => {
                if(res.data.code == 1){
                    Toast({
                        type: 'success',
                        message: '投诉成功',
                        onClose: () => {
                            mpvue.switchTab({ url:'../mine/main'});
                        }
                    });
                }
            } )
        }   
    },
    onShow(){
    }
}
</script>
<style lang="less" scoped>
.suggest-box{
    height: 100%;
    background-color: #fff;
    .tips{
        font-size: 17px;
        position: relative;
        height: 25px;
        line-height: 25px;
        position: relative;
        color: #000;
        font-weight: bold;
        padding: 10px 20px;
        padding-right: 10px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
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
    
    .title{
        padding-left:15px;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        color: #333;

    }
    textarea{
        width: 325px;
        height: 120px;
        border:1px solid rgba(245, 245, 245, 1);
        margin: 0 auto;
        font-size: 14px;
        color: rgba(134, 134, 134, 1);
        padding: 10px;
    }
    .foter-box{
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
}
</style>